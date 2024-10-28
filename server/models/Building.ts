import mongoose from 'mongoose';

const buildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  targetTemperature: { type: Number, required: true },
  autoAdjustEnabled: { type: Boolean, default: true },
  peakThreshold: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Building || mongoose.model('Building', buildingSchema);