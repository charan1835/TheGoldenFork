"use client";

import { useEffect, useState } from "react";
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
  Percent,
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
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
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
      setLoading(false);
    }
  }, [user]);

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
      fetchCartItems();
      fetchCartCount();
    } catch (error) {
      console.error("Error deleting cart item:", error);
      toast.error("Failed to remove item");
    } finally {
      setDeletingId(null);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  const calculateGST = (subtotal) => {
    // Standard GST rate of 18% for food items
    const gstRate = 0.18;
    return Math.round(subtotal * gstRate);
  };

  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 500 ? 0 : 50;
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    const subtotal = calculateSubtotal();
    let discount = 0;

    if (appliedCoupon.type === "percentage") {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
      // Apply max discount limit
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.type === "fixed") {
      discount = appliedCoupon.value;
    }

    return discount;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const gst = calculateGST(subtotal);
    const deliveryFee = calculateDeliveryFee();
    const discount = calculateDiscount();
    
    return subtotal + gst + deliveryFee - discount;
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    
    try {
      const coupon = availableCoupons.find(
        c => c.code.toLowerCase() === couponCode.trim().toLowerCase()
      );

      if (!coupon) {
        toast.error("Invalid coupon code");
        setCouponLoading(false);
        return;
      }

      const subtotal = calculateSubtotal();
      
      if (subtotal < coupon.minAmount) {
        toast.error(`Minimum order amount ₹${coupon.minAmount} required for this coupon`);
        setCouponLoading(false);
        return;
      }

      setAppliedCoupon(coupon);
      setCouponCode("");
      toast.success(`Coupon applied! You saved ₹${calculateDiscount()}`);
      
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
          </div>
        </div>
      </div>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <ShoppingCart className="w-20 h-20 mx-auto text-gray-400 mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
              <p className="text-gray-600 mb-8">Please sign in to view your cart and continue shopping</p>
              <button
                onClick={() => router.push("/sign-in")}
                className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              Your Cart
            </h1>
            <p className="text-gray-600 mt-1">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <ShoppingCart className="w-20 h-20 mx-auto text-gray-400 mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-8">Add some delicious items to get started</p>
              <button
                onClick={() => router.push("/")}
                className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Browse Menu
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 lg:mb-0">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                      {/* Item Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.itemname}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <ShoppingBag className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                              {item.itemname}
                            </h3>
                            <div className="flex items-center mt-1 text-orange-600 font-medium">
                              <IndianRupee className="w-4 h-4" />
                              <span className="text-lg">{item.price}</span>
                            </div>
                          </div>
                          
                          {/* Delete Button */}
                          <button
                            onClick={() => deleteCartItem(item.id)}
                            disabled={deletingId === item.id}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
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
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
                
                {/* Coupon Section */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-orange-600 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Have a Coupon?
                  </h3>
                  
                  {appliedCoupon ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-800">{appliedCoupon.code}</p>
                          <p className="text-xs text-green-600">You saved ₹{calculateDiscount()}</p>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-3 py-2 border border-orange-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={couponLoading}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                      >
                        {couponLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </button>
                    </div>
                  )}
                  
                  {/* Available Coupons */}
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-orange-600">Available Coupons:</p>
                    {availableCoupons.map((coupon) => (
                      <div key={coupon.code} className="text-xs text-orange-600 bg-gray-50 p-2 rounded border-l-2 text-orange-600 border-orange-200">
                        <span className="font-medium">{coupon.code}</span> - {coupon.description}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-orange-600">Subtotal</span>
                    <div className="flex items-center font-medium text-orange-600">
                      <IndianRupee className="w-4 h-4" />
                      <span>{calculateSubtotal()}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-orange-600">GST (18%)</span>
                    <div className="flex items-center font-medium text-orange-600">
                      <IndianRupee className="w-4 h-4" />
                      <span>{calculateGST(calculateSubtotal())}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-orange-600">Delivery Fee</span>
                    <div className="flex items-center font-medium text-orange-600 ">
                      {calculateDeliveryFee() === 0 ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        <>
                          <IndianRupee className="w-4 h-4" />
                          <span>{calculateDeliveryFee()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between items-center">
                      <span className="text-orange-600">Discount</span>
                      <div className="flex items-center font-medium text-green-600">
                        <span>-</span>
                        <IndianRupee className="w-4 h-4" />
                        <span>{calculateDiscount()}</span>
                      </div>
                    </div>
                  )}
                  
                  {calculateSubtotal() > 0 && calculateSubtotal() <= 500 && (
                    <div className="text-sm text-orange-600 bg-gray-50 p-3 rounded-lg">
                      Add ₹{500 - calculateSubtotal()} more for free delivery
                    </div>
                  )}
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-orange-600">Total</span>
                      <div className="flex items-center text-xl font-bold text-orange-600">
                        <IndianRupee className="w-5 h-5" />
                        <span>{calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={() => router.push("/")}
                  className="w-full mt-3 bg-orange-100 text-orange-600 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
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