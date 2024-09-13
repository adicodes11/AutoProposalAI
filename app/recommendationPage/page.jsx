"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Use useRouter from next/navigation for app directory
import Header from "@/components/Header"; // Import Header component
import Footer from "@/components/Footer";   // Import Footer component

const RecommendedCars = () => {
  const [top4Recommendations, setTop4Recommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [maxMatchIndex, setMaxMatchIndex] = useState(-1); // To track the car with the highest match percentage

  // Fetch the sessionId from sessionStorage
  const [sessionId, setSessionId] = useState("");
  const router = useRouter(); // Initialize useRouter for navigation

  useEffect(() => {
    // Retrieve sessionId from sessionStorage
    const storedSessionId = sessionStorage.getItem("sessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      console.error("Session ID is missing. Redirect to login or previous page.");
      // Handle missing sessionId (e.g., redirect to login or detailed requirement pages)
    }
  }, []);

  // Placeholder data to display when loading or on error
  const placeholderData = [
    {
      carModel: "Tata Nexon XE",
      exShowroomPrice: "7.49 Lakh",
      engine: "1199CC",
      fuelType: "Petrol",
      transmissionType: "Manual",
      mileage: "19-24",
      image: "/path/to/car-image1.jpg",
      bodyType: "Compact SUV",
      seatingCapacity: 5,
      primaryUse: "Daily commuting",
      emissionStandard: "BS6",
      ncapRating: 5,
      bodyStyle: "SUV",
      groundClearance: "209mm",
      fuelTankCapacity: "44L",
      bootSpaceCapacity: "350L",
      drivingRange: "600KM",
      engineType: "Turbocharged",
      topSpeed: "180km/h",
      wheels: "Alloy",
      parkingAssists: "Rear Camera",
      driveModes: "Eco, City, Sport",
      headlights: "LED",
      airConditioner: "Automatic Climate Control",
      displayHeadUnit: "7-inch Touchscreen",
      matchPercentage: 87,
      carColor: "Red",
    },
    {
      carModel: "Tata Nexon XM",
      exShowroomPrice: "8.44 Lakh",
      engine: "1199CC",
      fuelType: "Petrol",
      transmissionType: "Manual",
      mileage: "17-24",
      image: "/path/to/car-image2.jpg",
      bodyType: "Subcompact SUV",
      seatingCapacity: 5,
      primaryUse: "Daily commuting, family trips",
      emissionStandard: "BS6",
      ncapRating: 5,
      bodyStyle: "SUV",
      groundClearance: "209mm",
      fuelTankCapacity: "44L",
      bootSpaceCapacity: "350L",
      drivingRange: "590KM",
      engineType: "Turbocharged",
      topSpeed: "185km/h",
      wheels: "Alloy",
      parkingAssists: "Rear Camera",
      driveModes: "Eco, City, Sport",
      headlights: "Halogen",
      airConditioner: "Manual AC",
      displayHeadUnit: "7-inch Touchscreen",
      matchPercentage: 92,
      carColor: "Blue",
    },
    {
      carModel: "Tata Punch Adventure",
      exShowroomPrice: "7.15 Lakh",
      engine: "1497CC",
      fuelType: "Petrol",
      transmissionType: "Manual",
      mileage: "19-24",
      image: "/path/to/car-image3.jpg",
      bodyType: "Micro SUV",
      seatingCapacity: 5,
      primaryUse: "Daily commuting",
      emissionStandard: "BS6",
      ncapRating: 4,
      bodyStyle: "SUV",
      groundClearance: "190mm",
      fuelTankCapacity: "37L",
      bootSpaceCapacity: "366L",
      drivingRange: "550KM",
      engineType: "Naturally Aspirated",
      topSpeed: "160km/h",
      wheels: "Steel",
      parkingAssists: "None",
      driveModes: "City, Eco",
      headlights: "Halogen",
      airConditioner: "Manual AC",
      displayHeadUnit: "5-inch",
      matchPercentage: 85,
      carColor: "White",
    },
    {
      carModel: "Tata Punch Pure",
      exShowroomPrice: "6.00 Lakh",
      engine: "1199CC",
      fuelType: "Petrol",
      transmissionType: "Manual",
      mileage: "20.09-26.49",
      image: "/path/to/car-image4.jpg",
      bodyType: "Micro SUV",
      seatingCapacity: 5,
      primaryUse: "Daily commuting, family trips",
      emissionStandard: "BS6",
      ncapRating: 4,
      bodyStyle: "SUV",
      groundClearance: "190mm",
      fuelTankCapacity: "37L",
      bootSpaceCapacity: "366L",
      drivingRange: "530KM",
      engineType: "Naturally Aspirated",
      topSpeed: "155km/h",
      wheels: "Steel",
      parkingAssists: "None",
      driveModes: "City, Eco",
      headlights: "Halogen",
      airConditioner: "Manual AC",
      displayHeadUnit: "5-inch",
      matchPercentage: 80,
      carColor: "Green",
    },
  ];

  // Fetch top 4 recommended cars from the backend
  useEffect(() => {
    async function fetchRecommendations() {
      if (!sessionId) {
        console.error("No sessionId available. Cannot fetch recommendations.");
        return;
      }

      try {
        const response = await fetch("/api/recommendationRoutes/recommendationPageRoute", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }), // Pass sessionId in the body
        });

        const data = await response.json();
        if (data.success) {
          setTop4Recommendations(data.data);
          const maxIndex = data.data.reduce(
            (maxIdx, car, idx, arr) => (car.matchPercentage > arr[maxIdx].matchPercentage ? idx : maxIdx),
            0
          );
          setMaxMatchIndex(maxIndex); // Find the car with maximum matchPercentage
        } else {
          setError(true);
          setTop4Recommendations(placeholderData); // Use placeholder data on error
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setError(true);
        setTop4Recommendations(placeholderData); // Use placeholder data on error
      } finally {
        setLoading(false);
      }
    }

    if (sessionId) {
      fetchRecommendations(); // Fetch recommendations once sessionId is available
    }
  }, [sessionId]);

  // Helper function to convert car model and color to match the image naming convention
  const getImageName = (carModel, carColor) => {
    const formattedModel = carModel.toLowerCase().replace(/\s+/g, "_"); // Replace spaces with underscores and convert to lowercase
    const formattedColor = carColor.toLowerCase(); // Convert color to lowercase
    return `/Car Image Dataset/${formattedModel}_${formattedColor}.png`; // Construct the image path
  };

  // Handle navigation to the customize car page
  const handleCustomize = (carModel) => {
    router.push(`/customizecar?carModel=${encodeURIComponent(carModel)}`);
  };

  // Handle navigation to the generate proposal page
  const handleGenerateProposal = (carModel) => {
    router.push(`/generateProposal?carModel=${encodeURIComponent(carModel)}`);
  };

  return (
    <div className="bg-white min-h-screen">
      <Header /> {/* Adding the Header component */}
      
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Top 4 Recommended Cars</h1>

        {/* Top 4 Recommended Cars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {(loading ? placeholderData : top4Recommendations).map((car, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6 text-center relative hover:shadow-2xl transition-shadow duration-300">
              {/* Use getImageName function to get the correct image path */}
              <Image
                src={getImageName(car.carModel, car.carColor) || "/path/to/default-car-image.jpg"} // Fallback to a default image if needed
                alt={car.carModel}
                width={200}
                height={150}
                className="mx-auto mb-4"
              />
              {index === maxMatchIndex && !loading && (
                <span className="absolute top-0 right-0 bg-yellow-500 text-white px-2 py-1 rounded-lg font-bold">
                  Gen AI Recommended
                </span>
              )}
              <h3 className="text-xl font-bold mb-2 text-gray-900">{car.carModel}</h3>
              <p className="text-lg font-semibold text-gray-700 mb-2">₹ {car.exShowroomPrice}</p>
              <div className="flex justify-between items-center mb-4">
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
                  <p className="font-semibold">{car.transmissionType}</p>
                </div>
              </div>

              {/* Mileage and Match Percentage */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-medium text-gray-600">
                  Mileage: <span className="font-semibold">{car.mileage} KM/L</span>
                </p>
                {/* Match Percentage */}
                <div className="text-sm font-medium text-gray-600 mt-2 text-right">
                  Match Percentage:
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2" style={{ width: "100px" }}>
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: `${car.matchPercentage}%` }}
                    ></div>
                  </div>
                  <p className="font-semibold">{car.matchPercentage.toFixed(2)}% Match</p>
                </div>
              </div>

              {/* Customize and Generate Proposal Buttons */}
              <div className="flex justify-center mt-4 space-x-4">
                <button
                  onClick={() => handleCustomize(car.carModel)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors duration-200"
                >
                  Customize
                </button>
                <button
                  onClick={() => handleGenerateProposal(car.carModel)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors duration-200"
                >
                  Generate Proposal
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Comparison Table</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="border border-gray-300 p-3">Criteria</th>
                {(loading ? placeholderData : top4Recommendations).map((car, index) => (
                  <th key={index} className="border border-gray-300 p-3">
                    {car.carModel}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3">1. Emission Standard</td>
                {(loading ? placeholderData : top4Recommendations).map((car, index) => (
                  <td key={index} className="border border-gray-300 p-3">{car.emissionStandard}</td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">2. NCAP Rating</td>
                {(loading ? placeholderData : top4Recommendations).map((car, index) => (
                  <td key={index} className="border border-gray-300 p-3">{car.ncapRating} Stars</td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">3. Body Style</td>
                {(loading ? placeholderData : top4Recommendations).map((car, index) => (
                  <td key={index} className="border border-gray-300 p-3">{car.bodyType}</td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">4. Ground Clearance</td>
                {(loading ? placeholderData : top4Recommendations).map((car, index) => (
                  <td key={index} className="border border-gray-300 p-3">{car.groundClearance}</td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">5. Fuel Tank Capacity</td>
                {(loading ? placeholderData : top4Recommendations).map((car, index) => (
                  <td key={index} className="border border-gray-300 p-3">{car.fuelTankCapacity}</td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">6. Boot Space Capacity</td>
                {(loading ? placeholderData : top4Recommendations).map((car, index) => (
                  <td key={index} className="border border-gray-300 p-3">{car.bootSpaceCapacity}</td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">7. Driving Range</td>
                {(loading ? placeholderData : top4Recommendations).map((car, index) => (
                  <td key={index} className="border border-gray-300 p-3">{car.drivingRange}</td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">8. Engine Type</td>
                {(loading ? placeholderData : top4Recommendations).map((car, index) => (
                  <td key={index} className="border border-gray-300 p-3">{car.engineType}</td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">9. Top Speed</td>
                {(loading ? placeholderData : top4Recommendations).map((car, index) => (
                  <td key={index} className="border border-gray-300 p-3">{car.topSpeed}</td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">10. Wheels</td>
                {(loading ? placeholderData : top4Recommendations).map((car, index) => (
                  <td key={index} className="border border-gray-300 p-3">{car.wheels}</td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">11. Parking Assists</td>
                {(loading ? placeholderData : top4Recommendations).map((car, index) => (
                  <td key={index} className="border border-gray-300 p-3">{car.parkingAssist}</td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">12. Drive Modes</td>
                {(loading ? placeholderData : top4Recommendations).map((car, index) => (
                  <td key={index} className="border border-gray-300 p-3">{car.driveModes}</td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">13. Headlights</td>
                {(loading ? placeholderData : top4Recommendations).map((car, index) => (
                  <td key={index} className="border border-gray-300 p-3">{car.headlights}</td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">14. Air Conditioner</td>
                {(loading ? placeholderData : top4Recommendations).map((car, index) => (
                  <td key={index} className="border border-gray-300 p-3">{car.airConditioner}</td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">15. Display</td>
                {(loading ? placeholderData : top4Recommendations).map((car, index) => (
                  <td key={index} className="border border-gray-300 p-3">{car.display}</td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">16. Head unit size</td>  
                {(loading ? placeholderData : top4Recommendations).map((car, index) => (
                  <td key={index} className="border border-gray-300 p-3">{car.headUnitSize}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <Footer /> {/* Adding the Footer component */}
    </div>
  );
};

export default RecommendedCars;
