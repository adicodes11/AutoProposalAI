import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp: { // OTP field
        type: String,
        required: false,
    },
    otpExpiry: { // OTP expiration time
        type: Date,
        required: false,
    },
    verified: { // Verification status
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,  // Use Date.now without parentheses
    },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
