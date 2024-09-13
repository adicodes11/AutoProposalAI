import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/config/db';

export async function POST(req) {
  try {
    // Parse the request body to get the sessionId
    const { sessionId } = await req.json();

    // Validate sessionId
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required.' }, { status: 400 });
    }

    // Connect to the database
    const db = await ConnectDB();

    // Fetch the top 4 recommendations based on sessionId from the top4recommendations collection
    const topRecommendations = await db.collection('top4recommendations').findOne({ sessionId });

    // If no recommendations found, return an error
    if (!topRecommendations || !topRecommendations.recommendations) {
      return NextResponse.json({ error: 'No recommendations found for this session.' }, { status: 404 });
    }

    // Fetch the carColor from customerrequirementinputs based on sessionId
    const customerRequirement = await db.collection('customerrequirementinputs').findOne({ sessionId });
    
    // Extract carColor, with fallback to 'N/A' if it's not found
    const carColor = customerRequirement?.carColor || 'N/A';

    // Extract car model, version, and match percentage from the recommendations
    const carDetails = await Promise.all(
      topRecommendations.recommendations.map(async (recommendation) => {
        const { carModel, version, matchPercentage } = recommendation;

        try {
          // Fetch detailed car information from the CarSpecificationDataset collection
          const carSpec = await db.collection('CarSpecificationDataset').findOne(
            { Model: carModel, Version: version },
            {
              // Only fetch required fields
              projection: {
                'Ex-Showroom Price': 1,
                'Fuel Type': 1,
                'Transmission Type': 1,
                'Body Type': 1,
                'Seating Capacity': 1,
                'Emission Standard': 1,
                'NCAP Rating (Adult) (Star (Global NCAP))': 1,
                'NCAP Rating (Child) (Star (Global NCAP))': 1,
                'Ground Clearance (cm)': 1,
                'Fuel Tank Capacity': 1,
                'Bootspace(litres)': 1,
                'Driving Range (km)': 1,
                'Engine Type': 1,
                'Engine Power (cc)': 1,
                'Mileage (ARAI) (kmpl)': 1,
                'Top Speed (kmph)': 1,
                'Wheels': 1,
                'Parking Assist': 1,
                'Drive Modes': 1,
                'Headlights': 1,
                'Air Conditioner': 1,
                'Display': 1,
                'Head Unit Size(inch)': 1
              }
            }
          );

          // Return partial data if no car spec found
          if (!carSpec) {
            return {
              carModel,
              version,
              carColor,  // Added car color
              matchPercentage,  // Add match percentage for displaying in frontend
              details: 'Details not found in CarSpecificationDataset',
            };
          }

          // Return the car details, including the new fields and match percentage
          return {
            carModel,
            version,
            carColor, // Added car color
            matchPercentage, // Add match percentage
            exShowroomPrice: carSpec['Ex-Showroom Price'] || 'N/A',
            fuelType: carSpec['Fuel Type'] || 'N/A',
            transmissionType: carSpec['Transmission Type'] || 'N/A',
            bodyType: carSpec['Body Type'] || 'N/A',
            seatingCapacity: carSpec['Seating Capacity'] || 'N/A',
            emissionStandard: carSpec['Emission Standard'] || 'N/A',
            ncapRatingAdult: carSpec['NCAP Rating (Adult) (Star (Global NCAP))'] || 'N/A',
            ncapRatingChild: carSpec['NCAP Rating (Child) (Star (Global NCAP))'] || 'N/A',
            groundClearance: carSpec['Ground Clearance (cm)'] || 'N/A',
            fuelTankCapacity: carSpec['Fuel Tank Capacity'] || 'N/A',
            bootSpaceCapacity: carSpec['Bootspace(litres)'] || 'N/A',
            drivingRange: carSpec['Driving Range (km)'] || 'N/A',
            engineType: carSpec['Engine Type'] || 'N/A',
            engine: carSpec['Engine Power (cc)'] || 'N/A',
            mileage: carSpec['Mileage (ARAI) (kmpl)'] || 'N/A',
            topSpeed: carSpec['Top Speed (kmph)'] || 'N/A',
            wheels: carSpec['Wheels'] || 'N/A',
            parkingAssist: carSpec['Parking Assist'] || 'N/A',
            driveModes: carSpec['Drive Modes'] || 'N/A',
            headlights: carSpec['Headlights'] || 'N/A',
            airConditioner: carSpec['Air Conditioner'] || 'N/A',
            display: carSpec['Display'] || 'N/A',
            headUnitSize: carSpec['Head Unit Size(inch)'] || 'N/A'
          };
        } catch (err) {
          console.error(`Error fetching car details for ${carModel} - ${version}:`, err);
          return {
            carModel,
            version,
            carColor,  // Added car color
            matchPercentage,
            details: 'Error fetching car details',
          };
        }
      })
    );

    // Return the details of the top 4 recommended cars
    return NextResponse.json({ success: true, data: carDetails });
  } catch (error) {
    console.error('Error fetching top 4 recommendations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
