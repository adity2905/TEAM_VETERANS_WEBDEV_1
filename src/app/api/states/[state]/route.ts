import { NextResponse } from 'next/server';
import { STATE_METRICS, INITIAL_NGOS } from '@/lib/mockData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ state: string }> }
) {
  try {
    const { state } = await params;
    const cleanState = decodeURIComponent(state).toLowerCase().replace(/-/g, ' ');

    const stateData = STATE_METRICS.find(
      (s) => s.state.toLowerCase() === cleanState || s.state.toLowerCase().includes(cleanState)
    );

    if (!stateData) {
      return NextResponse.json(
        { status: 'error', message: `State '${state}' not found in registry` },
        { status: 404 }
      );
    }

    const stateNgos = INITIAL_NGOS.filter(
      (n) => (n.state && n.state.toLowerCase().includes(cleanState)) || n.location.toLowerCase().includes(cleanState)
    );

    return NextResponse.json({
      status: 'success',
      data: {
        ...stateData,
        ngos: stateNgos,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to retrieve state information' },
      { status: 500 }
    );
  }
}
