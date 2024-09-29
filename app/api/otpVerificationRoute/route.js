import { NextResponse } from 'next/server';
import User from '@/models/UserModel';  
import { ConnectDB } from '@/lib/config/db';

export async function POST(request) {
  try {
    await ConnectDB();

    const { email, otp } = await request.json();
    const normalizedEmail = email.toLowerCase();

    // Find the user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    // Check if the OTP matches and is not expired
    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return NextResponse.json({ error: "Invalid or expired OTP!" }, { status: 400 });
    }

    // Mark the user as verified and clear the OTP fields
    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "User verified successfully!" }, { status: 200 });
  } catch (error) {
    console.error("OTP verification failed:", error);
    return NextResponse.json({ error: "OTP verification failed!" }, { status: 500 });
  }
}
