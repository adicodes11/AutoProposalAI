const mongoose = require('mongoose');

// Helper function to generate unique PID in the required format
const generateUniquePID = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  const randomPart = Math.floor(1000 + Math.random() * 9000);  // 4-digit random number for uniqueness
  return `${year}${month}${day}-AC-${randomPart}`;
};

const ProposalSchema = new mongoose.Schema({
  PID: {
    type: String,
    default: generateUniquePID,
    unique: true  // Ensure PID is always unique
  },
  sessionId: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },    
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure updatedAt is updated on document changes
ProposalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.Proposal || mongoose.model('Proposal', ProposalSchema);
