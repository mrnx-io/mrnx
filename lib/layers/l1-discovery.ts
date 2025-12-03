/**
 * L1: Discovery Layer
 * 
 * Executes 5 parallel Grok agents for comprehensive information gathering.
 * Each agent has a unique persona and specialized query.
 */

import type { 
  GrokAgentConfig, 
  FieldReport, 
  Finding,
  GrokPersona 
} from "../types/research";

const XAI_API_URL = "https://api.x.ai/v1/chat/completions";

const PERSONA_PROMPTS: Record<GrokPersona, string> = {
  tech: `You are a technical expert focused on implementation details, architecture, code examples, and engineering best practices. Search for technical documentation, GitHub repos, and engineering blogs.`,
  
  news: `You are a news analyst focused on recent developments, announcements, company news, and emerging trends. Search for recent articles, press releases, and industry updates.`,
  
  contrarian: `You are a critical analyst who looks for alternative viewpoints, risks, limitations, and criticisms. Search for failure cases, criticisms, and alternative approaches.`,
  
  academic: `You are an academic researcher focused on theoretical foundations, research papers, and scientific evidence. Search for peer-reviewed papers, academic sources, and theoretical frameworks.`,
  
  practical: `You are a practitioner focused on real-world applications, case studies, and hands-on experience. Search for case studies, user experiences, and practical implementations.`,
};

export interface DiscoveryConfig {
  xaiApiKey: string;
  model?: string;
  maxTokens?: number;
}

interface GrokResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    total_tokens: number;
  };
}

async function runGrokAgent(
  agent: GrokAgentConfig,
  config: DiscoveryConfig
): Promise<FieldReport> {
  const startTime = Date.now();
  
  const systemPrompt = PERSONA_PROMPTS[agent.persona];
  
  const response = await fetch(XAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.xaiApiKey}`,
    },
    body: JSON.stringify({
      model: config.model || "grok-beta",
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `Research the following query and provide detailed findings with sources.

Query: ${agent.query}

Respond with a JSON array of findings:
[
  {
    "claim": "Main finding or claim",
    "evidence": "Supporting evidence or details",
    "source": "Source name",
    "source_url": "https://...",
    "confidence": 0.85,
    "relevance": 0.9
  }
]

Include 3-7 findings. Be specific and cite sources.` 
        },
      ],
      max_tokens: config.maxTokens || 4000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Grok API error: ${response.status} - ${error}`);
  }

  const data: GrokResponse = await response.json();
  const content = data.choices[0]?.message?.content || "[]";
  
  // Parse findings from response
  let findings: Finding[] = [];
  try {
    const parsed = JSON.parse(content);
    findings = (Array.isArray(parsed) ? parsed : []).map((f: {
      claim?: string;
      evidence?: string;
      source?: string;
      source_url?: string;
      confidence?: number;
      relevance?: number;
    }, idx: number) => ({
      id: `${agent.id}_${idx}`,
      claim: f.claim || "",
      evidence: f.evidence || "",
      source: f.source || "Unknown",
      sourceUrl: f.source_url,
      confidence: f.confidence || 0.7,
      relevance: f.relevance || 0.7,
    }));
  } catch {
    // If JSON parsing fails, create a single finding from the text
    findings = [{
      id: `${agent.id}_0`,
      claim: content.substring(0, 500),
      evidence: content,
      source: "Grok Analysis",
      confidence: 0.6,
      relevance: 0.6,
    }];
  }

  return {
    agentId: agent.id,
    agentName: `Grok ${agent.persona}`,
    persona: agent.persona,
    findings,
    gaps: [],
    confidence: findings.length > 0 ? 0.8 : 0.3,
    tokensUsed: data.usage?.total_tokens || 0,
    durationMs: Date.now() - startTime,
  };
}

export async function runDiscovery(
  agents: GrokAgentConfig[],
  config: DiscoveryConfig
): Promise<FieldReport[]> {
  // Run all agents in parallel
  const results = await Promise.allSettled(
    agents.map(agent => runGrokAgent(agent, config))
  );

  // Collect successful results
  const reports: FieldReport[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      reports.push(result.value);
    } else {
      console.error("Agent failed:", result.reason);
    }
  }

  return reports;
}