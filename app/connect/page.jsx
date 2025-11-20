"use client";

import { useState, useRef } from "react";
import GlobalApi from "../_utils/GlobalApi";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) {
      errors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!form.description.trim()) {
      errors.description = "Message is required";
    } else if (form.description.trim().length < 10) {
      errors.description = "Message must be at least 10 characters";
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => toast.error(error));
      return;
    }

    setLoading(true);
    try {
      const { name, email, description } = form;
      const result = await GlobalApi.createContactSubmission(name, email, description);

      toast.success("Thank you! We'll be in touch soon. 🌟");
      setForm({ name: "", email: "", description: "" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 6000);
    } catch (error) {
      console.error("Contact form error:", error);
      let errorMessage = "Unable to send message. Please try again.";
      if (error.response?.errors?.[0]?.message) {
        errorMessage = error.response.errors[0].message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ name: "", email: "", description: "" });
    setSubmitted(false);
    setFocusedField(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 rounded-full text-violet-300 text-sm font-medium backdrop-blur-sm">
                ✨ We'd Love to Hear From You
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                Let's Connect
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Whether you have feedback, a query about our food services, or just want to chat, we're eager to hear from you and make your experience exceptional.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Contact Card */}
              <div className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 hover:border-violet-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-violet-500/30">
                      �
                    </div>
                    <h2 className="text-2xl font-bold text-white">Quick Contact</h2>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-start gap-4 group/item">
                      <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center text-xl flex-shrink-0 group-hover/item:bg-violet-500/20 transition-colors">
                        📧
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-400 mb-1">Email Us</p>
                        <a href="mailto:info@hotelmadiina.com" className="text-white hover:text-violet-400 transition-colors font-medium">
                          info@hotelmadiina.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group/item">
                      <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center text-xl flex-shrink-0 group-hover/item:bg-violet-500/20 transition-colors">
                        📱
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-400 mb-1">Call Us</p>
                        <a href="tel:+919876543210" className="text-white hover:text-violet-400 transition-colors font-medium">
                          +91 98765 43210
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group/item">
                      <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center text-xl flex-shrink-0 group-hover/item:bg-violet-500/20 transition-colors">
                        📍
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-400 mb-1">Visit Us</p>
                        <p className="text-white font-medium">Hotel Madiina</p>
                        <p className="text-slate-300 text-sm">Kurnool, Andhra Pradesh</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours Card */}
              <div className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 hover:border-violet-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30">
                      ⏰
                    </div>
                    <h2 className="text-2xl font-bold text-white">We're Available</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Reception</span>
                      <span className="text-white font-semibold">24/7</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Restaurant</span>
                      <span className="text-white font-semibold">7 AM - 11 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Response Time</span>
                      <span className="text-emerald-400 font-semibold">Within 2 hours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              {submitted && (
                <div className="relative bg-gradient-to-br from-emerald-800/60 to-emerald-900/60 backdrop-blur-xl border border-emerald-500/50 rounded-2xl p-8 animate-slideIn shadow-2xl shadow-emerald-500/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 animate-bounce">
                      ✅
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-emerald-100 mb-2">
                        Message Received!
                      </h3>
                      <p className="text-emerald-200 text-sm leading-relaxed">
                        Thank you for reaching out. Our team will review your message and get back to you shortly.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="relative group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 lg:p-10 hover:border-violet-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Send Us a Message</h2>
                    <p className="text-slate-400">Fill out the form below and we'll get back to you as soon as possible.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div className="group/field">
                      <label htmlFor="name" className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                        <span className="text-lg">👤</span>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={form.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3.5 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 ${focusedField === 'name'
                          ? 'border-violet-500 focus:ring-violet-500/30 bg-slate-900/70'
                          : 'border-slate-600 hover:border-slate-500'
                          }`}
                        placeholder="Enter your full name"
                        disabled={loading}
                      />
                    </div>

                    {/* Email Field */}
                    <div className="group/field">
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                        <span className="text-lg">✉️</span>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3.5 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 ${focusedField === 'email'
                          ? 'border-violet-500 focus:ring-violet-500/30 bg-slate-900/70'
                          : 'border-slate-600 hover:border-slate-500'
                          }`}
                        placeholder="your.email@example.com"
                        disabled={loading}
                      />
                    </div>

                    {/* Message Field */}
                    <div className="group/field">
                      <label htmlFor="description" className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                        <span className="text-lg">💬</span>
                        Your Message *
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        value={form.description}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('description')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3.5 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 resize-none ${focusedField === 'description'
                          ? 'border-violet-500 focus:ring-violet-500/30 bg-slate-900/70'
                          : 'border-slate-600 hover:border-slate-500'
                          }`}
                        rows="6"
                        placeholder="Tell us about your inquiry, event plans, special requests, or any questions you may have..."
                        disabled={loading}
                        maxLength={1000}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-slate-500">
                          {form.description.length}/1000 characters
                        </p>
                        <p className="text-xs text-slate-500">
                          Minimum 10 characters
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="flex-1 group/btn relative py-4 px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none overflow-hidden"
                        disabled={loading}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                        <span className="relative flex items-center justify-center gap-3">
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <span className="text-xl">�</span>
                              <span>Send Message</span>
                            </>
                          )}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="py-4 px-8 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
                        disabled={loading}
                      >
                        <span className="text-xl">🔄</span>
                        <span>Reset</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        
        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
}