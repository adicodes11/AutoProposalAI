"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Footer2 from '@/components/Footer2';
import logo from '/assets/logo.png';  // Update with your actual logo path

const PreviewProposal = () => {
  const [proposalData, setProposalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reference to the proposal content that will be printed
  const printRef = useRef();

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await fetch('/api/proposalRoutes/proposalPreviewRoute');
        if (response.ok) {
          const data = await response.json();
          setProposalData(data);
        } else {
          throw new Error('Failed to fetch proposal data.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, []);

  // Function to handle the printing of the proposal content
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();  // Reload to restore the original content
  };

  // Get current date and time for footer
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleString();  // Format: MM/DD/YYYY, HH:MM:SS AM/PM
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading proposal...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 flex flex-col items-center justify-between h-screen relative">
      {/* Proposal content wrapped in a bordered container */}
      <div ref={printRef} className="p-4 border border-gray-300 rounded-lg shadow-md bg-white w-full max-w-4xl">
        
        {/* Include header inside the printed content */}
        <div className="w-full flex justify-between items-center mb-6">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Image src={logo} alt="Innovators Logo" width={60} height={60} />
          </div>

          {/* Center: Title */}
          <div className="flex-grow flex justify-center">
            <span className="text-2xl font-semibold text-blue-600">Gen AI Based Customized Car Proposal</span>
          </div>

          {/* Right: PID */}
          <div className="text-gray-600 font-medium">
            PID: 20240728-AC-001
          </div>
        </div>
        <hr/>
        {/* 1. Important Section */}
        <h2 className="text-xl font-bold mb-4">Important</h2>
        <ul className="list-disc ml-6 mb-8">
          <li>Please review the entire proposal thoroughly to understand the features, specifications, and customizations offered.</li>
          <li>All prices and offers mentioned in this proposal are indicative and subject to confirmation by the respective car manufacturer or dealer.</li>
          <li>This proposal is valid for 30 days from the date of generation and may be subject to changes based on updated data or customer preferences.</li>
        </ul>
        <hr/>
        {/* 2. Customer Details */}
        <h2 className="text-xl font-bold mb-4">Customer Details</h2>
        <table className="table-auto w-full mb-8 border-collapse border border-gray-300">
          <tbody>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Name:</td>
              <td className="border border-gray-300 p-2">{proposalData.customer_details.name}</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Date of Birth:</td>
              <td className="border border-gray-300 p-2">{proposalData.customer_details.dob}</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Gender:</td>
              <td className="border border-gray-300 p-2">{proposalData.customer_details.gender}</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Nationality:</td>
              <td className="border border-gray-300 p-2">{proposalData.customer_details.nationality}</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Phone:</td>
              <td className="border border-gray-300 p-2">{proposalData.customer_details.phone}</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Email:</td>
              <td className="border border-gray-300 p-2">{proposalData.customer_details.email}</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Address:</td>
              <td className="border border-gray-300 p-2">{proposalData.customer_details.address}</td>
            </tr>
          </tbody>
        </table>
        <hr/>
        {/* 3. Proposal Overview1 */}
        <h2 className="text-xl font-bold mb-4">Proposal Overview </h2>
        <p className="mb-8">
          We are excited to present your customized car proposal, tailored to meet your specific preferences and requirements.
          Based on the details you provided, this proposal highlights the features and benefits of the Tata Nexon XM, ensuring
          you have all the necessary information to make an informed decision.
          At Tata Motors, we strive to offer innovative, high-performance vehicles that deliver exceptional value. Your chosen
          Tata Nexon XM exemplifies our commitment to quality and customer satisfaction.
        </p>
        <hr/>
       
        {/* 5. Recommended Car */}
        <h2 className="text-xl font-bold mb-4">Recommended Car</h2>
        <p className="mb-8">
          We are delighted to present you with a customized proposal for the TATA NEXON XM that perfectly fits your
          specified requirements and budget. The TATA NEXON XM, known for its robust design and advanced features, is an
          ideal choice for those seeking both style and performance.
        </p>
        <div className="flex mb-8">
          <div className="w-2/3">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="font-semibold border border-gray-300 p-2">Car Name:</td>
                  <td className="border border-gray-300 p-2">{proposalData.recommended_car.car_name}</td>
                </tr>
                <tr>
                  <td className="font-semibold border border-gray-300 p-2">Price:</td>
                  <td className="border border-gray-300 p-2">{proposalData.recommended_car.price}</td>
                </tr>
                <tr>
                  <td className="font-semibold border border-gray-300 p-2">Fuel Type:</td>
                  <td className="border border-gray-300 p-2">{proposalData.recommended_car.fuel_type}</td>
                </tr>
                <tr>
                  <td className="font-semibold border border-gray-300 p-2">Transmission:</td>
                  <td className="border border-gray-300 p-2">{proposalData.recommended_car.transmission}</td>
                </tr>
                <tr>
                  <td className="font-semibold border border-gray-300 p-2">Mileage:</td>
                  <td className="border border-gray-300 p-2">{proposalData.recommended_car.mileage}</td>
                </tr>
                <tr>
                  <td className="font-semibold border border-gray-300 p-2">Engine Capacity:</td>
                  <td className="border border-gray-300 p-2">{proposalData.recommended_car.engine.capacity}</td>
                </tr>
                <tr>
                  <td className="font-semibold border border-gray-300 p-2">Safety Rating:</td>
                  <td className="border border-gray-300 p-2">{proposalData.recommended_car.safety_rating}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Right: Placeholder for Car Image */}
          <div className="w-1/3 flex justify-center items-center">
            <img
              src="/path-to-your-car-image-placeholder.png"  // Placeholder image path
              alt="Car Image"
              className="w-48 h-32 object-cover border rounded-md"
            />
          </div>
        </div>
        <hr/>
        {/* 6. Key Highlights */}
        <h2 className="text-xl font-bold mb-4">Key Highlights</h2>
        <table className="table-auto w-full mb-8 border-collapse border border-gray-300">
          <tbody>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Exterior:</td>
              <td className="border border-gray-300 p-2">{proposalData.key_highlights.exterior.join(', ')}</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Interior:</td>
              <td className="border border-gray-300 p-2">{proposalData.key_highlights.interior.join(', ')}</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Comfort & Convenience:</td>
              <td className="border border-gray-300 p-2">{proposalData.key_highlights.comfort_and_convenience.join(', ')}</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Safety:</td>
              <td className="border border-gray-300 p-2">{proposalData.key_highlights.safety.join(', ')}</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Additional Highlights:</td>
              <td className="border border-gray-300 p-2">{proposalData.key_highlights.additional_highlights.join(', ')}</td>
            </tr>
          </tbody>
        </table>
        <hr/>
        {/* 7. Specifications */}
        <h2 className="text-xl font-bold mb-4">Specifications</h2>
        <table className="table-auto w-full mb-8 border-collapse border border-gray-300">
          <tbody>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Price:</td>
              <td className="border border-gray-300 p-2">{proposalData.specifications.price}</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Fuel Type:</td>
              <td className="border border-gray-300 p-2">{proposalData.specifications.fuel_type}</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Transmission:</td>
              <td className="border border-gray-300 p-2">{proposalData.specifications.transmission}</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Mileage:</td>
              <td className="border border-gray-300 p-2">{proposalData.specifications.mileage}</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Engine:</td>
              <td className="border border-gray-300 p-2">{proposalData.specifications.engine.capacity} ({proposalData.specifications.engine.type})</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Dimensions:</td>
              <td className="border border-gray-300 p-2">{`Length: ${proposalData.specifications.dimensions.length}, Width: ${proposalData.specifications.dimensions.width}, Height: ${proposalData.specifications.dimensions.height}, Wheelbase: ${proposalData.specifications.dimensions.wheelbase}`}</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Safety Rating:</td>
              <td className="border border-gray-300 p-2">{proposalData.specifications.safety_rating}</td>
            </tr>
          </tbody>
        </table>
        <hr/>
        {/* 8. Financial Overview */}
        <h2 className="text-xl font-bold mb-4">Financial Overview</h2>
        <table className="table-auto w-full mb-8 border-collapse border border-gray-300">
          <tbody>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Vehicle Cost:</td>
              <td className="border border-gray-300 p-2">{proposalData.financial_overview.vehicle_cost}</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Customization Cost:</td>
              <td className="border border-gray-300 p-2">{proposalData.financial_overview.customization_cost}</td>
            </tr>
            <tr>
              <td className="font-semibold border border-gray-300 p-2">Total Cost:</td>
              <td className="border border-gray-300 p-2">{proposalData.financial_overview.total_cost}</td>
            </tr>
          </tbody>
        </table>
        <hr/>
        {/* 9. Proposal Summary */}
        <h2 className="text-xl font-bold mb-4">Proposal Summary</h2>
        <p className="mb-8">
          We are pleased to present the Tata Nexon XM, a versatile SUV within your budget of ₹5,00,000 - ₹10,00,000, perfect for daily
          commuting and family trips. This 5-seater, powered by a 1.5L petrol engine with a manual transmission, offers a smooth and
          comfortable driving experience. Key features include climate control, power windows, keyless entry, a sunroof, a 7-inch
          touchscreen, Bluetooth, and navigation.
        </p>
        <hr/>
        {/* 10. Conclusion */}
        <h2 className="text-xl font-bold mb-4">Conclusion</h2>
        <p>
          We are delighted to present the TATA NEXON, a vehicle meticulously designed to meet your needs and exceed your
          expectations. This SUV blends cutting-edge technology, exceptional comfort, and unparalleled style, making it an
          excellent choice for your journey ahead.
        </p>
        <hr/>
        {/* Footer Section */}
        <div className="mt-6 pt-4 border-t border-gray-300 text-sm flex justify-between items-center">
          <span><strong>Date:</strong> {getCurrentDate()}</span>
          <span><strong>Generated By:</strong> teaminnovators@gmail.com</span>
          <span>Page 1 of 1</span> {/* You can adjust this to dynamically display page numbers if using a PDF library */}
        </div>
      </div>

      {/* Button to trigger the print function */}
      <button
        onClick={handlePrint}
        className="mt-6 px-4 py-2 border border-blue-500 rounded-md text-white font-bold bg-blue-500 hover:bg-blue-600"
      >
        Download Proposal
      </button>
    </div>
  );
};

export default PreviewProposal;
