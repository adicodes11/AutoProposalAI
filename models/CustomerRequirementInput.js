import mongoose from 'mongoose';

// Combined CustomerRequirementInputSchema with sessionId
const CustomerRequirementInputSchema = new mongoose.Schema({
  budgetMin: { type: Number, required: true },
  budgetMax: { type: Number, required: true },
  location: { type: String, required: true },
  bodyStyle: { type: [String], default: [] },
  fuelType: { type: String },
  transmissionType: { type: String },
  drivingRange: { type: String },
  seatingCapacity: { type: Number },
  primaryUse: { type: String },
  carColor: { type: String },

  // DetailedRequirement1 fields
  enginePower: { type: String },
  batteryCapacity: { type: String },
  driveModes: { type: String },

  // Exterior Design
  exteriorDesign: { type: [String], default: [] },
  groundClearance: { type: String },

  // Fuel Tank & Boot Space as ranges
  fuelTankCapacityMin: { type: Number, default: null },
  fuelTankCapacityMax: { type: Number, default: null },
  bootSpaceMin: { type: Number, default: null },
  bootSpaceMax: { type: Number, default: null },

  // Non-nested Exterior Lighting fields
  fogLights: { type: String },
  daytimeRunningLights: { type: String },
  headlights: { type: String },
  automaticHeadlamps: { type: String },
  followMeHomeHeadlamps: { type: String },
  taillights: { type: String },

  // Safety Features
  safetyFeatures: { type: [String], default: [] },

  // Entertainment Features
  entertainmentFeatures: { type: [String], default: [] },

  // Comfort Features
  comfortFeatures: { type: [String], default: [] },

  // Driving Assistance Features
  drivingAssistanceFeatures: { type: [String], default: [] },

  // Driving Experience
  drivingExperience: { type: String },

  // DetailedRequirement2 fields

  // Window & Mirror Features
  windowMirrorFeatures: { type: [String], default: [] },

  // Connected Car Features
  connectedCarFeatures: { type: [String], default: [] },

  // Infotainment & Connectivity Features
  infotainmentFeatures: { type: [String], default: [] },

  // Additional Fields from detailedRequirement2
  additionalFeatures: { type: String }, // Custom input for additional features
  carModelVariant: { type: String }, // Custom input for car model and variant
  extendedWarranty: { type: String }, // Radio input for extended warranties
  registrationInsurance: { type: String }, // Radio input for registration and insurance assistance

  // Created By and Taken From Fields
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  takenFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference if taken from another user

  // Session ID for tracking
  sessionId: { type: String, required: true }, // A common session ID for tracking
  
}, { timestamps: true });

const CustomerRequirementInput = mongoose.models.CustomerRequirementInput || mongoose.model('CustomerRequirementInput', CustomerRequirementInputSchema);

export default CustomerRequirementInput;
