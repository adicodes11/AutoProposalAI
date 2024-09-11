import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { ConnectDB } from '@/lib/config/db';

// Simplified Field Mapping for testing
const fieldMapping = {
  budgetMin: 'Ex-Showroom Price',
  budgetMax: 'Ex-Showroom Price',
  bodyStyle: 'Body Type',
  fuelType: 'Fuel Type',
  transmissionType: 'Transmission Type',
};

// Function to calculate match percentage for a single car
const calculateMatchPercentage = (userInput, carSpec) => {
  let totalFields = 0;
  let matchedFields = 0;

  // Check budget range
  if (userInput.budgetMin && userInput.budgetMax && carSpec['Ex-Showroom Price']) {
    totalFields++;
    if (
      carSpec['Ex-Showroom Price'] >= userInput.budgetMin &&
      carSpec['Ex-Showroom Price'] <= userInput.budgetMax
    ) {
      matchedFields++;
    }
  }

  // Check body style, fuel type, and transmission type
  ['bodyStyle', 'fuelType', 'transmissionType'].forEach((field) => {
    const carField = fieldMapping[field];
    if (userInput[field] && carSpec[carField]) {
      totalFields++;
      if (userInput[field] === carSpec[carField]) {
        matchedFields++;
      }
    }
  });

  return (matchedFields / totalFields) * 100;
};

export async function POST(req) {
  try {
    const { recommendationResultId } = await req.json();
    
    if (!recommendationResultId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Connect to the database
    await ConnectDB();

    // Get the collections
    const recommendationResultsCollection = mongoose.connection.collection('recommendationresults');
    const customerRequirementCollection = mongoose.connection.collection('customerrequirementinputs');
    const carSpecificationCollection = mongoose.connection.collection('CarSpecificationDataset');

    // Find the recommendation result by its ObjectId
    const recommendationResult = await recommendationResultsCollection.findOne({
      _id: new mongoose.Types.ObjectId(recommendationResultId)
    });

    if (!recommendationResult) {
      return NextResponse.json({ error: "Recommendation results not found" }, { status: 404 });
    }

    // Now fetch the customer input using the createdBy field (ensure proper ObjectId handling)
    const customerInput = await customerRequirementCollection.findOne({
      _id: new mongoose.Types.ObjectId(recommendationResult.createdBy) 
    });

    if (!customerInput) {
      return NextResponse.json({ error: "Customer input not found" }, { status: 404 });
    }

    // Calculate match percentages for each recommendation
    const updatedRecommendations = await Promise.all(
      recommendationResult.recommendations.map(async (recommendation) => {
        // Find the car in the CarSpecificationDataset collection
        const carSpec = await carSpecificationCollection.findOne({
          Model: recommendation['Car Model'],
          Version: recommendation['Version'],
        });

        if (carSpec) {
          const matchPercentage = calculateMatchPercentage(customerInput, carSpec);
          return {
            ...recommendation,
            matchPercentage,
          };
        }

        // If carSpec is not found, return the recommendation as is
        return recommendation;
      })
    );

    // Update the recommendations with the calculated match percentage
    await recommendationResultsCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(recommendationResultId) },
      { $set: { recommendations: updatedRecommendations } }
    );

    return NextResponse.json(updatedRecommendations, { status: 200 });

  } catch (error) {
    console.error('Error processing recommendations:', error);
    return NextResponse.json({ error: 'An error occurred while processing recommendations.', details: error.message }, { status: 500 });
  }
}
