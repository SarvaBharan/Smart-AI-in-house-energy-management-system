import mongoose from 'mongoose';

const energyDataSchema = new mongoose.Schema({
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
  timestamp: { type: Date, required: true },
  consumption: { type: Number, required: true },
  predictedConsumption: { type: Number, required: true },
  temperature: { type: Number, required: true },
  optimizationEnabled: { type: Boolean, default: true }
});

export default mongoose.models.EnergyData || mongoose.model('EnergyData', energyDataSchema);