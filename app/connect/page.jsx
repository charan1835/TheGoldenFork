"use client";

import { useState, useRef } from "react";
import GlobalApi from "../_utils/GlobalApi";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "", // Changed from 'message' to 'description'
  });

  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

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
    if (!form.description.trim()) { // Changed from 'message' to 'description'
      errors.description = "Description is required";
    } else if (form.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
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
      const { name, email, description } = form; // Updated destructuring
      console.log("Submitting contact form:", { name, email, description });
      
      // Now the parameter names match your GraphQL mutation
      const result = await GlobalApi.createContactSubmission(name, email, description);
      console.log("Contact submission result:", result);
      
      toast.success("Message sent successfully! 🚀 We'll get back to you soon!");
      setForm({ name: "", email: "", description: "" }); // Updated reset
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Contact form error:", error);
      
      let errorMessage = "Failed to send message. Please try again.";
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
    setForm({ name: "", email: "", description: "" }); // Updated reset
    setSubmitted(false);
    setFocusedField(null);
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Have a project in mind? Let's collaborate and create something extraordinary together
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="relative group bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">💬</span>
                  Let's Chat
                </h2>
                <div className="space-y-6 text-gray-300">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">📧</span>
                    <div>
                      <p className="font-semibold text-white">Email</p>
                      <p>hello@yourcompany.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">📱</span>
                    <div>
                      <p className="font-semibold text-white">Phone</p>
                      <p>+91 12345 67890</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">🌍</span>
                    <div>
                      <p className="font-semibold text-white">Location</p>
                      <p>Kurnool, Andhra Pradesh, India</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">⏰</span>
                    <div>
                      <p className="font-semibold text-white">Response Time</p>
                      <p>Within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {submitted && (
                <div className="relative group bg-green-800/40 backdrop-blur-xl border border-green-700/50 rounded-3xl p-8 animate-pulse">
                  <h3 className="text-xl font-bold text-green-300 mb-3 flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    Message Sent Successfully!
                  </h3>
                  <p className="text-green-200 mb-2">
                    Thanks for reaching out! Your message has been saved to our system.
                  </p>
                  <p className="text-green-300 text-sm">
                    We'll get back to you within 24 hours! 🚀
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-3">
              <div className="relative group bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange}
                      onFocus={() => handleFocus('name')}
                      onBlur={handleBlur}
                      className={`w-full p-3 bg-zinc-700 border rounded-lg text-white placeholder-zinc-400 transition-all duration-300 focus:outline-none focus:ring-2 ${
                        focusedField === 'name' 
                          ? 'border-purple-400 focus:ring-purple-400/50' 
                          : 'border-zinc-600 hover:border-zinc-500'
                      }`}
                      placeholder="Enter your full name" 
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      value={form.email} 
                      onChange={handleChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={handleBlur}
                      className={`w-full p-3 bg-zinc-700 border rounded-lg text-white placeholder-zinc-400 transition-all duration-300 focus:outline-none focus:ring-2 ${
                        focusedField === 'email' 
                          ? 'border-purple-400 focus:ring-purple-400/50' 
                          : 'border-zinc-600 hover:border-zinc-500'
                      }`}
                      placeholder="your.email@example.com" 
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-2">
                      Your Message *
                    </label>
                    <textarea 
                      name="description" // Changed from 'message' to 'description'
                      value={form.description} // Updated value reference
                      onChange={handleChange}
                      onFocus={() => handleFocus('description')} // Updated focus handler
                      onBlur={handleBlur}
                      className={`w-full p-3 bg-zinc-700 border rounded-lg text-white placeholder-zinc-400 transition-all duration-300 focus:outline-none focus:ring-2 resize-none ${
                        focusedField === 'description' // Updated condition
                          ? 'border-purple-400 focus:ring-purple-400/50' 
                          : 'border-zinc-600 hover:border-zinc-500'
                      }`}
                      rows="6" 
                      placeholder="Tell us about your project, requirements, or just say hello..."
                      disabled={loading}
                      maxLength={1000}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-zinc-400">
                        {form.description.length}/1000 characters {/* Updated reference */}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Minimum 10 characters required
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={handleSubmit}
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Sending to Hygraph...
                        </>
                      ) : (
                        <>
                          <span>📨</span>
                          Send Message
                        </>
                      )}
                    </button>
                    
                    <button 
                      type="button"
                      onClick={handleReset}
                      className="py-3 px-6 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
                      disabled={loading}
                    >
                      🔄 Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}