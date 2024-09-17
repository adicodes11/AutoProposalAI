import { NextResponse } from 'next/server';
import UserDetails from '@/models/UserDetails';
import { ConnectDB } from '@/lib/config/db';

// POST request handler for saving user details and triggering the Python API
export async function POST(req) {
  try {
    // Parse the request body
    const {
      designation,
      fullName,
      dob,
      gender,
      nationality,
      mobileNo,
      email,
      residentialAddress,
      sessionId,
      createdBy,
      selectedCarModel,
      selectedVersion,
    } = await req.json();

    // Check for required fields
    if (
      !designation ||
      !fullName ||
      !dob ||
      !gender ||
      !mobileNo ||
      !email ||
      !residentialAddress ||
      !sessionId ||
      !createdBy ||
      !selectedCarModel ||
      !selectedVersion
    ) {
      return NextResponse.json(
        {
          error:
            'All fields are required, including sessionId, createdBy, car model, and car version.',
        },
        { status: 400 }
      );
    }

    // Validate mobile number format (10 digits)
    if (!/^\d{10}$/.test(mobileNo)) {
      return NextResponse.json(
        { error: 'Invalid mobile number. Must be a 10-digit number.' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 }
      );
    }

    // Connect to the MongoDB database
    await ConnectDB();

    // Save the user details in the database
    const userDetails = await UserDetails.create({
      designation,
      fullName,
      dob,
      gender,
      nationality,
      mobileNo,
      email,
      residentialAddress,
      sessionId,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Python API URL (use port 5001 as Python backend is running there)
    const pythonApiUrl = 'http://127.0.0.1:5001/generateProposal';

    // Data to send to Python API
    const pythonApiData = {
      sessionId,
      createdBy,
      carModelName: selectedCarModel, // Car model name from session
      versionName: selectedVersion, // Car version name from session
    };

    // Call Python API to generate the proposal
    const pythonResponse = await fetch(pythonApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pythonApiData),
    });

    // Check Python API response
    if (!pythonResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to generate the proposal in Python API.' },
        { status: 500 }
      );
    }

    const proposalData = await pythonResponse.json(); // Get the generated proposal data

    // Return success response with the saved user details and proposal data
    return NextResponse.json({
      success: true,
      userDetails,
      proposalData,
      message: 'User details saved and proposal generated successfully.',
    });
  } catch (error) {
    // Catch and log any server errors
    console.error('Error saving user details or generating proposal:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
