import { NextResponse } from 'next/server';
import CustomerRequirementInput from '@/models/CustomerRequirementInput';
import { ConnectDB } from '@/lib/config/db';

export async function POST(req) {
  const { fuelType, transmissionType, drivingRange, seatingCapacity, sessionId } = await req.json();

  // Validate required fields
  if (!fuelType || !seatingCapacity || !sessionId) {
    return NextResponse.json({ error: 'Fuel type, seating capacity, and sessionId are required.' }, { status: 400 });
  }

  try {
    await ConnectDB();

    // Find the document with the given sessionId and update it
    const result = await CustomerRequirementInput.findOneAndUpdate(
      { sessionId },  // Filter by sessionId to find the correct document
      {
        fuelType,
        transmissionType,
        drivingRange,
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
    console.error('Error handling requirement3Route:', error);
    return NextResponse.json({ error: 'Failed to submit data.' }, { status: 500 });
  }
}
