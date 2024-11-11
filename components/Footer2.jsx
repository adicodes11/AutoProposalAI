"use client"; // Mark this component as a Client Component

import React from 'react';
import Link from 'next/link'; // Import Link from next/link

const Footer2 = () => {
  return (
    <footer className="flex justify-between items-center p-4 bg-white text-gray-700 mt-4">
      {/* Left Side */}
      <div className="text-sm flex items-center space-x-4 text-blue-600 mr-12"> {/* Added margin-right */}
        <Link href="/terms" className="hover:underline hover:text-blue-700">Terms & Conditions</Link>
        <span className="text-black">|</span>
        <Link href="/privacy" className="hover:underline hover:text-blue-700">Privacy Policy</Link>
        <span className="text-black">|</span>
        <Link href="/accessibility" className="hover:underline hover:text-blue-700">Accessibility</Link>
        <span className="text-black">|</span>
        <Link href="/contactUs" className="hover:underline hover:text-blue-700">Contact Us</Link>
      </div>

      {/* Right Side */}
      <div className="text-sm text-gray-600">
        © 2024, Auto Proposal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer2;
