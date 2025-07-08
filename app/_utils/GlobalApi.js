import { gql, request } from "graphql-request";

const MASTER_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
const HYGRAPH_TOKEN = process.env.NEXT_PUBLIC_HYGRAPH_TOKEN;

if (!MASTER_URL) {
  console.error("NEXT_PUBLIC_BACKEND_API_URL is not defined.");
}

if (!HYGRAPH_TOKEN) {
  console.error("NEXT_PUBLIC_HYGRAPH_TOKEN is not defined.");
}

// Request headers with authentication
const requestHeaders = {
  authorization: `Bearer ${HYGRAPH_TOKEN}`,
};

// Rate limiting utilities
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Request wrapper with retry logic and rate limiting
const requestWithRetry = async (url, query, variables = {}, headers = {}, maxRetries = 3) => {
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      // Add delay between requests to avoid rate limiting
      if (retryCount > 0) {
        const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff: 2s, 4s, 8s
        console.log(`⏳ Waiting ${waitTime}ms before retry ${retryCount}/${maxRetries}`);
        await delay(waitTime);
      }
      
      const result = await request(url, query, variables, headers);
      return result;
    } catch (error) {
      if (error.response?.status === 429 && retryCount < maxRetries - 1) {
        retryCount++;
        console.log(`🔄 Rate limit hit, retrying... (${retryCount}/${maxRetries})`);
        continue;
      }
      throw error;
    }
  }
};

// Simple in-memory cache to reduce API calls
const cache = new Map();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes cache

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`📦 Returning cached data for: ${key}`);
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// 1️⃣ Get All Categories
const getCategory = async () => {
  const cacheKey = 'categories';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const query = gql`
    query Category {
      categories {
        id
        name
        slug
        icon {
          url
        }
      }
    }
  `;
  try {
    const result = await requestWithRetry(MASTER_URL, query, {}, requestHeaders);
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { categories: [] };
  }
};

// 2️⃣ Get Menu Items by Category Slug
const getMenuItemsByCategory = async (slug) => {
  const cacheKey = `menu-items-${slug}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const query = gql`
    query GetMenuItemsByCategory($slug: String!) {
      menuitems(where: { category_some: { slug: $slug } }) {
        id
        name
        price
        description
        img {
          url
        }
      }
    }
  `;
  try {
    const data = await requestWithRetry(MASTER_URL, query, { slug }, requestHeaders);
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching menu items for category ${slug}:`, error);
    return { menuitems: [] };
  }
};

// 3️⃣ Create a User Cart Entry (with auto-publish)
const createUserCart = async ({ email, image, itemname, phonenumber, price }) => {
  const mutation = gql`
    mutation CreateAndPublishUserCart(
      $email: String!
      $image: String
      $itemname: String!
      $phonenumber: Int!
      $price: Float!
    ) {
      createUsercart(
        data: {
          email: $email
          image: $image
          itemname: $itemname
          phonenumber: $phonenumber
          price: $price
        }
      ) {
        id
      }
    }
  `;

  // 💡 Sanitize phone number (strip '+' and parseInt)
  const cleanedPhone = parseInt(String(phonenumber).replace(/\D/g, ""));

  const variables = {
    email,
    image,
    itemname,
    phonenumber: cleanedPhone,
    price: parseFloat(price),
  };

  try {
    // Step 1: Create the cart item
    const res = await requestWithRetry(MASTER_URL, mutation, variables, requestHeaders);
    
    // Step 2: Publish the created cart item
    if (res.createUsercart?.id) {
      await delay(500); // Small delay between requests
      const publishMutation = gql`
        mutation PublishUserCart($id: ID!) {
          publishUsercart(where: { id: $id }) {
            id
          }
        }
      `;
      await requestWithRetry(MASTER_URL, publishMutation, { id: res.createUsercart.id }, requestHeaders);
    }
    
    // Clear cart cache for this user
    cache.delete(`user-cart-${email}`);
    
    return res;
  } catch (error) {
    console.error("Error creating user cart:", error);
    return null;
  }
};

// 4️⃣ Get User Cart by Email
const getUserCart = async (email) => {
  const cacheKey = `user-cart-${email}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const query = gql`
    query GetUserCart($email: String!) {
      usercarts(where: { email: $email }) {
        id
        email
        image
        itemname
        phonenumber
        price
      }
    }
  `;
  try {
    const res = await requestWithRetry(MASTER_URL, query, { email }, requestHeaders);
    setCachedData(cacheKey, res);
    return res;
  } catch (error) {
    console.error(`Error fetching cart for ${email}:`, error);
    return { usercarts: [] };
  }
};

// 5️⃣ Delete Cart Item
const deleteCartItem = async (id) => {
  const mutation = gql`
    mutation DeleteCartItem($id: ID!) {
      deleteUsercart(where: { id: $id }) {
        id
      }
    }
  `;
  
  try {
    const result = await requestWithRetry(MASTER_URL, mutation, { id }, requestHeaders);
    
    await delay(500); // Small delay between requests
    
    // Publish all cart items after deletion
    const publishMutation = gql`
      mutation PublishManyUserCarts {
        publishManyUsercarts(to: PUBLISHED) {
          count
        }
      }
    `;
    await requestWithRetry(MASTER_URL, publishMutation, {}, requestHeaders);
    
    // Clear all cart caches
    for (const key of cache.keys()) {
      if (key.startsWith('user-cart-')) {
        cache.delete(key);
      }
    }
    
    return result;
  } catch (error) {
    console.error("Error deleting cart item:", error);
    throw error;
  }
};

// 6️⃣ Clear User Cart (Delete all cart items for a user)
const clearUserCart = async (email) => {
  try {
    console.log("🧹 Clearing cart for user:", email);
    
    // First, get all cart items for the user
    const cartData = await getUserCart(email);
    const cartItems = cartData.usercarts || [];
    
    if (cartItems.length === 0) {
      console.log("No cart items to clear");
      return { deletedCount: 0 };
    }
    
    console.log(`Found ${cartItems.length} items to delete`);
    
    // Delete all cart items for the user with delays
    const deletePromises = cartItems.map(async (item, index) => {
      // Add delay between deletions to avoid rate limiting
      await delay(index * 200);
      
      const mutation = gql`
        mutation DeleteCartItem($id: ID!) {
          deleteUsercart(where: { id: $id }) {
            id
          }
        }
      `;
      return requestWithRetry(MASTER_URL, mutation, { id: item.id }, requestHeaders);
    });
    
    // Wait for all deletions to complete
    const results = await Promise.all(deletePromises);
    
    await delay(500); // Wait before publishing
    
    // Publish changes after all deletions
    const publishMutation = gql`
      mutation PublishDeletedCarts($ids: [ID!]!) {
        publishManyUsercarts(where: { id_in: $ids }, to: PUBLISHED) {
          count
        }
      }
    `;
    
    await requestWithRetry(MASTER_URL, publishMutation, { ids: cartItems.map(item => item.id) }, requestHeaders);
    const publishOrderMutation = gql`
      mutation PublishOrder($id: ID!) {
        publishUserOrder(where: { id: $id }, to: PUBLISHED) {
          id
        }
      }
    `;
    
    // Clear cart cache for this user
    cache.delete(`user-cart-${email}`);
    
    console.log(`✅ Successfully cleared ${results.length} items from cart for ${email}`);
    return { deletedCount: results.length };
    
  } catch (error) {
    console.error("❌ Error clearing user cart:", error);
    throw error;
  }
};

const createOrder = async (orderData) => {
  console.log("💾 Creating new order:", orderData);
  
  const mutation = gql`
    mutation CreateOrder(
      $username: String!
      $useremail: String!
      $total: Float!
      $subtotal: Float!
      $orderdate: DateTime!
      $paymentmode: String!
      $items: Json!
      $gst: Float!
      $deliveryfee: Float!
      $address: String!
      $statue: String
    ) {
      createOrder(
        data: {
          username: $username
          useremail: $useremail
          total: $total
          subtotal: $subtotal
          orderdate: $orderdate
          paymentmode: $paymentmode
          items: $items
          gst: $gst
          deliveryfee: $deliveryfee
          address: $address
          statue: $statue
        }
      ) {
        id
        username
        useremail
        total
        subtotal
        orderdate
        paymentmode
        items
        gst
        deliveryfee
        address
        statue
        createdAt
      }
    }
  `;

  const variables = {
    username: orderData.username,
    useremail: orderData.useremail,
    total: parseFloat(orderData.total),
    subtotal: parseFloat(orderData.subtotal),
    orderdate: orderData.orderdate,
    paymentmode: orderData.paymentmode,
    items: orderData.items, // Direct JSON object, not string
    gst: parseFloat(orderData.gst),
    deliveryfee: parseFloat(orderData.deliveryfee),
    address: orderData.address,
    statue: orderData.statue || "pending"
  };

  console.log("📤 Sending variables:", variables);

  try {
    const res = await requestWithRetry(MASTER_URL, mutation, variables, requestHeaders);
    console.log("✅ Order created successfully:", res);
    
    // Publish the order
    const publishMutation = gql`
      mutation PublishOrder($id: ID!) {
        publishOrder(where: { id: $id }, to: PUBLISHED) {
          id
        }
      }
    `;
    
    await requestWithRetry(MASTER_URL, publishMutation, { id: res.createOrder.id }, requestHeaders);
    console.log("✅ Order published successfully");
    
    return res.createOrder;
    
  } catch (error) {
    console.error("❌ Error creating order:", error);
    console.error("Error details:", error.response?.errors || error.message);
    throw error;
  }
};

const getUserOrders = async (userEmail) => {
  const query = gql`
    query GetUserOrders($useremail: String!) {
      orders(where: { useremail: $useremail }, orderBy: createdAt_DESC) {
        id
        username
        useremail
        total
        subtotal
        orderdate
        paymentmode
        items
        gst
        deliveryfee
        address
        statue
        createdAt
      }
    }
  `;

  try {
    const res = await requestWithRetry(MASTER_URL, query, { useremail: userEmail }, requestHeaders);
    return res.orders;
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    throw error;
  }
};

const updateOrderStatus = async (orderId, status) => {
  const mutation = gql`
    mutation UpdateOrderStatus($id: ID!, $status: String!) {
      updateOrder(where: { id: $id }, data: { status: $status }) {
        id
        statue
      }
    }
  `;

  try {
    const res = await requestWithRetry(MASTER_URL, mutation, { id: orderId, status }, requestHeaders);
    
    // Publish the updated order
    const publishMutation = gql`
      mutation PublishOrder($id: ID!) {
        publishOrder(where: { id: $id }, to: PUBLISHED) {
          id
        }
      }
    `;
    
    await requestWithRetry(MASTER_URL, publishMutation, { id: orderId }, requestHeaders);
    
    return res.updateOrder;
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    throw error;
  }
};





export default {
  getCategory,
  getMenuItemsByCategory,
  createUserCart,
  getUserCart,
  deleteCartItem,
  clearUserCart,
  createOrder,
  getUserOrders,
  updateOrderStatus,
  
};