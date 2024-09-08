"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Footer2 from "@/components/Footer2";
import { useRouter } from "next/navigation";

// HelperIcon component for showing popover on hover
const HelperIcon = ({ imageSrc }) => {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowPopover(true)}
      onMouseLeave={() => setShowPopover(false)}
    >
      <Image
        src={assets.info_icon}
        width={24}
        height={24}
        alt="Info Icon"
        className="ml-2"
      />
      {showPopover && (
        <div className="absolute left-0 mt-2 w-96 p-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <Image src={imageSrc} width={700} height={500} alt="Helper Image" />
        </div>
      )}
    </div>
  );
};

const DetailedRequirement1 = () => {
  const router = useRouter();

  const sections = [
    "Car Power",
    "Drive Modes",
    "Exterior Design",
    "Fuel Tank & Boot Space",
    "Safety & Features",
  ];

  const [answers, setAnswers] = useState({
    enginePower: "",
    batteryCapacity: "",
    driveModes: "",
    exteriorDesign: [],
    groundClearance: "",
    fuelTankCapacity: "",
    bootSpace: "",
    safetyFeatures: [],
    entertainmentFeatures: [],
    comfortFeatures: [],
    drivingAssistanceFeatures: [],
    drivingExperience: "",
    fuelTankCapacityMin: null,
    fuelTankCapacityMax: null,
    bootSpaceMin: null,
    bootSpaceMax: null,
  });

  const [currentSection, setCurrentSection] = useState(0); // Active section
  const [progress, setProgress] = useState(0); // Progress percentage
  const [fuelType, setFuelType] = useState(""); // Fuel type from session storage

  // Retrieve data from session storage on component mount
  useEffect(() => {
    const storedFuelType = sessionStorage.getItem("fuelType");
    if (storedFuelType) setFuelType(storedFuelType);

    const storedAnswers =
      JSON.parse(sessionStorage.getItem("detailedAnswers")) || {};
    setAnswers(storedAnswers);
    calculateProgress(storedAnswers);
  }, []);

  // Store the answers in session storage whenever they change
  useEffect(() => {
    sessionStorage.setItem("detailedAnswers", JSON.stringify(answers));
    calculateProgress();
  }, [answers]);

  // Update answers based on user input
  const handleAnswerChange = (field, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [field]: value,
    }));
  };

  // Update answers for checkbox selections
  const handleCheckboxChange = (field, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [field]: Array.isArray(prevAnswers[field])
        ? prevAnswers[field].includes(value)
          ? prevAnswers[field].filter((item) => item !== value)
          : [...prevAnswers[field], value]
        : [value], // Initialize as array if undefined
    }));
  };

  // Calculate form progress based on filled sections
  const calculateProgress = (customAnswers) => {
    const checkAnswers = customAnswers || answers;
    let filledSections = 0;
    const requiredFields = [
      checkAnswers.enginePower || checkAnswers.batteryCapacity,
      checkAnswers.driveModes,
      checkAnswers.exteriorDesign?.length > 0,
      checkAnswers.groundClearance,
      checkAnswers.fuelTankCapacity,
      checkAnswers.bootSpace,
      checkAnswers.safetyFeatures?.length > 0,
      checkAnswers.entertainmentFeatures?.length > 0,
      checkAnswers.comfortFeatures?.length > 0,
      checkAnswers.drivingAssistanceFeatures?.length > 0,
      checkAnswers.drivingExperience,
    ];

    filledSections = requiredFields.filter((field) => field).length;
    const progressPercent = (filledSections / requiredFields.length) * 100;
    setProgress(progressPercent);
  };

  // Parse and submit the form
  const handleSubmit = async () => {
    let fuelTankCapacityMin = null,
      fuelTankCapacityMax = null,
      bootSpaceMin = null,
      bootSpaceMax = null;

    // Parse fuelTankCapacity if the format includes a dash (range format)
    if (answers.fuelTankCapacity) {
      if (answers.fuelTankCapacity.includes("-")) {
        const [fuelTankCapacityMinStr, fuelTankCapacityMaxStr] =
          answers.fuelTankCapacity.split("-");
        fuelTankCapacityMin = parseInt(
          fuelTankCapacityMinStr.trim().replace(/\D/g, ""),
          10
        );
        fuelTankCapacityMax = fuelTankCapacityMaxStr.includes("and above")
          ? Number.MAX_SAFE_INTEGER
          : parseInt(fuelTankCapacityMaxStr.trim().replace(/\D/g, ""), 10);
      } else {
        // If the user doesn't provide a range, assign both values the same number
        fuelTankCapacityMin = fuelTankCapacityMax = parseInt(
          answers.fuelTankCapacity.trim().replace(/\D/g, ""),
          10
        );
      }
    }

    // Parse bootSpace if the format includes a dash (range format)
    if (answers.bootSpace) {
      if (answers.bootSpace.includes("-")) {
        const [bootSpaceMinStr, bootSpaceMaxStr] = answers.bootSpace.split("-");
        bootSpaceMin = parseInt(bootSpaceMinStr.trim().replace(/\D/g, ""), 10);
        bootSpaceMax = bootSpaceMaxStr.includes("and above")
          ? Number.MAX_SAFE_INTEGER
          : parseInt(bootSpaceMaxStr.trim().replace(/\D/g, ""), 10);
      } else {
        // If the user doesn't provide a range, assign both values the same number
        bootSpaceMin = bootSpaceMax = parseInt(
          answers.bootSpace.trim().replace(/\D/g, ""),
          10
        );
      }
    }

    const body = {
      ...answers,
      fuelType: sessionStorage.getItem("fuelType"),
      budgetMin: sessionStorage.getItem("budgetMin"),
      budgetMax: sessionStorage.getItem("budgetMax"),
      location: sessionStorage.getItem("location"),
      bodyStyle: JSON.parse(sessionStorage.getItem("bodyStyle")) || [],
      transmissionType: sessionStorage.getItem("transmissionType"),
      drivingRange: sessionStorage.getItem("drivingRange"),
      seatingCapacity: sessionStorage.getItem("seatingCapacity"),
      primaryUse: sessionStorage.getItem("primaryUse"),
      carColor: sessionStorage.getItem("carColor"),
      fuelTankCapacityMin,
      fuelTankCapacityMax,
      bootSpaceMin,
      bootSpaceMax,
    };

    try {
      const response = await fetch(
        "/api/detailedRequirementRoutes/detailedRequirement1Route",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Data submitted successfully", data);
        alert("Your details have been submitted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error submitting data", errorData);
        alert("Error submitting your details. Please try again.");
      }
    } catch (error) {
      console.error("Network error while submitting data", error);
      alert("A network error occurred. Please try again.");
    }
  };

  const handleNext = async () => {
    if (currentSection === 4) {
      await handleSubmit();
      router.push("/detailedRequirementPages/detailedRequirement2");
    } else {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleBack = () => {
    if (currentSection === 0) {
      router.push("/requirementPages/requirement4");
    } else {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex">
        {/* Blue Side Frame */}
        <div
          className="w-1/6 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-8 flex flex-col justify-between shadow-lg"
          style={{ height: "calc(100vh)" }}
        >
          {/* Larger Icon */}
          <div className="flex items-center justify-center mb-6">
            <Image src={assets.logo} width={150} height={100} alt="logo.png" />
          </div>

          {/* Section Headings */}
          <div className="flex flex-col gap-4">
            {sections.map((section, index) => (
              <div
                key={index}
                className={`cursor-pointer py-2 px-4 rounded-lg text-center transition-all duration-300 ${
                  index === currentSection
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-blue-500 hover:bg-blue-600 text-gray-100"
                }`}
                onClick={() => setCurrentSection(index)}
              >
                {section}
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="relative w-full h-4 bg-blue-300 rounded-lg overflow-hidden shadow-md">
              <div
                className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-left mt-2 font-bold text-white text-sm">
              Progress: {Math.round(progress)}%
            </div>
          </div>
        </div>

        {/* Main Content - Right Frame */}
        <div className="w-5/6 p-8 bg-white shadow-lg rounded-lg">
          <div className="space-y-12">
            {/* Car Power */}
            <div className={`${currentSection === 0 ? "block" : "hidden"}`}>
              {fuelType !== "Electric" ? (
                <>
                  <h2 className="text-3xl font-bold mt-8 text-gray-700 flex items-center">
                    How important is car power to you?
                    <HelperIcon imageSrc={assets.logo} />
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-6 mt-4">
                    {[
                      "Low (1000 - 1200 cc)",
                      "Moderate (1200 - 1500 cc)",
                      "High (1500 - 2000 cc)",
                      "Very High (2000 cc and above)",
                    ].map((option) => (
                      <label
                        key={option}
                        className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all"
                      >
                        <input
                          type="radio"
                          name="enginePower"
                          value={option}
                          checked={answers.enginePower === option}
                          onChange={() =>
                            handleAnswerChange("enginePower", option)
                          }
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mt-8 text-gray-700 flex items-center">
                    What is your preferred battery capacity?
                    <HelperIcon imageSrc={assets.logo} />
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">
                    Note: Electric car prices and driving range increase with
                    greater battery capacity.
                  </p>
                  <select
                    onChange={(e) =>
                      handleAnswerChange("batteryCapacity", e.target.value)
                    }
                    className="border border-gray-300 p-3 rounded-md w-full bg-gray-50 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={answers.batteryCapacity}
                  >
                    <option value="">Select Battery Capacity</option>
                    {["26 kWh", "30 kWh", "40 kWh", "50 kWh and above"].map(
                      (option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </>
              )}
            </div>

            {/* Drive Modes */}
            <div className={`${currentSection === 1 ? "block" : "hidden"}`}>
              <h2 className="text-3xl font-bold mt-8 text-gray-700 flex items-center">
                Which of the following drive modes are available in the car you
                are interested in?
                <HelperIcon imageSrc={assets.logo} />
              </h2>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  "3 Drive Modes - Economy, City, and Sports",
                  "Standard",
                  "2 Modes - City and Sport",
                  "2 Modes - Eco and City",
                  "Sport Mode",
                  "Sport/Standard",
                ].map((option) => (
                  <label
                    key={option}
                    className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all"
                  >
                    <input
                      type="radio"
                      name="driveModes"
                      value={option}
                      checked={answers.driveModes === option}
                      onChange={() =>
                        handleAnswerChange("driveModes", option)
                      }
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Exterior Design */}
            <div className={`${currentSection === 2 ? "block" : "hidden"}`}>
              <h2 className="text-3xl font-bold mt-8 text-gray-700 flex items-center">
                Exterior Design Preferences
                <HelperIcon imageSrc={assets.logo} />
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    "Alloy Wheels",
                    "LED Headlights",
                    "Fog Lamps",
                    "Roof Rails",
                    "Body-Colored Bumpers",
                  ].map((option) => (
                    <label
                      key={option}
                      className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all"
                    >
                      <input
                        type="checkbox"
                        value={option}
                        checked={answers.exteriorDesign.includes(option)}
                        onChange={() =>
                          handleCheckboxChange("exteriorDesign", option)
                        }
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>

                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-700 flex items-center">
                    Ground Clearance
                    <HelperIcon imageSrc={assets.ground_clearance} />
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {["High", "Moderate", "Low"].map((option) => (
                      <label
                        key={option}
                        className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all"
                      >
                        <input
                          type="radio"
                          name="groundClearance"
                          value={option}
                          checked={answers.groundClearance === option}
                          onChange={() =>
                            handleAnswerChange("groundClearance", option)
                          }
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Fuel Tank and Boot Space */}
            <div className={`${currentSection === 3 ? "block" : "hidden"}`}>
              <div className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-700 flex items-center">
                    Fuel Tank Capacity
                    <HelperIcon imageSrc={assets.logo} />
                  </h2>
                  <select
                    value={answers.fuelTankCapacity}
                    onChange={(e) =>
                      handleAnswerChange("fuelTankCapacity", e.target.value)
                    }
                    className="border border-gray-300 p-3 rounded-md w-full bg-gray-50 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Fuel Tank Capacity</option>
                    {[
                      "Less than 40 liters",
                      "40-50 liters",
                      "50-60 liters",
                      "60-70 liters",
                      "More than 70 liters",
                    ].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-700 flex items-center">
                    Boot Space Capacity
                    <HelperIcon imageSrc={assets.boot_space} />
                  </h2>
                  <select
                    value={answers.bootSpace}
                    onChange={(e) =>
                      handleAnswerChange("bootSpace", e.target.value)
                    }
                    className="border border-gray-300 p-3 rounded-md w-full bg-gray-50 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Boot Space Capacity</option>
                    {[
                      "Less than 300 liters",
                      "300-400 liters",
                      "400-500 liters",
                      "500-600 liters",
                      "More than 600 liters",
                    ].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Safety & Features */}
            <div className={`${currentSection === 4 ? "block" : "hidden"}`}>
              <h2 className="text-2xl font-bold text-gray-700 flex items-center">
                Safety Features
                <HelperIcon imageSrc={assets.logo} />
              </h2>
              <div className="space-y-12">
                {/* Safety Features */}
                <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
                  {[
                    "Airbags",
                    "ABS",
                    "Electronic Brakeforce Distribution (EBD)",
                    "Traction Control System (TCS)",
                    "Electronic Stability Program (ESP)",
                    "Child Seat Anchor Points (ISOFIX)",
                    "Blind Spot Detection",
                    "Forward Collision Warning (FCW)",
                    "360-Degree Camera System",
                    "Parking Assist",
                    "Lane Departure Warning",
                  ].map((option) => (
                    <label
                      key={option}
                      className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all"
                    >
                      <input
                        type="checkbox"
                        value={option}
                        checked={answers.safetyFeatures.includes(option)}
                        onChange={() =>
                          handleCheckboxChange("safetyFeatures", option)
                        }
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {/* Entertainment Features */}
                <div className="mb-4 mt-2">
                  <h2 className="text-2xl font-bold text-gray-700 flex items-center">
                    Entertainment Features
                    <HelperIcon imageSrc={assets.logo} />
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "Bluetooth Connectivity",
                      "FM Radio",
                      "Touchscreen Display",
                      "Apple CarPlay / Android Auto",
                      "Multifunction Steering Wheel",
                      "Multi Speaker Sound System",
                    ].map((option) => (
                      <label
                        key={option}
                        className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          checked={answers.entertainmentFeatures.includes(
                            option
                          )}
                          onChange={() =>
                            handleCheckboxChange(
                              "entertainmentFeatures",
                              option
                            )
                          }
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Comfort Features */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-700 flex items-center">
                    Comfort Features
                    <HelperIcon imageSrc={assets.logo} />
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "Sunroof / Moonroof",
                      "Adjustable Steering Wheel",
                      "Air Conditioner / Automatic Climate Control",
                      "Power Adjustable Front Seats",
                      "Rear Seat Armrest",
                      "Ambient Lighting",
                    ].map((option) => (
                      <label
                        key={option}
                        className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          checked={answers.comfortFeatures.includes(option)}
                          onChange={() =>
                            handleCheckboxChange("comfortFeatures", option)
                          }
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Driving Assistance Features */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-700 flex items-center">
                    Driving Assistance Features
                    <HelperIcon imageSrc={assets.logo} />
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "Cruise Control",
                      "Navigation System",
                      "Reverse Parking Camera",
                      "Rain Sensing Wipers",
                      "Hill Assist",
                    ].map((option) => (
                      <label
                        key={option}
                        className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          checked={answers.drivingAssistanceFeatures.includes(
                            option
                          )}
                          onChange={() =>
                            handleCheckboxChange(
                              "drivingAssistanceFeatures",
                              option
                            )
                          }
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Driving Experience */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-700 flex items-center">
                    Driving Experience
                    <HelperIcon imageSrc={assets.logo} />
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "Smooth and Comfortable",
                      "Sporty and Fast",
                      "Off-Road Capable",
                      "Luxurious",
                      "Fuel Efficient",
                      "Tech-Driven Experience",
                    ].map((option) => (
                      <label
                        key={option}
                        className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all"
                      >
                        <input
                          type="radio"
                          name="drivingExperience"
                          value={option}
                          checked={answers.drivingExperience === option}
                          onChange={() =>
                            handleAnswerChange("drivingExperience", option)
                          }
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-12 flex justify-between">
            <button
              onClick={handleBack}
              className="flex items-center px-6 py-2 border border-blue-700 rounded-md text-blue-700 font-bold bg-blue-100 hover:bg-blue-200 transition-all"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 border border-red-700 rounded-md text-white font-bold bg-red-700 hover:bg-red-800 transition-all"
            >
              {currentSection === 4 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>

      <Footer2 />
    </div>
  );
};

export default DetailedRequirement1;
