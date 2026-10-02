import { NextResponse } from 'next/server';
import { STATE_METRICS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    count: STATE_METRICS.length,
    disclaimer: 'Demo platform data — not official government statistics',
    data: STATE_METRICS,
  });
}
