"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { 
  ShoppingCart, 
  X, 
  Loader2, 
  IndianRupee, 
  Plus, 
  Minus, 
  ArrowLeft,
  ShoppingBag,
  Trash2,
  Tag,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useCart } from "../context/CartContext";
import GlobalApi from "../_utils/GlobalApi";
import toast from "react-hot-toast";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const { user } = useUser();
  const { cartCount, fetchCartCount } = useCart();
  const router = useRouter();

  // Available coupons (you can move this to a separate API call or config)
  const availableCoupons = [
    {
      code: "FIRST10",
      type: "percentage",
      value: 10,
      minAmount: 200,
      maxDiscount: 100,
      description: "10% off on first order (min ₹200)"
    },
    {
      code: "SAVE50",
      type: "fixed",
      value: 50,
      minAmount: 300,
      maxDiscount: 50,
      description: "₹50 off on orders above ₹300"
    },
    {
      code: "WELCOME15",
      type: "percentage",
      value: 15,
      minAmount: 500,
      maxDiscount: 150,
      description: "15% off on orders above ₹500"
    }
  ];

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchCartItems();
    } else {
      // If there's no user, ensure the cart is empty and stop loading.
      setCartItems([]);
      setLoading(false); 
    }
  }, [user, cartCount]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const res = await GlobalApi.getUserCart(user.primaryEmailAddress.emailAddress);
      setCartItems(res?.usercarts || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const deleteCartItem = async (id) => {
    try {
      setDeletingId(id);
      await GlobalApi.deleteCartItem(id);
      toast.success("Item removed from cart");      
      // Optimistically update the UI for a faster user experience
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      // Update the global cart count, which syncs other components
      fetchCartCount(); 
    } catch (error) {
      console.error("Error deleting cart item:", error);
      toast.error("Failed to remove item");
      fetchCartItems(); // Re-fetch on error to ensure data consistency
    } finally {
      setDeletingId(null);
    }
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0);
  }, [cartItems]);

  const gst = useMemo(() => {
    return Math.round(subtotal * 0.18);
  }, [subtotal]);

  const deliveryFee = useMemo(() => {
    return subtotal > 500 ? 0 : 50;
  }, [subtotal]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    let discount = 0;

    if (appliedCoupon.type === "percentage") {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.type === "fixed") {
      discount = appliedCoupon.value;
    }
    return discount;
  }, [appliedCoupon, subtotal]);

  const total = useMemo(() => {
    return subtotal + gst + deliveryFee - discount;
  }, [subtotal, gst, deliveryFee, discount]);

  const handleCouponSelect = (couponCode) => {
    if (!couponCode) {
      removeCoupon();
      return;
    }

    const coupon = availableCoupons.find(c => c.code === couponCode);
    if (coupon && subtotal >= coupon.minAmount) {
      setAppliedCoupon(coupon);
      toast.success(`Coupon ${coupon.code} applied!`);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  };

  const handleProceedToCheckout = () => {
    const checkoutData = {
      subtotal: subtotal,
      gst: gst,
      deliveryFee: deliveryFee,
      discount: discount,
      total: total,
      couponCode: appliedCoupon ? appliedCoupon.code : 'none',
    };

    const queryString = new URLSearchParams(checkoutData).toString();
    router.push(`/checkout?${queryString}`);
  };


  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-16 h-16 animate-spin text-orange-500" />
          </div>
        </div>
      </div>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-md mx-auto">
              <ShoppingCart className="w-20 h-20 mx-auto text-slate-300 mb-6" />
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Sign In Required</h2>
              <p className="text-slate-500 mb-8">Please sign in to view your cart and continue shopping</p>
              <button
                onClick={() => router.push("/sign-in")}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
              <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />
              Your Cart
            </h1>
            <p className="text-slate-500 mt-1">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-md mx-auto">
              <ShoppingCart className="w-20 h-20 mx-auto text-slate-300 mb-6" />
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Cart is Empty</h2>
              <p className="text-slate-500 mb-8">Add some delicious items to get started</p>
              <button
                onClick={() => router.push("/")}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
              >
                Browse Menu
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 sm:p-6 mb-6 lg:mb-0">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 px-2">Order Items</h2>
                <div className="divide-y divide-slate-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50/50 transition-colors">
                      {/* Item Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.itemname}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-200">
                            <ShoppingBag className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                              {item.itemname}
                            </h3>
                            <div className="flex items-center mt-1 text-orange-500 font-medium">
                              <IndianRupee className="w-4 h-4" />
                              <span className="text-lg">{item.price}</span>
                            </div>
                          </div>
                          
                          {/* Delete Button */}
                          <button
                            onClick={() => deleteCartItem(item.id)}
                            disabled={deletingId === item.id}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 sm:p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Order Summary</h2>
                
                {/* Coupon Section */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-orange-500 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Have a Coupon?
                  </h3>
                  <div className="space-y-3">
                    {/* No Coupon Option */}
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-slate-50 has-[:checked]:bg-slate-100 has-[:checked]:border-slate-400">
                      <input
                        type="radio"
                        name="coupon"
                        value=""
                        checked={!appliedCoupon}
                        onChange={() => handleCouponSelect(null)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="font-medium text-sm text-slate-700">None</span>
                    </label>

                    {/* Available Coupons */}
                    {availableCoupons.map((coupon) => {
                      const isApplicable = subtotal >= coupon.minAmount;
                      return (
                        <label
                          key={coupon.code}
                          className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                            isApplicable
                              ? "cursor-pointer hover:bg-orange-50 has-[:checked]:bg-orange-50 has-[:checked]:border-orange-500"
                              : "cursor-not-allowed bg-slate-50 opacity-60"
                          }`}
                        >
                          <input
                            type="radio"
                            name="coupon"
                            value={coupon.code}
                            checked={appliedCoupon?.code === coupon.code}
                            onChange={() => handleCouponSelect(coupon.code)}
                            disabled={!isApplicable}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 disabled:text-slate-300"
                          />
                          <div>
                            <span className="font-semibold tracking-wider text-sm text-orange-800">{coupon.code}</span>
                            <p className="text-xs text-slate-600">{coupon.description}</p>
                            {!isApplicable && <p className="text-xs text-red-500 mt-1">Requires min. order of ₹{coupon.minAmount}</p>}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 my-6 pt-4 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Subtotal</span>
                    <div className="flex items-center font-medium text-slate-800">
                      <IndianRupee className="w-4 h-4" />
                      <span>{subtotal}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">GST (18%)</span>
                    <div className="flex items-center font-medium text-slate-800">
                      <IndianRupee className="w-4 h-4" />
                      <span>{gst}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Delivery Fee</span>
                    <div className="flex items-center font-medium text-slate-800 ">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        <>
                          <IndianRupee className="w-4 h-4" />
                          <span>{deliveryFee}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Discount</span>
                      <div className="flex items-center font-medium text-green-600">
                        <span>-</span>
                        <IndianRupee className="w-4 h-4" />
                        <span>{discount}</span>
                      </div>
                    </div>
                  )}
                  
                  {subtotal > 0 && subtotal <= 500 && (
                    <div className="text-sm text-orange-700 bg-orange-50 p-3 rounded-lg text-center">
                      Add ₹{500 - subtotal} more for free delivery
                    </div>
                  )}
                  
                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-slate-800">Total</span>
                      <div className="flex items-center text-xl font-bold text-orange-500">
                        <IndianRupee className="w-5 h-5" />
                        <span>{total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  disabled={total === 0}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={() => router.push("/")}
                  className="w-full mt-3 bg-slate-100 text-slate-600 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}