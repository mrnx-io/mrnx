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

export interface ResearchResult {
  final_output: string;
  run_id: string;
  status: 'success' | 'error';
}

export interface LangGraphRunResponse {
  run_id: string;
}