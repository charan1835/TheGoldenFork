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
      <html lang="en" className="dark bg-background text-foreground">
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
                {/* Floating WhatsApp button */}
                <a
                  href="https://wa.me/918688605760"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Chat"
                  className="fixed bottom-5 right-5 z-50 inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#25D366] text-white shadow-elevated border border-white/20 hover:scale-105 transition-transform"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-6 w-6" fill="currentColor" aria-hidden>
                    <path d="M19.11 17.21c-.28-.14-1.64-.81-1.9-.9-.26-.1-.45-.14-.64.14-.19.28-.73.9-.9 1.08-.17.19-.33.21-.61.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.64-1.54-.88-2.11-.23-.55-.47-.48-.64-.49-.16-.01-.35-.01-.54-.01-.19 0-.49.07-.75.35-.26.28-1 1-1 2.43 0 1.43 1.02 2.81 1.16 3 .14.19 2.01 3.06 4.87 4.29.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.12.55-.08 1.64-.67 1.87-1.32.23-.65.23-1.21.16-1.32-.07-.12-.26-.19-.54-.33z"/>
                    <path d="M26.07 5.93C23.28 3.14 19.76 1.6 16 1.6 8.78 1.6 2.96 7.42 2.96 14.64c0 2.25.59 4.45 1.71 6.39L2 30.4l9.62-2.51c1.86 1.02 3.98 1.56 6.15 1.56 7.22 0 13.04-5.82 13.04-13.04 0-3.76-1.54-7.28-4.33-10.08zM16.77 27.2c-1.98 0-3.91-.53-5.6-1.54l-.4-.24-5.71 1.49 1.52-5.56-.26-.43c-1.07-1.8-1.63-3.86-1.63-5.96C4.69 8.53 9.87 3.35 16 3.35c3.39 0 6.58 1.32 8.98 3.72s3.72 5.59 3.72 8.98c-.01 6.13-5.19 11.15-11.93 11.15z"/>
                  </svg>
                </a>
              </>
            )}

            <SpeedInsights />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}