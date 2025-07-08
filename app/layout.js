"use client";

import { ClerkProvider, useUser } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
// 🔄 CHANGE THIS:
import Header from "./_components/Header";
import { CartProvider } from "./context/CartContext";
      
import { Toaster, toast } from "react-hot-toast";

import { useEffect, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

function WelcomeToast() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      const username = user.firstName || "babe";

      // Cute Welcome Toast
      toast.success(`👋 Welcome ${username}!`, {
        duration: 2200,
      });

      // After 2s, drop the dinner invite
      setTimeout(() => {
        toast("Did you miss me babe? 🥺 Come, let’s have a dinner date ❤️", {
          duration: 3000,
        });

        // Optional second line toast
        setTimeout(() => {
          toast("Or just order something and enjoy your meal 🍔", {
            duration: 3000,
          });
        }, 2500);
      }, 2000);
    }
  }, [isSignedIn, user]);

  return null;
}

export default function RootLayout({ children }) {
  const [updateCart, setUpdateCart] = useState(false);

  return (
    <ClerkProvider>
      <CartProvider>
        <html lang="en">
          <body className={inter.className}>
            <SpeedInsights />

            {/* 💬 Welcome Toast for Signed-In Users */}
            <WelcomeToast />

            {/* 🧭 Navigation */}
            <Header />

            {/* 🚀 Main Content Area */}
            <main className="relative z-10 text-white">{children}</main>

            {/* 🌟 Toaster Component */}
            <Toaster position="top-center" reverseOrder={false} />

            {/* 💚 WhatsApp Floating Button */}
            <a
              href="https://wa.me/918688605760?text=Hey%20hello%20I%20have%20a%20query%20regarding%20the%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition duration-300"
            >
              {/* WhatsApp Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M16 2.938c-7.379 0-13.375 5.996-13.375 13.375 0 2.363.625 4.652 1.813 6.688l-1.906 6.938 7.125-1.875a13.42 13.42 0 006.344 1.625h.001c7.377 0 13.373-5.996 13.373-13.375S23.377 2.938 16 2.938zm0 24.625a11.47 11.47 0 01-5.938-1.625l-.426-.25-4.219 1.125 1.125-4.063-.281-.438A11.447 11.447 0 014.5 16.313C4.5 9.998 9.685 4.813 16 4.813c6.314 0 11.5 5.185 11.5 11.5s-5.186 11.5-11.5 11.5zm6.282-8.217c-.33-.166-1.951-.961-2.256-1.07-.303-.111-.525-.166-.748.167-.222.33-.861 1.07-1.056 1.291-.194.222-.388.249-.718.083-.33-.166-1.396-.513-2.66-1.633-.984-.878-1.648-1.961-1.843-2.291-.194-.33-.021-.51.146-.676.15-.15.33-.388.497-.583.167-.194.222-.33.333-.555.111-.222.056-.416-.028-.583-.083-.167-.748-1.804-1.025-2.47-.27-.648-.548-.56-.748-.57l-.64-.012a1.21 1.21 0 00-.872.406c-.305.33-1.161 1.135-1.161 2.767s1.188 3.208 1.352 3.43c.167.222 2.34 3.57 5.666 5.004.792.342 1.41.547 1.891.699.794.252 1.515.216 2.086.131.637-.095 1.951-.796 2.23-1.565.276-.77.276-1.428.194-1.565-.083-.139-.305-.222-.64-.388z" />
              </svg>
            </a>
          </body>
        </html>
      </CartProvider>
    </ClerkProvider>
  );
}
