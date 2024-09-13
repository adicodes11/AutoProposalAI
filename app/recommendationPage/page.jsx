"use client";
import React from 'react';
import Image from 'next/image';

const RecommendedCars = () => {
  // Dummy data for now. Replace this with real data from the backend in future steps.
  const top4Recommendations = [
    {
      carModel: "Tata Nexon XE",
      price: "7.49",
      engine: "1199CC",
      fuelType: "Petrol",
      transmission: "Manual",
      mileage: "19-24",
      image: "/path/to/car-image1.jpg",
    },
    {
      carModel: "Tata Nexon XM",
      price: "8.44",
      engine: "1199CC",
      fuelType: "Petrol",
      transmission: "Manual",
      mileage: "17-24",
      image: "/path/to/car-image2.jpg",
    },
    {
      carModel: "Tata Punch Adventure",
      price: "7.15",
      engine: "1497CC",
      fuelType: "Petrol",
      transmission: "Manual",
      mileage: "19-24",
      image: "/path/to/car-image3.jpg",
    },
    {
      carModel: "Tata Punch Pure",
      price: "6.00",
      engine: "1199CC",
      fuelType: "Petrol",
      transmission: "Manual",
      mileage: "20.09-26.49",
      image: "/path/to/car-image4.jpg",
    },
  ];

  return (
    <div className="p-8">
      {/* Top 4 Recommended Cars */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {top4Recommendations.map((car, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-4 text-center">
            <Image
              src={car.image}
              alt={car.carModel}
              width={200}
              height={150}
              className="mx-auto mb-4"
            />
            {index === 1 && (
              <span className="absolute top-0 right-0 bg-yellow-500 text-white px-2 py-1 rounded-lg font-bold">
                Gen AI Recommended
              </span>
            )}
            <h3 className="text-lg font-bold mb-2">{car.carModel}</h3>
            <p className="text-lg font-semibold text-gray-700 mb-2">₹ {car.price} Lakh</p>
            <div className="flex justify-between items-center mb-2">
              <div className="text-left">
                <p className="text-sm font-medium text-gray-600">ENGINE</p>
                <p className="font-semibold">{car.engine}</p>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-600">FUEL TYPE</p>
                <p className="font-semibold">{car.fuelType}</p>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-600">TRANSMISSION</p>
                <p className="font-semibold">{car.transmission}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600">Mileage: <span className="font-semibold">{car.mileage} KM/L</span></p>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <h2 className="text-2xl font-bold text-center mb-6">COMPARISON TABLE</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-blue-300">
            <tr>
              <th className="border border-gray-300 p-2">Criteria</th>
              {top4Recommendations.map((car, index) => (
                <th key={index} className="border border-gray-300 p-2">
                  {car.carModel}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">1. Budget Range</td>
              <td className="border border-gray-300 p-2">₹5,00,000 - ₹10,00,000</td>
              <td className="border border-gray-300 p-2">₹5,00,000 - ₹10,00,000</td>
              <td className="border border-gray-300 p-2">₹5,00,000 - ₹10,00,000</td>
              <td className="border border-gray-300 p-2">₹5,00,000 - ₹10,00,000</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">2. Fuel Type</td>
              <td className="border border-gray-300 p-2">Petrol</td>
              <td className="border border-gray-300 p-2">Petrol</td>
              <td className="border border-gray-300 p-2">Petrol</td>
              <td className="border border-gray-300 p-2">Petrol</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">3. Transmission</td>
              <td className="border border-gray-300 p-2">Manual</td>
              <td className="border border-gray-300 p-2">Manual</td>
              <td className="border border-gray-300 p-2">Manual</td>
              <td className="border border-gray-300 p-2">Manual</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">4. Car Type</td>
              <td className="border border-gray-300 p-2">Compact SUV</td>
              <td className="border border-gray-300 p-2">Subcompact SUV</td>
              <td className="border border-gray-300 p-2">Micro SUV</td>
              <td className="border border-gray-300 p-2">Micro SUV</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">5. Primary Use</td>
              <td className="border border-gray-300 p-2">Daily commuting</td>
              <td className="border border-gray-300 p-2">Daily commuting, family trips</td>
              <td className="border border-gray-300 p-2">Daily commuting</td>
              <td className="border border-gray-300 p-2">Daily commuting, family trips</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">6. Seating Capacity</td>
              <td className="border border-gray-300 p-2">5 seats</td>
              <td className="border border-gray-300 p-2">5 seats</td>
              <td className="border border-gray-300 p-2">5 seats</td>
              <td className="border border-gray-300 p-2">5 seats</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">7. Preferred Color Options</td>
              <td className="border border-gray-300 p-2">Multiple color options</td>
              <td className="border border-gray-300 p-2">Multiple color options</td>
              <td className="border border-gray-300 p-2">Multiple color options</td>
              <td className="border border-gray-300 p-2">Multiple color options</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecommendedCars;
