"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import "@fontsource/great-vibes"; // Import the font for signature styling

const REMOVE_BG_API_KEY = 'Y2gzyBQtQrvtHaAdF8ivgPuw'; // Your Remove.bg API key

const ValidateProposalPage = () => {
  const [signatureType, setSignatureType] = useState("");
  const [signature, setSignature] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [userId, setUserId] = useState("");
  const [typedSignature, setTypedSignature] = useState("");
  const router = useRouter();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem("sessionId");
    const storedUserId = sessionStorage.getItem("userId");

    if (storedSessionId && storedUserId) {
      setSessionId(storedSessionId);
      setUserId(storedUserId);
    } else {
      alert("Session or user information not found. Please log in.");
      router.push("/signin");
    }
  }, [router]);

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
    setTypedSignature("");
  };

  const renderTypedSignatureAsImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    clearCanvas();
    ctx.font = "36px 'Great Vibes'";
    ctx.fillStyle = "#4F46E5";
    ctx.fillText(typedSignature, 10, 50);
    const dataURL = canvas.toDataURL("image/png");
    setSignature(dataURL);
  };

  const handleTypedSignatureChange = (e) => {
    setTypedSignature(e.target.value);
    setTimeout(() => {
      renderTypedSignatureAsImage();
    }, 100);
  };

  const handleBack = () => {
    router.push("/proposalPages/previewProposal");
  };

  const isSubmitButtonDisabled = () => {
    if (signatureType === "upload" && signature) {
      return false;
    } else if (signatureType === "draw" && signature) {
      return false;
    } else if (signatureType === "type" && signature) {
      return false;
    }
    return true;
  };

  const handleDone = async () => {
    if (!signature) {
      alert("Please provide the required signature.");
      return;
    }

    setIsUploading(true);
    try {
      const response = await fetch("/api/validateProposalRoute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signature,
          sessionId,
          userId,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert("Proposal validated successfully!");
        router.push("/proposalPages/finalProposal");
      } else {
        throw new Error(data.error || "Failed to validate proposal.");
      }
    } catch (error) {
      console.error("Error validating proposal:", error);
      alert(error.message || "An error occurred while validating the proposal.");
    } finally {
      setIsUploading(false);
    }
  };

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
      <div className="w-full max-w-3xl p-10 bg-white rounded-3xl shadow-2xl">
        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-10 tracking-wide">
          Validate Your Proposal
        </h1>

        <div className="flex justify-around mb-10">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="signatureType"
              className="form-radio h-6 w-6 text-indigo-600 focus:ring-0"
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
              className="form-radio h-6 w-6 text-indigo-600 focus:ring-0"
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
              className="form-radio h-6 w-6 text-indigo-600 focus:ring-0"
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
              className="border border-indigo-500 w-full h-48 cursor-crosshair rounded-lg shadow-lg"
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={finishDrawing}
              onTouchMove={draw}
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
              placeholder="Type your Signature Here"
              value={typedSignature}
              onChange={handleTypedSignatureChange}
              className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 focus:outline-none"
            />
            <canvas ref={canvasRef} className="hidden"></canvas>
            {signature && (
              <img
                src={signature}
                alt="Typed Signature Preview"
                className="mt-4 w-full max-h-64 object-contain rounded-md shadow-lg"
              />
            )}
          </div>
        )}

        <p className="mt-6 text-sm text-gray-600 text-center italic">
          By clicking "Submit", you agree that the signature is the electronic representation
          of your signature for all purposes, including legally binding documents.
        </p>

        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className="px-8 py-3 text-lg font-semibold text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-100 transition duration-300"
          >
            Back
          </button>
          <button
            onClick={handleDone}
            disabled={isUploading || isSubmitButtonDisabled()}
            className={`px-8 py-3 text-lg font-semibold text-white rounded-lg transition-all duration-300 ${
              isUploading || isSubmitButtonDisabled()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {isUploading ? "Processing..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidateProposalPage;