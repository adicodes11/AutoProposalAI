"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Welcome() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('User');
  const [showText, setShowText] = useState(false);

  // Retrieve the first name from session storage
  useEffect(() => {
    const storedFirstName = sessionStorage.getItem('firstName');
    if (storedFirstName) {
      setFirstName(storedFirstName);
    }

    // Simulate text delay for smooth appearance
    setTimeout(() => {
      setShowText(true);
    }, 500); // Delay for text appearance
  }, []);

  const handleGetStarted = () => {
    router.push('/requirementPages/requirement1'); // Navigate to the Requirement1 page
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover brightness-50"
      >
        <source src="/welcomepage_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center text-white">
          {/* Heading Animation */}
          {showText && (
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in-up tracking-wide leading-tight">
              <span className="block">
                Hey {firstName} 👋
              </span>
              <span className="block animate-typewriter overflow-hidden border-r-4 border-r-white whitespace-nowrap">
                Welcome to Auto Proposal AI
              </span>
            </h1>
          )}

          {/* Subtext */}
          {showText && (
            <p className="text-lg md:text-xl text-gray-300 mb-8 animate-fade-in-up delay-200">
              Let&apos;s start by getting to know your requirements.
            </p>
          )}

          {/* Get Started Button */}
          {showText && (
            <button
              onClick={handleGetStarted}
              className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-110 hover:shadow-2xl transition duration-300 animate-float"
            >
              Let&apos;s Get Started
            </button>
          )}
        </div>
      </div>

      {/* Floating stars for a magical look */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
        <div className="star-field">
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        /* Keyframes for fade-in animations */
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Keyframes for floating button animation */
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        /* Keyframes for typewriter effect */
        @keyframes typewriter {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        /* Fade-in animations */
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        /* Button floating effect */
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* Typewriter effect for the heading */
        .animate-typewriter {
          animation: typewriter 2s steps(20) 0.5s 1 normal both, blinkTextCursor 0.75s steps(40) infinite normal;
        }

        /* Blink effect for the cursor */
        @keyframes blinkTextCursor {
          from {
            border-right-color: rgba(255, 255, 255, 0.75);
          }
          to {
            border-right-color: transparent;
          }
        }

        /* Star field for background */
        .star-field {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .star {
          width: 3px;
          height: 3px;
          background: white;
          position: absolute;
          top: 0;
          left: 50%;
          animation: star 3s infinite ease-in-out;
        }

        .star:nth-child(1) {
          left: 10%;
          animation-duration: 2s;
          animation-delay: 0s;
        }

        .star:nth-child(2) {
          left: 30%;
          animation-duration: 3.5s;
          animation-delay: 0.2s;
        }

        .star:nth-child(3) {
          left: 50%;
          animation-duration: 2.8s;
          animation-delay: 0.4s;
        }

        .star:nth-child(4) {
          left: 70%;
          animation-duration: 2.6s;
          animation-delay: 0.6s;
        }

        .star:nth-child(5) {
          left: 90%;
          animation-duration: 3s;
          animation-delay: 0.8s;
        }

        @keyframes star {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-30px);
            opacity: 0.6;
          }
          100% {
            transform: translateY(60px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
