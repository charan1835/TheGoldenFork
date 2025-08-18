"use client";

import { ClerkProvider, useUser } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { CartProvider } from "./context/CartContext";
import { Toaster, toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

function WelcomeToast() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      const username = user.firstName || "babe";

      toast.success(`👋 Welcome ${username}!`, {
        duration: 2200,
      });

      setTimeout(() => {
        toast("Did you miss me babe? 🥺 Come, let’s have a dinner date ❤️", {
          duration: 3000,
          position: "bottom-center",
        });
      }, 2000);
    }
  }, [isSignedIn, user]);

  return null;
}

export default function RootLayout({ children }) {
  const [updateCart, setUpdateCart] = useState(false);
  const pathname = usePathname();

  const isAdminPanel = pathname?.startsWith("/adminpanel");

  return (
    <ClerkProvider>
      <CartProvider>
        <html lang="en">
          <body className={inter.className}>
            <SpeedInsights />

            {/* 🔐 Conditional Layout Logic */}
            {isAdminPanel ? (
              // 👨‍💼 Admin Panel View
              <main className="min-h-screen bg-gray-900 text-white">{children}</main>
            ) : (
              // 👤 User Side View
              <>
                <WelcomeToast />
                <Header />
                <main className="relative z-10 text-white">{children}</main>
                <Toaster position="top-center" reverseOrder={false} />

                {/* 💚 WhatsApp Floating Button */}
                <a
                  href="https://wa.me/918688605760?text=Hey%20hello%20I%20have%20a%20query%20regarding%20the%20order"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                  >
                    <path d="M16 2.938c-7.379 0-13.375 5.996-13.375 13.375...z" />
                  </svg>
                </a>
              </>
            )}
          </body>
        </html>
      </CartProvider>
    </ClerkProvider>
  );
}
