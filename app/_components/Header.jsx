"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import {
  ShoppingCart,
  UtensilsCrossed,
  Menu as MenuIcon,
  X as CloseIcon,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import BubbleMenu from "./BubbleMenu";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user } = useUser();

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('siteTheme') : null
    if (saved === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 px-6 py-3 flex justify-between items-center border-b border-border/60 bg-surface/60 backdrop-blur-md text-foreground shadow-soft">
      <Link
        href="/"
        className="text-2xl font-extrabold tracking-tight flex items-center gap-3 transition-transform duration-300 hover:scale-105"
      >
        <UtensilsCrossed className="w-7 h-7 text-amber-400 animate-pulse" />
        <span className="text-amber-300">Madeena Restaurant</span>
      </Link>

      <nav className="hidden md:flex gap-2 text-sm font-medium tracking-wide">
        <Link href="/" className="px-3 py-1.5 rounded-full hover:bg-foreground/5 hover:text-foreground transition">Home</Link>
        <Link href="/my-orders" className="px-3 py-1.5 rounded-full hover:bg-foreground/5 hover:text-foreground transition">My Orders</Link>
        <Link href="/about" className="px-3 py-1.5 rounded-full hover:bg-foreground/5 hover:text-foreground transition">About</Link>
        <Link href="/connect" className="px-3 py-1.5 rounded-full hover:bg-foreground/5 hover:text-foreground transition">Connect</Link>
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            const root = document.documentElement
            root.classList.toggle('dark')
            const isDark = root.classList.contains('dark')
            localStorage.setItem('siteTheme', isDark ? 'dark' : 'light')
          }}
          className="hidden md:inline px-3 py-1.5 rounded-full border border-border/70 text-sm hover:bg-foreground/5"
        >
          Theme
        </button>
        <Link
          href="/cart"
          className="relative group p-2 rounded-full hover:bg-foreground/5 transition"
        >
          <ShoppingCart className="w-6 h-6 text-foreground/80 group-hover:text-foreground transition" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded-full font-bold">
              {cartCount}
            </span>
          )}
        </Link>

        <SignedOut>
          <div className="hidden md:flex gap-2">
            <SignInButton mode="modal">
              <button className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full font-semibold shadow-soft hover:shadow-elevated transition">
                🔐 Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-foreground text-background px-4 py-1.5 rounded-full font-semibold shadow-soft hover:shadow-elevated transition">
                ✍️ Sign Up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        <div className="md:hidden">
          <BubbleMenu
            logo={<span style={{ fontWeight: 700 }}>RB</span>}
            items={[
              { label: 'home', href: '/', ariaLabel: 'Home', rotation: -8, hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' } },
              { label: 'about', href: '/about', ariaLabel: 'About', rotation: 8, hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' } },
              { label: 'orders', href: '/my-orders', ariaLabel: 'My Orders', rotation: 8, hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' } },
              { label: 'connect', href: '/connect', ariaLabel: 'Connect', rotation: 8, hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' } },
              { label: 'cart', href: '/cart', ariaLabel: 'Cart', rotation: -8, hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' } },
            ]}
            menuAriaLabel="Toggle navigation"
            menuBg="#ffffff"
            menuContentColor="#111111"
            useFixedPosition={false}
            animationEase={[0.22,1,0.36,1]}
            animationDuration={0.5}
            staggerDelay={0.12}
          />
        </div>
      </div>

      {menuOpen && (
        <div className="absolute top-full right-0 w-full bg-surface border-t border-border/60 shadow-soft py-4 px-6 flex flex-col gap-3 md:hidden">
          <Link href="/" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-md hover:bg-foreground/5">Home</Link>
          <Link href="/my-orders" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-md hover:bg-foreground/5">My Orders</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-md hover:bg-foreground/5">About</Link>
          <Link href="/connect" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-md hover:bg-foreground/5">Connect</Link>

          <SignedOut>
            <div className="flex flex-col gap-2 mt-2">
              <SignInButton mode="modal">
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold shadow-soft hover:shadow-elevated transition">
                  🔐 Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-foreground text-background px-4 py-2 rounded-full font-semibold shadow-soft hover:shadow-elevated transition">
                  ✍️ Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>
      )}
    </header>
  );
}