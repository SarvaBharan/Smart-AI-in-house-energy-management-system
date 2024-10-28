import { NextResponse } from 'next/server';
import connectDB from '@/server/lib/db';
import Building from '@/server/models/Building';
import EnergyData from '@/server/models/EnergyData';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { buildingId } = await request.json();
    
    if (!buildingId) {
      return NextResponse.json({ error: 'Building ID is required' }, { status: 400 });
    }

    const building = await Building.findById(buildingId);
    if (!building) {
      return NextResponse.json({ error: 'Building not found' }, { status: 404 });
    }

    // Simulate optimization logic
    const currentConsumption = await EnergyData.findOne({ buildingId }).sort({ timestamp: -1 });
    const optimizationResult = {
      buildingId,
      timestamp: new Date(),
      consumption: currentConsumption ? currentConsumption.consumption * 0.9 : 0,
      predictedConsumption: currentConsumption ? currentConsumption.predictedConsumption * 0.85 : 0,
      temperature: building.targetTemperature,
      optimizationEnabled: true
    };

    const newEnergyData = await EnergyData.create(optimizationResult);
    return NextResponse.json(newEnergyData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to optimize energy consumption' }, { status: 500 });
  }
}