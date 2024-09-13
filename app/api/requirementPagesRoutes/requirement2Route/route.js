import { NextResponse } from 'next/server';
import CustomerRequirementInput from '@/models/CustomerRequirementInput';
import { ConnectDB } from '@/lib/config/db';

export async function POST(req) {
  const { bodyStyle, sessionId } = await req.json();

  // Validation: Ensure required fields are present
  if (!bodyStyle || !sessionId) {
    return NextResponse.json({ error: 'Missing body style or session ID.' }, { status: 400 });
  }

  try {
    // Connect to the database
    await ConnectDB();

    // Build the update object
    const updateData = {
      bodyStyle,
      updatedAt: new Date(),
    };

    // Find the customer requirement by sessionId and update the bodyStyle
    const result = await CustomerRequirementInput.findOneAndUpdate(
      { sessionId },  // Use sessionId to find the correct document
      updateData,     // Fields to update
      { new: true }   // Return the updated document
    );

    // If no document is found, return an appropriate error
    if (!result) {
      return NextResponse.json({ error: 'No record found for the session.' }, { status: 404 });
    }

    // Return the updated document
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error handling requirement2Route:', error);
    return NextResponse.json({ error: 'Failed to submit data.' }, { status: 500 });
  }
}
