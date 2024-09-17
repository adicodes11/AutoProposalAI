import mongoose from 'mongoose';

const ValidatedProposalSignatureSchema = new mongoose.Schema({
  signature: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        const base64StrLength = value.length;
        const sizeInBytes = (base64StrLength * (3 / 4)) - (value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0);
        return sizeInBytes < 5 * 1024 * 1024;
      },
      message: 'Signature size exceeds the allowed limit of 5MB.',
    },
  },
  sessionId: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

const ValidatedProposalSignature =
  mongoose.models.ValidatedProposalSignature ||
  mongoose.model('ValidatedProposalSignature', ValidatedProposalSignatureSchema);

export default ValidatedProposalSignature;