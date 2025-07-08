'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <footer className="footer-container">
      {/* Main Footer Content */}
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-section brand-section">
          <div className="brand-logo">
            <span className="logo-icon">🍳</span>
            <span className="logo-text">FoodVibe</span>
          </div>
          <p className="brand-description">
            Real-time local kitchen bringing fresh, delicious meals to your doorstep. 
            Made with love, served with speed.
          </p>
          <div className="social-links">
            <a href="https://wa.me/8688605760" className="social-link">📱</a>
            <a href="mailto:chimbilicharan@gmail.com" className="social-link">📧</a>
            <a href="https://twitter.com/chimbilicharan" className="social-link">🐦</a>
            <a href="#" className="social-link">📘</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="section-title">Quick Bites</h3>
          <ul className="footer-links">
            <li><Link href="/">🍽️ Menu</Link></li>
            <li><Link href="/about"> 👨‍🍳 Our Story</Link></li>
            <li><Link href="#live">📺 Live Kitchen</Link></li>
            <li><Link href="#reviews">⭐ Reviews</Link></li>
            <li><Link href="/connect">📞 Contact</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h3 className="section-title">Services</h3>
          <ul className="footer-links">
            <li><a href="#delivery">🚚 Fast Delivery</a></li>
            <li><a href="#catering">🎉 Catering</a></li>
            <li><a href="#subscription">📅 Meal Plans</a></li>
            <li><a href="#corporate">🏢 Corporate Orders</a></li>
            <li><a href="#events">🎊 Special Events</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-section newsletter-section">
          <h3 className="section-title">Stay Hungry 😋</h3>
          <p className="newsletter-text">
            Get notified about new dishes, special offers, and cooking tips!
          </p>
          
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button">
                🔔 Subscribe
              </button>
            </form>
          ) : (
            <div className="subscription-success">
              <span className="success-icon">✅</span>
              <p>Thanks! You're all set for tasty updates!</p>
            </div>
          )}

          <div className="delivery-info">
            <h4>📍 Delivery Areas</h4>
            <p>Guntakal, Andhra Pradesh & surrounding areas</p>
            <p className="delivery-time">🕒 Open: 11 AM - 11 PM</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="bottom-content">
          <div className="copyright">
            <p>&copy; 2025 FoodVibe. Made with ❤️ in Guntakal</p>
          </div>
          
          <div className="footer-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat">
              <span className="stat-number">15min</span>
              <span className="stat-label">Avg Delivery</span>
            </div>
            <div className="stat">
              <span className="stat-number">4.8⭐</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>

          <div className="legal-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#refund">Refund Policy</a>
          </div>
        </div>
      </div>

      {/* Floating Food Elements */}
      <div className="floating-food">
        <div className="food-emoji food-1">🍕</div>
        <div className="food-emoji food-2">🍔</div>
        <div className="food-emoji food-3">🍜</div>
        <div className="food-emoji food-4">🥘</div>
        <div className="food-emoji food-5">🍰</div>
      </div>

      <style jsx>{`
        .footer-container {
          background: linear-gradient(135deg, #2c3e50, #34495e);
          color: white;
          margin-top: 50px;
          position: relative;
          overflow: hidden;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 20px 40px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 40px;
          position: relative;
          z-index: 10;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Brand Section */
        .brand-section {
          max-width: 350px;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .logo-icon {
          font-size: 3em;
          animation: brand-pulse 3s infinite;
        }

        .logo-text {
          font-size: 2.5em;
          font-weight: 800;
          background: linear-gradient(45deg, #ff6b6b, #ffa726);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-description {
          font-size: 1.1em;
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom: 20px;
        }

        .social-links {
          display: flex;
          gap: 15px;
        }

        .social-link {
          display: inline-block;
          font-size: 1.5em;
          padding: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          text-decoration: none;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .social-link:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px);
        }

        /* Section Titles */
        .section-title {
          font-size: 1.5em;
          font-weight: 700;
          margin-bottom: 20px;
          color: #ff6b6b;
          position: relative;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 3px;
          background: linear-gradient(45deg, #ff6b6b, #ffa726);
          border-radius: 2px;
        }

        /* Footer Links */
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-links li a {
          color: white;
          text-decoration: none;
          font-size: 1.1em;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          border-left: 3px solid transparent;
          padding-left: 15px;
        }

        .footer-links li a:hover {
          color: #ff6b6b;
          border-left-color: #ff6b6b;
          transform: translateX(5px);
        }

        /* Newsletter Section */
        .newsletter-section {
          background: rgba(255, 255, 255, 0.1);
          padding: 30px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .newsletter-text {
          font-size: 1.1em;
          opacity: 0.9;
          margin-bottom: 20px;
        }

        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .newsletter-input {
          padding: 15px;
          font-size: 1.1em;
          border: none;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          outline: none;
          transition: all 0.3s ease;
        }

        .newsletter-input:focus {
          background: white;
          box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
        }

        .newsletter-button {
          padding: 15px;
          font-size: 1.1em;
          font-weight: 600;
          border: none;
          border-radius: 50px;
          background: linear-gradient(45deg, #ff6b6b, #ffa726);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .newsletter-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);
        }

        .subscription-success {
          text-align: center;
          padding: 20px;
          background: rgba(76, 175, 80, 0.2);
          border-radius: 15px;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }

        .success-icon {
          font-size: 2em;
          display: block;
          margin-bottom: 10px;
        }

        .delivery-info {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .delivery-info h4 {
          font-size: 1.2em;
          margin-bottom: 10px;
          color: #ffa726;
        }

        .delivery-time {
          color: #ff6b6b;
          font-weight: 600;
        }

        /* Footer Bottom */
        .footer-bottom {
          background: rgba(0, 0, 0, 0.3);
          padding: 30px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .bottom-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .copyright {
          font-size: 1.1em;
          opacity: 0.8;
        }

        .footer-stats {
          display: flex;
          gap: 30px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 1.3em;
          font-weight: 700;
          color: #ff6b6b;
        }

        .stat-label {
          font-size: 0.9em;
          opacity: 0.7;
        }

        .legal-links {
          display: flex;
          gap: 20px;
        }

        .legal-links a {
          color: white;
          text-decoration: none;
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .legal-links a:hover {
          opacity: 1;
          color: #ff6b6b;
        }

        /* Floating Food Elements */
        .floating-food {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .food-emoji {
          position: absolute;
          font-size: 2em;
          opacity: 0.1;
          animation: float-food 12s infinite linear;
        }

        .food-1 { top: 10%; left: 5%; animation-delay: 0s; }
        .food-2 { top: 20%; right: 10%; animation-delay: 2s; }
        .food-3 { top: 50%; left: 8%; animation-delay: 4s; }
        .food-4 { bottom: 30%; right: 5%; animation-delay: 6s; }
        .food-5 { bottom: 10%; left: 15%; animation-delay: 8s; }

        /* Animations */
        @keyframes brand-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        @keyframes float-food {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0px) rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            padding: 40px 15px;
            gap: 30px;
          }

          .brand-section {
            max-width: 100%;
          }

          .logo-text {
            font-size: 2em;
          }

          .bottom-content {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }

          .footer-stats {
            gap: 20px;
          }

          .legal-links {
            flex-direction: column;
            gap: 10px;
          }
        }

        @media (max-width: 480px) {
          .newsletter-form {
            gap: 10px;
          }

          .social-links {
            justify-content: center;
          }

          .footer-stats {
            flex-direction: column;
            gap: 15px;
          }
        }
      `}</style>
    </footer>
  )
}