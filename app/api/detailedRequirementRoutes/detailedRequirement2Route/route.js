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

    // Log incoming data for debugging
    console.log("Received data:", {
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

    // Update the most recent document or create a new one if none exists
    const result = await CustomerRequirementInput.findOneAndUpdate(
      {}, // Adjust this filter based on your user/session handling
      updateData,
      { sort: { createdAt: -1 }, new: true, upsert: true }
    );

    if (!result) {
      console.error("No record found to update.");
      return NextResponse.json({ error: "No record found to update." }, { status: 404 });
    }

    // Log the result for debugging
    // console.log("Record updated or created:", result);

    // Return the _id (requirementId) of the newly inserted/updated record
    return NextResponse.json({ success: true, requirementId: result._id });
  } catch (error) {
    // Log the error for debugging
    console.error("Error handling detailedRequirement2Route:", error);

    // Return a JSON error response
    return NextResponse.json({ error: "Failed to submit data." }, { status: 500 });
  }
}
