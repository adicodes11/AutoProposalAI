"use client";

import React, { useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets"; // Replace with correct path to your assets

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null); // State to handle error messages

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const response = await fetch('/api/contactRoute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true); // Show success message
        setFormData({ name: '', email: '', message: '' }); // Reset form
        setError(null); // Clear any previous error
      } else {
        throw new Error(result.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setError('Failed to send your message. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-blue-900 to-gray-900 text-white">
      {/* Header Section */}
      <header className="py-12 px-8 text-center">
        <Image src={assets.logo} alt="AutoProposalAI Logo" width={150} height={100} />
        <h1 className="text-5xl font-bold mt-4">Contact AutoProposalAI</h1>
        <p className="text-lg mt-2">We’re here to help you</p>
      </header>

      {/* Main Content Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-8 py-12">
        <section className="max-w-5xl w-full mb-12">
          <h2 className="text-3xl font-semibold text-center mb-6">Get in Touch</h2>
          <p className="text-lg leading-relaxed text-center text-gray-200 mb-10">
            We’d love to hear from you. Whether you have a question, a suggestion, or just want to get in touch, fill out the form below and our team will get back to you as soon as possible.
          </p>

          {/* Contact Form */}
          <div className="w-full max-w-lg mx-auto bg-white bg-opacity-10 backdrop-blur-lg shadow-lg rounded-lg p-8 text-center border border-gray-500 border-opacity-20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="w-full p-4 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-md bg-gray-800 bg-opacity-40 text-gray-200 placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className="w-full p-4 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-md bg-gray-800 bg-opacity-40 text-gray-200 placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message"
                  className="w-full h-36 p-4 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-md resize-none bg-gray-800 bg-opacity-40 text-gray-200 placeholder-gray-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold rounded-full shadow-2xl hover:shadow-pink-600 hover:scale-105 transition-transform transform hover:from-yellow-500 hover:to-pink-500 focus:ring-4 focus:ring-yellow-300 focus:outline-none"
              >
                Send Message
              </button>
            </form>

            {/* Success Message */}
            {submitted && (
              <div className="mt-6 text-lg font-semibold text-green-400 animate-pulse">
                Thank you for reaching out! We’ll get back to you soon.
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 text-lg font-semibold text-red-400 animate-pulse">
                {error}
              </div>
            )}
          </div>
        </section>

        {/* Contact Information */}
        <section className="max-w-5xl w-full mb-12">
          <h2 className="text-3xl font-semibold text-center mb-6">Our Contact Information</h2>
          <div className="flex flex-col md:flex-row justify-around text-gray-200 space-y-8 md:space-y-0">
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-2">Head Office</h3>
              <p className="text-lg">123 AI Street, Tech City</p>
              <p className="text-lg">Innovate Town, 90210</p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-lg">+1 234 567 890</p>
              <p className="text-lg">Mon - Fri, 9am - 6pm</p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-lg">support@autoproposalai.com</p>
              <p className="text-lg">We reply within 24 hours</p>
            </div>
          </div>
        </section>

        {/* Map Section (Optional) */}
        <section className="max-w-5xl w-full mb-12">
          <h2 className="text-3xl font-semibold text-center mb-6">Find Us on the Map</h2>
          <div className="w-full h-64 bg-gray-800 rounded-lg">
            {/* You can replace this with an actual map integration */}
            <p className="text-center pt-28 text-gray-400">[Google Maps or other Map Embed]</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="text-center">
          <p className="text-gray-400">&copy; 2024 AutoProposalAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactUsPage;
