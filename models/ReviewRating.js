import mongoose from 'mongoose';

const ReviewRatingSchema = new mongoose.Schema({
  carModel: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming there's a User model
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ReviewRating = mongoose.models.ReviewRating || mongoose.model('ReviewRating', ReviewRatingSchema);
export default ReviewRating;
