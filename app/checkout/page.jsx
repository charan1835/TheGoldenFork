"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft,
  MapPin,
  Phone,
  User,
  CreditCard,
  Smartphone,
  Wallet,
  IndianRupee,
  ShoppingBag,
  Loader2,
  AlertCircle,
  CheckCircle,
  Lock,
  MessageSquare
} from "lucide-react";
import { useCart } from "../context/CartContext";
import GlobalApi from "../_utils/GlobalApi";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const { user } = useUser();
  const { cartCount, fetchCartCount } = useCart();
  const router = useRouter();

  // Address form state
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    specialInstructions: ""
  });

  // Form validation state
  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchCartItems();
      // Pre-fill name from user data
      setAddressForm(prev => ({
        ...prev,
        fullName: user.fullName || user.firstName || ""
      }));
    } else {
      setLoading(false);
    }
  }, [user]);
 
  // Load Razorpay checkout script once on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      // script.onload = () => {
      //   window.Razorpay = window.Razorpay || {};
      // };
    }
  }, []);
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0);
  };
  
  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 500 ? 0 : 50;
  };
  
  const calculateGST = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.18;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee() + calculateGST();
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!addressForm.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!addressForm.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(addressForm.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!addressForm.address.trim()) newErrors.address = "Address is required";
    if (!addressForm.city.trim()) newErrors.city = "City is required";
    if (!addressForm.state.trim()) newErrors.state = "State is required";
    if (!addressForm.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(addressForm.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handlePlaceOrder = async () => {
    // First, always validate the address form
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setPlacing(true);

    // If payment is via Razorpay, initiate payment flow
    if (selectedPayment === "razorpay") {
      const totalAmount = calculateTotal();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your Razorpay Key ID
        amount: Math.round(totalAmount * 100), // Amount in the smallest currency unit (paise)
        currency: "INR",
        name: "Hotel Madiina",
        description: "Food Order Payment",
        image: "/logo.png", // URL of your logo
        handler: async function (response) {
          // This function is called after successful payment
          console.log("Razorpay payment successful:", response);
          
          // Now, save the order to the database
          try {
            const savedOrder = await saveOrderToDB("razorpay", response.razorpay_payment_id);
            toast.success("Payment successful! Order placed.");
            // Pass order details to the confirmation page
            const query = new URLSearchParams({
              paymentMethod: "razorpay",
              address: addressForm.address,
              orderId: savedOrder.id,
              total: savedOrder.total,
            }).toString();
            router.push(`/order-confirmation?${query}`);
          } catch (error) {
            console.error("Error saving order after payment:", error);
            toast.error("Payment was successful, but failed to save your order. Please contact support.");
          } finally {
            setPlacing(false);
          }
        },
        prefill: {
          name: addressForm.fullName,
          email: user.primaryEmailAddress.emailAddress,
          contact: addressForm.phone,
        },
        theme: {
          color: "#F59E0B", // Orange color to match your theme
        },
        modal: {
          ondismiss: function () {
            // This function is called when user closes the modal
            console.log("Razorpay modal closed.");
            toast.error("Payment was cancelled.");
            setPlacing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } else { // Handle Cash on Delivery (COD)
      try {
        const savedOrder = await saveOrderToDB("cod");
        toast.success("Order placed successfully!");
        // Pass order details to the confirmation page
        const query = new URLSearchParams({
          paymentMethod: "cod",
          address: addressForm.address,
          orderId: savedOrder.id,
          total: savedOrder.total,
        }).toString();
        router.push(`/order-confirmation?${query}`);
      } catch (error) {
        console.error("Error placing COD order:", error);
        toast.error("Failed to place order. Please try again.");
      } finally {
        setPlacing(false);
      }
    }
  };

  // Helper function to save order and clean up
  const saveOrderToDB = async (paymentMethod, paymentId = null) => {
    try {
      const orderData = {
        userEmail: user.primaryEmailAddress.emailAddress,
        items: cartItems,
        deliveryAddress: addressForm.address,
        addressType: addressForm.addressType || "home",
        landmark: addressForm.landmark,
        paymentMethod: paymentMethod,
        paymentId: paymentId,
        subtotal: calculateSubtotal(),
        deliveryFee: calculateDeliveryFee(),
        gst: calculateGST(),
        total: calculateTotal(),
        orderDate: new Date().toISOString(),
        itemCount: cartItems.length,
      };

      console.log("💾 Saving order to database...");
      const savedOrder = await GlobalApi.createOrder({
        username: user?.fullName || "Guest",
        useremail: user.primaryEmailAddress.emailAddress,
        total: orderData.total,
        subtotal: orderData.subtotal,
        orderdate: orderData.orderDate, // Corrected from orderDate
        paymentmode: orderData.paymentMethod, // Corrected from paymentMethod
        items: cartItems.map(item => ({
          id: item.id,
          email: item.email,
          image: item.image,
          itemname: item.itemname,
          price: item.price
        })),
        gst: orderData.gst,
        deliveryfee: orderData.deliveryFee,
        address: `${orderData.deliveryAddress}${orderData.landmark ? ', ' + orderData.landmark : ''}`,
        statue: "pending",
        paymentId: orderData.paymentId,
      });

      console.log("✅ Order saved successfully:", savedOrder);

      console.log("🧹 Clearing cart after successful order save...");
      await GlobalApi.clearUserCart(user.primaryEmailAddress.emailAddress);

      setCartItems([]);
      await fetchCartCount();

      // You can still send a WhatsApp summary if needed
      // sendWhatsAppSummary(orderData);

      // Return the saved order to use its ID and total
      return savedOrder;
    } catch (error) {
      // Re-throw the error to be caught by the caller
      throw error;
    }
  };


  const paymentMethods = [
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: IndianRupee,
      description: "Pay when your order arrives",
      available: true
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, MasterCard, RuPay",
      available: false
    },
    {
      id: "upi",
      name: "UPI Payment",
      icon: Smartphone,
      description: "Google Pay, PhonePe, Paytm",
      available: false
    },
    {
      id: "razorpay",
      name: "Razorpay",
      icon: Wallet,
      description: "Razorpay",
      available: true
    }
  ];

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <Lock className="w-20 h-20 mx-auto text-gray-400 mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
              <p className="text-gray-600 mb-8">Please sign in to proceed with checkout</p>
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <ShoppingBag className="w-20 h-20 mx-auto text-gray-400 mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-8">Add items to your cart before checkout</p>
              <button
                onClick={() => router.push("/")}
                className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Browse Menu
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Checkout
            </h1>
            <p className="text-gray-600 mt-1">Complete your order</p>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Delivery Address
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={addressForm.fullName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={addressForm.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-orange-500 ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={addressForm.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-orange-500 ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your complete address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-orange-500 ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={addressForm.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-orange-500 ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter state"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.state}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={addressForm.pincode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-orange-500 ${
                      errors.pincode ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter pincode"
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.pincode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={addressForm.landmark}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-orange-500"
                    placeholder="Enter landmark"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions for Delivery
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      name="specialInstructions"
                      value={addressForm.specialInstructions}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-orange-500"
                      placeholder="Any special instructions for delivery..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h2>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className={`relative`}>
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        method.available 
                          ? selectedPayment === method.id
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-300 hover:border-gray-400"
                          : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                      }`}
                      onClick={() => method.available && setSelectedPayment(method.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          method.available && selectedPayment === method.id
                            ? "border-orange-500 bg-orange-500"
                            : "border-gray-300"
                        }`}>
                          {method.available && selectedPayment === method.id && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <method.icon className={`w-5 h-5 ${
                          method.available ? "text-gray-600" : "text-gray-400"
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-medium ${
                              method.available ? "text-gray-800" : "text-gray-500"
                            }`}>
                              {method.name}
                            </h3>
                            {!method.available && (
                              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                                Coming Soon
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${
                            method.available ? "text-gray-600" : "text-gray-400"
                          }`}>
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.itemname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-sm truncate">
                        {item.itemname}
                      </h4>
                      <div className="flex items-center text-orange-600 font-medium">
                        <IndianRupee className="w-3 h-3" />
                        <span className="text-sm">{item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <div className="flex items-center font-medium text-black">
                    <IndianRupee className="w-4 h-4" />
                    <span>{calculateSubtotal()}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">GST</span>
                  <div className="flex items-center font-medium text-black">
                    <IndianRupee className="w-4 h-4" />
                    <span>{calculateGST(calculateSubtotal())}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Fee</span>
                  <div className="flex items-center font-medium text-black">
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
                
                {calculateSubtotal() > 0 && calculateSubtotal() <= 500 && (
                  <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    Add ₹{500 - calculateSubtotal()} more for free delivery
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-black">Total</span>
                    <div className="flex items-center text-xl font-bold text-black">
                      <IndianRupee className="w-5 h-5" />
                      <span>{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {placing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>
              
              <div className="mt-3 text-center text-sm text-gray-500">
                <Lock className="w-4 h-4 inline mr-1" />
                Your order details are secure
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}