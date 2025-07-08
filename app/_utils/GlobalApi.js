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

// 7️⃣ Create User Order (with enhanced debugging)
const createUserOrder = async ({
  useremail,
  username,
  total,
  subtotal,
  phonenumber,
  orderdate,
  paymentmode,
  items,
  gst,
  deliveryfee,
  address
}) => {
  console.log("🔍 Creating order with data:", {
    useremail,
    username,
    total,
    subtotal,
    phonenumber,
    orderdate,
    paymentmode,
    items,
    gst,
    deliveryfee,
    address
  });

  const mutation = gql`
    mutation CreateUserOrder(
      $useremail: String!
      $username: String!
      $total: Float!
      $subtotal: Float!
      $phonenumber: String!
      $orderdate: DateTime!
      $paymentmode: String!
      $items: String!
      $gst: Float!
      $deliveryfee: Float!
      $address: String!
    ) {
      createUserOrder(
        data: {
          useremail: $useremail
          username: $username
          total: $total
          subtotal: $subtotal
          phonenumber: $phonenumber
          orderdate: $orderdate
          paymentmode: $paymentmode
          items: $items
          gst: $gst
          deliveryfee: $deliveryfee
          address: $address
        }
      ) {
        id
        useremail
        username
        total
        subtotal
        phonenumber
        orderdate
        paymentmode
        items
        gst
        deliveryfee
        address
      }
    }
  `;

  const variables = {
    useremail,
    username,
    total: parseFloat(total),
    subtotal: parseFloat(subtotal),
    phonenumber: String(phonenumber),
    orderdate,
    paymentmode,
    items,
    gst: parseFloat(gst),
    deliveryfee: parseFloat(deliveryfee),
    address
  };

  console.log("📤 Sending variables:", variables);

  try {
    const res = await requestWithRetry(MASTER_URL, mutation, variables, requestHeaders);
    console.log("✅ Order created successfully:", res);

    await delay(500); // Small delay before publishing

    // Publish the created order
    const publishMutation = gql`
      mutation PublishUserOrder($id: ID!) {
        publishUserOrder(where: { id: $id }) {
          id
        }
      }
    `;

    if (res?.createUserOrder?.id) {
      console.log("📢 Publishing order with ID:", res.createUserOrder.id);
      const publishRes = await requestWithRetry(MASTER_URL, publishMutation, { id: res.createUserOrder.id }, requestHeaders);
      console.log("✅ Order published successfully:", publishRes);
    } else {
      console.error("❌ No order ID returned from creation");
    }

    // Clear user orders cache
    cache.delete(`user-orders-${useremail}`);

    return res;
  } catch (error) {
    console.error("❌ Error creating user order:", error);
    console.error("Error details:", error.response?.errors || error.message);
    throw error;
  }
};

// 8️⃣ Get User Orders - OPTIMIZED VERSION
const getUserOrders = async (email) => {
  console.log("🔍 Fetching orders for email:", email);
  
  const cacheKey = `user-orders-${email}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  // Simplified query - use only one query that's most likely to work
  const query = gql`
    query GetUserOrders($email: String!) {
      userOrders(where: { useremail: $email }, orderBy: orderdate_DESC) {
        id
        username
        total
        subtotal
        orderdate
        paymentmode
        items
        gst
        deliveryfee
        address
        useremail
      }
    }
  `;

  try {
    const res = await requestWithRetry(MASTER_URL, query, { email }, requestHeaders);
    console.log("✅ Orders fetched successfully:", res);
    
    const orders = res.userOrders || [];
    console.log("📊 Number of orders found:", orders.length);
    
    const result = { userOrders: orders };
    setCachedData(cacheKey, result);
    return result;
    
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    
    // If the main query fails, try a simpler fallback
    try {
      console.log("🔄 Trying fallback query without orderBy");
      const fallbackQuery = gql`
        query GetUserOrders($email: String!) {
          userOrders(where: { useremail: $email }) {
            id
            username
            total
            subtotal
            orderdate
            paymentmode
            items
            gst
            deliveryfee
            address
            useremail
          }
        }
      `;
      
      const fallbackRes = await requestWithRetry(MASTER_URL, fallbackQuery, { email }, requestHeaders);
      const orders = fallbackRes.userOrders || [];
      const result = { userOrders: orders };
      setCachedData(cacheKey, result);
      return result;
      
    } catch (fallbackError) {
      console.error("❌ Fallback query also failed:", fallbackError);
      return { userOrders: [] };
    }
  }
};




export default {
  getCategory,
  getMenuItemsByCategory,
  createUserCart,
  getUserCart,
  deleteCartItem,
  clearUserCart,
  createUserOrder,
  getUserOrders,
  
};