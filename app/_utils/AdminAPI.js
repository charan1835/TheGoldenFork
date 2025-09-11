import { gql, request } from 'graphql-request';

const HYGRAPH_ENDPOINT = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
const HYGRAPH_TOKEN = process.env.NEXT_PUBLIC_HYGRAPH_TOKEN;

// Helper function to make GraphQL requests with auth
const makeRequest = async (query, variables = {}) => {
  const headers = {
    'Authorization': `Bearer ${HYGRAPH_TOKEN}`,
    'Content-Type': 'application/json',
  };
  
  return await request(HYGRAPH_ENDPOINT, query, variables, headers);
};

// Get all orders (for admin dashboard)
const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    orders(orderBy: orderdate_DESC) {
      id
      username
      useremail
      orderdate
      items
      subtotal
      gst
      deliveryfee
      total
      paymentmode
      statue
      address
    }
  }
`;

// Get orders by status
const GET_ORDERS_BY_STATUS = gql`
  query GetOrdersByStatus($status: String!) {
    orders(where: { statue: $status }, orderBy: orderdate_DESC) {
      id
      username
      useremail
      orderdate
      items
      subtotal
      gst
      deliveryfee
      total
      paymentmode
      statue
      address
    }
  }
`;

// Get orders by date range
const GET_ORDERS_BY_DATE = gql`
  query GetOrdersByDate($startDate: DateTime!, $endDate: DateTime!) {
    orders(
      where: { 
        orderdate_gte: $startDate, 
        orderdate_lte: $endDate 
      }, 
      orderBy: orderdate_DESC
    ) {
      id
      username
      useremail
      orderdate
      items
      subtotal
      gst
      deliveryfee
      total
      paymentmode
      statue
      address
    }
  }
`;

// Get orders by user email
const GET_ORDERS_BY_EMAIL = gql`
  query GetOrdersByEmail($email: String!) {
    orders(where: { useremail: $email }, orderBy: orderdate_DESC) {
      id
      username
      useremail
      orderdate
      items
      subtotal
      gst
      deliveryfee
      total
      paymentmode
      statue
      address
    }
  }
`;

// Update order mutation
const UPDATE_ORDER = gql`
  mutation UpdateOrder(
    $id: ID!,
    $username: String,
    $useremail: String,
    $address: String,
    $statue: String,
    $paymentmode: String,
    $subtotal: Float,
    $gst: Float,
    $deliveryfee: Float,
    $total: Float
  ) {
    updateOrder(
      where: { id: $id }
      data: {
        username: $username
        useremail: $useremail
        address: $address
        statue: $statue
        paymentmode: $paymentmode
        subtotal: $subtotal
        gst: $gst
        deliveryfee: $deliveryfee
        total: $total
      }
    ) {
      id
      username
      useremail
      orderdate
      items
      subtotal
      gst
      deliveryfee
      total
      paymentmode
      statue
      address
    }
  }
`;

// Delete order mutation
const DELETE_ORDER = gql`
  mutation DeleteOrder($id: ID!) {
    deleteOrder(where: { id: $id }) {
      id
    }
  }
`;

// Publish order mutation (if using Hygraph's draft system)
const PUBLISH_ORDER = gql`
  mutation PublishOrder($id: ID!) {
    publishOrder(where: { id: $id }) {
      id
    }
  }
`;

// Get order statistics
const GET_ORDER_STATS = gql`
  query GetOrderStats {
    orders {
      id
      total
      statue
      orderdate
    }
  }
`;

// Search orders by multiple criteria
const SEARCH_ORDERS = gql`
  query SearchOrders($searchTerm: String!) {
    orders(
      where: {
        OR: [
          { username_contains: $searchTerm }
          { useremail_contains: $searchTerm }
          { id_contains: $searchTerm }
        ]
      }
      orderBy: orderdate_DESC
    ) {
      id
      username
      useremail
      orderdate
      items
      subtotal
      gst
      deliveryfee
      total
      paymentmode
      statue
      address
    }
  }
`;

// AdminAPI class with all methods
class AdminAPI {
  // Get all orders
  static async getAllOrders() {
    try {
      const data = await makeRequest(GET_ALL_ORDERS);
      return data.orders;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  }

  // Get orders by status
  static async getOrdersByStatus(status) {
    try {
      const data = await makeRequest(GET_ORDERS_BY_STATUS, { status });
      return data.orders;
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      throw error;
    }
  }

  // Get orders by date range
  static async getOrdersByDateRange(startDate, endDate) {
    try {
      const data = await makeRequest(GET_ORDERS_BY_DATE, { 
        startDate: startDate.toISOString(), 
        endDate: endDate.toISOString() 
      });
      return data.orders;
    } catch (error) {
      console.error('Error fetching orders by date range:', error);
      throw error;
    }
  }

  // Get orders by user email
  static async getOrdersByEmail(email) {
    try {
      const data = await makeRequest(GET_ORDERS_BY_EMAIL, { email });
      return data.orders;
    } catch (error) {
      console.error('Error fetching orders by email:', error);
      throw error;
    }
  }

  // Search orders
  static async searchOrders(searchTerm) {
    try {
      const data = await makeRequest(SEARCH_ORDERS, { searchTerm });
      return data.orders;
    } catch (error) {
      console.error('Error searching orders:', error);
      throw error;
    }
  }

  // Update order
  static async updateOrder(orderId, orderData) {
    try {
      const data = await makeRequest(UPDATE_ORDER, {
        id: orderId,
        ...orderData
      });
      
      // Publish the updated order if using Hygraph's draft system
      await this.publishOrder(orderId);
      
      return data.updateOrder;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  // Delete order
  static async deleteOrder(orderId) {
    try {
      const data = await makeRequest(DELETE_ORDER, { id: orderId });
      return data.deleteOrder;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  // Publish order (for Hygraph draft system)
  static async publishOrder(orderId) {
    try {
      const data = await makeRequest(PUBLISH_ORDER, { id: orderId });
      return data.publishOrder;
    } catch (error) {
      console.error('Error publishing order:', error);
      // Don't throw error here as it's not critical
      return null;
    }
  }

  // Get order statistics
  static async getOrderStats() {
    try {
      const data = await makeRequest(GET_ORDER_STATS);
      const orders = data.orders;
      
      const stats = {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
        pendingOrders: orders.filter(order => order.statue === 'pending').length,
        completedOrders: orders.filter(order => order.statue === 'completed').length,
        cancelledOrders: orders.filter(order => order.statue === 'cancelled').length,
        processingOrders: orders.filter(order => order.statue === 'processing').length,
        todayOrders: orders.filter(order => {
          const orderDate = new Date(order.orderdate);
          const today = new Date();
          return orderDate.toDateString() === today.toDateString();
        }).length,
        thisWeekOrders: orders.filter(order => {
          const orderDate = new Date(order.orderdate);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return orderDate >= weekAgo;
        }).length,
        thisMonthOrders: orders.filter(order => {
          const orderDate = new Date(order.orderdate);
          const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          return orderDate >= monthAgo;
        }).length
      };
      
      return stats;
    } catch (error) {
      console.error('Error fetching order statistics:', error);
      throw error;
    }
  }

  // Bulk update order status
  static async bulkUpdateOrderStatus(orderIds, newStatus) {
    try {
      const updatePromises = orderIds.map(orderId => 
        this.updateOrder(orderId, { statue: newStatus })
      );
      
      const results = await Promise.all(updatePromises);
      return results;
    } catch (error) {
      console.error('Error bulk updating order status:', error);
      throw error;
    }
  }

  // Get recent orders (last 10)
  static async getRecentOrders(limit = 10) {
    try {
      const RECENT_ORDERS_QUERY = gql`
        query GetRecentOrders($limit: Int!) {
          orders(first: $limit, orderBy: orderdate_DESC) {
            id
            username
            useremail
            orderdate
            items
            subtotal
            gst
            deliveryfee
            total
            paymentmode
            statue
            address
          }
        }
      `;
      
      const data = await makeRequest(RECENT_ORDERS_QUERY, { limit });
      return data.orders;
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      throw error;
    }
  }

  // Get orders with filters (comprehensive filter method)
  static async getOrdersWithFilters(filters = {}) {
    try {
      let whereConditions = {};
      
      // Status filter
      if (filters.status && filters.status !== 'all') {
        whereConditions.statue = filters.status;
      }
      
      // Email filter
      if (filters.email) {
        whereConditions.useremail = filters.email;
      }
      
      // Date range filter
      if (filters.startDate) {
        whereConditions.orderdate_gte = filters.startDate;
      }
      if (filters.endDate) {
        whereConditions.orderdate_lte = filters.endDate;
      }
      
      // Search term filter
      if (filters.searchTerm) {
        whereConditions.OR = [
          { username_contains: filters.searchTerm },
          { useremail_contains: filters.searchTerm },
          { id_contains: filters.searchTerm }
        ];
      }
      
      const FILTERED_ORDERS_QUERY = gql`
        query GetFilteredOrders($where: OrderWhereInput!) {
          orders(where: $where, orderBy: orderdate_DESC) {
            id
            username
            useremail
            orderdate
            items
            subtotal
            gst
            deliveryfee
            total
            paymentmode
            statue
            address
          }
        }
      `;
      
      const data = await makeRequest(FILTERED_ORDERS_QUERY, { where: whereConditions });
      return data.orders;
    } catch (error) {
      console.error('Error fetching filtered orders:', error);
      throw error;
    }
  }
}

export default AdminAPI;