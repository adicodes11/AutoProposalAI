'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in
  const router = useRouter();

  // Check if sessionId exists in sessionStorage
  useEffect(() => {
    const sessionId = sessionStorage.getItem('sessionId'); // Get sessionId from sessionStorage
    if (sessionId) {
      setIsLoggedIn(true); // Set user as logged in if sessionId exists
    } else {
      setIsLoggedIn(false); // Set user as logged out if no sessionId
    }
  }, []);

  // Function to handle login/logout
  const handleLoginClick = () => {
    if (isLoggedIn) {
      // Logout functionality
      sessionStorage.clear(); // Clear all sessionStorage items (including sessionId and other stored data)

      // Redirect to home page after logout
      router.push('/');
      setIsLoggedIn(false); // Update state to logged out
    } else {
      // Navigate to login page if not logged in
      router.push('/signin');
    }
  };

  // Listen for back button events and redirect if logged out
  useEffect(() => {
    const handlePopState = () => {
      const sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        router.push('/signin'); // Redirect to signin if sessionId is missing
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup event listener when component unmounts
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  return (
    <div className="py-5 px-5 md:px-12 lg:px-20">
      <div className="flex justify-between items-center">
        {/* Logo or Title */}
        <Image src={assets.logo} width={150} height={100} alt="logo.png" className="w-[130px] sm:w-auto" />
        
        {/* Button Container */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <span className="font-bold text-lg py-1 px-3 text-gray-800 hover:text-blue-500 transition-colors duration-300 cursor-pointer">
              Home
            </span>
          </Link>
          <Link href="/about">
            <span className="font-bold text-lg py-1 px-3 text-gray-800 hover:text-blue-500 transition-colors duration-300 cursor-pointer">
              About Us
            </span>
          </Link>
          <Link href="/contact">
            <span className="font-bold text-lg py-1 px-3 text-gray-800 hover:text-blue-500 transition-colors duration-300 cursor-pointer">
              Contact Us
            </span>
          </Link>
          <Link href="/help">
            <span className="font-bold text-lg py-1 px-3 text-gray-800 hover:text-blue-500 transition-colors duration-300 cursor-pointer">
              Help
            </span>
          </Link>
          <button
            className="font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black text-black hover:bg-black hover:text-white transition-colors duration-300"
            onClick={handleLoginClick}
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
