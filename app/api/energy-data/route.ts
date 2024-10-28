import { NextResponse } from 'next/server';
import connectDB from '@/server/lib/db';
import EnergyData from '@/server/models/EnergyData';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const buildingId = searchParams.get('buildingId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const query: any = {};
    if (buildingId) query.buildingId = buildingId;
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const energyData = await EnergyData.find(query).sort({ timestamp: 1 });
    return NextResponse.json(energyData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch energy data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const energyData = await EnergyData.create(data);
    return NextResponse.json(energyData, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create energy data' }, { status: 500 });
  }
}