// 'use client' directive to mark this as a Client Component
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Image for handling SVGs
import { assets } from '@/assets/assets';

function Footer() {
  return (
    <div className='py-10 px-5 md:px-12 lg:px-28 bg-gray-100 text-black'>
      <div className='flex flex-col md:flex-row justify-between'>

        {/* Branding Section */}
        <div className='mb-8 md:mb-0'>
          <Image src={assets.logo} alt='Auto Proposal AI' width={150} height={100} className='mb-4' />
          <p className='text-gray-700'>Personalize your car purchase experience with AI-driven custom proposals.</p>
        </div>

        {/* Key Links */}
        <div className='flex flex-col md:flex-row gap-10'>
          <div>
            <h4 className='font-semibold mb-4'>Services</h4>
            <ul className='space-y-2'>
              <li>
                <Link href='/custom-proposals'>
                  <span className='text-gray-800 hover:text-blue-500 cursor-pointer transition-colors duration-300'>Custom Proposals</span>
                </Link>
              </li>
              <li>
                <Link href='/car-models'>
                  <span className='text-gray-800 hover:text-blue-500 cursor-pointer transition-colors duration-300'>Car Models</span>
                </Link>
              </li>
              <li>
                <Link href='/pricing'>
                  <span className='text-gray-800 hover:text-blue-500 cursor-pointer transition-colors duration-300'>Pricing</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className='font-semibold mb-4'>Company</h4>
            <ul className='space-y-2'>
              <li>
                <Link href='/aboutUs'>
                  <span className='text-gray-800 hover:text-blue-500 cursor-pointer transition-colors duration-300'>About Us</span>
                </Link>
              </li>
              <li>
                <Link href='/contactUs'>
                  <span className='text-gray-800 hover:text-blue-500 cursor-pointer transition-colors duration-300'>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link href='/privacy-policy'>
                  <span className='text-gray-800 hover:text-blue-500 cursor-pointer transition-colors duration-300'>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className='flex gap-4 mt-8 md:mt-0'>
          <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
            <Image src={assets.facebook_icon} alt='Facebook' width={24} height={24} className='hover:opacity-80 transition-opacity duration-300' />
          </a>
          <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
            <Image src={assets.twitter_icon} alt='Twitter' width={24} height={24} className='hover:opacity-80 transition-opacity duration-300' />
          </a>
          <a href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
            <Image src={assets.instagram_icon} alt='Instagram' width={24} height={24} className='hover:opacity-80 transition-opacity duration-300' />
          </a>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className='text-center mt-10'>
        <p className='text-sm'>&copy; {new Date().getFullYear()} Auto Proposal AI. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
