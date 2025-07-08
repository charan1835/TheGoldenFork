"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import GlobalApi from "../_utils/GlobalApi";
import { Loader2, ShoppingBag, IndianRupee, MapPin, Phone } from "lucide-react";

const MyOrdersPage = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await GlobalApi.getUserOrders(user.primaryEmailAddress.emailAddress);
      setOrders(res.userOrders);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
        <span className="ml-3">Fetching your orders...</span>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🧾 My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">You haven’t placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div key={index} className="border p-4 rounded-xl shadow-sm bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  📅 {new Date(order.orderdate).toLocaleString()}
                </span>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  {order.paymentmode}
                </span>
              </div>
              <h2 className="text-lg font-semibold">
                <ShoppingBag className="inline w-5 h-5 mr-2" />
                {order.items}
              </h2>
              <p className="text-sm text-gray-600">
                <IndianRupee className="inline w-4 h-4 mr-1" />
                Subtotal: ₹{order.subtotal} | GST: ₹{order.gst} | Delivery: ₹{order.deliveryfee} | Total: ₹{order.total}
              </p>
              <p className="text-sm mt-1">
                <Phone className="inline w-4 h-4 mr-1" /> {order.phonenumber}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <MapPin className="inline w-4 h-4 mr-1" />
                {order.address}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
