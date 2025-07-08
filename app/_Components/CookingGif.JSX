'use client'

import { useState, useEffect } from 'react'

export default function CookingGIF({ type = 'transition', duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true)
  const [currentAnimation, setCurrentAnimation] = useState('steam')

  useEffect(() => {
    const animations = ['steam', 'sizzle', 'chop', 'stir']
    const interval = setInterval(() => {
      setCurrentAnimation(animations[Math.floor(Math.random() * animations.length)])
    }, duration)

    return () => clearInterval(interval)
  }, [duration])

  const renderAnimation = () => {
    switch (currentAnimation) {
      case 'steam':
        return <SteamAnimation />
      case 'sizzle':
        return <SizzleAnimation />
      case 'chop':
        return <ChopAnimation />
      case 'stir':
        return <StirAnimation />
      default:
        return <SteamAnimation />
    }
  }

  if (!isVisible) return null

  return (
    <div className="cooking-gif-container">
      <div className="cooking-animation">
        {renderAnimation()}
        <div className="cooking-text">
          <h3>🍳 Kitchen Magic Happening...</h3>
          <p>Fresh ingredients being prepared with love</p>
        </div>
      </div>

      <style jsx>{`
        .cooking-gif-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, #ff6b6b, #ffa726);
          margin: 30px 0;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }

        .cooking-animation {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          z-index: 2;
        }

        .cooking-text {
          text-align: center;
          color: white;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .cooking-text h3 {
          font-size: 1.8em;
          margin-bottom: 10px;
          animation: bounce 2s infinite;
        }

        .cooking-text p {
          font-size: 1.1em;
          opacity: 0.9;
        }

        /* Background food particles */
        .cooking-gif-container::before {
          content: '🍅🧄🌶️🥕🧅';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-around;
          align-items: center;
          font-size: 2em;
          opacity: 0.1;
          animation: float 6s infinite;
          z-index: 1;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
          100% {
            transform: translateY(0px) rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .cooking-gif-container {
            padding: 30px 15px;
            margin: 20px 0;
          }
          
          .cooking-text h3 {
            font-size: 1.5em;
          }
          
          .cooking-text p {
            font-size: 1em;
          }
        }
      `}</style>
    </div>
  )
}

// Steam Animation Component
function SteamAnimation() {
  return (
    <div className="steam-container">
      <div className="pan">🍳</div>
      <div className="steam steam-1"></div>
      <div className="steam steam-2"></div>
      <div className="steam steam-3"></div>
      
      <style jsx>{`
        .steam-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .pan {
          font-size: 4em;
          animation: panShake 0.5s infinite;
        }

        .steam {
          position: absolute;
          width: 4px;
          height: 30px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50px;
          animation: steam-rise 2s infinite;
        }

        .steam-1 {
          left: 45%;
          animation-delay: 0s;
        }

        .steam-2 {
          left: 50%;
          animation-delay: 0.5s;
        }

        .steam-3 {
          left: 55%;
          animation-delay: 1s;
        }

        @keyframes panShake {
          0% { transform: translateX(0); }
          50% { transform: translateX(2px); }
          100% { transform: translateX(0); }
        }

        @keyframes steam-rise {
          0% {
            opacity: 0;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateY(-20px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) scale(0.8);
          }
        }
      `}</style>
    </div>
  )
}

// Sizzle Animation Component
function SizzleAnimation() {
  return (
    <div className="sizzle-container">
      <div className="pan">🔥</div>
      <div className="sizzle-effect"></div>
      
      <style jsx>{`
        .sizzle-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .pan {
          font-size: 4em;
          animation: sizzle 0.1s infinite;
        }

        .sizzle-effect {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,165,0,0.3) 0%, transparent 70%);
          animation: sizzle-pulse 1s infinite;
        }

        @keyframes sizzle {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.02) rotate(1deg); }
          50% { transform: scale(1.01) rotate(-1deg); }
          75% { transform: scale(1.03) rotate(0.5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        @keyframes sizzle-pulse {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.6; }
          100% { transform: scale(1); opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

// Chop Animation Component
function ChopAnimation() {
  return (
    <div className="chop-container">
      <div className="knife">🔪</div>
      <div className="vegetable">🥕</div>
      
      <style jsx>{`
        .chop-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        .knife {
          font-size: 3em;
          animation: chop 1s infinite;
        }

        .vegetable {
          font-size: 3em;
          animation: veggie-bounce 1s infinite;
        }

        @keyframes chop {
          0% { transform: translateY(0) rotate(0deg); }
          30% { transform: translateY(-15px) rotate(-15deg); }
          60% { transform: translateY(5px) rotate(0deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        @keyframes veggie-bounce {
          0% { transform: scale(1); }
          60% { transform: scale(1); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

// Stir Animation Component
function StirAnimation() {
  return (
    <div className="stir-container">
      <div className="spoon">🥄</div>
      <div className="bowl">🍲</div>
      
      <style jsx>{`
        .stir-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .bowl {
          font-size: 4em;
          animation: bowl-shake 2s infinite;
        }

        .spoon {
          position: absolute;
          font-size: 2em;
          animation: stir-motion 2s infinite;
        }

        @keyframes bowl-shake {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(1deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-1deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes stir-motion {
          0% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(10px) rotate(90deg); }
          50% { transform: translateX(0) rotate(180deg); }
          75% { transform: translateX(-10px) rotate(270deg); }
          100% { transform: translateX(0) rotate(360deg); }
        }
      `}</style>
    </div>
  )
}