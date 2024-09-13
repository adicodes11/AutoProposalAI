"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ValidateProposalPage = () => {
  const [fullName, setFullName] = useState('');
  const [signature, setSignature] = useState(null); // Will hold the processed signature image without background
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Simulate a userId for now, in practice this would come from session or auth
  const userId = 'your_user_id_here'; 

  const handleNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handleSignatureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      // Call your backend API to remove the background using remove.bg and handle the upload
      const formData = new FormData();
      formData.append('image', file);
      formData.append('fullName', fullName);
      formData.append('userId', userId);

      const response = await fetch('/api/validateProposalRoute', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSignature(data.cleanedImageUrl); // Assuming the API returns the cleaned image URL
        alert('Proposal validated successfully!');
        router.push('/some_next_page'); // Navigate to the next page
      } else {
        alert('Failed to validate the proposal. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while uploading the signature.');
    }

    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!fullName || !signature) {
      alert('Please provide both your full name and signature.');
      return;
    }

    try {
      const response = await fetch('/api/validateProposalRoute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, signatureUrl: signature, userId }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Proposal validated!');
        router.push('/some_next_page'); // Navigate to the next page
      } else {
        alert('Failed to validate the proposal. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">Validate Your Proposal with Signature</h1>

      <div className="flex justify-center w-full max-w-lg mb-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="signatureType"
            className="mr-2"
            checked
            readOnly
          />
          Upload Signature
        </label>
      </div>

      <div className="w-full max-w-lg mb-4">
        <input
          type="text"
          placeholder="Type your Full Name Here"
          value={fullName}
          onChange={handleNameChange}
          className="border border-gray-300 p-3 w-full rounded-md mb-2"
        />
        <input type="file" accept="image/*" onChange={handleSignatureUpload} className="w-full mb-2" />

        {loading && <p>Processing your signature, please wait...</p>}

        {signature && (
          <div className="mt-4">
            <img src={signature} alt="Signature Preview" className="w-full max-h-40 object-contain" />
          </div>
        )}
      </div>

      <div className="flex justify-between w-full max-w-lg mt-4">
        <button
          onClick={() => router.push('/previousPage')}
          className="px-6 py-2 border border-blue-700 text-blue-700 font-bold rounded-md hover:bg-blue-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-yellow-500 text-white font-bold rounded-md hover:bg-yellow-600"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ValidateProposalPage;
