'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <footer className="mt-16 border-t border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍳</span>
              <span className="text-lg font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">FoodVibe</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Fresh, delicious meals from a live local kitchen. Made with love, served with speed.
            </p>
            <div className="flex gap-2">
              <a href="https://wa.me/8688605760" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 hover:bg-foreground/5">📱</a>
              <a href="mailto:chimbilicharan@gmail.com" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 hover:bg-foreground/5">📧</a>
              <a href="https://twitter.com/chimbilicharan" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 hover:bg-foreground/5">🐦</a>
              <a href="#" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 hover:bg-foreground/5">📘</a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Quick Bites</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/" className="hover:text-foreground">Menu</Link></li>
              <li><Link href="/about" className="hover:text-foreground">Our Story</Link></li>
              <li><Link href="#reviews" className="hover:text-foreground">Reviews</Link></li>
              <li><Link href="/connect" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Services</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#delivery" className="hover:text-foreground">Fast Delivery</a></li>
              <li><a href="#catering" className="hover:text-foreground">Catering</a></li>
              <li><a href="#subscription" className="hover:text-foreground">Meal Plans</a></li>
              <li><a href="#events" className="hover:text-foreground">Special Events</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Stay Hungry 😋</h3>
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="mt-3 flex w-full max-w-sm items-center gap-2">
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 rounded-md border border-border/60 bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
                />
                <button type="submit" className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
                  Subscribe
                </button>
              </form>
            ) : (
              <div className="mt-3 rounded-md border border-green-600/40 bg-green-600/10 px-3 py-2 text-sm text-green-300">
                Thanks! You're all set for tasty updates!
              </div>
            )}
            <div className="mt-4 text-xs text-muted-foreground">
              <p>📍 Guntakal, Andhra Pradesh & nearby</p>
              <p>🕒 11 AM - 11 PM</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} FoodVibe. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-foreground">Privacy</a>
            <a href="#terms" className="hover:text-foreground">Terms</a>
            <a href="#refund" className="hover:text-foreground">Refunds</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
