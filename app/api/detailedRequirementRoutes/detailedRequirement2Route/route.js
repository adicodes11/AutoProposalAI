import { NextResponse } from "next/server";
import CustomerRequirementInput from "@/models/CustomerRequirementInput";
import { ConnectDB } from "@/lib/config/db";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    // Connect to the database
    await ConnectDB();

    // Parse the request body
    const {
      sessionId, // Include sessionId from the request body
      windowMirrorFeatures = [],
      fogLights,
      daytimeRunningLights,
      headlights,
      automaticHeadlamps,
      followMeHomeHeadlamps,
      taillights,
      connectedCarFeatures = [],
      infotainmentFeatures = [],
      additionalFeatures = "",
      carModelVariant = "",
      extendedWarranty = "",
      registrationInsurance = "",
    } = await req.json();

    // Ensure sessionId is provided
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required." }, { status: 400 });
    }

    // Log incoming data for debugging
    console.log("Received data:", {
      sessionId,
      windowMirrorFeatures,
      fogLights,
      daytimeRunningLights,
      headlights,
      automaticHeadlamps,
      followMeHomeHeadlamps,
      taillights,
      connectedCarFeatures,
      infotainmentFeatures,
      additionalFeatures,
      carModelVariant,
      extendedWarranty,
      registrationInsurance,
    });

    // Build the update data object
    const updateData = {
      windowMirrorFeatures: windowMirrorFeatures.length > 0 ? windowMirrorFeatures : [],
      fogLights: fogLights || "",
      daytimeRunningLights: daytimeRunningLights || "",
      headlights: headlights || "",
      automaticHeadlamps: automaticHeadlamps || "",
      followMeHomeHeadlamps: followMeHomeHeadlamps || "",
      taillights: taillights || "",
      connectedCarFeatures: connectedCarFeatures.length > 0 ? connectedCarFeatures : [],
      infotainmentFeatures: infotainmentFeatures.length > 0 ? infotainmentFeatures : [],
      additionalFeatures: additionalFeatures || "",
      carModelVariant: carModelVariant || "",
      extendedWarranty: extendedWarranty || "",
      registrationInsurance: registrationInsurance || "",
      updatedAt: new Date(),
    };

    // Update the document based on sessionId or create a new one if none exists
    const result = await CustomerRequirementInput.findOneAndUpdate(
      { sessionId }, // Filter based on sessionId
      updateData,
      { sort: { createdAt: -1 }, new: true, upsert: true } // Sort by most recent and return updated document
    );

    if (!result) {
      console.error("No record found to update.");
      return NextResponse.json({ error: "No record found to update." }, { status: 404 });
    }

    // Log the result for debugging
    console.log("Record updated or created:", result);

    // Return the sessionId along with the requirementId
    return NextResponse.json({ success: true, sessionId, requirementId: result._id });
  } catch (error) {
    // Log the error for debugging
    console.error("Error handling detailedRequirement2Route:", error);

    // Return a JSON error response
    return NextResponse.json({ error: "Failed to submit data." }, { status: 500 });
  }
}
