const mongoose = require('mongoose');

const UserDetailsSchema = new mongoose.Schema({
  designation: { type: String },
  fullName: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String },
  nationality: { type: String },
  mobileNo: { type: String },
  email: { type: String, required: true },  // The field containing the user's email
  residentialAddress: { type: String },
  sessionId: { type: String, required: true },  // Session ID for matching
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.UserDetails || mongoose.model('UserDetails', UserDetailsSchema);
