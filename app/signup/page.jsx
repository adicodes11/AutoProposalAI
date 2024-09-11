"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('User registered successfully!');
        
        // Save the user's first name and sessionId to session storage
        const firstName = formData.fullname.split(' ')[0];
        sessionStorage.setItem('firstName', firstName);
        sessionStorage.setItem('sessionId', data.sessionId);  // Save sessionId to sessionStorage

        setTimeout(() => {
          router.push('/signin'); // Redirect to the sign-in page after a short delay
        }, 1500); // Adjust the delay as needed
      } else {
        setMessage(data.error); // Display error message from the server
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-grow flex-col justify-center items-center bg-white pt-16">
        <h1 className="text-3xl font-bold mb-6">Create a new account</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded shadow-lg">
          <div className="mb-4">
            <label htmlFor="fullname" className="block text-gray-700 font-bold mb-2">Full Name</label>
            <input
              type="text"
              name="fullname"
              id="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Sign Up
          </button>
          <p
            style={{
              opacity: message ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
              color: message.includes('successfully') ? 'green' : 'red'
            }}
            className="mt-4 text-center"
          >
            {message}
          </p>
        </form>
        <p className="mt-6 text-gray-600">
          Already have an account?{' '}
          <a href="/signin" className="text-blue-500 hover:underline">
            Sign in Now
          </a>
        </p>
      </div>
      <div style={{ paddingTop: '20rem' }}>
        <Footer />
      </div>
    </div>
  );
}
