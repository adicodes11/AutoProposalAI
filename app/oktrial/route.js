import { NextResponse } from 'next/server';
import ProposalModel from '@/models/ProposalModel';  // Import the Proposal schema model
import UserDetails from '@/models/UserDetails'; // Import the UserDetails schema model
import { ConnectDB } from '@/lib/config/db'; // Import your MongoDB connection utility
import mongoose from 'mongoose'; // Mongoose for querying the collections

export async function POST(req) {
  try {
    // Parse the incoming request data (Assuming the data is sent in JSON format)
    const { sessionId, createdBy, carModel, carVersion } = await req.json();  // Fetch sessionId, createdBy, carModel, carVersion from the request body

    // Check if all required fields are present
    if (!sessionId || !createdBy || !carModel || !carVersion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Connect to MongoDB using your utility function
    await ConnectDB();

    // Fetch user details from the UserDetails collection using sessionId
    const userDetails = await UserDetails.findOne({ sessionId });

    if (!userDetails) {
      return NextResponse.json({ error: 'User details not found for this session.' }, { status: 404 });
    }

    const generatedByEmail = userDetails.email;

    // Fetch AI-generated proposal content from the collection without a schema
    const AIGeneratedProposalContent = mongoose.connection.collection('AIGeneratedProposalContent');
    const aiGeneratedContent = await AIGeneratedProposalContent.findOne({ sessionId });

    if (!aiGeneratedContent) {
      return NextResponse.json({ error: 'AI-generated content not found for this session.' }, { status: 404 });
    }

    // Fetch customer requirements from the existing collection (no need to import a model)
    const CustomerRequirementInputs = mongoose.connection.collection('customerrequirementinputs');
    const customerRequirements = await CustomerRequirementInputs.findOne({ sessionId });

    if (!customerRequirements) {
      return NextResponse.json({ error: 'Customer requirements not found for this session.' }, { status: 404 });
    }

    // Fetch car specifications based on car model and version from CarSpecificationDataset
    const CarSpecificationDataset = mongoose.connection.collection('CarSpecificationDataset');
    const carSpecification = await CarSpecificationDataset.findOne({
      Model: carModel,
      Version: carVersion
    });

    if (!carSpecification) {
      return NextResponse.json({ error: 'Car specifications not found for this model/version.' }, { status: 404 });
    }

    // Generate a unique PID for the new proposal
    const newProposal = new ProposalModel({
      sessionId,
      createdBy,
      createdAt: new Date(), // Automatically set createdAt
      updatedAt: new Date()  // Automatically set updatedAt
    });

    // Save the new proposal into the database
    const result = await newProposal.save();

    // Return the new proposal's PID, the user's email, the customer details, the AI-generated introduction, customer requirements, and car specifications
    return NextResponse.json({
      success: true,
      PID: result.PID,
      generatedByEmail,
      customer_details: userDetails, // Pass customer details to the frontend
      introduction: aiGeneratedContent.introduction, // Pass the AI-generated introduction to the frontend
      carOverview: aiGeneratedContent.carOverview, // Pass the AI-generated introduction to the frontend
      customer_requirements: customerRequirements, // Pass customer requirements to the frontend
      car_specifications: carSpecification // Pass the car specifications to the frontend
    }, { status: 201 });
  } catch (error) {
    console.error('Error inserting proposal data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
