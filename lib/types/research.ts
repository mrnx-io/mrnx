/**
 * Core type definitions for the Autonomous R&D Engine
 * TypeScript implementation for Restate + Vercel AI SDK
 */

// ============================================================
// GROK PERSONAS & DISCOVERY TYPES
// ============================================================

export type GrokPersona = "tech" | "news" | "contrarian" | "academic" | "practical";

export interface GrokAgentConfig {
  id: string;
  persona: GrokPersona;
  query: string;
  priority: number;  // 1=highest, 5=lowest
}

export interface Finding {
  id: string;
  claim: string;
  evidence: string;
  source: string;
  sourceUrl?: string;
  confidence: number;      // 0-1
  relevance: number;       // 0-1
  embedding?: number[];    // For deduplication (temporary)
}

export interface FieldReport {
  agentId: string;
  agentName: string;
  persona: GrokPersona;
  findings: Finding[];
  gaps: string[];
  confidence: number;
  tokensUsed: number;
  durationMs: number;
}

// ============================================================
// QUERY PLANNING TYPES
// ============================================================

export interface ResearchPlan {
  clarifiedQuery: string;
  goalObjective: string;
  goalHash: string;
  clarityScore: number;
  grokAgents: GrokAgentConfig[];
  searchQueries: Record<GrokPersona, string[]>;
  tokensUsed?: number;
}

// ============================================================
// AGGREGATION TYPES
// ============================================================

export interface AggregationResult {
  originalCount: number;
  deduplicatedCount: number;
  findings: Finding[];
  duplicatesRemoved: number;
  processingTimeMs: number;
  outlierCount?: number;
  compressionRatio?: number;
}

// ============================================================
// SYNTHESIS TYPES
// ============================================================

export interface Theme {
  name: string;
  description: string;
  supportingFindings: string[];  // Finding IDs
  confidence: number;
}

export interface Contradiction {
  claimA: string;
  claimB: string;
  sourceA: string;
  sourceB: string;
  resolution: string;
}

export interface OpenQuestion {
  question: string;
  reason: string;
  researchNeeded: boolean;
}

export interface SynthesisResult {
  executiveSummary: string;
  detailedAnalysis: string;
  themes: Theme[];
  contradictions: Contradiction[];
  openQuestions: OpenQuestion[];
  confidence: number;
  tokensUsed: number;
  iterationsUsed: number;
  feedbackApplied: string[];
}

// ============================================================
// VERIFICATION TYPES
// ============================================================

export type Verdict = "PASS" | "CONDITIONAL_PASS" | "FAIL";

export type AttackStrategy = 
  | "steel_man"
  | "source_reliability"
  | "temporal_validity"
  | "scope_limitation"
  | "bias_detection"
  | "contradiction"
  | "missing_evidence";

export interface Vulnerability {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  strategy: AttackStrategy;
  finding: string;
  evidence: string;
  impact: string;
  suggestedFix: string;
}

export interface VerificationReport {
  verdict: Verdict;
  vulnerabilities: Vulnerability[];
  originalConfidence: number;
  adjustedConfidence: number;
  confidenceReason: string;
  steelManAssessment: string;
  alternativeConclusions: string[];
  recommendations: Record<string, string>;
}

// ============================================================
// FINAL OUTPUT TYPES
// ============================================================

export interface FinalOutput {
  requestId: string;
  query: string;
  goal: string;
  executiveSummary: string;
  themes: Theme[];
  contradictions: Contradiction[];
  openQuestions: OpenQuestion[];
  verification: VerificationReport;
  sources: Finding[];
  metadata: OutputMetadata;
}

export interface OutputMetadata {
  durationSeconds: number;
  tokensUsed: number;
  layerTimings: Record<string, number>;
  agentContributions: Record<string, number>;
  confidence: number;
  iterationsUsed: number;
}

// ============================================================
// RESEARCH STATE (for Restate orchestration)
// ============================================================

export interface ResearchState {
  requestId: string;
  query: string;
  status?: ResearchStatus;
  plan?: ResearchPlan;
  clarifiedQuery?: string;
  goalHash?: string;
  fieldReports?: FieldReport[];
  aggregatedFindings?: Finding[];
  aggregation?: AggregationResult;
  synthesis?: SynthesisResult;
  verification?: VerificationReport;
  output?: FinalOutput;
  error?: string;
  startedAt?: number;
  completedAt?: number;
  layerTimings: Record<string, number>;
  tokensUsed: number;
}

export type ResearchStatus = 
  | "pending"
  | "planning"
  | "discovering"
  | "aggregating"
  | "synthesizing"
  | "verifying"
  | "formatting"
  | "completed"
  | "failed";

// ============================================================
// API TYPES
// ============================================================

export interface ResearchRequest {
  query: string;
  options?: ResearchOptions;
}

export interface ResearchOptions {
  maxFindings?: number;
  dedupThreshold?: number;
  thinkingBudget?: number;
  skipVerification?: boolean;
}