import { ConnectDB } from '@/lib/config/db';
import { NextResponse } from 'next/server';
import Top4Recommendation from '@/models/Top4Recommendations'; // Import the model

export async function POST(req) {
  try {
    // Parse the request body
    const { sessionId } = await req.json();

    if (!sessionId) {
      console.error('Error: Session ID is missing');
      return NextResponse.json({ message: 'Session ID is missing' }, { status: 400 });
    }

    console.log('Received sessionId:', sessionId);

    // Connect to the database
    const db = await ConnectDB();
    const customerCollection = db.collection('customerrequirementinputs');
    const recommendationCollection = db.collection('recommendationresults');
    const carSpecificationCollection = db.collection('CarSpecificationDataset');

    // Fetch customer requirement input using sessionId
    const customerInput = await customerCollection.findOne({ sessionId });
    if (!customerInput) {
      console.error('Error: Customer input not found for sessionId:', sessionId);
      return NextResponse.json({ message: 'Customer input not found' }, { status: 404 });
    }
    console.log('Fetched customerInput:', customerInput);

    // Fetch recommendations based on sessionId
    const recommendations = await recommendationCollection.findOne({ sessionId });
    if (!recommendations || !recommendations.recommendations) {
      console.error('Error: Recommendations not found for sessionId:', sessionId);
      return NextResponse.json({ message: 'Recommendations not found' }, { status: 404 });
    }
    console.log('Fetched recommendations:', recommendations);

    // Iterate through each recommended car and compare with CarSpecificationDataset
    const updatedRecommendations = await Promise.all(
      recommendations.recommendations.map(async (recommendation) => {
        const carSpec = await carSpecificationCollection.findOne({
          Model: recommendation['Car Model'],
          Version: recommendation['Version'],
        });

        if (!carSpec) {
          console.warn(`Warning: No car specification found for model ${recommendation['Car Model']} and version ${recommendation['Version']}`);
          return { ...recommendation, matchPercentage: 0 };
        }

        let matchPoints = 0;
        let totalCriteria = 0;

        // Criteria comparison with logs
        totalCriteria++;
        if (carSpec['Ex-Showroom Price'] >= customerInput.budgetMin && carSpec['Ex-Showroom Price'] <= customerInput.budgetMax) {
          matchPoints++;
          console.log('Matched: Ex-Showroom Price');
        } else {
          console.log('Not Matched: Ex-Showroom Price');
        }

        totalCriteria++;
        if (carSpec['Fuel Type'] === customerInput.fuelType) {
          matchPoints++;
          console.log('Matched: Fuel Type');
        } else {
          console.log('Not Matched: Fuel Type');
        }

        totalCriteria++;
        if (customerInput.bodyStyle.includes(carSpec['Body Type'])) {
          matchPoints++;
          console.log('Matched: Body Type');
        } else {
          console.log('Not Matched: Body Type');
        }

        totalCriteria++;
        if (carSpec['Transmission Type'] === customerInput.transmissionType) {
          matchPoints++;
          console.log('Matched: Transmission Type');
        } else {
          console.log('Not Matched: Transmission Type');
        }

        totalCriteria++;
        if (carSpec['Seating Capacity'] === customerInput.seatingCapacity) {
          matchPoints++;
          console.log('Matched: Seating Capacity');
        } else {
          console.log('Not Matched: Seating Capacity');
        }

        totalCriteria++;
        if (carSpec['Drive Modes'] === customerInput.driveModes) {
          matchPoints++;
          console.log('Matched: Drive Modes');
        } else {
          console.log('Not Matched: Drive Modes');
        }

        totalCriteria++;
        if (carSpec['Fuel Tank Capacity'] >= customerInput.fuelTankCapacityMin && carSpec['Fuel Tank Capacity'] <= customerInput.fuelTankCapacityMax) {
          matchPoints++;
          console.log('Matched: Fuel Tank Capacity');
        } else {
          console.log('Not Matched: Fuel Tank Capacity');
        }

        totalCriteria++;
        if (carSpec['Bootspace(litres)'] >= customerInput.bootSpaceMin && carSpec['Bootspace(litres)'] <= customerInput.bootSpaceMax) {
          matchPoints++;
          console.log('Matched: Boot Space');
        } else {
          console.log('Not Matched: Boot Space');
        }

        totalCriteria++;
        if (carSpec['Daytime Running Lights'] === customerInput.daytimeRunningLights) {
          matchPoints++;
          console.log('Matched: Daytime Running Lights');
        } else {
          console.log('Not Matched: Daytime Running Lights');
        }

        totalCriteria++;
        if (carSpec['Fog Lights'] === customerInput.fogLights) {
          matchPoints++;
          console.log('Matched: Fog Lights');
        } else {
          console.log('Not Matched: Fog Lights');
        }

        totalCriteria++;
        if (carSpec['Follow me home headlamps'] === customerInput.followMeHomeHeadlamps) {
          matchPoints++;
          console.log('Matched: Follow Me Home Headlamps');
        } else {
          console.log('Not Matched: Follow Me Home Headlamps');
        }

        totalCriteria++;
        if (carSpec['Headlights'] === customerInput.headlights) {
          matchPoints++;
          console.log('Matched: Headlights');
        } else {
          console.log('Not Matched: Headlights');
        }

        totalCriteria++;
        if (carSpec['Automatic Headlamps'] === customerInput.automaticHeadlamps) {
          matchPoints++;
          console.log('Matched: Automatic Headlamps');
        } else {
          console.log('Not Matched: Automatic Headlamps');
        }

        // Calculate match percentage dynamically
        const matchPercentage = (matchPoints / totalCriteria) * 100;
        console.log(`Match percentage for model ${recommendation['Car Model']} is ${matchPercentage}%`);

        return {
          ...recommendation,
          matchPercentage,
        };
      })
    );

    // Update the recommendations with match percentages in MongoDB
    await recommendationCollection.updateOne(
      { sessionId },
      { $set: { recommendations: updatedRecommendations } }
    );
    console.log('Updated recommendations with match percentages');

    // Sort the updated recommendations by match percentage in descending order
    const sortedRecommendations = updatedRecommendations
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Apply logic to ensure no more than 2 cars from the same model in top 4
    const carModelCount = {};
    const finalTop4Recommendations = [];

    for (const recommendation of sortedRecommendations) {
      const carModel = recommendation['Car Model'];

      // Initialize the count for the car model if not already done
      if (!carModelCount[carModel]) {
        carModelCount[carModel] = 0;
      }

      // Add the car to the final recommendations if there are fewer than 2 from this model
      if (carModelCount[carModel] < 2) {
        finalTop4Recommendations.push(recommendation);
        carModelCount[carModel] += 1;
      }

      // Stop once we have 4 cars in the final recommendations
      if (finalTop4Recommendations.length === 4) {
        break;
      }
    }

    // If there are less than 4 cars, fill the remaining slots with other cars, regardless of model
    if (finalTop4Recommendations.length < 4) {
      for (const recommendation of sortedRecommendations) {
        if (!finalTop4Recommendations.includes(recommendation)) {
          finalTop4Recommendations.push(recommendation);
        }
        if (finalTop4Recommendations.length === 4) {
          break;
        }
      }
    }

    console.log('Final Top 4 sorted cars:', finalTop4Recommendations);

    // Create a single document with the array of top 4 recommendations
    const top4RecommendationsDocument = {
      sessionId,
      recommendations: finalTop4Recommendations.map((rec) => ({
        carModel: rec['Car Model'],
        version: rec['Version'],
        matchPercentage: rec.matchPercentage
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: customerInput.createdBy // Assuming customerInput contains createdBy field
    };

    // Insert the single document containing all 4 recommendations
    await Top4Recommendation.create(top4RecommendationsDocument);
    console.log('Top 4 recommendations stored successfully');

    // Return the top 4 sorted recommendations as a response
    return NextResponse.json({ top4Recommendations: top4RecommendationsDocument });

  } catch (error) {
    console.error('Error occurred during POST request:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
