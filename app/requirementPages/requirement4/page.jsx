"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import Footer2 from '@/components/Footer2';

const Requirement4 = () => {
  const [primaryUse, setPrimaryUse] = useState('');
  const [carColor, setCarColor] = useState('');
  const [showCarColor, setShowCarColor] = useState(false);
  const router = useRouter();

  // Load previous selections from sessionStorage
  useEffect(() => {
    const savedPrimaryUse = sessionStorage.getItem('primaryUse');
    const savedCarColor = sessionStorage.getItem('carColor');
    if (savedPrimaryUse) setPrimaryUse(savedPrimaryUse);
    if (savedCarColor) {
      setCarColor(savedCarColor);
      setShowCarColor(true);
    }
  }, []);

  const handlePrimaryUseChange = (selectedPrimaryUse) => {
    setPrimaryUse(selectedPrimaryUse);
    setShowCarColor(true);
    sessionStorage.setItem('primaryUse', selectedPrimaryUse); // Save to sessionStorage
  };

  const handleCarColorChange = (selectedCarColor) => {
    setCarColor(selectedCarColor);
    sessionStorage.setItem('carColor', selectedCarColor); // Save to sessionStorage
  };

  const handleBack = () => {
    router.push('/requirementPages/requirement3');
  };

  const handleNext = async () => {
    if (!primaryUse || !carColor) {
      alert('Please select both primary use and car color.');
      return;
    }

    const sessionId = sessionStorage.getItem('sessionId'); // Retrieve the sessionId from sessionStorage

    if (!sessionId) {
      alert('Session expired. Please sign in again.');
      return;
    }

    try {
      const response = await fetch('/api/requirementPagesRoutes/requirement4Route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primaryUse, carColor, sessionId }), // Include sessionId in the request
      });

      if (response.ok) {
        // Set a flag in session storage to indicate we should refresh on next page load
        sessionStorage.setItem('shouldReload', 'true');
        router.push('/detailedRequirementPages/detailedRequirement1'); // Navigate to detailedRequirement1
      } else {
        alert('Failed to submit your data. Please check the console for details.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-between h-screen relative">
      <div className="absolute top-5 left-[80px]">
        <Image
          src={assets.logo}
          width={130}
          height={100}
          alt="logo.png"
          className="w-[130px] sm:w-auto"
        />
      </div>
      <div className="flex flex-col flex-grow justify-center">
        {/* Primary Use Question */}
        <div className="mb-8 w-full max-w-4xl text-center">
          <h1 className="text-2xl font-bold mb-6">What is the primary use of the car for you?</h1>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {["Daily commute", "Long drives", "Family outings", "Off-road"].map((option) => (
              <button
                key={option}
                onClick={() => handlePrimaryUseChange(option)}
                className={`relative px-4 py-2 border rounded-md ${
                  primaryUse === option ? 'border-blue-500 bg-blue-100' : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Car Color Question */}
        <div className={`mb-8 w-full max-w-4xl text-center ${showCarColor ? 'block' : 'hidden'}`}>
          <h2 className="text-2xl font-bold mb-4">What is your preferred car color?</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {["Red", "Blue", "Black", "White", "Silver", "Gray"].map((color) => (
              <button
                key={color}
                onClick={() => handleCarColorChange(color)}
                className={`relative w-16 h-16 rounded-full border ${
                  carColor === color ? 'border-blue-500' : 'border-gray-300'
                } ${color === "Red" ? 'bg-red-500' : color === "Blue" ? 'bg-blue-500' : color === "Black" ? 'bg-black' : color === "White" ? 'bg-white' : color === "Silver" ? 'bg-gray-400' : color === "Gray" ? 'bg-gray-500' : ''}`}
              >
                {carColor === color && (
                  <span className={`absolute inset-0 flex items-center justify-center text-xl ${color === "White" ? 'text-black' : 'text-white'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className={`flex justify-between w-full max-w-4xl mt-8 ${showCarColor ? 'block' : 'hidden'}`}>
          <button
            onClick={handleBack}
            className="flex items-center px-6 py-2 border border-blue-700 rounded-md text-blue-700 font-bold hover:bg-blue-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 border border-red-700 rounded-md text-white font-bold bg-red-700 hover:bg-red-800"
          >
            Next
          </button>
        </div>
      </div>
      <Footer2 />
    </div>
  );
};

export default Requirement4;
