import { NextRequest, NextResponse } from 'next/server';

// Node.js runtime with Fluid Compute (enable in Vercel dashboard)
// Supports up to 60s free, 14 min paid
export const runtime = 'nodejs';
export const maxDuration = 600; // Match Modal timeout

const MODAL_RESEARCH_URL = process.env.MODAL_RESEARCH_URL || 'https://mrnx-io--autonomous-rd-engine-research.modal.run';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    console.log(`[Research API] Starting research for: ${query}`);

    // Call Modal endpoint
    const response = await fetch(MODAL_RESEARCH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Research API] Modal error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: `Research failed: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log(`[Research API] Research complete for run_id: ${result.run_id}`);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Research API] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    runtime: 'nodejs',
    maxDuration: 60,
    note: 'Enable Fluid Compute in Vercel dashboard for extended duration',
    modal_url: MODAL_RESEARCH_URL 
  });
}