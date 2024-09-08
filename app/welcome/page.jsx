"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Welcome() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('User');

  // Retrieve the first name from session storage
  useEffect(() => {
    const storedFirstName = sessionStorage.getItem('firstName');
    if (storedFirstName) {
      setFirstName(storedFirstName);
    }
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
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/welcomepage_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen bg-red bg-opacity-60">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Hey {firstName} 👋, Welcome to Auto Proposal AI
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Let's start by getting to know your requirements.
        </p>
        <button
          onClick={handleGetStarted}
          className="mt-4 bg-blue-500 text-white font-bold py-2 px-6 rounded hover:bg-blue-600 transition duration-300"
        >
          Let&apos;s Get Started
        </button>
      </div>
    </div>
  );
}
