"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Home, MapPin, IndianRupee, FileText, Copy, ArrowRight } from "lucide-react";
import { Suspense } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import AnimatedCheck from "../_components/animations/AnimatedCheck";

// A simple hook to get window dimensions for the confetti effect
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
};

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paymentMethod = searchParams.get("paymentMethod");
  const address = searchParams.get("address");
  const orderId = searchParams.get("orderId");
  const total = Number(searchParams.get("total"));
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Let the confetti run for 10 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 8000);
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Order ID copied!");
  };

  // Format payment method for display
  const displayPaymentMethod = paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online';

  // Button styles
  const primaryButtonStyles = "flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all w-full font-semibold backdrop-blur-md";
  const secondaryButtonStyles = "w-full border border-white/20 text-white/80 px-6 py-3 rounded-xl hover:bg-white/10 transition-all font-semibold";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center px-4 py-16 overflow-hidden">
      {showConfetti && width && height && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={5000}
          gravity={0.08}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-purple-500/10 p-6 sm:p-10 max-w-xl w-full text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
        >
          <AnimatedCheck className="w-20 h-20 mx-auto mb-4" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-white mb-2"
        >
          Order Confirmed! 🎉
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-white/70 mb-8"
        >
          Thank you for your order! You will receive a confirmation on WhatsApp shortly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-white/5 rounded-2xl p-4 sm:p-5 mb-8 text-left text-sm text-white/80 border border-white/10"
        >
          {orderId && (
            <div className="flex justify-between items-center mb-2">
              <p className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-white/50" />
                Order ID: <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded-md">{orderId}</span>
              </p>
              <button onClick={() => handleCopy(orderId)} className="p-1.5 rounded-md hover:bg-white/10 transition-colors">
                <Copy className="w-4 h-4 text-white/70" />
              </button>
            </div>
          )}
          {total > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <IndianRupee className="w-4 h-4 text-white/50" />
              Total Amount: <span className="font-medium flex items-center">
                <IndianRupee className="w-3.5 h-3.5" />{total}
              </span>
            </div>
          )}
          <div className="border-t border-white/10 my-3"></div>
          <p className="mb-1">⏰ Estimated Delivery: <span className="font-medium">25–30 mins</span></p>
          <p className="mb-1">💵 Payment Mode: <span className="font-medium">{displayPaymentMethod}</span></p>
          <p className="mb-1">📍 Delivery Address: <span className="font-medium">{address || 'As provided'}</span></p>
          <p className="mt-4 text-cyan-300 font-semibold flex items-center gap-1.5 text-xs sm:text-sm">
            <MapPin className="w-4 h-4" />
            Please share your live location on WhatsApp to help us deliver faster!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => router.push("/my-orders")} className={primaryButtonStyles}> View Order <ArrowRight className="w-4 h-4" /> </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => router.push("/")} className={secondaryButtonStyles}> Hungry Again order more <ArrowRight className="w-4 h-4" /> </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ConfirmationSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 max-w-xl w-full text-center">
        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
        <div className="h-9 bg-gray-200 rounded-md w-3/4 mx-auto mb-2 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded-md w-full mx-auto mb-8 animate-pulse"></div>
        <div className="bg-gray-100 rounded-lg p-4 sm:p-5 mb-6 space-y-3">
          <div className="h-5 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded-md w-2/3 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  // Wrap the component in Suspense because useSearchParams can suspend rendering
  return (
    <Suspense fallback={<ConfirmationSkeleton />}>
      <ConfirmationContent />
    </Suspense>
  );
}
