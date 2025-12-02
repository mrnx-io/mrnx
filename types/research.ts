export interface LogEntry {
  level: string;
  message: string;
  source: string;
  timestamp: number;
}

export interface AgentState {
  agent_id: string;
  state: string;
  details: Record<string, unknown>;
  timestamp: number;
}

export interface ResearchPlan {
  query: string;
  goal_hash: string;
  angles: string[];
  agent_count: number;
  grok_agents: string[];
  claude_agents: string[];
  search_queries: Record<string, string[]>;
  depth: string;
}

export interface LangGraphMessage {
  type: 'log' | 'agent_state' | 'plan' | 'result' | 'error';
  data: unknown;
  timestamp: number;
}

export interface ResearchResult extends Record<string, unknown> {
  final_output?: string;
  run_id?: string;
  status?: 'success' | 'error' | 'streaming';
  executive_summary?: string;
  detailed_analysis?: string;
  themes?: Array<{ theme: string; confidence: number }>;
  contradictions?: Array<{ claims: string[]; resolution: string }>;
  open_questions?: string[];
  limitations?: string[];
  confidence?: number;
}

export interface LangGraphRunResponse {
  run_id: string;
}