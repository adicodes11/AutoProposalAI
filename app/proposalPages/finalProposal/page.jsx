"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import logo from "/assets/logo.png";
import { useRouter } from "next/navigation";

const PreviewProposal = () => {
  const [proposalData, setProposalData] = useState(null);
  const [proposalIntroduction, setProposalIntroduction] = useState("");
  const [carOverview, setCarOverview] = useState("");
  const [customizationSuggestions, setCustomizationSuggestions] = useState("");
  const [proposalSummary, setProposalSummary] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [customerRequirements, setCustomerRequirements] = useState(null);
  const [carDetails, setCarDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [PID, setPID] = useState("");
  const [generatedByEmail, setGeneratedByEmail] = useState("");

  const router = useRouter();
  const printRef = useRef();

  // Helper function to convert car model and color to match the image naming convention
  const getImageName = (carModel, carColor) => {
    const formattedModel = carModel.toLowerCase().replace(/\s+/g, "_"); // Replace spaces with underscores and convert to lowercase
    const formattedColor = carColor.toLowerCase(); // Convert color to lowercase
    return `/Car Image Dataset/${formattedModel}_${formattedColor}.png`; // Construct the image path
  };

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const sessionId = sessionStorage.getItem("sessionId");
        const createdBy = sessionStorage.getItem("userId");
        const selectedCarModel = sessionStorage.getItem("selectedCarModel");
        const selectedVersion = sessionStorage.getItem("selectedVersion");

        if (!sessionId || !createdBy || !selectedCarModel || !selectedVersion) {
          throw new Error("Session data missing.");
        }

        const response = await fetch("/api/proposalRoutes/proposalPreviewRoute", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            createdBy,
            selectedCarModel,
            selectedVersion,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setProposalData(data);
          setPID(data.PID);
          setGeneratedByEmail(data.generatedByEmail);
          setProposalIntroduction(data.introduction);
          setCarOverview(data.carOverview);
          setCustomizationSuggestions(data.customizationSuggestions);
          setProposalSummary(data.proposalSummary);
          setConclusion(data.conclusion);
          setCustomerRequirements(data.customer_requirements);
          setCarDetails(data.carDetails);
        } else {
          throw new Error("Failed to fetch proposal data.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, []);

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleValidate = () => {
    router.push("/validateProposal");
  };

  const handleBack = () => {
    router.push("/recommendationPage");
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading proposal...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center justify-between h-screen bg-gray-50">
      <div
        ref={printRef}
        className="bg-white p-6 border border-gray-300 rounded-xl shadow-lg w-full max-w-4xl"
      >
        {/* Header Section */}
        <div className="w-full flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Image src={logo} alt="AutoProposalAI Logo" width={120} height={100} />
          </div>
          <div className="flex-grow flex justify-center">
            <h3 className="text-2xl font-bold text-blue-600">
              Gen AI Based Customized Car Proposal
            </h3>
          </div>
          <div className="text-gray-600 font-semibold text-sm">PID: {PID}</div>
        </div>
        <hr className="border-t border-blue-600 mb-4" />

        {/* Important Section */}
        <h3 className="text-lg font-semibold mb-3 underline">Important:</h3>
        <ul className="list-disc ml-4 mb-6">
          <li>
            Please review the entire proposal thoroughly to understand the features,
            specifications, and customizations offered.
          </li>
          <li>
            All prices and offers mentioned in this proposal are indicative and subject to
            confirmation by the respective car manufacturer or dealer.
          </li>
          <li>
            This proposal is valid for 30 days from the date of generation and may be
            subject to changes based on updated data or customer preferences.
          </li>
        </ul>

        {/* Customer Details Section */}
        <hr className="border-t border-blue-600 mb-4" />
        <h2 className="text-lg font-semibold mb-3">A. Customer Details</h2>
        <table className="table-auto w-full mb-6 border-collapse border border-gray-300">
          <tbody>
            <tr>
              <td className="font-semibold border border-gray-300 p-1">Name:</td>
              <td className="border border-gray-300 p-1">{`${proposalData.customer_details.designation} ${proposalData.customer_details.fullName}`}</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-1">Date of Birth:</td>
              <td className="border border-gray-300 p-1">
                {new Date(proposalData.customer_details.dob).toLocaleDateString()}
              </td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-1">Gender:</td>
              <td className="border border-gray-300 p-1">
                {proposalData.customer_details.gender}
              </td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-1">Nationality:</td>
              <td className="border border-gray-300 p-1">
                {proposalData.customer_details.nationality}
              </td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-1">Phone:</td>
              <td className="border border-gray-300 p-1">
                {proposalData.customer_details.mobileNo}
              </td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-1">Email:</td>
              <td className="border border-gray-300 p-1">
                {proposalData.customer_details.email}
              </td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-1">Address:</td>
              <td className="border border-gray-300 p-1">
                {proposalData.customer_details.residentialAddress}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Introduction Section */}
        <hr className="border-t border-blue-600 mb-4" />
        <h2 className="text-lg font-semibold mb-3">B. Introduction</h2>
        <p className="mb-4 leading-relaxed">{proposalIntroduction}</p>

        {/* Customer Requirement Summary Section */}
        <hr className="border-t border-blue-600 mb-4" />
        {customerRequirements && (
          <>
            <h2 className="text-lg font-semibold mb-2">C. Customer Requirement Summary</h2>
            <div className="overflow-x-auto">
              <table className="table-auto w-full mb-4 border-collapse border border-gray-300 text-xs">
                <tbody>
                  <tr>
                    <td className="font-semibold border border-gray-300 p-1">Budget</td>
                    <td className="border border-gray-300 p-1">
                      ₹{customerRequirements.budgetMin} - ₹{customerRequirements.budgetMax}
                    </td>
                    <td className="font-semibold border border-gray-300 p-1">Location</td>
                    <td className="border border-gray-300 p-1">
                      {customerRequirements.location}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold border border-gray-300 p-1">Body Style</td>
                    <td className="border border-gray-300 p-1">
                      {customerRequirements.bodyStyle.join(", ")}
                    </td>
                    <td className="font-semibold border border-gray-300 p-1">Fuel Type</td>
                    <td className="border border-gray-300 p-1">
                      {customerRequirements.fuelType}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold border border-gray-300 p-1">Seating Capacity</td>
                    <td className="border border-gray-300 p-1">
                      {customerRequirements.seatingCapacity}
                    </td>
                    <td className="font-semibold border border-gray-300 p-1">Transmission</td>
                    <td className="border border-gray-300 p-1">
                      {customerRequirements.transmissionType}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold border border-gray-300 p-1">Preferred Color</td>
                    <td className="border border-gray-300 p-1">
                      {customerRequirements.carColor}
                    </td>
                    <td className="font-semibold border border-gray-300 p-1">Primary Use</td>
                    <td className="border border-gray-300 p-1">
                      {customerRequirements.primaryUse}
                    </td>
                  </tr>
                  {/* Additional Fields */}
                  <tr>
                    <td className="font-semibold border border-gray-300 p-1">Driving Experience</td>
                    <td className="border border-gray-300 p-1">
                      {customerRequirements.drivingExperience || "N/A"}
                    </td>
                    <td className="font-semibold border border-gray-300 p-1">Engine Power</td>
                    <td className="border border-gray-300 p-1">
                      {customerRequirements.enginePower || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold border border-gray-300 p-1">
                      Ground Clearance
                    </td>
                    <td className="border border-gray-300 p-1">
                      {customerRequirements.groundClearance || "N/A"}
                    </td>
                    <td className="font-semibold border border-gray-300 p-1">
                      Battery Capacity
                    </td>
                    <td className="border border-gray-300 p-1">
                      {customerRequirements.batteryCapacity || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-xs mb-4">
              <strong>Additional Features:</strong>{" "}
              {customerRequirements.additionalFeatures || "None specified"}
            </div>
            <div className="text-xs mb-4">
              <strong>Safety Features:</strong>{" "}
              {customerRequirements.safetyFeatures.join(", ") || "None specified"}
            </div>
          </>
        )}

        {/* Car Overview Section */}
        <hr className="border-t border-blue-600 mb-4" />
        <h2 className="text-lg font-semibold mb-3">D. Car Overview</h2>
        <p className="mb-4 text-sm leading-relaxed">{carOverview}</p>

        {/* Car Details Section */}
        {carDetails && (
          <>
            <hr className="border-t border-blue-600 mb-4" />
            <div className="flex justify-left mb-4">
              <div className="bg-[#253760] text-gray-100 py-2 px-4 text-center rounded" style={{ maxWidth: "fit-content" }}>
                <h2 className="text-lg font-bold uppercase tracking-wide">{carDetails.Model} {carDetails.Version}</h2>
              </div>
            </div>
            <div className="flex flex-wrap mb-4">
              <div className="w-full md:w-1/2 pr-4">
                <h3 className="text-md font-semibold mb-2">Key Highlights</h3>
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr>
                      <td className="font-semibold border border-gray-300 p-1">Price</td>
                      <td className="border border-gray-300 p-1">
                        ₹{carDetails["Ex-Showroom Price"] || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold border border-gray-300 p-1">Fuel type</td>
                      <td className="border border-gray-300 p-1">
                        {carDetails["Fuel Type"]}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold border border-gray-300 p-1">
                        Transmission type
                      </td>
                      <td className="border border-gray-300 p-1">
                        {carDetails["Transmission Type"]}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold border border-gray-300 p-1">Car type</td>
                      <td className="border border-gray-300 p-1">{carDetails["Body Type"]}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold border border-gray-300 p-1">Mileage</td>
                      <td className="border border-gray-300 p-1">
                        {carDetails["Mileage (ARAI) (kmpl)"]} KMPL
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold border border-gray-300 p-1">Engine</td>
                      <td className="border border-gray-300 p-1">
                        {carDetails["Engine Power (cc)"]} CC,{" "}
                        {carDetails["Engine Specification"]}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold border border-gray-300 p-1">Safety</td>
                      <td className="border border-gray-300 p-1">
                        {carDetails["NCAP Rating (Adult) (Star (Global NCAP))"]} Star Global
                        NCAP
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold border border-gray-300 p-1">
                        Emission Standard
                      </td>
                      <td className="border border-gray-300 p-1">
                        {carDetails["Emission Standard"]}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="w-full md:w-1/2 mt-4 md:mt-0">
                {/* Fetch car image based on the car model and color */}
                <Image
                  src={getImageName(carDetails.Model, customerRequirements.carColor) || "/path/to/default-car-image.jpg"}
                  alt={carDetails.Model}
                  width={708}
                  height={500}
                  className="object-contain"
                />
              </div>
            </div>
          </>
        )}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        {/* Key Features Section */}
        {/* {carDetails && (
          <>
            <hr className="border-t border-blue-600 mb-4" />
            <div className="flex justify-left mb-4">
            </div>
            <div className="flex flex-wrap mb-4">
              <div className="w-full md:w-full pr-4">
                <h3 className="text-lg font-semibold mb-2">E.Key Features</h3>
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr>
                      <td className="font-semibold border border-gray-300 p-1">Price</td>
                      <td className="border border-gray-300 p-1">
                        ₹{carDetails["Ex-Showroom Price"] || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold border border-gray-300 p-1">Fuel type</td>
                      <td className="border border-gray-300 p-1">
                        {carDetails["Fuel Type"]}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold border border-gray-300 p-1">
                        Transmission type
                      </td>
                      <td className="border border-gray-300 p-1">
                        {carDetails["Transmission Type"]}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold border border-gray-300 p-1">Car type</td>
                      <td className="border border-gray-300 p-1">{carDetails["Body Type"]}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold border border-gray-300 p-1">Mileage</td>
                      <td className="border border-gray-300 p-1">
                        {carDetails["Mileage (ARAI) (kmpl)"]} KMPL
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold border border-gray-300 p-1">Engine</td>
                      <td className="border border-gray-300 p-1">
                        {carDetails["Engine Power (cc)"]} CC,{" "}
                        {carDetails["Engine Specification"]}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold border border-gray-300 p-1">Safety</td>
                      <td className="border border-gray-300 p-1">
                        {carDetails["NCAP Rating (Adult) (Star (Global NCAP))"]} Star Global
                        NCAP
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold border border-gray-300 p-1">
                        Emission Standard
                      </td>
                      <td className="border border-gray-300 p-1">
                        {carDetails["Emission Standard"]}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )} */}



////////////////////////////////////////////////////////////////////////////////////////////////////
        {/* Key Features Section */}        
        {carDetails && (
          <>
            <hr className="border-t border-blue-600 mb-4" />
            <div className="flex justify-left mb-4">
              <div className="text-lg font-semibold mb-2" style={{ maxWidth: "fit-content" }}>
                <h2 className="text-lg font-bold uppercase tracking-wide">E. Key Features</h2>
              </div>
            </div>
            <div className="flex flex-wrap mb-4">
              <div className="w-full md:w-1/2 pr-4">  
                <h3 className="text-md font-semibold mb-2">Exterior</h3>
                <ul className="list-disc ml-6 mb-4">
                  <li>{carDetails["Headlights"] || "N/A"} with LED DRLs</li>
                  <li>{carDetails["Roof Rails"] ? "Dual-Tone Roof Rails" : "N/A"}</li>
                  <li>{carDetails["Turn Indicators on ORVM"] ? "Electrically Adjustable ORVMs with LED Turn Indicators" : "N/A"}</li>
                  <li>{carDetails["Wheel Size (inch)"] ? `Wheel Covers on ${carDetails["Wheel Size (inch)"]}-inch Steel Wheels` : "N/A"}</li>
                </ul>

                <h3 className="text-md font-semibold mb-2">Comfort & Convenience</h3>
                <ul className="list-disc ml-6 mb-4">
                  <li>{carDetails["Automatic Climate Control"] ? "Automatic Climate Control" : "N/A"}</li>
                  <li>{carDetails["Rear Armrest"] ? "Rear Seat Armrest with Cup Holders" : "N/A"}</li>
                  <li>{carDetails["Parking Sensors"] ? "Rear Parking Sensors" : "N/A"}</li>
                  <li>{carDetails["Bootlid Opener"] ? "Electric Tailgate Release" : "N/A"}</li>
                  <li>{carDetails["Central Locking"] ? "Remote Central Locking" : "N/A"}</li>
                </ul>

                <h3 className="text-md font-semibold mb-2">Safety</h3>
                <ul className="list-disc ml-6 mb-4">
                  <li>{carDetails["Airbags"] ? `Dual Front Airbags (${carDetails["Airbags"]})` : "N/A"}</li>
                  <li>{carDetails["Anti-Lock Braking System (ABS)"] && carDetails["Electronic Brake-force Distribution (EBD)"] ? "ABS with EBD" : "N/A"}</li>
                  <li>{carDetails["Electronic Stability Program (ESP)"] ? "Corner Stability Control" : "N/A"}</li>
                  <li>{carDetails["Child Seat Anchor Points"] ? "ISOFIX Child Seat Mounts" : "N/A"}</li>
                  <li>{carDetails["Parking Assist"] ? "Reverse Parking Assist" : "N/A"}</li>
                  <li>{carDetails["Seat Belt Warning"] ? "Seat Belt Reminder (Driver and Co-Driver)" : "N/A"}</li>
                </ul>

                <h3 className="text-md font-semibold mb-2">Additional Highlights</h3>
                <ul className="list-disc ml-6 mb-4">
                  <li>{carDetails["Follow me home headlamps"] ? "Follow-Me-Home Headlamps" : "N/A"}</li>
                  <li>{carDetails["Drive Modes"] ? `Multi-Drive Modes (${carDetails["Drive Modes"]})` : "N/A"}</li>
                  {/* <li>Nexon Signature Grille</li> */}
                  <li>{carDetails["Keyless Start"] ? "Smart Key with Push Button Start" : "N/A"}</li>
                </ul>
              </div>

              <div className="w-full md:w-1/2">
                <h3 className="text-md font-semibold mb-2">Interior</h3>
                <ul className="list-disc ml-6 mb-4">
                  <li>{carDetails["Seat Upholstery"] ? `Premium ${carDetails["Seat Upholstery"]} Upholstery` : "N/A"}</li>
                  <li>{carDetails["Rear AC"] ? "Rear AC Vents" : "N/A"}</li>
                  <li>{carDetails["Driver Seat Adjustment"] ? "Height Adjustable Driver Seat" : "N/A"}</li>
                  <li>{carDetails["Steering Adjustment"] ? "Tilt Adjustable Steering Wheel" : "N/A"}</li>
                  <li>{carDetails["Power Windows"] ? "Front and Rear Power Windows" : "N/A"}</li>
                </ul>

                <h3 className="text-md font-semibold mb-2">Infotainment</h3>
                <ul className="list-disc ml-6 mb-4">
                  <li>{carDetails["Speakers"] ? `Harman-Infotainment System with ${carDetails["Speakers"]} Speakers` : "N/A"}</li>
                  <li>{carDetails["Steering Mounted Controls"] ? "Steering Mounted Audio Controls" : "N/A"}</li>
                  <li>{carDetails["USB Compatibility"] && carDetails["Aux Compatibility"] ? "USB and AUX Ports" : "N/A"}</li>
                  <li>{carDetails["AM/FM Radio"] ? "Radio and MP3 Playback" : "N/A"}</li>
                </ul>

                <h3 className="text-md font-semibold mb-2">Engine & Performance</h3>
                <ul className="list-disc ml-6 mb-4">
                  <li>{carDetails["Engine Type"] ? `Engine Type: ${carDetails["Engine Type"]}` : "N/A"}</li>
                  <li>{carDetails["Engine Power (cc)"] ? `Displacement: ${carDetails["Engine Power (cc)"]} cc` : "N/A"}</li>
                  <li>{carDetails["Max Power (bhp)"] && carDetails["Max Power (rpm)"] ? `Power Output: ${carDetails["Max Power (bhp)"]} PS @ ${carDetails["Max Power (rpm)"]} RPM` : "N/A"}</li>
                  <li>{carDetails["Max Torque (Nm)"] && carDetails["Max Torque (rpm)"] ? `Torque: ${carDetails["Max Torque (Nm)"]} Nm @ ${carDetails["Max Torque (rpm)"]} RPM` : "N/A"}</li>
                  <li>{carDetails["Transmission Type"] && carDetails["Transmission Specification"] ? `Transmission: ${carDetails["Transmission Type"]}, ${carDetails["Transmission Specification"]}` : "N/A"}</li>
                </ul>

                <h3 className="text-md font-semibold mb-2">Dimensions & Capacity</h3>
                <ul className="list-disc ml-6 mb-4">
                  <li>{carDetails["Length (mm)"] ? `Length: ${carDetails["Length (mm)"]} mm` : "N/A"}</li>
                  <li>{carDetails["Width(mm)"] ? `Width: ${carDetails["Width(mm)"]} mm` : "N/A"}</li>
                  <li>{carDetails["Height(mm)"] ? `Height: ${carDetails["Height(mm)"]} mm` : "N/A"}</li>
                  <li>{carDetails["Wheelbase(mm)"] ? `Wheelbase: ${carDetails["Wheelbase(mm)"]} mm` : "N/A"}</li>
                  <li>{carDetails["Ground Clearance (cm)"] ? `Ground Clearance: ${carDetails["Ground Clearance (cm)"]} mm` : "N/A"}</li>
                  <li>{carDetails["Bootspace(litres)"] ? `Boot Space: ${carDetails["Bootspace(litres)"]} liters` : "N/A"}</li>
                  <li>{carDetails["Fuel Tank Capacity"] ? `Fuel Tank Capacity: ${carDetails["Fuel Tank Capacity"]} liters` : "N/A"}</li>
                </ul>
              </div>
            </div>
          </>
        )}



//////////////////////////////////////////////////////////////////////////////////////
        {/* Car Overview Section */}
        {/* <hr className="border-t border-blue-600 mb-4" />
        <h2 className="text-lg font-semibold mb-3">E. Customization Suggestions</h2>
        <p className="mb-4 text-sm leading-relaxed">{customizationSuggestions}</p> */}



        {/* Car Overview Section */}
        <hr className="border-t border-blue-600 mb-4" />
        <h2 className="text-lg font-semibold mb-3">F. Customization Suggestions</h2>

        {/* Properly format and display customization suggestions */}
        <div className="mb-4 text-sm leading-relaxed">
          {customizationSuggestions.split('\n').map((line, index) => {
            // Check if the line is a heading (doesn't start with a number or bullet point)
            const isHeading = !/^[0-9]/.test(line.trim()) && line.trim().length > 0;

            return (
              <p
                key={index}
                className={`${isHeading ? 'font-bold mb-2' : 'ml-4 mb-1'}`}
              >
                {line.trim()}
              </p>
            );
          })}
        </div>


/////////////////////////////////////////////////////////////////////////////////////
          {/* Financial Overview Section */}
          <hr className="border-t border-blue-600 mb-4" />
          <h2 className="text-lg font-semibold mb-3">G. Financial Overview</h2>

          {/* Vehicle Cost Details */}
          <p className="mb-2 text-sm">
            <strong>Vehicle Cost (Showroom Price):</strong> ₹{carDetails["Ex-Showroom Price"]} lakhs
          </p>

          {/* Customization cost (fixed) */}
          <p className="mb-2 text-sm"><strong>Customization cost:</strong> ₹6,103</p>

          {/* Total cost (calculated as vehicle cost + some fixed value) */}
          <p className="mb-2 text-sm">
            <strong>Total Cost:</strong> ₹{(carDetails["Ex-Showroom Price"] + 0.6).toFixed(2)} lakhs (including taxes and fees)
          </p>

          {/* On-road Price (using the Mumbai field from CarSpecificationDataset) */}
          <p className="mb-2 text-sm">
            <strong>On-Road Price:</strong> ₹{carDetails.Mumbai / 100000} lakhs (includes registration, road tax, and insurance)
          </p>

          {/* Financing Options */}
          <h3 className="mt-4 mb-2 text-md font-semibold">Financing Options</h3>
          <table className="table-auto w-full mb-4 border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Options</th>
                <th className="border border-gray-300 p-2">Standard Loan</th>
                <th className="border border-gray-300 p-2">Flexi Loan</th>
                <th className="border border-gray-300 p-2">Balloon Payment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">Intrest Rate</td>
                <td className="border border-gray-300 p-2">3.5% APR</td>
                <td className="border border-gray-300 p-2">3.8% APR</td>
                <td className="border border-gray-300 p-2">3.2% APR</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">LOAN TERM</td>
                <td className="border border-gray-300 p-2">5 Years</td>
                <td className="border border-gray-300 p-2">Up to 7 Years</td>
                <td className="border border-gray-300 p-2">3 Years</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">EMI (Estimated Monthly Installment)</td>
                <td className="border border-gray-300 p-2">₹15,366</td>
                <td className="border border-gray-300 p-2">₹12,594 (For a 7-year term)</td>
                <td className="border border-gray-300 p-2">₹14,575 (30% of the total cost at the end of the term)</td>
              </tr>
            </tbody>
          </table>

          {/* Insurance Options */}
          <h3 className="mt-4 mb-2 text-md font-semibold">Insurance Options</h3>
          <ul className="list-disc ml-8 mb-4 text-sm">
            <li>
              <strong>Comprehensive Insurance:</strong> ₹25,000 per year (includes third-party liability, own damage, and personal accident cover)
            </li>
            <li>
              <strong>Third-Party Insurance:</strong> ₹8,000 per year (minimum legal requirement)
            </li>
          </ul>

          {/* Down Payment and Amount Financed */}
          
          {/* <h3 className="mt-4 mb-2 text-md font-semibold">Down Payment</h3> */}
          <table className="table-auto w-full mb-4 border-collapse border border-gray-300">
          <thead>
              <tr>
                <th className="border border-gray-300 p-2">Options</th>
                <th className="border border-gray-300 p-2">Standard Loan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">
                  <ul className="list-disc ml-4 text-sm">
                    <li>Minimum Down Payment: 20% of On-Road Price</li>
                    <li>Amount: ₹{(carDetails.Mumbai * 0.2 / 100000).toFixed(2)} lakhs</li>
                  </ul>
                </td>
                <td className="border border-gray-300 p-2">
                  <ul className="list-disc ml-4 text-sm">
                    <li><strong>Option 1:</strong> ₹{(carDetails.Mumbai * 0.8 / 100000).toFixed(2)} lakhs</li>
                    <li><strong>Option 2:</strong> ₹{(carDetails.Mumbai * 0.8 / 100000).toFixed(2)} lakhs</li>
                    <li><strong>Option 3:</strong> ₹{(carDetails.Mumbai * 0.8 / 100000).toFixed(2)} lakhs (excluding balloon payment)</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Final Text Part */}
          <p className="text-sm leading-relaxed">
            These options provide a range of choices for financing your {carDetails.Model} {carDetails.Version}, allowing flexibility based on your financial preferences and needs. For further details and to choose the best option, please contact our finance team.
          </p>

///////////////////////////////////////////////////////////////////////////////////////////////
        {/* Proposal Summary Section */}
        <hr className="border-t border-blue-600 mb-4" />
        <h2 className="text-lg font-semibold mb-3">H. Proposal Summary</h2>
        <p className="mb-4 text-sm leading-relaxed">{proposalSummary}</p>


///////////////////////////////////////////////////////////////////////////////////////////////
        {/* Conclusion Section */}
        <hr className="border-t border-blue-600 mb-4" />
        <h2 className="text-lg font-semibold mb-3">I. Conclusion</h2>
        <p className="mb-4 text-sm leading-relaxed">{conclusion}</p>


///////////////////////////////////////////////////////////////////////////////////////////////

        {/* Footer Section */}
        <div className="mt-4 pt-4 border-t border-blue-600 text-sm flex justify-between items-center">
          <span>
            <strong>Date:</strong> {getCurrentDate()}
          </span>
          <span>
            <strong>Generated By:</strong> {generatedByEmail}
          </span>
          <span>Page 1 of 1</span>
        </div>
      </div>

      {/* Button Container */}
      <div className="flex justify-between w-full max-w-4xl mt-6">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="px-8 py-2 text-lg font-semibold text-indigo-700 border border-indigo-700 rounded-lg hover:bg-indigo-100 transition duration-300"
        >
          Back to Recommendation
        </button>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="px-8 py-2 text-lg font-semibold text-gray-700 border border-gray-400 rounded-lg hover:bg-gray-100 transition duration-300"
        >
          Print Proposal
        </button>

        {/* Validate Proposal Button */}
        <button
          onClick={handleValidate}
          className="px-8 py-2 text-lg font-semibold text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Validate Proposal
        </button>
      </div>
    </div>
  );
};

export default PreviewProposal;
