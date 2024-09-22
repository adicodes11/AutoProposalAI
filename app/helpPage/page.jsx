"use client";

import React, { useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets"; // Ensure to correct the assets import

const HelpPage = () => {
  const [faqIndex, setFaqIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const toggleFaq = (index) => {
    setFaqIndex(faqIndex === index ? null : index); // Toggle the clicked FAQ section
  };

  const faqs = [
    {
      question: "How do I generate a car proposal?",
      answer:
        "To generate a customized car proposal, navigate to the 'Car Recommendation' page, fill in your details, and follow the instructions. Our AI-based system will provide a tailored car recommendation and proposal based on your preferences.",
    },
    {
      question: "How can I edit my proposal?",
      answer:
        "After generating your proposal, you can go back to the recommendation page and make changes. Make sure your session is active to retain the data or simply start a new session.",
    },
    {
      question: "How do I save and share my proposal?",
      answer:
        "You can download your proposal as a PDF directly from the proposal preview page, and you also have the option to email the proposal to yourself or a third party.",
    },
    {
      question: "What if I encounter a technical issue?",
      answer:
        "If you face any issues using the platform, try refreshing the page or clearing your browser cache. If the problem persists, please contact our support team via the contact form or the provided email address.",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await fetch("/api/helpRoute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true); // Show success message
        setFormData({ name: "", email: "", message: "" }); // Reset form
        setError(null); // Clear any previous error
      } else {
        throw new Error(result.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting help form:", error);
      setError("Failed to send your message. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-blue-900 to-gray-900 text-white">
      {/* Header Section */}
      <header className="py-12 px-8 text-center">
        <Image src={assets.logo} alt="AutoProposalAI Logo" width={150} height={100} />
        <h1 className="text-5xl font-bold mt-4">Help & Support</h1>
        <p className="text-lg mt-2">Find answers to common questions or contact our support team</p>
      </header>

      {/* Main Content Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-8 py-12">
        <section className="max-w-5xl w-full mb-12">
          <h2 className="text-3xl font-semibold text-center mb-6">Frequently Asked Questions</h2>
          <div className="text-gray-200 space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-800 bg-opacity-30 p-4 rounded-lg shadow-lg">
                <div
                  className="cursor-pointer text-xl font-semibold flex justify-between items-center"
                  onClick={() => toggleFaq(index)}
                >
                  {faq.question}
                  <span>{faqIndex === index ? "-" : "+"}</span>
                </div>
                {faqIndex === index && <p className="mt-4 text-lg">{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Support Section */}
        <section className="max-w-5xl w-full mb-12 text-center">
          <h2 className="text-3xl font-semibold mb-6">Still need help?</h2>
          <p className="text-lg leading-relaxed text-gray-200 mb-8">
            If you can't find the answer you're looking for, feel free to reach out to us.
            We’re always here to assist you.
          </p>
          <div className="flex justify-center space-x-6">
            <div className="bg-gradient-to-r from-pink-500 to-yellow-500 p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">Email Support</h3>
              <p className="mt-2 text-lg">support@autoproposalai.com</p>
              <p className="text-sm text-gray-300">Response within 24 hours</p>
            </div>
            <div className="bg-gradient-to-r from-pink-500 to-yellow-500 p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">Call Support</h3>
              <p className="mt-2 text-lg">+1 234 567 890</p>
              <p className="text-sm text-gray-300">Mon - Fri, 9am - 6pm</p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="w-full max-w-lg mx-auto bg-white bg-opacity-10 backdrop-blur-lg shadow-lg rounded-lg p-8 text-center border border-gray-500 border-opacity-20">
          <h2 className="text-2xl font-semibold mb-6 text-white">Submit a Ticket</h2>
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
              Submit Ticket
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

export default HelpPage;
