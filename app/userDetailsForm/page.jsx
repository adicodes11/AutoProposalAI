"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const UserDetailForm = () => {
  const [formData, setFormData] = useState({
    designation: "Mr.",
    fullName: "",
    dob: "",
    gender: "",
    nationality: "Indian",
    mobileNo: "",
    email: "",
    residentialAddress: "",
  });
  const [errors, setErrors] = useState({});
  const [sessionId, setSessionId] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [selectedCarModel, setSelectedCarModel] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("");
  const router = useRouter();

  // Fetch session storage data
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem("sessionId");
    const storedCreatedBy = sessionStorage.getItem("userId");
    const storedCarModel = sessionStorage.getItem("selectedCarModel");
    const storedVersion = sessionStorage.getItem("selectedVersion");

    if (storedSessionId) setSessionId(storedSessionId);
    if (storedCreatedBy) setCreatedBy(storedCreatedBy);
    if (storedCarModel) setSelectedCarModel(storedCarModel);
    if (storedVersion) setSelectedVersion(storedVersion);

    if (!storedSessionId || !storedCreatedBy) {
      alert("Session or user information not found. Please log in.");
      router.push("/signin");
    }
  }, [router]);

  // Form validation logic
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required.";
    if (!formData.dob) newErrors.dob = "Date of Birth is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.mobileNo || !/^\d{10}$/.test(formData.mobileNo))
      newErrors.mobileNo = "Please enter a valid 10-digit mobile number.";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email address.";
    if (!formData.residentialAddress)
      newErrors.residentialAddress = "Residential Address is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const bodyData = {
      ...formData,
      sessionId,
      createdBy,
      selectedCarModel, // Pass car model
      selectedVersion, // Pass car version
    };

    try {
      // Redirect to "generating" page immediately after form submission
      router.push("/generating");

      // Step 1: Submit user details to the Next.js API route
      const response = await fetch("/api/userDetailsFormRoute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const data = await response.json();
        alert("Error saving user details: " + data.error);
        return;
      }

      alert("User details saved successfully.");

      // Step 2: Trigger the Python API to generate the proposal
      const pythonResponse = await fetch("https://aiproposalcontentgeneration-production.up.railway.app/generateProposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionId,
          createdBy: createdBy,
          carModelName: selectedCarModel,
          versionName: selectedVersion,
        }),
      });

      if (pythonResponse.ok) {
        const result = await pythonResponse.json();
        console.log("Proposal generated:", result);
      } else {
        alert("Error generating the proposal.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the details or generating the proposal.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center py-12 px-6 sm:px-10 lg:px-8">
      <div className="max-w-3xl w-full bg-white p-10 rounded-xl shadow-md space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">User Details</h2>
          <p className="mt-2 text-lg text-gray-500">Fill in your details to proceed</p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="block w-full mt-1 p-3 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              >
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Mrs.">Mrs.</option>
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="block w-full mt-1 p-3 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>
          </div>

          {/* Date of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="block w-full mt-1 p-3 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              />
              {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="block w-full mt-1 p-3 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nationality</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              readOnly
              className="block w-full mt-1 p-3 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile No.</label>
              <input
                type="tel"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                className="block w-full mt-1 p-3 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                maxLength={10}
                placeholder="Enter your mobile number"
              />
              {errors.mobileNo && <p className="text-red-500 text-xs mt-1">{errors.mobileNo}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email ID</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full mt-1 p-3 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Residential Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Residential Address</label>
            <textarea
              name="residentialAddress"
              value={formData.residentialAddress}
              onChange={handleChange}
              className="block w-full mt-1 p-3 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              placeholder="Enter your residential address"
            />
            {errors.residentialAddress && <p className="text-red-500 text-xs mt-1">{errors.residentialAddress}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDetailForm;
