// "use client";

// import React, { useEffect } from "react";
// import { useRouter } from "next/navigation";

// const GeneratingProposal = () => {
//   const router = useRouter();

//   useEffect(() => {
//     // Automatically navigate to the next page after 5 seconds
//     const timer = setTimeout(() => {
//       router.push("/proposalPages/previewProposal");    // to be changed later
//     }, 5000);

//     return () => clearTimeout(timer); // Cleanup timer on unmount
//   }, [router]);

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
      
//       {/* Pulsating Background Elements */}
//       <div className="absolute inset-0 z-0 flex items-center justify-center">
//         <div className="w-72 h-72 bg-white opacity-10 rounded-full animate-pulse"></div>
//         <div className="absolute w-96 h-96 bg-purple-400 opacity-20 rounded-full animate-pulse"></div>
//       </div>

//       {/* Content */}
//       <div className="z-10 text-center space-y-10">
//         <h1 className="text-5xl font-bold text-white">
//           Generating Your Proposal...
//         </h1>

//         {/* Spinner Animation */}
//         <div className="relative flex justify-center">
//           <div className="w-32 h-32 border-8 border-t-8 border-t-white border-blue-400 rounded-full animate-spin"></div>
//           <div className="absolute w-16 h-16 bg-blue-400 rounded-full top-8"></div>
//         </div>

//         {/* Text for Describing the Process */}
//         <p className="text-xl text-gray-300">
//           We're crafting the best proposal based on your inputs.
//         </p>

//         {/* Progress Bar */}
//         <div className="relative pt-1 w-64 mx-auto">
//           <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
//             <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500" 
//                  style={{
//                    width: '0%', 
//                    animation: 'progress 5s ease-in-out forwards'
//                  }}>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Inline CSS for the Progress Bar Animation */}
//       <style jsx>{`
//         @keyframes progress {
//           0% { width: 0%; }
//           100% { width: 100%; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default GeneratingProposal;
