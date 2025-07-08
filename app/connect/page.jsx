"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ConnectForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📨 Submitted:", formData);
    // Hook to your Hygraph mutation here.
  };

  return (
    <div className="min-h-screen bg-zinc-900 px-4 py-12 sm:px-6 lg:px-8 text-white">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Connect With Us</h2>
        <p className="text-zinc-400 mb-6">
          Got a project, collab idea, or feedback? Let’s talk.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-zinc-800 p-6 rounded-xl shadow-lg border border-zinc-700"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-zinc-300">
              Message
            </label>
            <textarea
              name="message"
              rows={5}
              required
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Tell us how we can help..."
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <Send size={18} /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
