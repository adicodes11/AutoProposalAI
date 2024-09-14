"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header2 from '@/components/Header2';
import Footer2 from '@/components/Footer2';

const Requirement3 = () => {
  const [fuelType, setFuelType] = useState('');
  const [transmissionType, setTransmissionType] = useState('');
  const [drivingRange, setDrivingRange] = useState('');
  const [seatingCapacity, setSeatingCapacity] = useState('');
  const router = useRouter();

  // Load sessionId and previous selections from sessionStorage
  const sessionId = sessionStorage.getItem('sessionId');

  useEffect(() => {
    const storedFuelType = sessionStorage.getItem('fuelType');
    const storedTransmissionType = sessionStorage.getItem('transmissionType');
    const storedDrivingRange = sessionStorage.getItem('drivingRange');
    const storedSeatingCapacity = sessionStorage.getItem('seatingCapacity');
    
    if (storedFuelType) setFuelType(storedFuelType);
    if (storedTransmissionType) setTransmissionType(storedTransmissionType);
    if (storedDrivingRange) setDrivingRange(storedDrivingRange);
    if (storedSeatingCapacity) setSeatingCapacity(storedSeatingCapacity);
  }, []);

  const handleFuelTypeChange = (type) => {
    setFuelType(type);
    sessionStorage.setItem('fuelType', type); // Save to sessionStorage

    // If the fuel type is Electric, automatically set the transmission to "Automatic"
    if (type === 'Electric') {
      setTransmissionType('Automatic');
      sessionStorage.setItem('transmissionType', 'Automatic');
    } else {
      setTransmissionType(''); // Reset transmission for other fuel types
      sessionStorage.setItem('transmissionType', ''); // Ensure the sessionStorage is reset
    }
  };

  const handleTransmissionTypeChange = (type) => {
    setTransmissionType(type);
    sessionStorage.setItem('transmissionType', type); // Save to sessionStorage
  };

  const handleDrivingRangeChange = (range) => {
    setDrivingRange(range);
    sessionStorage.setItem('drivingRange', range); // Save to sessionStorage
  };

  const handleSeatingCapacityChange = (capacity) => {
    setSeatingCapacity(capacity);
    sessionStorage.setItem('seatingCapacity', capacity); // Save to sessionStorage
  };

  const handleSubmit = async () => {
    if (!sessionId) {
      alert('Session not found. Please log in.');
      return;
    }

    // Submit form with fuelType, transmissionType, drivingRange, and seatingCapacity
    const response = await fetch('/api/requirementPagesRoutes/requirement3Route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        fuelType, 
        transmissionType,  // Ensure transmissionType is passed to the backend
        drivingRange, 
        seatingCapacity, 
        sessionId  // Pass sessionId to the backend
      }),
    });

    if (response.ok) {
      router.push('/requirementPages/requirement4'); // Move to next page
    } else {
      console.error('Failed to submit data');
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-between h-screen relative">
      <Header2 />
      <div className="flex flex-col flex-grow justify-center max-w-6xl">
        {/* Question 1: Fuel Type */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6 text-center">
            What fuel type do you prefer?
          </h1>
          <div className="flex flex-wrap justify-center gap-4">
            {['Petrol', 'Diesel', 'Electric', 'CNG'].map((type) => (
              <button
                key={type}
                onClick={() => handleFuelTypeChange(type)}
                className={`px-4 py-3 border rounded-md focus:outline-none ${
                  fuelType === type ? 'border-blue-500 bg-blue-100' : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Transmission Type (for non-Electric vehicles) */}
        {fuelType && fuelType !== 'Electric' && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-center">What transmission type do you prefer?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['Manual', 'Automatic', 'Semi-Automatic (AMT)'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleTransmissionTypeChange(type)}
                  className={`px-4 py-3 border rounded-md focus:outline-none ${
                    transmissionType === type ? 'border-blue-500 bg-blue-100' : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Transmission Type Auto-set for Electric */}
        {fuelType === 'Electric' && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-center">
              Transmission Type: Automatic (Auto-selected for Electric Cars)
            </h2>
          </div>
        )}

        {/* Question 3 for Electric Car: Driving Range */}
        {fuelType === 'Electric' && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-center">
              What is your preferred driving range for an Electric Vehicle?
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['Below 300 km', '300 - 500 km', '500 - 700 km', 'Above 700 km'].map((range) => (
                <button
                  key={range}
                  onClick={() => handleDrivingRangeChange(range)}
                  className={`px-4 py-3 border rounded-md focus:outline-none ${
                    drivingRange === range ? 'border-blue-500 bg-blue-100' : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 4: Seating Capacity */}
        {(fuelType && (transmissionType || drivingRange)) && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-center">What is the ideal seating capacity you need in your car?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['5', '6', '7'].map((capacity) => (
                <button
                  key={capacity}
                  onClick={() => handleSeatingCapacityChange(capacity)}
                  className={`px-4 py-3 border rounded-md focus:outline-none ${
                    seatingCapacity === capacity ? 'border-blue-500 bg-blue-100' : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {capacity}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {(seatingCapacity || drivingRange) && (
          <div className="flex justify-between w-full max-w-lg mt-8">
            <button
              onClick={() => router.push('/requirementPages/requirement2')}
              className="flex items-center px-6 py-2 border border-blue-700 rounded-md text-blue-700 font-bold hover:bg-blue-50"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 border border-red-700 rounded-md text-white font-bold bg-red-700 hover:bg-red-800"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer2 />
    </div>
  );
};

export default Requirement3;
