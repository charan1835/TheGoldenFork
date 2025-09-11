'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const heroSlides = [
    {
      title: "Savor the Finest Cuisine",
      subtitle: "Experience culinary excellence with our chef's special dishes",
      emoji: "🍽️",
      gradient: "from-amber-500 to-orange-600",
      bgEmoji: "🍲🥗🍷"
    },
    {
      title: "Crafted with Passion",
      subtitle: "Every dish tells a story of tradition and innovation",
      emoji: "👨‍🍳",
      gradient: "from-rose-500 to-pink-600",
      bgEmoji: "🌿🍅🧄"
    },
    {
      title: "Moments to Remember",
      subtitle: "Create unforgettable dining experiences with us",
      emoji: "✨",
      gradient: "from-indigo-500 to-purple-600",
      bgEmoji: "🌟🍾🎉"
    }
  ];

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentHero = heroSlides[currentSlide];

  const stats = [
    { value: "25-30", label: "Mins Avg", icon: "⏱️" },
    { value: "4.8", label: "Rating", icon: "⭐" },
    { value: "500+", label: "Happy Orders", icon: "😊" }
  ];

  // Only render on client-side to avoid hydration issues
  if (!isMounted) {
    return (
      <div className="relative min-h-[80vh] overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600" />
    );
  }

  return (
    <div 
      className={`relative min-h-[80vh] overflow-hidden bg-gradient-to-br ${currentHero.gradient} text-white`}
      style={{
        transition: 'background 0.8s ease-in-out',
        backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`
      }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {currentHero.bgEmoji.split('').map((emoji, index) => (
          <motion.span
            key={index}
            className="absolute text-4xl opacity-10"
            initial={{
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh',
              rotate: Math.random() * 360
            }}
            animate={{
              x: [null, Math.random() * 100 + 'vw'],
              y: [null, Math.random() * 100 + 'vh'],
              rotate: [0, 360]
            }}
            transition={{
              duration: 30 + Math.random() * 30,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center relative z-10 py-20">
        <div className="max-w-4xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6"
            >
              <motion.div 
                className="text-7xl mb-6 inline-block"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {currentHero.emoji}
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                {currentHero.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                {currentHero.subtitle}
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white text-orange-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  🍽️ Order Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open('https://youtu.be/Seg3Rmts7Yo?si=87JOxhsos8FYU-lX', '_blank')}
                  className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                >
                  👨‍🍳 Watch Kitchen Live
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-white/10 backdrop-blur-md p-4 rounded-xl"
                whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-3xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
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