import { NextResponse } from 'next/server';
import User from '@/models/UserModel';  
import { ConnectDB } from '@/lib/config/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';  // For sending OTP emails

// Helper function to check if password is in the breached list
async function isPasswordBreached(password) {
  const hash = bcrypt.hashSync(password, 10); // Hash the password
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5).toUpperCase();
  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const data = await response.text();
  return data.includes(suffix);
}

// Handle POST request to create a new user
export async function POST(request) {
  try {
    await ConnectDB(); // Await the DB connection

    const formData = await request.json(); // Parsing JSON data
    const { fullname, email, password } = formData;

    // Normalize email to lowercase to prevent case sensitivity issues
    const normalizedEmail = email.toLowerCase();

    // Check if the user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists!" }, { status: 400 });
    }

    // Check if the password is breached
    if (await isPasswordBreached(password)) {
      return NextResponse.json({ error: "Password has been found in a data breach. Please choose a different password." }, { status: 400 });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP and expiration time (e.g., 5 minutes from now)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60000); // OTP expires in 5 minutes

    // Create a new user in the database but mark them as unverified
    const newUser = await User.create({
      fullname,
      email: normalizedEmail,
      password: hashedPassword,
      otp,
      otpExpiry,
      verified: false,  // User is not verified yet
    });

    // Send OTP email to the user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: normalizedEmail,
      subject: 'Verify Your Email - OTP',
      text: `Your OTP for email verification is ${otp}. This OTP is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    // Return a success message along with sessionId (optional)
    const sessionId = crypto.randomBytes(16).toString('hex');
    return NextResponse.json({ msg: "OTP sent to email!", sessionId }, { status: 201 });
  } catch (error) {
    console.error("User registration failed:", error);
    return NextResponse.json({ error: "User registration failed!" }, { status: 500 });
  }
}
