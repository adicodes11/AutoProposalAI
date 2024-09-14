import { NextResponse } from 'next/server';
import CustomerRequirementInput from '@/models/CustomerRequirementInput';
import { ConnectDB } from '@/lib/config/db';

export async function POST(req) {
  const { fuelType, transmissionType, drivingRange, seatingCapacity, sessionId } = await req.json();

  // Validate required fields
  if (!fuelType || !seatingCapacity || !sessionId) {
    return NextResponse.json({ error: 'Fuel type, seating capacity, and sessionId are required.' }, { status: 400 });
  }

  // Automatically set transmission type for Electric cars
  let finalTransmissionType = transmissionType;
  if (fuelType === 'Electric') {
    finalTransmissionType = 'Automatic'; // Force transmission to Automatic for Electric cars
  }

  // Ensure driving range is only set if the fuel type is Electric
  let finalDrivingRange = null;
  if (fuelType === 'Electric' && drivingRange) {
    finalDrivingRange = drivingRange;
  }

  try {
    await ConnectDB();

    // Find the document with the given sessionId and update it
    const result = await CustomerRequirementInput.findOneAndUpdate(
      { sessionId }, // Filter by sessionId to find the correct document
      {
        fuelType,
        transmissionType: finalTransmissionType, // Use the final transmission type
        drivingRange: finalDrivingRange, // Set driving range only for Electric cars
        seatingCapacity,
        updatedAt: new Date(),
      },
      { sort: { createdAt: -1 }, new: true } // Sort by the most recent createdAt and return the updated document
    );

    if (!result) {
      return NextResponse.json({ error: 'No record found with the given sessionId.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error handling requirement3Route:', error.message);
    return NextResponse.json({ error: 'Failed to submit data.' }, { status: 500 });
  }
}
