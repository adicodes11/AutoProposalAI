"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ValidateProposalPage = () => {
  const [fullName, setFullName] = useState("");
  const [displayedName, setDisplayedName] = useState(""); // State to store the name for display
  const [signatureType, setSignatureType] = useState("");
  const [signature, setSignature] = useState(null);
  const router = useRouter();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.closePath();
    setIsDrawing(false);
    setSignature(canvasRef.current.toDataURL());
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setSignature(null);
  };

  const handleSignatureDraw = () => {
    setSignatureType("draw");
    clearCanvas();
  };

  const handleSignatureType = () => {
    setSignatureType("type");
    setSignature(null); // Clear any previous signature
    setDisplayedName(""); // Clear displayed name
  };

  const handleFullNameInput = (e) => {
    setFullName(e.target.value);
  };

  const displayFullName = () => {
    setDisplayedName(fullName);
  };

  const handleBack = () => {
    router.push("/previousPage"); // Change this to your desired route
  };

  const isDoneButtonDisabled = () => {
    if (signatureType === "upload" && signature) {
      return false;
    } else if (signatureType === "draw" && signature) {
      return false;
    } else if (signatureType === "type" && displayedName) {
      return false;
    }
    return true;
  };

  const handleDone = () => {
    if (!signature && !displayedName) {
      alert("Please provide the required signature.");
      return;
    }
    // Logic to handle proposal validation, such as submitting to backend
    alert("Proposal validated!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-r from-blue-100 via-white to-gray-100">
      <div className="w-full max-w-4xl p-10 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">
          Validate Your Proposal with Signature
        </h1>

        <div className="flex justify-around mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="signatureType"
              className="text-blue-500 focus:ring-0"
              checked={signatureType === "upload"}
              onChange={() => setSignatureType("upload")}
            />
            <span className="text-lg text-gray-600">Upload Signature</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="signatureType"
              className="text-blue-500 focus:ring-0"
              checked={signatureType === "draw"}
              onChange={handleSignatureDraw}
            />
            <span className="text-lg text-gray-600">Draw Signature</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="signatureType"
              className="text-blue-500 focus:ring-0"
              checked={signatureType === "type"}
              onChange={handleSignatureType}
            />
            <span className="text-lg text-gray-600">Type Signature</span>
          </label>
        </div>

        {signatureType === "upload" && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSignature(URL.createObjectURL(e.target.files[0]))}
            className="block w-full px-4 py-2 mb-4 text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
          />
        )}

        {signatureType === "draw" && (
          <div className="flex flex-col items-center mb-6">
            <canvas
              ref={canvasRef}
              width="400"
              height="150"
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={draw}
              onMouseOut={finishDrawing}
              className="border border-gray-400 w-full cursor-crosshair rounded-lg shadow"
            />
            <button
              onClick={clearCanvas}
              className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-all duration-300"
            >
              Clear
            </button>
          </div>
        )}

        {signatureType === "type" && (
          <div className="flex flex-col items-center mb-6">
            <input
              type="text"
              placeholder="Type your Full Name Here"
              value={fullName}
              onChange={handleFullNameInput}
              onBlur={displayFullName}
              className="w-full px-4 py-2 text-lg border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
            />
            {displayedName && (
              <p className="mt-4 text-lg text-center italic text-gray-500">
                {displayedName}
              </p>
            )}
          </div>
        )}

        {signature && (
          <div className="mt-6">
            <img
              src={signature}
              alt="Signature Preview"
              className="w-full max-h-60 object-contain rounded-md shadow-md"
            />
          </div>
        )}

        <p className="mt-6 text-sm text-gray-600 text-center">
          By clicking "Sign", you agree that the signature is the electronic representation
          of your signature for all purposes, including legally binding documents.
        </p>

        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className="px-6 py-2 text-lg font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-100 transition duration-300"
          >
            Back
          </button>
          <button
            onClick={handleDone}
            disabled={isDoneButtonDisabled()}
            className={`px-6 py-2 text-lg font-semibold text-white rounded-md transition-all duration-300 ${
              isDoneButtonDisabled()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidateProposalPage;
