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
        toast("Did you miss me babe? 🥺 Come, let's have a dinner date ❤️", {
          duration: 1000,
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

  const isAdminPanel = pathname?.startsWith("/admin");

  return (
    <ClerkProvider>
      <html lang="en" className="bg-background text-foreground">
        <body className={`${inter.className} antialiased selection:bg-primary/15 selection:text-foreground` }>
          <CartProvider>
            <WelcomeToast />
            <Toaster />

            {/* 🔐 Conditional Layout Logic */}
            {isAdminPanel ? (
              // 👨💼 Admin Panel View - NO HEADER
              <div>
                {children}
              </div>
            ) : (
              // 👤 User Side View - WITH HEADER
              <>
                <Header updateCart={updateCart} />
                <div className="min-h-screen bg-surface">
                  {children}
                </div>

                
              </>
            )}

            <SpeedInsights />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}