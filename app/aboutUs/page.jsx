"use client";

import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets"; // Make sure to import your logo and assets correctly

const AboutUsPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-blue-900 to-gray-900 text-white">
      {/* Header Section */}
      <header className="py-12 px-8 text-center">
        <Image src={assets.logo} alt="AutoProposalAI Logo" width={150} height={100} />
        <h1 className="text-5xl font-bold mt-4">About AutoProposalAI</h1>
        <p className="text-lg mt-2">Your Smartest Road to a New Car</p>
      </header>

      {/* Main Content Section */}
      <main className="flex flex-col items-center justify-center px-8 py-12">
        <section className="max-w-5xl w-full mb-12">
          <h2 className="text-3xl font-semibold text-center mb-6">Our Mission</h2>
          <p className="text-lg leading-relaxed text-center text-gray-200">
            At AutoProposalAI, our mission is to simplify the car buying process by merging cutting-edge AI technology with 
            personalized service. We believe in making the experience smoother, smarter, and more tailored to your specific needs.
          </p>
        </section>

        <section className="max-w-5xl w-full mb-12">
          <h2 className="text-3xl font-semibold text-center mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-lg shadow-lg">
              <h3 className="text-xl font-semibold text-pink-400 mb-4">AI-Driven Car Proposals</h3>
              <p className="text-gray-200">
                Using advanced Generative AI Models and Deep Learning Algorithms, our system generates personalized car proposals based on your unique preferences, budget, and market data.
              </p>
            </div>
            <div className="p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-lg shadow-lg">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">VAE-Based Recommendations</h3>
              <p className="text-gray-200">
                Our Variational Autoencoder (VAE) model powers intelligent car recommendations to offer the best features that suit your lifestyle.
              </p>
            </div>
            <div className="p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-lg shadow-lg">
              <h3 className="text-xl font-semibold text-indigo-400 mb-4">Seamless Integration</h3>
              <p className="text-gray-200">
                Our platform integrates with backend systems to provide a smooth journey from selecting your car model to receiving a fully customized proposal.
              </p>
            </div>
            <div className="p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-lg shadow-lg">
              <h3 className="text-xl font-semibold text-green-400 mb-4">Next-Gen Features</h3>
              <p className="text-gray-200">
                AutoProposalAI is built with cutting-edge tech like Next.js, MongoDB, and Flask APIs, ensuring a modern, user-friendly experience.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-5xl w-full mb-12">
          <h2 className="text-3xl font-semibold text-center mb-6">Why Choose Us?</h2>
          <ul className="list-disc list-inside text-lg text-gray-200 space-y-4">
            <li>
              <strong>Personalized Experience:</strong> We tailor every car proposal to fit your unique needs, with detailed insights into features and customizations.
            </li>
            <li>
              <strong>Expertise in AI and Technology:</strong> Our platform leverages AI-driven tools to provide car-buying solutions that are informed, intelligent, and innovative.
            </li>
            <li>
              <strong>Trusted Support:</strong> We guide you through every step of the journey, from selecting the car to generating the proposal, ensuring your complete satisfaction.
            </li>
          </ul>
        </section>

        <section className="max-w-5xl w-full mb-12">
          <h2 className="text-3xl font-semibold text-center mb-6">Our Story</h2>
          <p className="text-lg leading-relaxed text-center text-gray-200">
            AutoProposalAI was born out of a vision to simplify the car buying process through AI. We combine the intelligence of Generative AI models with an intuitive user experience to offer proposals that are personalized and smart. Over the course of our development, we've built a platform that caters to both the novice buyer and the seasoned car enthusiast.
          </p>
        </section>

        <section className="max-w-5xl w-full mb-12">
          <h2 className="text-3xl font-semibold text-center mb-6">Join Us</h2>
          <p className="text-lg leading-relaxed text-center text-gray-200">
            Explore our platform and discover how AI can revolutionize your car-buying experience. Whether you’re a first-time buyer or a car enthusiast, AutoProposalAI is your trusted partner in finding the perfect vehicle.
          </p>
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

export default AboutUsPage;
