import { NextResponse } from 'next/server';
import ValidatedProposalSignature from '@/models/validatedProposalSignatures';
import { ConnectDB } from '@/lib/config/db';
import mongoose from 'mongoose';

export async function POST(req) {
  try {
    const { signature, sessionId, userId } = await req.json();

    if (!signature || !sessionId || !userId) {
      return NextResponse.json({ success: false, error: 'Missing signature, session ID, or user ID.' }, { status: 400 });
    }

    await ConnectDB();

    let existingRecord = await ValidatedProposalSignature.findOne({ sessionId });
    
    if (existingRecord) {
      existingRecord.signature = signature;
      existingRecord.updatedAt = new Date();
      
      const updatedRecord = await existingRecord.save();
      return NextResponse.json({ success: true, data: updatedRecord._id.toString() });
    }

    const newProposalSignature = await ValidatedProposalSignature.create({
      signature,
      sessionId,
      createdBy: new mongoose.Types.ObjectId(userId),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, data: newProposalSignature._id.toString() });
  } catch (error) {
    console.error('Error validating proposal:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}