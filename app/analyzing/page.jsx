"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const AnalyzingPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Automatically move to the next page after the animation is done (5 seconds for demo)
    const timer = setTimeout(() => {
      router.push("/recommendationPage"); // Change this to the final page after analysis is done
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-600">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold text-white">Analyzing Your Input...</h1>
        <div className="relative">
          {/* Background Pulsating Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400 rounded-full opacity-50 animate-ping"></div>
          
          {/* Main Spinner */}
          <div className="w-64 h-64 border-8 border-t-8 border-t-white border-blue-500 rounded-full animate-spin"></div>
        </div>

        {/* Text describing what's happening */}
        <p className="text-xl text-gray-300">
          Our AI is processing and analyzing all your preferences and requirements.
        </p>

        {/* Progress bar */}
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div className="w-1/2 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-400 animate-[loading_5s_ease-in-out]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzingPage;
