"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import GlobalApi from "../_utils/GlobalApi";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag, IndianRupee, MapPin, Calendar, CreditCard, Package } from "lucide-react";

const MyOrdersPage = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const res = await GlobalApi.getUserOrders(user.primaryEmailAddress.emailAddress);
      setOrders(res || []);
    } catch (err) {
      console.error("Error loading orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchOrders();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
          </div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Package className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your order history</p>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start ordering to see your orders here!</p>
            <button
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
              onClick={() => router.push("/")}
            >
              Start Ordering
            </button> 
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div key={order.id || index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-medium">{new Date(order.orderdate).toLocaleDateString()}</span>
                        <span className="ml-2 text-gray-500">{new Date(order.orderdate).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-gray-700">
                        <CreditCard className="w-4 h-4 mr-2" />
                        <span className="font-medium">{order.paymentmode}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.statue)}`}>
                        {order.statue || 'pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <ShoppingBag className="w-5 h-5 mr-2 text-orange-600" />
                      Order Items
                    </h3>
                    <div className="space-y-3">
                      {(() => {
                        let items = order.items;
                        
                        if (typeof items === 'string') {
                          try {
                            items = JSON.parse(items);
                          } catch (e) {
                            console.error('Error parsing items JSON:', e);
                            items = [];
                          }
                        }
                        
                        if (items && Array.isArray(items) && items.length > 0) {
                          return items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium text-gray-900">{item.itemname}</span>
                              <span className="text-orange-600 font-semibold">₹{item.price}</span>
                            </div>
                          ));
                        } else {
                          return (
                            <div className="text-center py-4 text-gray-500">
                              No items information available
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Pricing Details */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <IndianRupee className="w-4 h-4 mr-2" />
                          Order Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="text-gray-900">₹{order.subtotal}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">GST:</span>
                            <span className="text-gray-900">₹{order.gst}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery:</span>
                            <span className="text-gray-900">₹{order.deliveryfee}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-gray-200">
                            <span className="font-semibold text-gray-900">Total:</span>
                            <span className="font-semibold text-orange-600">₹{order.total}</span>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Delivery Address
                        </h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-700 text-sm leading-relaxed">{order.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;