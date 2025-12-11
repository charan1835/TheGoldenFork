"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import GlobalApi from "../_utils/GlobalApi";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag, IndianRupee, MapPin, Calendar, CreditCard, Package, RotateCcw, Hash } from "lucide-react";

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
        <div className="bg-surface p-8 rounded-2xl shadow-soft border border-border/60">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 border border-border/60 bg-surface shadow-soft">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your order history</p>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 border border-border/60 bg-surface shadow-soft">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">You haven't placed any orders yet. Start ordering to see your orders here!</p>
            <button
              className="px-6 py-3 rounded-lg font-semibold text-foreground/90 border border-border/70 bg-surface shadow-soft hover:shadow-elevated transition"
              onClick={() => router.push("/")}
            >
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div key={order.id || index} className="bg-surface rounded-2xl shadow-soft border border-border/60 overflow-hidden hover:shadow-elevated transition-shadow">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-primary/5 to-accent/10 px-6 py-4 border-b border-border/60">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                      <div className="flex items-center text-foreground font-semibold bg-white/50 px-3 py-1 rounded-full border border-border/50">
                        <Hash className="w-3 h-3 mr-2 text-primary" />
                        <span className="text-xs font-mono">{order.id?.slice(-8)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="font-medium text-foreground">{new Date(order.orderdate).toLocaleDateString()}</span>
                          <span className="ml-2">{new Date(order.orderdate).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-muted-foreground">
                        <CreditCard className="w-4 h-4 mr-2" />
                        <span className="font-medium text-foreground">{order.paymentmode}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.statue)}`}>
                        {order.statue || 'pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                      <ShoppingBag className="w-5 h-5 mr-2 text-primary" />
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
                            <div key={itemIndex} className="flex justify-between items-center p-3 bg-background rounded-lg border border-border/60">
                              <span className="font-medium text-foreground">{item.itemname}</span>
                              <span className="text-primary font-semibold">₹{item.price}</span>
                            </div>
                          ));
                        } else {
                          return (
                            <div className="text-center py-4 text-muted-foreground">
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
                        <h4 className="font-semibold text-foreground mb-3 flex items-center">
                          <IndianRupee className="w-4 h-4 mr-2 text-primary" />
                          Order Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span className="text-foreground">₹{order.subtotal}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">GST:</span>
                            <span className="text-foreground">₹{order.gst}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Delivery:</span>
                            <span className="text-foreground">₹{order.deliveryfee}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-border/60">
                            <span className="font-semibold text-foreground">Total:</span>
                            <span className="font-semibold text-primary">₹{order.total}</span>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3 flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-primary" />
                          Delivery Address
                        </h4>
                        <div className="bg-background p-3 rounded-lg border border-border/60">
                          <p className="text-foreground/80 text-sm leading-relaxed">{order.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Order Actions */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-border/60 flex justify-end">
                    <a
                      href="https://return-automation.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 mr-2 text-gray-500" />
                      Cancel or Return Order
                    </a>
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