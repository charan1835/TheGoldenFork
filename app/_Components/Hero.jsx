'use client'

import { useState, useEffect } from 'react'

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const heroSlides = [
    {
      title: "Fresh, Local, Delicious",
      subtitle: "Real-time cooking from your neighborhood kitchen",
      emoji: "🍳",
      gradient: "from-orange-500 to-red-600",
      bgEmoji: "🔥🍅🌶️"
    },
    {
      title: "Made with Love",
      subtitle: "Watch your meal being prepared live",
      emoji: "❤️",
      gradient: "from-pink-500 to-purple-600",
      bgEmoji: "💖🥘✨"
    },
    {
      title: "Ready in Minutes",
      subtitle: "Hot, fresh food delivered fast",
      emoji: "⚡",
      gradient: "from-yellow-500 to-orange-600",
      bgEmoji: "🚀🍽️⏰"
    }
  ]

  useEffect(() => {
    setIsLoaded(true)
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const currentHero = heroSlides[currentSlide]

  return (
    <div className={`hero-container ${isLoaded ? 'loaded' : ''}`}>
      <div className="hero-content">
        <div className="hero-main">
          <div className="hero-emoji">{currentHero.emoji}</div>
          <h1 className="hero-title">{currentHero.title}</h1>
          <p className="hero-subtitle">{currentHero.subtitle}</p>
          
          <div className="hero-buttons">
            <button className="cta-button primary">
              🛍️ Order Now
            </button>
            <button className="cta-button secondary" onClick={() => window.open('https://youtu.be/Seg3Rmts7Yo?si=87JOxhsos8FYU-lX', '_blank')}>
              👨‍🍳 Watch Kitchen Live
            </button>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-number">🔥 25-30</div>
            <div className="stat-label">Mins Avg</div>
          </div>
          <div className="stat">
            <div className="stat-number">⭐ 4.8</div>
            <div className="stat-label">Rating</div>
          </div>
          <div className="stat">
            <div className="stat-number">🚀 500+</div>
            <div className="stat-label">Happy Orders</div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="slide-indicators">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* Floating Background Elements */}
      <div className="floating-elements">
        {currentHero.bgEmoji.split('').map((emoji, index) => (
          <div
            key={index}
            className="floating-emoji"
            style={{
              animationDelay: `${index * 0.5}s`,
              left: `${20 + (index % 5) * 25}%`,
              top: `${30 + Math.floor(index / 5) * 40}%`
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <style jsx>{`
        .hero-container {
          position: relative;
          min-height: 60vh;
          background: linear-gradient(135deg, 
            ${currentHero.gradient.includes('orange') ? '#ff6b35, #f7931e' : 
              currentHero.gradient.includes('pink') ? '#ff6b9d, #c44569' : 
              '#ffa726, #ff7043'});
          border-radius: 25px;
          margin: 20px 0;
          padding: 40px;
          overflow: hidden;
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          opacity: 0;
          transform: translateY(30px);
        }

        .hero-container.loaded {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-content {
          position: relative;
          z-index: 10;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          gap: 30px;
        }

        .hero-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .hero-emoji {
          font-size: 5em;
          animation: hero-bounce 2s infinite;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
        }

        .hero-title {
          font-size: 3.5em;
          font-weight: 800;
          color: white;
          text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
          margin: 0;
          animation: slide-in-left 1s ease-out;
        }

        .hero-subtitle {
          font-size: 1.3em;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          max-width: 600px;
          animation: slide-in-right 1s ease-out;
        }

        .hero-buttons {
          display: flex;
          gap: 20px;
          margin-top: 20px;
          animation: fade-in-up 1.2s ease-out;
        }

        .cta-button {
          padding: 15px 30px;
          font-size: 1.1em;
          font-weight: 600;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .cta-button.primary {
          background: white;
          color: #333;
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        .cta-button.primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.3);
        }

        .cta-button.secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid white;
          backdrop-filter: blur(10px);
        }

        .cta-button.secondary:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .hero-stats {
          display: flex;
          gap: 40px;
          animation: fade-in-up 1.4s ease-out;
        }

        .stat {
          text-align: center;
          color: white;
        }

        .stat-number {
          font-size: 1.5em;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 0.9em;
          opacity: 0.8;
        }

        .slide-indicators {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 20;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: white;
          transform: scale(1.2);
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .floating-emoji {
          position: absolute;
          font-size: 2em;
          opacity: 0.1;
          animation: float-around 8s infinite;
        }

        /* Animations */
        @keyframes hero-bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }

        @keyframes slide-in-left {
          0% {
            opacity: 0;
            transform: translateX(-100px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          0% {
            opacity: 0;
            transform: translateX(100px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-around {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-30px) rotate(120deg);
          }
          66% {
            transform: translateY(20px) rotate(240deg);
          }
          100% {
            transform: translateY(0px) rotate(360deg);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-container {
            padding: 30px 20px;
            min-height: 50vh;
          }

          .hero-title {
            font-size: 2.5em;
          }

          .hero-subtitle {
            font-size: 1.1em;
          }

          .hero-buttons {
            flex-direction: column;
            gap: 15px;
          }

          .hero-stats {
            gap: 20px;
          }

          .stat-number {
            font-size: 1.3em;
          }

          .floating-emoji {
            font-size: 1.5em;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2em;
          }

          .hero-emoji {
            font-size: 3.5em;
          }

          .hero-stats {
            flex-direction: column;
            gap: 15px;
          }
        }
      `}</style>
    </div>
  )
}