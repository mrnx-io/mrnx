"use client";

import { useState, useCallback } from "react";

export interface ResearchStage {
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  startedAt?: Date;
  completedAt?: Date;
}

export interface ResearchTheme {
  name: string;
  description: string;
  confidence: number;
}

export interface ResearchContradiction {
  claim_a: string;
  claim_b: string;
  resolution: string;
}

export interface ResearchVulnerability {
  severity: string;
  finding: string;
  suggested_fix: string;
}

export interface ResearchResult {
  request_id: string;
  query: string;
  executive_summary: string;
  themes: ResearchTheme[];
  contradictions: ResearchContradiction[];
  open_questions: Array<{ question: string; reason: string }>;
  verification: {
    verdict: string;
    adjusted_confidence: number;
    vulnerabilities: ResearchVulnerability[];
  };
  duration_seconds: number;
  tokens_used: number;
  stages_completed: string[];
}

export interface UseResearchState {
  isLoading: boolean;
  error: string | null;
  result: ResearchResult | null;
  stages: ResearchStage[];
  startedAt: Date | null;
}

const DEFAULT_STAGES: ResearchStage[] = [
  { name: "L0: Query Planning", status: "pending" },
  { name: "L1: Discovery", status: "pending" },
  { name: "L2: Aggregation", status: "pending" },
  { name: "L3: Synthesis", status: "pending" },
  { name: "L4: Output", status: "pending" },
];

export function useResearch() {
  const [state, setState] = useState<UseResearchState>({
    isLoading: false,
    error: null,
    result: null,
    stages: DEFAULT_STAGES,
    startedAt: null,
  });

  const updateStage = useCallback(
    (stageName: string, status: ResearchStage["status"]) => {
      setState((prev) => ({
        ...prev,
        stages: prev.stages.map((stage) =>
          stage.name.includes(stageName)
            ? {
                ...stage,
                status,
                ...(status === "running" ? { startedAt: new Date() } : {}),
                ...(status === "completed" ? { completedAt: new Date() } : {}),
              }
            : stage
        ),
      }));
    },
    []
  );

  const runResearch = useCallback(
    async (query: string, sessionId?: string): Promise<ResearchResult | null> => {
      if (!query.trim()) {
        setState((prev) => ({ ...prev, error: "Query cannot be empty" }));
        return null;
      }

      setState({
        isLoading: true,
        error: null,
        result: null,
        stages: DEFAULT_STAGES.map((s) => ({ ...s, status: "pending" as const })),
        startedAt: new Date(),
      });

      // Start first stage
      updateStage("L0", "running");

      try {
        const response = await fetch("/api/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, sessionId }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Request failed: ${response.status}`);
        }

        const data = await response.json();

        // Map completed stages
        const completedStages = data.stages_completed || [];
        const updatedStages = DEFAULT_STAGES.map((stage) => {
          const stageKey = stage.name.split(":")[0].replace(" ", "_").toLowerCase();
          const isCompleted = completedStages.some(
            (s: string) => s.toLowerCase().includes(stageKey)
          );
          return {
            ...stage,
            status: isCompleted ? ("completed" as const) : ("pending" as const),
          };
        });

        const result: ResearchResult = {
          request_id: data.request_id,
          query: data.query,
          executive_summary: data.output?.executive_summary || "",
          themes: data.output?.themes || [],
          contradictions: data.output?.contradictions || [],
          open_questions: data.output?.open_questions || [],
          verification: data.output?.verification || {
            verdict: "PASS",
            adjusted_confidence: 0,
            vulnerabilities: [],
          },
          duration_seconds: data.duration_seconds,
          tokens_used: data.tokens_used,
          stages_completed: completedStages,
        };

        setState({
          isLoading: false,
          error: null,
          result,
          stages: updatedStages,
          startedAt: state.startedAt,
        });

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          stages: prev.stages.map((s) =>
            s.status === "running" ? { ...s, status: "failed" as const } : s
          ),
        }));

        return null;
      }
    },
    [updateStage, state.startedAt]
  );

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      result: null,
      stages: DEFAULT_STAGES,
      startedAt: null,
    });
  }, []);

  return {
    ...state,
    runResearch,
    reset,
  };
}