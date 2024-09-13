// src/app/api/detailedRequirementPagesRoutes/detailedRequirement1Route/route.js
import { NextResponse } from "next/server";
import CustomerRequirementInput from "@/models/CustomerRequirementInput";
import { ConnectDB } from "@/lib/config/db";

export async function POST(req) {
  try {
    const {
      sessionId, // Include sessionId from the request body
      enginePower,
      batteryCapacity,
      driveModes,
      exteriorDesign = [],
      groundClearance,
      fuelTankCapacityMin,  // Handling the range for fuel tank capacity
      fuelTankCapacityMax,  // Handling the range for fuel tank capacity
      bootSpaceMin,         // Handling the range for boot space
      bootSpaceMax,         // Handling the range for boot space
      safetyFeatures = [],
      entertainmentFeatures = [],
      comfortFeatures = [],
      drivingAssistanceFeatures = [],
      drivingExperience,
    } = await req.json();

    // Validate the sessionId
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required." }, { status: 400 });
    }

    // Connect to the database
    await ConnectDB();

    // Validate fuel tank capacity and boot space
    const validFuelTankCapacityMin =
      fuelTankCapacityMin !== null && !isNaN(fuelTankCapacityMin)
        ? fuelTankCapacityMin
        : null;
    const validFuelTankCapacityMax =
      fuelTankCapacityMax !== null && !isNaN(fuelTankCapacityMax)
        ? fuelTankCapacityMax
        : null;
    const validBootSpaceMin =
      bootSpaceMin !== null && !isNaN(bootSpaceMin) ? bootSpaceMin : null;
    const validBootSpaceMax =
      bootSpaceMax !== null && !isNaN(bootSpaceMax) ? bootSpaceMax : null;

    // Build the update data object
    const updateData = {
      enginePower: enginePower || "",
      batteryCapacity: batteryCapacity || "",
      driveModes: driveModes || "",
      exteriorDesign: exteriorDesign.length > 0 ? exteriorDesign : [],
      groundClearance: groundClearance || "",
      fuelTankCapacityMin: validFuelTankCapacityMin,
      fuelTankCapacityMax: validFuelTankCapacityMax,
      bootSpaceMin: validBootSpaceMin,
      bootSpaceMax: validBootSpaceMax,
      safetyFeatures: safetyFeatures.length > 0 ? safetyFeatures : [],
      entertainmentFeatures: entertainmentFeatures.length > 0 ? entertainmentFeatures : [],
      comfortFeatures: comfortFeatures.length > 0 ? comfortFeatures : [],
      drivingAssistanceFeatures: drivingAssistanceFeatures.length > 0 ? drivingAssistanceFeatures : [],
      drivingExperience: drivingExperience || "",
      updatedAt: new Date(),
    };

    // Find the document by sessionId and update it
    const result = await CustomerRequirementInput.findOneAndUpdate(
      { sessionId }, // Filter by sessionId
      updateData,    // Update the document with the data
      { sort: { createdAt: -1 }, new: true } // Sort by most recent and return updated document
    );

    if (!result) {
      return NextResponse.json({ error: "No record found to update." }, { status: 404 });
    }

    // Return success with sessionId and updated data
    return NextResponse.json({ success: true, sessionId, data: result });
  } catch (error) {
    console.error("Error handling detailedRequirement1Route:", error);
    return NextResponse.json({ error: "Failed to submit data." }, { status: 500 });
  }
}
  