import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  carModel: { type: String, required: true },
  version: { type: String, required: true },
  matchPercentage: { type: Number, required: true }
});

const top4RecommendationSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  recommendations: [recommendationSchema],  // Array of recommendations
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming `User` model exists
});

export default mongoose.models.Top4Recommendation || mongoose.model('Top4Recommendation', top4RecommendationSchema);
