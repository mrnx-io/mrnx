import { NextRequest, NextResponse } from "next/server";

// Backend configuration
// RD_ENGINE_URL: Direct Python backend on Vercel
// RESTATE_INGRESS_URL: Restate-powered durable execution (optional)
const RD_ENGINE_URL = process.env.RD_ENGINE_URL || "http://localhost:5000";
const RESTATE_INGRESS_URL = process.env.RESTATE_INGRESS_URL;

// Use Restate if configured, otherwise direct Python backend
const USE_RESTATE = Boolean(RESTATE_INGRESS_URL);

export interface ResearchRequest {
  query: string;
  sessionId?: string;
}

export interface ResearchResponse {
  request_id: string;
  query: string;
  output: {
    goal: string;
    executive_summary: string;
    themes: Array<{
      name: string;
      description: string;
      confidence: number;
    }>;
    contradictions: Array<{
      claim_a: string;
      claim_b: string;
      resolution: string;
    }>;
    open_questions: Array<{
      question: string;
      reason: string;
    }>;
    verification: {
      verdict: string;
      adjusted_confidence: number;
      vulnerabilities: Array<{
        severity: string;
        finding: string;
        suggested_fix: string;
      }>;
    };
  };
  stages_completed: string[];
  duration_seconds: number;
  tokens_used: number;
}

/**
 * POST /api/research
 *
 * Proxies research requests to the R&D Engine backend.
 * Supports two modes:
 * 1. Direct: Calls Python Flask backend on Vercel
 * 2. Restate: Uses Restate for durable execution (if RESTATE_INGRESS_URL is set)
 */
export async function POST(request: NextRequest) {
  try {
    const body: ResearchRequest = await request.json();

    if (!body.query || body.query.trim() === "") {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    let response: Response;

    if (USE_RESTATE) {
      // Mode 1: Restate-powered durable execution
      const restateUrl = `${RESTATE_INGRESS_URL}/ResearchEngine/run_research`;

      response = await fetch(restateUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: body.query,
          session_id: body.sessionId,
        }),
      });
    } else {
      // Mode 2: Direct Python backend call
      const backendUrl = `${RD_ENGINE_URL}/api/research`;

      response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: body.query,
        }),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error: ${response.status} - ${errorText}`);

      return NextResponse.json(
        {
          error: "Research failed",
          details: errorText,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    // Normalize response format (direct mode returns { status, data })
    if (!USE_RESTATE && result.status === "success") {
      return NextResponse.json(result.data);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Research API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/research/health
 *
 * Health check endpoint to verify backend connectivity.
 */
export async function GET() {
  try {
    let response: Response;

    if (USE_RESTATE) {
      // Check Restate health
      const restateUrl = `${RESTATE_INGRESS_URL}/ResearchEngine/health`;

      response = await fetch(restateUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
    } else {
      // Check Python backend health
      const backendUrl = `${RD_ENGINE_URL}/api/health`;

      response = await fetch(backendUrl, {
        method: "GET",
      });
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "unhealthy",
          backend: USE_RESTATE ? "restate" : "direct",
          error: "disconnected",
        },
        { status: 503 }
      );
    }

    const health = await response.json();

    return NextResponse.json({
      status: "healthy",
      backend: USE_RESTATE ? "restate" : "direct",
      details: health,
    });
  } catch {
    return NextResponse.json(
      {
        status: "unhealthy",
        backend: USE_RESTATE ? "restate" : "direct",
        error: "unreachable",
      },
      { status: 503 }
    );
  }
}