"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { assets } from "@/assets/assets";

// Cost data (in Indian Rupees)
const costs = {
  colors: {
    Red: 50000, Black: 40000, Blue: 45000, White: 35000, Silver: 40000,
    Green: 55000, Yellow: 60000, Orange: 58000, Purple: 62000
  },
  wheels: {
    "18 inch": 80000, "19 inch": 100000, "20 inch": 120000, "21 inch": 140000, "22 inch": 160000
  },
  interiors: {
    Leather: 200000, Fabric: 100000, Synthetic: 150000,
    Alcantara: 250000, "Wood Trim": 300000, "Carbon Fiber": 350000
  },
  engines: {
    "4-cylinder": 500000, "V6": 700000, "V8": 1000000, "Hybrid": 1200000, "Electric": 1500000
  },
  transmissions: {
    Automatic: 200000, Manual: 150000, CVT: 250000, "Dual-Clutch": 300000
  },
  roofTypes: {
    Solid: 0, Panoramic: 150000, Convertible: 300000, Targa: 250000
  },
  exteriorTrims: {
    Chrome: 50000, Black: 60000, "Body-colored": 40000, Matte: 70000
  },
  accessories: {
    Sunroof: 100000, "Rear Spoiler": 50000, "Fog Lights": 30000,
    "GPS Navigation": 80000, "Heated Seats": 60000, "Rear Camera": 40000,
    "Premium Sound System": 150000, "Wireless Charging": 25000,
    "Adaptive Cruise Control": 100000, "Parking Assist": 70000,
    "Head-Up Display": 120000, "Ambient Lighting": 40000
  }
};

const CarCustomizationPage = () => {
  const [carColor, setCarColor] = useState("Red");
  const [carWheels, setCarWheels] = useState("18 inch");
  const [carInterior, setCarInterior] = useState("Leather");
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [engineType, setEngineType] = useState("V6");
  const [transmission, setTransmission] = useState("Automatic");
  const [roofType, setRoofType] = useState("Solid");
  const [exteriorTrim, setExteriorTrim] = useState("Chrome");
  const [totalCost, setTotalCost] = useState(0);
  const [priceChangeMessage, setPriceChangeMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const router = useRouter();

  const accessories = Object.keys(costs.accessories);
  const colors = Object.keys(costs.colors);
  const wheels = Object.keys(costs.wheels);
  const interiors = Object.keys(costs.interiors);
  const engines = Object.keys(costs.engines);
  const transmissions = Object.keys(costs.transmissions);
  const roofTypes = Object.keys(costs.roofTypes);
  const exteriorTrims = Object.keys(costs.exteriorTrims);

  useEffect(() => {
    calculateTotalCost();
  }, [carColor, carWheels, carInterior, selectedAccessories, engineType, transmission, roofType, exteriorTrim]);

  const calculateTotalCost = () => {
    let cost = 0;
    cost += costs.colors[carColor];
    cost += costs.wheels[carWheels];
    cost += costs.interiors[carInterior];
    cost += costs.engines[engineType];
    cost += costs.transmissions[transmission];
    cost += costs.roofTypes[roofType];
    cost += costs.exteriorTrims[exteriorTrim];
    selectedAccessories.forEach((accessory) => {
      cost += costs.accessories[accessory];
    });
    setTotalCost(cost);
  };

  const handleAccessoryChange = (accessory) => {
    const isSelected = selectedAccessories.includes(accessory);
    const changeInCost = costs.accessories[accessory];
    const message = isSelected
      ? `Removed ${accessory}... -₹${changeInCost.toLocaleString("en-IN")}`
      : `Added ${accessory}... +₹${changeInCost.toLocaleString("en-IN")}`;

    setSelectedAccessories((prev) =>
      isSelected
        ? prev.filter((item) => item !== accessory)
        : [...prev, accessory]
    );

    showPriceChangeNotification(message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `You have selected: \nColor: ${carColor} \nWheels: ${carWheels} \nInterior: ${carInterior} \nEngine: ${engineType} \nTransmission: ${transmission} \nRoof: ${roofType} \nExterior Trim: ${exteriorTrim} \nAccessories: ${selectedAccessories.join(", ")} \n\nTotal Cost: ₹${totalCost.toLocaleString("en-IN")}`
    );
    router.push("/userDetailsForm");
  };

  const showPriceChangeNotification = (message) => {
    setPriceChangeMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-blue-900 to-gray-900 text-white relative">
      <header className="py-12 px-8 text-center">
        <Image src={assets.logo} alt="AutoProposalAI Logo" width={150} height={100} />
        <h1 className="text-5xl font-bold mt-4">Advanced Car Customization</h1>
        <p className="text-lg mt-2">Design your perfect vehicle with our extensive options!</p>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-8 py-12">
        <form onSubmit={handleSubmit} className="max-w-5xl w-full space-y-10">
          {/* Cost Display */}
          <div className="fixed top-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg z-50">
            <h3 className="text-2xl font-semibold mb-2">Total Cost</h3>
            <p className="text-3xl font-bold text-yellow-400">{formatCurrency(totalCost)}</p>
          </div>

          {/* Notification for price change */}
          {showNotification && (
            <div className="fixed bottom-10 right-10 bg-green-600 text-white p-4 rounded-lg shadow-lg transform transition-all animate-slide-up">
              <p>{priceChangeMessage}</p>
            </div>
          )}

          {/* Color Selection */}
          <section>
            <h2 className="text-3xl font-semibold mb-4">Select Car Color</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-20 h-20 rounded-full shadow-lg ${
                    carColor === color
                      ? "ring-4 ring-yellow-400 transform scale-110"
                      : "ring-2 ring-gray-300"
                  } transition-all duration-200`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  onClick={() => {
                    setCarColor(color);
                    showPriceChangeNotification(`Selected ${color}... +₹${costs.colors[color].toLocaleString("en-IN")}`);
                  }}
                >
                  <span className="sr-only">{color}</span>
                </button>
              ))}
            </div>
            <p className="text-center mt-2">Selected: {carColor} - {formatCurrency(costs.colors[carColor])}</p>
          </section>

          {/* Wheels Selection */}
          <section>
            <h2 className="text-3xl font-semibold mb-4">Select Wheels</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {wheels.map((wheel) => (
                <button
                  key={wheel}
                  type="button"
                  className={`px-6 py-3 text-lg font-semibold border rounded-lg ${
                    carWheels === wheel
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-800 text-gray-300"
                  } transition-colors duration-200`}
                  onClick={() => {
                    setCarWheels(wheel);
                    showPriceChangeNotification(`Selected ${wheel}... +₹${costs.wheels[wheel].toLocaleString("en-IN")}`);
                  }}
                >
                  {wheel}
                </button>
              ))}
            </div>
            <p className="text-center mt-2">Selected: {carWheels} - {formatCurrency(costs.wheels[carWheels])}</p>
          </section>

          {/* Interior Selection */}
          <section>
            <h2 className="text-3xl font-semibold mb-4">Select Interior</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {interiors.map((interior) => (
                <button
                  key={interior}
                  type="button"
                  className={`px-6 py-3 text-lg font-semibold border rounded-lg ${
                    carInterior === interior
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-800 text-gray-300"
                  } transition-colors duration-200`}
                  onClick={() => {
                    setCarInterior(interior);
                    showPriceChangeNotification(`Selected ${interior}... +₹${costs.interiors[interior].toLocaleString("en-IN")}`);
                  }}
                >
                  {interior}
                </button>
              ))}
            </div>
            <p className="text-center mt-2">Selected: {carInterior} - {formatCurrency(costs.interiors[carInterior])}</p>
          </section>

          {/* Engine Selection */}
          <section>
            <h2 className="text-3xl font-semibold mb-4">Select Engine Type</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {engines.map((engine) => (
                <button
                  key={engine}
                  type="button"
                  className={`px-6 py-3 text-lg font-semibold border rounded-lg ${
                    engineType === engine
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-800 text-gray-300"
                  } transition-colors duration-200`}
                  onClick={() => {
                    setEngineType(engine);
                    showPriceChangeNotification(`Selected ${engine}... +₹${costs.engines[engine].toLocaleString("en-IN")}`);
                  }}
                >
                  {engine}
                </button>
              ))}
            </div>
            <p className="text-center mt-2">Selected: {engineType} - {formatCurrency(costs.engines[engineType])}</p>
          </section>

          {/* Transmission Selection */}
          <section>
            <h2 className="text-3xl font-semibold mb-4">Select Transmission</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {transmissions.map((trans) => (
                <button
                  key={trans}
                  type="button"
                  className={`px-6 py-3 text-lg font-semibold border rounded-lg ${
                    transmission === trans
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-800 text-gray-300"
                  } transition-colors duration-200`}
                  onClick={() => {
                    setTransmission(trans);
                    showPriceChangeNotification(`Selected ${trans}... +₹${costs.transmissions[trans].toLocaleString("en-IN")}`);
                  }}
                >
                  {trans}
                </button>
              ))}
            </div>
            <p className="text-center mt-2">Selected: {transmission} - {formatCurrency(costs.transmissions[transmission])}</p>
          </section>

          {/* Roof Type Selection */}
          <section>
            <h2 className="text-3xl font-semibold mb-4">Select Roof Type</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {roofTypes.map((roof) => (
                <button
                  key={roof}
                  type="button"
                  className={`px-6 py-3 text-lg font-semibold border rounded-lg ${
                    roofType === roof
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-800 text-gray-300"
                  } transition-colors duration-200`}
                  onClick={() => {
                    setRoofType(roof);
                    showPriceChangeNotification(`Selected ${roof}... +₹${costs.roofTypes[roof].toLocaleString("en-IN")}`);
                  }}
                >
                  {roof}
                </button>
              ))}
            </div>
            <p className="text-center mt-2">Selected: {roofType} - {formatCurrency(costs.roofTypes[roofType])}</p>
          </section>

          {/* Exterior Trim Selection */}
          <section>
            <h2 className="text-3xl font-semibold mb-4">Select Exterior Trim</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {exteriorTrims.map((trim) => (
                <button
                  key={trim}
                  type="button"
                  className={`px-6 py-3 text-lg font-semibold border rounded-lg ${
                    exteriorTrim === trim
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-800 text-gray-300"
                  } transition-colors duration-200`}
                  onClick={() => {
                    setExteriorTrim(trim);
                    showPriceChangeNotification(`Selected ${trim}... +₹${costs.exteriorTrims[trim].toLocaleString("en-IN")}`);
                  }}
                >
                  {trim}
                </button>
              ))}
            </div>
            <p className="text-center mt-2">Selected: {exteriorTrim} - {formatCurrency(costs.exteriorTrims[exteriorTrim])}</p>
          </section>

          {/* Accessories Selection */}
          <section>
            <h2 className="text-3xl font-semibold mb-4">Select Additional Accessories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {accessories.map((accessory) => (
                <label
                  key={accessory}
                  className="flex items-center space-x-3 bg-gray-800 bg-opacity-40 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-opacity-60 transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    checked={selectedAccessories.includes(accessory)}
                    onChange={() => handleAccessoryChange(accessory)}
                    className="h-5 w-5 text-yellow-500 rounded focus:ring-yellow-500"
                  />
                  <span className="text-lg font-medium text-gray-200">{accessory}</span>
                  <span className="text-sm text-gray-400">({formatCurrency(costs.accessories[accessory])})</span>
                </label>
              ))}
            </div>
          </section>

          <button
            type="submit"
            className="w-full px-8 py-4 bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-pink-600 hover:scale-105 transition-all transform duration-300 hover:from-yellow-500 hover:to-pink-500 focus:ring-4 focus:ring-yellow-300 focus:outline-none"
          >
            Finalize Your Dream Car
          </button>
        </form>
      </main>

      <footer className="bg-gray-900 py-8">
        <div className="text-center">
          <p className="text-gray-400">&copy; 2024 AutoProposalAI. All rights reserved.</p>
        </div>
      </footer>

      {/* Tailwind CSS animations for notification */}
      <style jsx>{`
        @keyframes slide-up {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.5s forwards;
        }
      `}</style>
    </div>
  );
};

export default CarCustomizationPage;
