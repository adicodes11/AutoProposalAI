import mongoose from 'mongoose';

const ValidatedProposalSignatureSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  signature: {
    type: String, // Storing the base64 string of the signature
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, // Assuming this refers to a user model
    ref: 'User', // Reference to User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ValidatedProposalSignatureSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const ValidatedProposalSignature = mongoose.models.ValidatedProposalSignature ||
  mongoose.model('ValidatedProposalSignature', ValidatedProposalSignatureSchema);

export default ValidatedProposalSignature;
