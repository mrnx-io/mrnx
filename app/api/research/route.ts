import { NextRequest, NextResponse } from 'next/server';

// Edge runtime has 300s timeout (vs 10s for Node.js hobby)
export const runtime = 'edge';
export const maxDuration = 300;

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

    // Call Modal endpoint with AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 290000); // 290s timeout

    try {
      const response = await fetch(MODAL_RESEARCH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

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
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Research timed out after 290 seconds' },
          { status: 504 }
        );
      }
      throw fetchError;
    }
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
  return NextResponse.json({ status: 'ok', runtime: 'edge', modal_url: MODAL_RESEARCH_URL });
}