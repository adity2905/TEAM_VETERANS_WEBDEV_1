import { NextResponse } from 'next/server';
import { INITIAL_NGOS } from '@/lib/mockData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ngo = INITIAL_NGOS.find(
      (n) => n.id === id || n.slug === id
    );

    if (!ngo) {
      return NextResponse.json(
        { status: 'error', message: 'NGO not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: 'success', data: ngo });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch NGO' },
      { status: 500 }
    );
  }
}
