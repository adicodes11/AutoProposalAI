"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import "@fontsource/great-vibes"; // Import the font for signature styling

const REMOVE_BG_API_KEY = 'Y2gzyBQtQrvtHaAdF8ivgPuw'; // Your Remove.bg API key

const ValidateProposalPage = () => {
  const [fullName, setFullName] = useState("");
  const [displayedName, setDisplayedName] = useState("");
  const [signatureType, setSignatureType] = useState("");
  const [signature, setSignature] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // For loading state when processing
  const [sessionId, setSessionId] = useState("your_session_id"); // Replace this with actual session ID logic
  const [userId, setUserId] = useState("your_user_id"); // Replace with actual user ID logic
  const router = useRouter();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  // Adjust the canvas for device pixel ratio
  const adjustCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const scale = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#1E40AF"; // Blue color
      ctx.lineWidth = 2;
    }
  }, []);

  useEffect(() => {
    if (signatureType === "draw") {
      adjustCanvas();
      clearCanvas();
    }
  }, [signatureType, adjustCanvas]);

  const getCanvasCoordinates = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if (event.touches) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width / (window.devicePixelRatio || 1),
      y: ((clientY - rect.top) / rect.height) * canvas.height / (window.devicePixelRatio || 1),
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getCanvasCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
    setLastPosition({ x, y });
    setIsDrawing(true);
  };

  const finishDrawing = (e) => {
    e.preventDefault();
    if (isDrawing) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.closePath();
      setIsDrawing(false);
      const dataURL = canvasRef.current.toDataURL("image/png");
      setSignature(dataURL);
    }
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;

    const { x, y } = getCanvasCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
    setLastPosition({ x, y });
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setSignature(null);
    }
  };

  const handleSignatureDraw = () => {
    setSignatureType("draw");
  };

  const handleSignatureType = () => {
    setSignatureType("type");
    setSignature(null);
    setDisplayedName("");
  };

  const handleFullNameInput = (e) => {
    setFullName(e.target.value);
  };

  const displayFullName = () => {
    setDisplayedName(fullName);
  };

  const handleBack = () => {
    router.push("/previousPage");
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

  const handleDone = async () => {
    if (!signature && !displayedName) {
      alert("Please provide the required signature.");
      return;
    }

    try {
      const response = await fetch("/api/validateProposalRoute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          signature,
          sessionId,
          userId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Proposal validated!");
        // Optionally, redirect or perform other actions
      } else {
        alert("Failed to validate proposal.");
      }
    } catch (error) {
      console.error("Error validating proposal:", error);
      alert("An error occurred while validating the proposal.");
    }
  };

  // Function to send the uploaded image to Remove.bg API and get the background removed
  const handleImageUpload = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image_file", file);
      formData.append("size", "auto");

      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": REMOVE_BG_API_KEY,
        },
        body: formData,
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const base64Image = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
        setSignature(base64Image);
      } else {
        console.error(`Remove.bg API error: ${response.statusText}`);
        alert("Failed to remove background from the signature image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Prevent scrolling on touch devices when drawing
  const preventScroll = (e) => {
    if (signatureType === "draw") {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="w-full max-w-3xl p-10 bg-white rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Validate Your Proposal
        </h1>

        <div className="flex justify-around mb-10">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="signatureType"
              className="form-radio h-6 w-6 text-cyan-600 focus:ring-0"
              checked={signatureType === "upload"}
              onChange={() => setSignatureType("upload")}
            />
            <span className="text-lg font-medium text-gray-700">
              Upload Signature
            </span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="signatureType"
              className="form-radio h-6 w-6 text-cyan-600 focus:ring-0"
              checked={signatureType === "draw"}
              onChange={handleSignatureDraw}
            />
            <span className="text-lg font-medium text-gray-700">
              Draw Signature
            </span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="signatureType"
              className="form-radio h-6 w-6 text-cyan-600 focus:ring-0"
              checked={signatureType === "type"}
              onChange={handleSignatureType}
            />
            <span className="text-lg font-medium text-gray-700">
              Type Signature
            </span>
          </label>
        </div>

        {signatureType === "upload" && (
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleImageUpload(e.target.files[0]);
              }
            }}
            className="block w-full px-5 py-3 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
          />
        )}

        {signatureType === "draw" && (
          <div className="flex flex-col items-center mb-6">
            <canvas
              ref={canvasRef}
              className="border border-cyan-400 w-full h-40 cursor-crosshair rounded-md shadow"
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={draw}
              onMouseOut={finishDrawing}
              onTouchStart={startDrawing}
              onTouchEnd={finishDrawing}
              onTouchMove={draw}
              onTouchCancel={finishDrawing}
              onTouchStartCapture={preventScroll}
              onTouchMoveCapture={preventScroll}
            />
            <button
              onClick={clearCanvas}
              className="mt-4 px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-all duration-300"
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
              className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:ring focus:ring-cyan-300 focus:outline-none"
            />
            {displayedName && (
              <p
                className="mt-4 text-lg text-center italic text-gray-600"
                style={{ fontFamily: "Great Vibes, cursive", fontSize: "36px", color: "#1E40AF" }}
              >
                {displayedName}
              </p>
            )}
          </div>
        )}

        {signature && (
          <div className="mt-6 flex flex-col items-center">
            <img
              src={signature}
              alt="Signature Preview"
              className="w-full max-h-64 object-contain rounded-md shadow-lg"
            />
          </div>
        )}

        <p className="mt-6 text-sm text-gray-600 text-center italic">
          By clicking "Sign", you agree that the signature is the electronic representation
          of your signature for all purposes, including legally binding documents.
        </p>

        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className="px-8 py-3 text-lg font-semibold text-cyan-600 border border-cyan-600 rounded-lg hover:bg-cyan-100 transition duration-300"
          >
            Back
          </button>
          <button
            onClick={handleDone}
            disabled={isUploading || isDoneButtonDisabled()}
            className={`px-8 py-3 text-lg font-semibold text-white rounded-lg transition-all duration-300 ${
              isUploading || isDoneButtonDisabled()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {isUploading ? "Processing..." : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidateProposalPage;