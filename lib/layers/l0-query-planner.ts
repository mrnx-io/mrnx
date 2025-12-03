/**
 * L0: Query Planner
 * 
 * Single Claude call for clarification + research planning.
 * Uses extended thinking for deep reasoning.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { 
  ResearchPlan, 
  GrokAgentConfig, 
  GrokPersona 
} from "../types/research";
import { createHash } from "crypto";

const QUERY_PLANNER_PROMPT = `You are a research planning expert. Your task is to:

1. CLARIFY the user's query - make it specific and actionable
2. PLAN the research strategy - assign Grok agents with specific queries

## Output Format (JSON)
{
  "clarified_query": "The refined, specific query",
  "goal_objective": "Clear objective statement",
  "clarity_score": 8,  // 1-10 how clear the query is
  "grok_agents": [
    {
      "id": "tech_1",
      "persona": "tech",
      "query": "Specific technical query for this agent",
      "priority": 1
    }
  ],
  "search_queries": {
    "tech": ["query1", "query2"],
    "news": ["query1"],
    "contrarian": ["query1"],
    "academic": ["query1"],
    "practical": ["query1"]
  }
}

## Grok Personas (use ALL 5 for comprehensive research)
- tech: Technical implementation, architecture, code
- news: Recent developments, announcements, trends
- contrarian: Alternative viewpoints, criticisms, risks
- academic: Research papers, theoretical foundations
- practical: Real-world applications, case studies

## Rules
- Always use all 5 personas for comprehensive coverage
- Each agent gets a specialized query tailored to their perspective
- Priority 1 = most important, 5 = least important
`;

export interface QueryPlannerConfig {
  anthropicApiKey: string;
  model?: string;
  thinkingBudget?: number;
}

export async function planQuery(
  query: string,
  config: QueryPlannerConfig
): Promise<ResearchPlan> {
  const client = new Anthropic({ apiKey: config.anthropicApiKey });
  
  const response = await client.messages.create({
    model: config.model || "claude-sonnet-4-20250514",
    max_tokens: 16000,
    thinking: {
      type: "enabled",
      budget_tokens: config.thinkingBudget || 10000,
    },
    messages: [
      {
        role: "user",
        content: `${QUERY_PLANNER_PROMPT}\n\n## User Query\n${query}\n\nRespond with JSON only, no markdown.`,
      },
    ],
  });

  // Extract text content from response
  let jsonText = "";
  for (const block of response.content) {
    if (block.type === "text") {
      jsonText = block.text;
      break;
    }
  }

  // Parse JSON response
  const parsed = JSON.parse(jsonText);
  
  // Generate goal hash for persistence
  const goalHash = createHash("sha256")
    .update(parsed.clarified_query || query)
    .digest("hex")
    .substring(0, 16);

  // Convert to typed structure
  const grokAgents: GrokAgentConfig[] = (parsed.grok_agents || []).map(
    (agent: { id: string; persona: string; query: string; priority: number }) => ({
      id: agent.id,
      persona: agent.persona as GrokPersona,
      query: agent.query,
      priority: agent.priority,
    })
  );

  // Ensure all 5 personas are covered
  const personas: GrokPersona[] = ["tech", "news", "contrarian", "academic", "practical"];
  for (const persona of personas) {
    if (!grokAgents.find(a => a.persona === persona)) {
      grokAgents.push({
        id: `${persona}_auto`,
        persona,
        query: `${parsed.clarified_query} - ${persona} perspective`,
        priority: 5,
      });
    }
  }

  return {
    clarifiedQuery: parsed.clarified_query || query,
    goalObjective: parsed.goal_objective || query,
    goalHash,
    clarityScore: parsed.clarity_score || 7,
    grokAgents,
    searchQueries: parsed.search_queries || {},
  };
}