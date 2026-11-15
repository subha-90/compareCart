import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', references: ['4CSvyCB73', '5Ad0lVGO5'] });
}
