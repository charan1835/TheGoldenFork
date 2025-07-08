"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import GlobalApi from "../_utils/GlobalApi";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [localCartCount, setLocalCartCount] = useState(0);
  const { user } = useUser();

  const totalCount = cartCount + localCartCount;

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchCartCount();
    } else {
      setCartCount(0);
      setLocalCartCount(0);
    }
  }, [user]);

  const fetchCartCount = async () => {
    try {
      const res = await GlobalApi.getUserCart(user?.primaryEmailAddress?.emailAddress);
      setCartCount(res?.usercarts?.length || 0);
      setLocalCartCount(0);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  };

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
    setLocalCartCount(0);
  };

  const incrementCartCount = () => {
    setLocalCartCount(prev => prev + 1);
  };

  const decrementCartCount = () => {
    setLocalCartCount(prev => Math.max(0, prev - 1));
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartCount: totalCount, 
        updateCartCount, 
        incrementCartCount, 
        decrementCartCount,
        fetchCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}