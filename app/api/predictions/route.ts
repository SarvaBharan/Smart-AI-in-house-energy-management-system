import { NextResponse } from 'next/server';
import connectDB from '@/server/lib/db';
import EnergyData from '@/server/models/EnergyData';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const buildingId = searchParams.get('buildingId');
    
    if (!buildingId) {
      return NextResponse.json({ error: 'Building ID is required' }, { status: 400 });
    }

    const currentDate = new Date();
    const predictions = await EnergyData.find({
      buildingId,
      timestamp: { $gte: currentDate },
      predictedConsumption: { $exists: true }
    }).sort({ timestamp: 1 }).limit(24);

    return NextResponse.json(predictions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 });
  }
}