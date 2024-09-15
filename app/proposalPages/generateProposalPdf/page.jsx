"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer2 from '@/components/Footer2';

const GenerateProposalPdf = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGenerateProposal = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/proposalRoutes/generateProposalPdfRoute');
      if (response.ok) {
        const data = await response.json();
        console.log('Proposal generated:', data);
        router.push(data.proposalLink);  // Navigate to the previewProposal page
      } else {
        alert('Failed to generate proposal.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while generating the proposal.');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-11 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Generate Your Proposal</h1>
        <button
          onClick={handleGenerateProposal}
          className="px-6 py-3 border border-blue-500 rounded-md text-white font-bold bg-blue-500 hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Proposal'}
        </button>
      </div>
      <Footer2 />
    </div>
  );
};

export default GenerateProposalPdf;
