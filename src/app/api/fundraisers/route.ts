import { NextResponse } from 'next/server';
import { INITIAL_FUNDRAISERS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    count: INITIAL_FUNDRAISERS.length,
    data: INITIAL_FUNDRAISERS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.target_amount || !body.ngo_id) {
      return NextResponse.json(
        { status: 'error', message: 'Title, target amount, and NGO ID are required' },
        { status: 400 }
      );
    }

    const newFundraiser = {
      ...body,
      id: `fund-${Date.now()}`,
      raised_amount: 0,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ status: 'success', data: newFundraiser }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to create fundraiser' },
      { status: 500 }
    );
  }
}
