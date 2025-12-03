/**
 * L3: Synthesis Layer
 * 
 * Generate research report with adversarial verification.
 * Uses feedback iteration: Generate → Verify → Improve
 */

import Anthropic from "@anthropic-ai/sdk";
import type { 
  Finding, 
  SynthesisResult, 
  VerificationReport,
  Theme,
  Contradiction,
  OpenQuestion,
  Vulnerability,
  Verdict,
} from "../types/research";

const SYNTHESIS_PROMPT = `You are a research synthesis expert. Analyze the findings and produce a comprehensive research report.

## Output Format (JSON)
{
  "executive_summary": "2-3 paragraph summary of key insights",
  "detailed_analysis": "In-depth analysis markdown",
  "themes": [
    {
      "name": "Theme name",
      "description": "Description of this theme",
      "supporting_findings": ["finding_id_1", "finding_id_2"],
      "confidence": 0.85
    }
  ],
  "contradictions": [
    {
      "claim_a": "First contradicting claim",
      "claim_b": "Second contradicting claim",
      "source_a": "Source of claim A",
      "source_b": "Source of claim B",
      "resolution": "How to reconcile or which is more reliable"
    }
  ],
  "open_questions": [
    {
      "question": "What remains unanswered?",
      "reason": "Why this is important",
      "research_needed": true
    }
  ],
  "confidence": 0.75
}

## Rules
- Identify 3-7 major themes
- Surface ALL contradictions - don't hide disagreements
- Note confidence levels honestly
- Cite finding IDs to support claims
`;

const VERIFICATION_PROMPT = `You are an adversarial verifier. Your job is to ATTACK the synthesis and find weaknesses.

## Attack Strategies
1. steel_man: What's the strongest counter-argument?
2. source_reliability: Are the sources credible?
3. temporal_validity: Is the information current?
4. scope_limitation: Is the research overgeneralizing?
5. bias_detection: Is there systematic bias?
6. contradiction: Are there internal inconsistencies?
7. missing_evidence: What claims lack support?

## Output Format (JSON)
{
  "verdict": "PASS" or "CONDITIONAL_PASS" or "FAIL",
  "vulnerabilities": [
    {
      "id": "v1",
      "severity": "critical" or "high" or "medium" or "low",
      "strategy": "steel_man",
      "finding": "What's wrong",
      "evidence": "Why it's wrong",
      "impact": "How it affects conclusions",
      "suggested_fix": "How to address it"
    }
  ],
  "original_confidence": 0.75,
  "adjusted_confidence": 0.65,
  "confidence_reason": "Why confidence was adjusted",
  "steel_man_assessment": "The strongest case against the synthesis",
  "alternative_conclusions": ["Alternative interpretation 1"],
  "recommendations": {
    "high_priority": "Most important fix",
    "medium_priority": "Secondary fixes"
  }
}
`;

export interface SynthesisConfig {
  anthropicApiKey: string;
  model?: string;
  thinkingBudget?: number;
  maxIterations?: number;
}

async function generateSynthesis(
  findings: Finding[],
  goalObjective: string,
  previousFeedback: string | null,
  config: SynthesisConfig
): Promise<{ synthesis: SynthesisResult; tokensUsed: number }> {
  const client = new Anthropic({ apiKey: config.anthropicApiKey });
  
  const findingsText = findings.map(f => 
    `[${f.id}] ${f.claim}\nEvidence: ${f.evidence}\nSource: ${f.source} (confidence: ${f.confidence})`
  ).join("\n\n");
  
  let userContent = `${SYNTHESIS_PROMPT}

## Research Goal
${goalObjective}

## Findings
${findingsText}

Respond with JSON only.`;

  if (previousFeedback) {
    userContent += `\n\n## Previous Verification Feedback (MUST ADDRESS)
${previousFeedback}`;
  }

  const response = await client.messages.create({
    model: config.model || "claude-sonnet-4-20250514",
    max_tokens: 16000,
    thinking: {
      type: "enabled",
      budget_tokens: config.thinkingBudget || 10000,
    },
    messages: [{ role: "user", content: userContent }],
  });

  let jsonText = "";
  for (const block of response.content) {
    if (block.type === "text") {
      jsonText = block.text;
      break;
    }
  }

  const parsed = JSON.parse(jsonText);
  
  const themes: Theme[] = (parsed.themes || []).map((t: {
    name: string;
    description: string;
    supporting_findings?: string[];
    confidence?: number;
  }) => ({
    name: t.name,
    description: t.description,
    supportingFindings: t.supporting_findings || [],
    confidence: t.confidence || 0.7,
  }));

  const contradictions: Contradiction[] = (parsed.contradictions || []).map((c: {
    claim_a: string;
    claim_b: string;
    source_a: string;
    source_b: string;
    resolution: string;
  }) => ({
    claimA: c.claim_a,
    claimB: c.claim_b,
    sourceA: c.source_a,
    sourceB: c.source_b,
    resolution: c.resolution,
  }));

  const openQuestions: OpenQuestion[] = (parsed.open_questions || []).map((q: {
    question: string;
    reason: string;
    research_needed?: boolean;
  }) => ({
    question: q.question,
    reason: q.reason,
    researchNeeded: q.research_needed ?? true,
  }));

  return {
    synthesis: {
      executiveSummary: parsed.executive_summary || "",
      detailedAnalysis: parsed.detailed_analysis || "",
      themes,
      contradictions,
      openQuestions,
      confidence: parsed.confidence || 0.7,
      tokensUsed: response.usage?.output_tokens || 0,
      iterationsUsed: 0,
      feedbackApplied: [],
    },
    tokensUsed: response.usage?.output_tokens || 0,
  };
}

async function verifySynthesis(
  synthesis: SynthesisResult,
  findings: Finding[],
  config: SynthesisConfig
): Promise<VerificationReport> {
  const client = new Anthropic({ apiKey: config.anthropicApiKey });
  
  const synthesisText = `
Executive Summary: ${synthesis.executiveSummary}

Themes: ${synthesis.themes.map(t => `- ${t.name}: ${t.description}`).join("\n")}

Contradictions: ${synthesis.contradictions.map(c => `- ${c.claimA} vs ${c.claimB}`).join("\n")}

Confidence: ${synthesis.confidence}
`;

  const response = await client.messages.create({
    model: config.model || "claude-sonnet-4-20250514",
    max_tokens: 8000,
    thinking: {
      type: "enabled",
      budget_tokens: 5000,
    },
    messages: [{
      role: "user",
      content: `${VERIFICATION_PROMPT}

## Synthesis to Verify
${synthesisText}

## Original Findings (${findings.length} total)
${findings.slice(0, 10).map(f => `[${f.id}] ${f.claim}`).join("\n")}

Respond with JSON only.`,
    }],
  });

  let jsonText = "";
  for (const block of response.content) {
    if (block.type === "text") {
      jsonText = block.text;
      break;
    }
  }

  const parsed = JSON.parse(jsonText);

  const vulnerabilities: Vulnerability[] = (parsed.vulnerabilities || []).map((v: {
    id: string;
    severity: string;
    strategy: string;
    finding: string;
    evidence: string;
    impact: string;
    suggested_fix: string;
  }) => ({
    id: v.id,
    severity: v.severity as Vulnerability["severity"],
    strategy: v.strategy as Vulnerability["strategy"],
    finding: v.finding,
    evidence: v.evidence,
    impact: v.impact,
    suggestedFix: v.suggested_fix,
  }));

  return {
    verdict: (parsed.verdict || "PASS") as Verdict,
    vulnerabilities,
    originalConfidence: parsed.original_confidence || synthesis.confidence,
    adjustedConfidence: parsed.adjusted_confidence || synthesis.confidence,
    confidenceReason: parsed.confidence_reason || "",
    steelManAssessment: parsed.steel_man_assessment || "",
    alternativeConclusions: parsed.alternative_conclusions || [],
    recommendations: parsed.recommendations || {},
  };
}

export async function synthesizeAndVerify(
  findings: Finding[],
  goalObjective: string,
  config: SynthesisConfig
): Promise<{ synthesis: SynthesisResult; verification: VerificationReport }> {
  const maxIterations = config.maxIterations ?? 2;
  let synthesis: SynthesisResult | null = null;
  let verification: VerificationReport | null = null;
  let feedback: string | null = null;
  let totalTokens = 0;
  const feedbackApplied: string[] = [];

  for (let i = 0; i < maxIterations; i++) {
    // Generate synthesis
    const result = await generateSynthesis(findings, goalObjective, feedback, config);
    synthesis = result.synthesis;
    totalTokens += result.tokensUsed;

    // Verify synthesis
    verification = await verifySynthesis(synthesis, findings, config);

    // Check if we need another iteration
    const hasCritical = verification.vulnerabilities.some(v => v.severity === "critical");
    
    if (!hasCritical || i === maxIterations - 1) {
      break;
    }

    // Build feedback for next iteration
    const criticalVulns = verification.vulnerabilities.filter(v => v.severity === "critical");
    feedback = criticalVulns.map(v => 
      `CRITICAL: ${v.finding}\nFix: ${v.suggestedFix}`
    ).join("\n\n");
    feedbackApplied.push(...criticalVulns.map(v => v.id));
  }

  // Update synthesis with iteration info
  synthesis!.iterationsUsed = feedbackApplied.length > 0 ? 2 : 1;
  synthesis!.feedbackApplied = feedbackApplied;
  synthesis!.tokensUsed = totalTokens;

  return {
    synthesis: synthesis!,
    verification: verification!,
  };
}