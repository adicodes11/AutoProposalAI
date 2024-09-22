"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import Image from "next/image";
import { assets } from "@/assets/assets"; // Make sure to update the correct path to assets

const CarCustomizationPage = () => {
  const [carColor, setCarColor] = useState("Red");
  const [carWheels, setCarWheels] = useState("18 inch");
  const [carInterior, setCarInterior] = useState("Leather");
  const [selectedAccessories, setSelectedAccessories] = useState([]);

  const router = useRouter(); // Initialize the useRouter hook

  const accessories = [
    "Sunroof",
    "Rear Spoiler",
    "Fog Lights",
    "GPS Navigation",
    "Heated Seats",
    "Rear Camera",
  ];

  const colors = ["Red", "Black", "Blue", "White", "Silver"];
  const wheels = ["18 inch", "20 inch", "22 inch"];
  const interiors = ["Leather", "Fabric", "Synthetic"];

  const handleAccessoryChange = (accessory) => {
    setSelectedAccessories((prev) =>
      prev.includes(accessory)
        ? prev.filter((item) => item !== accessory)
        : [...prev, accessory]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Display selected customization
    alert(
      `You have selected: \nColor: ${carColor} \nWheels: ${carWheels} \nInterior: ${carInterior} \nAccessories: ${selectedAccessories.join(
        ", "
      )}`
    );

    // Navigate to userDetailsForm after submission
    router.push("/userDetailsForm");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-blue-900 to-gray-900 text-white">
      {/* Header Section */}
      <header className="py-12 px-8 text-center">
        <Image src={assets.logo} alt="AutoProposalAI Logo" width={150} height={100} />
        <h1 className="text-5xl font-bold mt-4">Car Customization Menu</h1>
        <p className="text-lg mt-2">Customize your dream car just the way you like it!</p>
      </header>

      {/* Main Content Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-8 py-12">
        <form onSubmit={handleSubmit} className="max-w-4xl w-full space-y-8">
          {/* Car Color Customization */}
          <section>
            <h2 className="text-3xl font-semibold mb-4">Select Car Color</h2>
            <div className="flex justify-between space-x-4">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-24 h-24 rounded-lg shadow-lg ${
                    carColor === color
                      ? "ring-4 ring-yellow-400 transform scale-105"
                      : "ring-2 ring-gray-300"
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  onClick={() => setCarColor(color)}
                />
              ))}
            </div>
          </section>

          {/* Wheel Customization */}
          <section>
            <h2 className="text-3xl font-semibold mb-4">Select Wheels</h2>
            <div className="flex space-x-6">
              {wheels.map((wheel) => (
                <button
                  key={wheel}
                  type="button"
                  className={`px-8 py-4 text-lg font-semibold border rounded-lg ${
                    carWheels === wheel
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-800 text-gray-300"
                  }`}
                  onClick={() => setCarWheels(wheel)}
                >
                  {wheel}
                </button>
              ))}
            </div>
          </section>

          {/* Interior Customization */}
          <section>
            <h2 className="text-3xl font-semibold mb-4">Select Interior</h2>
            <div className="flex space-x-6">
              {interiors.map((interior) => (
                <button
                  key={interior}
                  type="button"
                  className={`px-8 py-4 text-lg font-semibold border rounded-lg ${
                    carInterior === interior
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-800 text-gray-300"
                  }`}
                  onClick={() => setCarInterior(interior)}
                >
                  {interior}
                </button>
              ))}
            </div>
          </section>

          {/* Additional Accessories */}
          <section>
            <h2 className="text-3xl font-semibold mb-4">Select Additional Accessories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {accessories.map((accessory) => (
                <label
                  key={accessory}
                  className="flex items-center space-x-3 bg-gray-800 bg-opacity-40 p-4 rounded-lg shadow-lg"
                >
                  <input
                    type="checkbox"
                    checked={selectedAccessories.includes(accessory)}
                    onChange={() => handleAccessoryChange(accessory)}
                    className="h-5 w-5 text-yellow-500 rounded focus:ring-yellow-500"
                  />
                  <span className="text-lg font-medium text-gray-200">{accessory}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-8 py-4 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold rounded-full shadow-2xl hover:shadow-pink-600 hover:scale-105 transition-transform transform hover:from-yellow-500 hover:to-pink-500 focus:ring-4 focus:ring-yellow-300 focus:outline-none"
          >
            Confirm Customization
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="text-center">
          <p className="text-gray-400">&copy; 2024 AutoProposalAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CarCustomizationPage;
