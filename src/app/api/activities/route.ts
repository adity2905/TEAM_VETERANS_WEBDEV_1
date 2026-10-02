import { NextResponse } from 'next/server';
import { INITIAL_POSTS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    count: INITIAL_POSTS.length,
    data: INITIAL_POSTS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.ngo_id) {
      return NextResponse.json(
        { status: 'error', message: 'Activity title and NGO ID are required' },
        { status: 400 }
      );
    }

    const newActivity = {
      ...body,
      id: `act-${Date.now()}`,
      created_at: new Date().toISOString(),
      likes_count: 0,
    };

    return NextResponse.json({ status: 'success', data: newActivity }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to record activity' },
      { status: 500 }
    );
  }
}
