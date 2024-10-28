import { NextResponse } from 'next/server';
import connectDB from '@/server/lib/db';
import Building from '@/server/models/Building';

export async function GET() {
  try {
    await connectDB();
    const buildings = await Building.find({});
    return NextResponse.json(buildings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch buildings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const building = await Building.create(data);
    return NextResponse.json(building, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create building' }, { status: 500 });
  }
}