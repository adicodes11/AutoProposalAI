import { NextResponse } from 'next/server';
import ProposalModel from '@/models/ProposalModel';
import UserDetails from '@/models/UserDetails';
import { ConnectDB } from '@/lib/config/db';
import mongoose from 'mongoose';

export async function POST(req) {
  try {
    // Parse the incoming request data
    const { sessionId, createdBy, selectedCarModel, selectedVersion } = await req.json();

    // Check if all required fields are present
    if (!sessionId || !createdBy || !selectedCarModel || !selectedVersion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Connect to MongoDB
    await ConnectDB();
    console.log('Database connected');

    // Fetch user details
    const userDetails = await UserDetails.findOne({ sessionId });

    if (!userDetails) {
      return NextResponse.json({ error: 'User details not found for this session.' }, { status: 404 });
    }

    const generatedByEmail = userDetails.email;

    // Fetch AI-generated proposal content
    const AIGeneratedProposalContent = mongoose.connection.collection('AIGeneratedProposalContent');
    const aiGeneratedContent = await AIGeneratedProposalContent.findOne({ sessionId });

    if (!aiGeneratedContent) {
      return NextResponse.json({ error: 'AI-generated content not found for this session.' }, { status: 404 });
    }

    // Fetch customer requirements
    const CustomerRequirementInputs = mongoose.connection.collection('customerrequirementinputs');
    const customerRequirements = await CustomerRequirementInputs.findOne({ sessionId });

    if (!customerRequirements) {
      return NextResponse.json({ error: 'Customer requirements not found for this session.' }, { status: 404 });
    }

    // Fetch the signature from the collection without directly importing the model
    const ValidatedProposalSignatureCollection = mongoose.connection.collection('validatedproposalsignatures');
    const validatedSignature = await ValidatedProposalSignatureCollection.findOne({ sessionId });

    if (!validatedSignature) {
      return NextResponse.json({ success: false, error: 'Signature not found' }, { status: 404 });
    }

    // Fetch car details from CarSpecificationDataset based on selected model and version from the frontend
    const CarSpecificationDataset = mongoose.connection.collection('CarSpecificationDataset');
    let carDetails = null;

    console.log("Fetching car details for model:", selectedCarModel);
    console.log("Fetching car details for version:", selectedVersion);

    carDetails = await CarSpecificationDataset.findOne({
      Model: selectedCarModel,
      Version: selectedVersion,
    });

    if (!carDetails) {
      console.warn(
        `Car details not found for the selected car model: ${selectedCarModel}, version: ${selectedVersion}. Proceeding without car details.`
      );
    } else {
      console.log("Car details successfully fetched:", carDetails);
    }

    // Generate a unique PID for the new proposal
    const newProposal = new ProposalModel({
      sessionId,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save the new proposal
    const result = await newProposal.save();
    console.log('New proposal saved with PID:', result.PID);

    // Return the proposal data
    return NextResponse.json(
      {
        success: true,
        PID: result.PID,
        generatedByEmail,
        customer_details: userDetails,
        introduction: aiGeneratedContent.introduction || 'No introduction available',
        carOverview: aiGeneratedContent.carOverview || 'No car overview available',
        customizationSuggestions: aiGeneratedContent.customizationSuggestions || 'No customization suggestions available',
        proposalSummary: aiGeneratedContent.proposalSummary || 'No proposal summary available',
        conclusion: aiGeneratedContent.conclusion || 'No conclusion available',
        customer_requirements: customerRequirements,
        signature: validatedSignature.signature, // Send signature to frontend
        carDetails: carDetails || {},  // Return carDetails even if empty
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error inserting proposal data:', error.message || error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message || 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
