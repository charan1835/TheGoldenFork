"use client";

import { useState } from "react";
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

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user } = useUser();

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-lg relative z-50">
      <Link
        href="/"
        className="text-2xl font-extrabold tracking-tight flex items-center gap-3 transition-transform duration-300 hover:scale-105"
      >
        <UtensilsCrossed className="w-7 h-7 text-amber-400 animate-pulse" />
        <span className="text-amber-300">Madeena Restaurant</span>
      </Link>

      <nav className="hidden md:flex gap-6 text-sm font-semibold tracking-wide">
        <Link href="/" className="hover:text-amber-400 transition">Home</Link>
        <Link href="/my-orders" className="hover:text-amber-400 transition">My Orders</Link>
        <Link href="/about" className="hover:text-amber-400 transition">About</Link>
        <Link href="/connect" className="hover:text-amber-400 transition">Connect</Link>
      </nav>

      <div className="flex items-center gap-4">
        <Link
          href="/cart"
          className="relative group p-2 rounded-full hover:bg-gray-700 transition"
        >
          <ShoppingCart className="w-6 h-6 text-gray-300 group-hover:text-amber-400 transition" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
              {cartCount}
            </span>
          )}
        </Link>

        <SignedOut>
          <div className="hidden md:flex gap-2">
            <SignInButton mode="modal">
              <button className="bg-amber-500 text-gray-900 px-4 py-1.5 rounded-full font-semibold shadow hover:bg-amber-400 transition">
                🔐 Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-white text-gray-900 px-4 py-1.5 rounded-full font-semibold shadow hover:bg-gray-100 transition">
                ✍️ Sign Up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {menuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full right-0 w-full bg-gray-900 shadow-lg py-4 px-6 flex flex-col gap-4 md:hidden">
          <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-amber-400">Home</Link>
          <Link href="/my-orders" onClick={() => setMenuOpen(false)} className="hover:text-amber-400">My Orders</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="hover:text-amber-400">About</Link>
          <Link href="/connect" onClick={() => setMenuOpen(false)} className="hover:text-amber-400">Connect</Link>

          <SignedOut>
            <div className="flex flex-col gap-2 mt-2">
              <SignInButton mode="modal">
                <button className="bg-amber-500 text-gray-900 px-4 py-2 rounded-full font-semibold shadow hover:bg-amber-400 transition">
                  🔐 Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold shadow hover:bg-gray-100 transition">
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