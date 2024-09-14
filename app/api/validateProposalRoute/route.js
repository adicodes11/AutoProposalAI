import { NextResponse } from 'next/server';
import ValidatedProposalSignature from '@/models/validatedProposalSignatures';
import { ConnectDB } from '@/lib/config/db';
import mongoose from 'mongoose';

export async function POST(req) {
  const { fullName, signature, sessionId, userId } = await req.json();

  // Validation: Ensure required fields are present
  if (!fullName || !signature || !sessionId || !userId) {
    return NextResponse.json({ error: 'Missing full name, signature, session ID, or user ID.' }, { status: 400 });
  }

  try {
    // Connect to the database
    await ConnectDB();

    // Check if a record with the same sessionId exists, and update if it does
    let existingRecord = await ValidatedProposalSignature.findOne({ sessionId });
    
    if (existingRecord) {
      // Update existing record
      existingRecord.fullName = fullName;
      existingRecord.signature = signature;
      existingRecord.updatedAt = new Date();
      
      const updatedRecord = await existingRecord.save();
      return NextResponse.json({ success: true, data: updatedRecord._id });
    }

    // If no existing record, create a new one
    const newProposalSignature = await ValidatedProposalSignature.create({
      fullName,
      signature,
      sessionId,
      createdBy: mongoose.Types.ObjectId(userId), // Use the userId to track who created it
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Return success response with the document ID
    return NextResponse.json({ success: true, data: newProposalSignature._id });
  } catch (error) {
    console.error('Error validating proposal:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
