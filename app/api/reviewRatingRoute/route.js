import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/config/db';
import ReviewRating from '@/models/ReviewRating';

export async function POST(req) {
  try {
    const { carModel, rating, review, sessionId, userId } = await req.json();

    // Validation: Ensure all fields are provided
    if (!carModel || !rating || !review || !sessionId || !userId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    await ConnectDB();

    // Create a new review and rating document
    const newReviewRating = await ReviewRating.create({
      carModel,
      userId,
      sessionId,
      rating,
      review,
    });

    return NextResponse.json({ success: true, data: newReviewRating }, { status: 201 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}
