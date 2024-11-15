"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import Header2 from '@/components/Header2';
import Footer2 from '@/components/Footer2';

const Requirement2 = () => {
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState(null); // State for sessionId
  const router = useRouter();

  // Load sessionId and previous selections from sessionStorage when on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedStyles = JSON.parse(sessionStorage.getItem('bodyStyles')) || [];
      const storedSessionId = sessionStorage.getItem('sessionId'); // Fetch sessionId from sessionStorage
      setSelectedStyles(storedStyles);
      setSessionId(storedSessionId);
    }
  }, []);

  const handleStyleChange = (style) => {
    let newSelection;

    if (style === 'No Preference') {
      // If "No Preference" is selected, deselect all other styles and select only "No Preference"
      if (selectedStyles.includes('No Preference')) {
        newSelection = []; // Unselect "No Preference" if it was selected
      } else {
        newSelection = ['No Preference']; // Only select "No Preference"
      }
    } else {
      // If any other style is selected, remove "No Preference" and add the selected style
      newSelection = selectedStyles.includes(style)
        ? selectedStyles.filter((s) => s !== style) // Remove the selected style if already selected
        : [...selectedStyles.filter((s) => s !== 'No Preference'), style]; // Remove "No Preference" and add the new style
    }

    setSelectedStyles(newSelection);
    sessionStorage.setItem('bodyStyles', JSON.stringify(newSelection)); // Save to sessionStorage
  };

  const handleSubmit = async () => {
    let stylesToSubmit = selectedStyles;

    // If "No Preference" is selected, submit all available styles except "No Preference"
    if (stylesToSubmit.includes('No Preference')) {
      stylesToSubmit = ['SUV', 'Sedan', 'Hatchback', 'Coupe'];
    }

    if (stylesToSubmit.length === 0) {
      alert('Please select at least one car body style.');
      return;
    }

    setIsSubmitting(true);

    if (!sessionId) {
      alert('Session not found. Please log in.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/requirementPagesRoutes/requirement2Route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bodyStyle: stylesToSubmit, sessionId }), // Include sessionId
      });

      // Check if the response is ok and handle the success case
      if (response.ok) {
        const result = await response.json(); // Optional: Capture the response data
        console.log('Successfully submitted:', result); // Log success
        router.push('/requirementPages/requirement3');
      } else {
        const errorData = await response.json();
        alert(`Failed to submit your data: ${errorData.error || 'An error occurred.'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-between h-screen relative">
      <Header2 />
      <div className="flex flex-col flex-grow justify-center">
        <div className="mb-11 w-full max-w-6xl text-center">
          <h1 className="text-2xl font-bold mb-6">
            What type of car body style are you interested in?
          </h1>
          <p className="mb-4 text-lg text-gray-600">
            (Select one or more options. Images are provided to help you choose.)
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { style: 'SUV', imgSrc: assets.tata_harrier_white },
              { style: 'Sedan', imgSrc: assets.tata_tiago_white },
              { style: 'Hatchback', imgSrc: assets.tata_altroz_blue },
              { style: 'Coupe', imgSrc: assets.tata_curvv_ev_gold },
              { style: 'No Preference', imgSrc: assets.tata_punch_red },
            ].map(({ style, imgSrc }) => (
              <div key={style} className="flex flex-col items-center max-w-[200px]">
                <button
                  onClick={() => handleStyleChange(style)}
                  className={`px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedStyles.includes(style)
                      ? 'border-blue-500 bg-blue-100'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {style}
                </button>
                <Image
                  src={imgSrc}
                  alt={`${style} image`}
                  width={200}
                  height={150}
                  className="mt-4"
                  onError={(e) => (e.currentTarget.src = '/path/to/fallback-image.jpg')}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full max-w-lg mt-8">
        <button
          onClick={() => router.push('/requirementPages/requirement1')}
          className="flex items-center px-6 py-2 border border-blue-700 rounded-md text-blue-700 font-bold hover:bg-blue-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 border border-red-700 rounded-md text-white font-bold bg-red-700 hover:bg-red-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Next' : 'Next'}
        </button>
      </div>
      <Footer2 />
    </div>
  );
};

export default Requirement2;
