import { NextRequest, NextResponse } from 'next/server';
import { fetchRealtimeProduct } from '@/src/lib/scrapers/coordinator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body?.query || body?.url || '';

    if (!query) {
      return NextResponse.json({ error: 'Search query or URL is required' }, { status: 400 });
    }

    const data = await fetchRealtimeProduct(query);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch realtime data' },
      { status: 500 }
    );
  }
}
