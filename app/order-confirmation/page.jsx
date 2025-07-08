"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Home, MapPin } from "lucide-react";

export default function OrderConfirmationPage() {
  const router = useRouter();

  useEffect(() => {
    // Optional: Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 max-w-xl w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Order Confirmed! 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order! A confirmation has been sent to your WhatsApp.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 sm:p-5 mb-6 text-left text-sm text-gray-700">
          <p className="mb-1">⏰ Estimated Delivery: <span className="font-medium">25–30 mins</span></p>
          <p className="mb-1">💵 Payment Mode: <span className="font-medium">Cash on Delivery</span></p>
          <p className="mb-1">📍 Delivery Address: <span className="font-medium">as provided</span></p>
          <p className="mt-3 text-orange-600 font-semibold flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Please share your live location on WhatsApp to help us deliver faster!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-all w-full"
          >
            <Home className="w-4 h-4" />
            Go to Home
          </button>

          <button
            onClick={() => router.push("/my-orders")}
            className="w-full border border-orange-600 text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 transition-all"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
}
