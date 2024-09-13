import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/config/db'; // Ensure your MongoDB config is correct
import Top4Recommendation from '@/models/Top4Recommendation';
import CarSpecificationDataset from '@/models/CarSpecificationDataset'; // Assuming this model exists for car details

export async function GET(req) {
  try {
    // Extract sessionId from query parameters (if needed)
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId'); // Pass sessionId as a query parameter

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is missing' }, { status: 400 });
    }

    const db = await ConnectDB();

    // Fetch the top 4 recommendations from the top4recommendations collection
    const top4Data = await db
      .collection('top4recommendations')
      .findOne({ sessionId });

    if (!top4Data || !top4Data.recommendations || top4Data.recommendations.length === 0) {
      return NextResponse.json({ error: 'No recommendations found for this session' }, { status: 404 });
    }

    const top4Recommendations = top4Data.recommendations;

    // Prepare an array to store the detailed car information
    const detailedCarInfo = await Promise.all(
      top4Recommendations.map(async (rec) => {
        const carDetails = await db
          .collection('CarSpecificationDataset')
          .findOne({ Model: rec.carModel, Version: rec.version });

        // Return the car details with the recommended model and version name
        return {
          carModel: rec.carModel,
          version: rec.version,
          price: carDetails?.['Ex-Showroom Price'] || 'N/A',
          engine: carDetails?.['Engine'] || 'N/A',
          fuelType: carDetails?.['Fuel Type'] || 'N/A',
          transmission: carDetails?.['Transmission Type'] || 'N/A',
          mileage: carDetails?.['Mileage'] || 'N/A',
        };
      })
    );

    // Return the detailed car information to the frontend
    return NextResponse.json({ top4Recommendations: detailedCarInfo });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}
