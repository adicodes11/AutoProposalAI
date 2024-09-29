"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import Footer2 from '@/components/Footer2';

const ReviewAndRatingPage = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [carModel, setCarModel] = useState('');  // Capture concatenated carModel
  const [userId, setUserId] = useState(null);  // Initialize with null
  const [sessionId, setSessionId] = useState(null); // Initialize with null

  const router = useRouter();

  // Load userId, sessionId, selectedCarModel, and selectedVersion from sessionStorage in the browser
  useEffect(() => {
    if (typeof window !== 'undefined') {  // Ensure code runs only in the browser
      const storedUserId = sessionStorage.getItem('userId');
      const storedSessionId = sessionStorage.getItem('sessionId');
      const selectedCarModel = sessionStorage.getItem('selectedCarModel');
      const selectedVersion = sessionStorage.getItem('selectedVersion');
      
      setUserId(storedUserId);
      setSessionId(storedSessionId);

      // Concatenate selectedCarModel and selectedVersion
      if (selectedCarModel && selectedVersion) {
        setCarModel(`${selectedCarModel} ${selectedVersion}`);
      }
    }
  }, []);  // Run once when the component mounts

  const handleRatingChange = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleSubmit = async () => {
    if (!rating || !review) {
      alert('Please provide a rating and review.');
      return;
    }

    if (!userId || !sessionId || !carModel) {
      alert('User not logged in, session invalid, or car model is missing.');
      return;
    }

    try {
      const response = await fetch('/api/reviewRatingRoute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review, carModel, userId, sessionId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Review submitted successfully:', data);
        setSubmitted(true);

        // Clear session storage after successful submission
        sessionStorage.clear();

        // Redirect to home page after 10 seconds
        setTimeout(() => {
          router.push('/');
        }, 10000); // 10 seconds delay
      } else {
        const errorData = await response.json();
        console.error('Error submitting review:', errorData);
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-blue-900 to-gray-900 text-white">
      {/* Header */}
      <div className="absolute top-5 left-10">
        <Image
          src={assets.logo}
          width={130}
          height={100}
          alt="logo.png"
          className="w-[130px] sm:w-auto opacity-90"
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow items-center justify-center px-4 py-12">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg shadow-xl rounded-lg p-10 max-w-lg w-full text-center border border-gray-500 border-opacity-20">
          <h1 className="text-5xl font-extrabold text-white mb-8 tracking-wide">
            Rate and Review
          </h1>

          {/* Rating Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">How would you rate your experience?</h2>
            <div className="flex justify-center space-x-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingChange(star)}
                  className={`text-5xl transition-transform duration-300 ${
                    rating >= star
                      ? 'text-yellow-500 transform scale-110'
                      : 'text-gray-500 hover:text-yellow-400 hover:scale-105'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Review Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">Tell us more:</h2>
            <textarea
              value={review}
              onChange={handleReviewChange}
              className="w-full h-36 p-4 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-md resize-none bg-gray-800 bg-opacity-40 text-gray-200 placeholder-gray-500"
              placeholder="Share your experience with us"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full px-8 py-4 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold rounded-full shadow-2xl hover:shadow-pink-600 hover:scale-105 transition-transform transform hover:from-yellow-500 hover:to-pink-500 focus:ring-4 focus:ring-yellow-300 focus:outline-none"
          >
            Submit Review
          </button>

          {/* Confirmation Message */}
          {submitted && (
            <div className="mt-6 text-lg font-semibold text-green-400 animate-pulse">
              Thank you for your review! Redirecting to home in 10 seconds...
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer2 />
    </div>
  );
};

export default ReviewAndRatingPage;
