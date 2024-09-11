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
        alt="info"
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

const DetailedRequirement2 = () => {
  const router = useRouter();

  const sections = [
    "Window & Mirror Features",
    "Exterior Lighting Features",
    "Connected Car Features",
    "Infotainment & Connectivity Features",
    "Personalized Inputs",
  ];

  const [answers, setAnswers] = useState({
    windowMirrorFeatures: [],
    fogLights: "",
    daytimeRunningLights: "",
    headlights: "",
    automaticHeadlamps: "",
    followMeHomeHeadlamps: "",
    taillights: "",
    connectedCarFeatures: [],
    infotainmentFeatures: [],
    additionalFeatures: "",
    carModelVariant: "",
    extendedWarranty: "",
    registrationInsurance: "",
  });

  const [currentSection, setCurrentSection] = useState(0); // Active section
  const [progress, setProgress] = useState(0); // Progress percentage

  // Check if we need to reload the page after navigating from DetailedRequirement1
  useEffect(() => {
    const shouldReload = sessionStorage.getItem("shouldReload");
    if (shouldReload) {
      sessionStorage.removeItem("shouldReload");
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    const storedAnswers = JSON.parse(sessionStorage.getItem("detailedAnswers2")) || {};
    setAnswers(storedAnswers);
    calculateProgress();
  }, []);

  useEffect(() => {
    sessionStorage.setItem("detailedAnswers2", JSON.stringify(answers));
    calculateProgress();
  }, [answers]);

  const handleAnswerChange = (field, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [field]: prevAnswers[field].includes(value)
        ? prevAnswers[field].filter((item) => item !== value)
        : [...prevAnswers[field], value],
    }));
  };

  const calculateProgress = () => {
    let filledSections = 0;
    const requiredFields = [
      answers.windowMirrorFeatures.length > 0,
      answers.fogLights,
      answers.daytimeRunningLights,
      answers.headlights,
      answers.automaticHeadlamps,
      answers.followMeHomeHeadlamps,
      answers.taillights,
      answers.connectedCarFeatures.length > 0,
      answers.infotainmentFeatures.length > 0,
      answers.additionalFeatures,
      answers.carModelVariant,
      answers.extendedWarranty,
      answers.registrationInsurance,
    ];

    filledSections = requiredFields.filter((field) => field).length;
    const progressPercent = (filledSections / requiredFields.length) * 100;
    setProgress(progressPercent);
  };

  const handleSubmit = async () => {
    const body = {
      ...answers,
      fuelType: sessionStorage.getItem("fuelType"),
    };

    try {
      // Step 1: Submit the user's detailed requirements
      const response = await fetch(
        "/api/detailedRequirementRoutes/detailedRequirement2Route",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        alert("Error submitting your details. Please try again.");
        return;
      }

      const result = await response.json();
      const { requirementId } = result; // Get the requirementId from the response

      // Step 2: Call the Flask API for recommendations using the requirementId
      const recommendationResponse = await fetch("http://localhost:5000/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: requirementId }), // Pass the requirementId to Flask API
      });

      if (recommendationResponse.ok) {
        const recommendationData = await recommendationResponse.json();
        console.log("Recommendations:", recommendationData);
        alert("Recommendations generated successfully!");
        // Redirect to the analyzing page
        router.push("/analyzing");
      } else {
        alert("Error generating recommendations. Please try again.");
      }
    } catch (error) {
      alert("A network error occurred. Please try again.");
    }
  };

  const handleNext = async () => {
    if (currentSection === 4) {
      await handleSubmit(); // Submit the form and trigger recommendations
    } else {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleBack = () => {
    if (currentSection === 0) {
      sessionStorage.setItem("shouldReload", "true"); // Set the reload flag
      router.push("/detailedRequirementPages/detailedRequirement1");
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
            {/* Window & Mirror Features */}
            <div className={`${currentSection === 0 ? "block" : "hidden"}`}>
              <h2 className="text-3xl font-bold text-gray-700 flex items-center">
                Window & Mirror Features
                <HelperIcon imageSrc={assets.window_features} />
              </h2>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  "Power Windows",
                  "One Touch Down",
                  "One Touch Up",
                  "ORVM Colour",
                  "Adjustable ORVM",
                  "Turn Indicators on ORVM",
                  "Rain Sensing Wipers",
                  "Side Window Blinds",
                  "Rear Windshield Blind",
                ].map((option) => (
                  <label
                    key={option}
                    className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all"
                  >
                    <input
                      type="checkbox"
                      value={option}
                      checked={answers.windowMirrorFeatures.includes(option)}
                      onChange={() =>
                        handleCheckboxChange("windowMirrorFeatures", option)
                      }
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Exterior Lighting Features */}
            <div className={`${currentSection === 1 ? "block" : "hidden"}`}>
              <h2 className="text-3xl font-bold text-gray-700 flex items-center">
                Exterior Lighting Features
                <HelperIcon imageSrc={assets.lighting_features} />
              </h2>
              <div className="grid grid-cols-2 gap-8 mt-6">
                {/* Fog Lights */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Fog Lights:</h3>
                  {["Halogen", "LED"].map((option) => (
                    <label
                      key={option}
                      className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all"
                    >
                      <input
                        type="radio"
                        name="fogLights"
                        value={option}
                        checked={answers.fogLights === option}
                        onChange={() => handleAnswerChange("fogLights", option)}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {/* Daytime Running Lights */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Daytime Running Lights:</h3>
                  {["Halogen", "LED"].map((option) => (
                    <label
                      key={option}
                      className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all"
                    >
                      <input
                        type="radio"
                        name="daytimeRunningLights"
                        value={option}
                        checked={answers.daytimeRunningLights === option}
                        onChange={() =>
                          handleAnswerChange("daytimeRunningLights", option)
                        }
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {/* Headlights */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Headlights:</h3>
                  {["Halogen", "Halogen Projector", "LED"].map((option) => (
                    <label
                      key={option}
                      className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all"
                    >
                      <input
                        type="radio"
                        name="headlights"
                        value={option}
                        checked={answers.headlights === option}
                        onChange={() => handleAnswerChange("headlights", option)}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {/* Automatic Headlamps */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Automatic Headlamps:</h3>
                  {["Yes", "No"].map((option) => (
                    <label
                      key={option}
                      className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all"
                    >
                      <input
                        type="radio"
                        name="automaticHeadlamps"
                        value={option}
                        checked={answers.automaticHeadlamps === option}
                        onChange={() =>
                          handleAnswerChange("automaticHeadlamps", option)
                        }
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {/* Follow-Me-Home Headlamps */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Follow-Me-Home Headlamps:</h3>
                  {["Yes", "No"].map((option) => (
                    <label
                      key={option}
                      className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all"
                    >
                      <input
                        type="radio"
                        name="followMeHomeHeadlamps"
                        value={option}
                        checked={answers.followMeHomeHeadlamps === option}
                        onChange={() =>
                          handleAnswerChange("followMeHomeHeadlamps", option)
                        }
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {/* Taillights */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Taillights:</h3>
                  {["Halogen", "LED"].map((option) => (
                    <label
                      key={option}
                      className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all"
                    >
                      <input
                        type="radio"
                        name="taillights"
                        value={option}
                        checked={answers.taillights === option}
                        onChange={() => handleAnswerChange("taillights", option)}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Connected Car Features */}
            <div className={`${currentSection === 2 ? "block" : "hidden"}`}>
              <h2 className="text-3xl font-bold text-gray-700 flex items-center">
                Connected Car Features
                <HelperIcon imageSrc={assets.connected_car_features} />
              </h2>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  "Remote Car Lock/Unlock Via app",
                  "Remote AC On/Off Via app",
                  "Remote Sunroof Open/Close Via app",
                  "Remote Car Light Flashing & Honking Via app",
                  "Find My Car",
                  "Check Vehicle Status Via App",
                  "Emergency Call",
                  "Over The Air (OTA) Updates",
                  "Geo-Fence",
                ].map((option) => (
                  <label
                    key={option}
                    className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all"
                  >
                    <input
                      type="checkbox"
                      value={option}
                      checked={answers.connectedCarFeatures.includes(option)}
                      onChange={() =>
                        handleCheckboxChange("connectedCarFeatures", option)
                      }
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Infotainment & Connectivity Features */}
            <div className={`${currentSection === 3 ? "block" : "hidden"}`}>
              <h2 className="text-3xl font-bold text-gray-700 flex items-center">
                Infotainment & Connectivity Features
                <HelperIcon imageSrc={assets.infotainment_features} />
              </h2>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  "Integrated (in-dash) Music System",
                  "GPS Navigation System",
                  "USB Compatibility",
                  "Aux Compatibility",
                  "Bluetooth Compatibility",
                  "CD Player",
                  "DVD Playback",
                  "AM/FM Radio",
                  "iPod Compatibility",
                  "Internal Hard-drive",
                  "Steering-mounted Controls",
                  "Voice Command",
                  "Wireless Charger",
                  "Gesture Control",
                ].map((option) => (
                  <label
                    key={option}
                    className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all"
                  >
                    <input
                      type="checkbox"
                      value={option}
                      checked={answers.infotainmentFeatures.includes(option)}
                      onChange={() =>
                        handleCheckboxChange("infotainmentFeatures", option)
                      }
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Personalized Inputs */}
            <div className={`${currentSection === 4 ? "block" : "hidden"}`}>
              <h2 className="text-3xl font-bold text-gray-700 flex items-center">
                Personalized Inputs
              </h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  Any additional features or specifications that are important to you?
                </h3>
                <textarea
                  value={answers.additionalFeatures}
                  onChange={(e) =>
                    handleAnswerChange("additionalFeatures", e.target.value)
                  }
                  className="border border-gray-300 p-3 rounded-md w-full bg-gray-50 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter any additional preferences..."
                />
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  Do you have any specific car model and variant in mind?
                </h3>
                <input
                  type="text"
                  value={answers.carModelVariant}
                  onChange={(e) =>
                    handleAnswerChange("carModelVariant", e.target.value)
                  }
                  className="border border-gray-300 p-3 rounded-md w-full bg-gray-50 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter car model and variant..."
                />
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  Are you interested in options for extended warranties or service packages?
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {["Yes", "No"].map((option) => (
                    <label
                      key={option}
                      className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all">
                      <input
                        type="radio"
                        name="extendedWarranty"
                        value={option}
                        checked={answers.extendedWarranty === option}
                        onChange={() =>
                          handleAnswerChange("extendedWarranty", option)
                        }
                        className="mr-2"
                      />
                      {option === "Yes"
                        ? "Yes, I’m interested in extended warranties or service packages."
                        : "No, I’m not interested."}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  Would you like assistance with vehicle registration and insurance options?
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {["Yes", "No"].map((option) => (
                    <label
                      key={option}
                      className="block bg-gray-50 p-4 rounded-md shadow hover:bg-gray-100 transition-all">
                      <input
                        type="radio"
                        name="registrationInsurance"
                        value={option}
                        checked={answers.registrationInsurance === option}
                        onChange={() =>
                          handleAnswerChange("registrationInsurance", option)
                        }
                        className="mr-2"
                      />
                      {option === "Yes"
                        ? "Yes, I need assistance with registration and insurance."
                        : "No, I will handle it myself."}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-12 flex justify-between">
            <button
              onClick={handleBack}
              className="flex items-center px-6 py-2 border border-blue-700 rounded-md text-blue-700 font-bold bg-blue-100 hover:bg-blue-200 transition-all">
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 border border-red-700 rounded-md text-white font-bold bg-red-700 hover:bg-red-800 transition-all">
              {currentSection === 4 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>

      <Footer2 />
    </div>
  );
};

export default DetailedRequirement2;
