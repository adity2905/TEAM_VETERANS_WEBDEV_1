import { NextResponse } from 'next/server';
import { INITIAL_VOLUNTEER_NEEDS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    count: INITIAL_VOLUNTEER_NEEDS.length,
    data: INITIAL_VOLUNTEER_NEEDS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.ngo_id || !body.total_slots) {
      return NextResponse.json(
        { status: 'error', message: 'Title, NGO ID, and total slots are required' },
        { status: 400 }
      );
    }

    const newNeed = {
      ...body,
      id: `vol-${Date.now()}`,
      filled_slots: 0,
      status: 'open',
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ status: 'success', data: newNeed }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to create volunteer opportunity' },
      { status: 500 }
    );
  }
}
