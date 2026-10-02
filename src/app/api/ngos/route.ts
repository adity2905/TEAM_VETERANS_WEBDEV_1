import { NextResponse } from 'next/server';
import { INITIAL_NGOS } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const cause = searchParams.get('cause');

    let results = INITIAL_NGOS;

    if (state) {
      const q = state.toLowerCase().trim();
      results = results.filter(
        (n) => (n.state && n.state.toLowerCase().includes(q)) || n.location.toLowerCase().includes(q)
      );
    }

    if (cause) {
      const q = cause.toLowerCase().trim();
      results = results.filter(
        (n) => n.category.toLowerCase().includes(q) || (n.causes && n.causes.some((c) => c.toLowerCase().includes(q)))
      );
    }

    // Strip private internal fields for public consumption
    const sanitized = results.map(({ ...publicData }) => publicData);

    return NextResponse.json({
      status: 'success',
      count: sanitized.length,
      data: sanitized,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Unable to retrieve NGO records' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.category) {
      return NextResponse.json(
        { status: 'error', message: 'Organization name and category are required' },
        { status: 400 }
      );
    }

    const newNGO = {
      ...body,
      id: `ngo-${Date.now()}`,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      verified: false,
      verification_status: 'pending_review',
      transparency_score: 85,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ status: 'success', data: newNGO }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to process NGO registration' },
      { status: 500 }
    );
  }
}
