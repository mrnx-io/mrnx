import { useState, useCallback, useRef } from 'react';
import { LogEntry, AgentState, ResearchPlan, ResearchResult } from '../types/research';

interface UseModalResearchReturn {
  isConnected: boolean;
  isProcessing: boolean;
  logs: LogEntry[];
  agents: AgentState[];
  plan: ResearchPlan | null;
  result: ResearchResult | null;
  error: string | null;
  startResearch: (query: string) => Promise<void>;
  clearLogs: () => void;
}

/**
 * Hook for research using Modal-deployed Autonomous R&D Engine.
 * Calls Modal directly to bypass Vercel function timeout limits.
 */
export function useModalResearch(): UseModalResearchReturn {
  const [isConnected] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [plan, setPlan] = useState<ResearchPlan | null>(null);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const addLog = useCallback((level: string, message: string, source: string) => {
    setLogs(prev => [...prev, { 
      level, 
      message, 
      source, 
      timestamp: Date.now() / 1000 
    }].slice(-100));
  }, []);

  const startResearch = useCallback(async (query: string) => {
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsProcessing(true);
    setError(null);
    setResult(null);
    setPlan(null);
    
    addLog('INFO', `Initializing research: ${query}`, 'user');

    // Set up plan
    const researchPlan: ResearchPlan = {
      query,
      goal_hash: `modal-${Date.now().toString(16).substring(0, 8)}`,
      angles: ['primary', 'synthesis', 'verification'],
      agent_count: 5,
      grok_agents: ['grok_tech', 'grok_news', 'grok_contrarian', 'grok_academic', 'grok_practical'],
      claude_agents: ['claude-synthesizer', 'claude-verifier'],
      search_queries: {
        primary: [`${query} overview`, `${query} latest`],
        synthesis: [`${query} analysis`, `${query} insights`],
      },
      depth: 'comprehensive',
    };
    setPlan(researchPlan);
    addLog('INFO', 'Research plan initialized', 'orchestrator');

    // Set agent states - all active initially
    const initialAgents: AgentState[] = [
      { agent_id: 'grok_tech', state: 'active', details: {}, timestamp: Date.now() / 1000 },
      { agent_id: 'grok_news', state: 'active', details: {}, timestamp: Date.now() / 1000 },
      { agent_id: 'grok_contrarian', state: 'active', details: {}, timestamp: Date.now() / 1000 },
      { agent_id: 'grok_academic', state: 'active', details: {}, timestamp: Date.now() / 1000 },
      { agent_id: 'grok_practical', state: 'active', details: {}, timestamp: Date.now() / 1000 },
      { agent_id: 'claude-synthesizer', state: 'pending', details: {}, timestamp: Date.now() / 1000 },
      { agent_id: 'claude-verifier', state: 'pending', details: {}, timestamp: Date.now() / 1000 },
    ];
    setAgents(initialAgents);

    try {
      addLog('INFO', 'Connecting to Modal backend...', 'core');

      // Simulate L0 progress
      setTimeout(() => {
        addLog('INFO', 'L0: Query planning complete', 'planner');
        setAgents(prev => prev.map(a => 
          a.agent_id === 'claude-synthesizer' ? { ...a, state: 'active' } : a
        ));
      }, 2000);

      // Simulate L1 progress
      setTimeout(() => {
        addLog('INFO', 'L1: Grok discovery agents deployed', 'discovery');
      }, 4000);

      // Simulate L2 progress
      setTimeout(() => {
        addLog('INFO', 'L2: Aggregation in progress', 'aggregation');
      }, 8000);

      // Simulate L3 progress
      setTimeout(() => {
        addLog('INFO', 'L3: Claude synthesis starting', 'synthesis');
        setAgents(prev => prev.map(a => 
          a.agent_id === 'claude-verifier' ? { ...a, state: 'active' } : a
        ));
      }, 12000);

      // Call the API route (Edge function with 300s timeout)
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Research request failed: ${response.status} - ${errorBody}`);
      }

      const data = await response.json();
      
      // Transform Modal response to ResearchResult format
      const researchResult: ResearchResult = {
        run_id: data.run_id || researchPlan.goal_hash,
        status: 'success',
        final_output: formatModalResponse(data),
        executive_summary: data.executive_summary,
        themes: data.themes,
        contradictions: data.contradictions,
        open_questions: data.open_questions,
        confidence: data.confidence,
      };

      setResult(researchResult);
      addLog('INFO', 'Research complete', 'system');
      setAgents(prev => prev.map(a => ({ ...a, state: 'complete' })));

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        addLog('INFO', 'Research cancelled', 'system');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        addLog('ERROR', `Research failed: ${errorMessage}`, 'system');
        setAgents(prev => prev.map(a => ({ ...a, state: 'error' })));
      }
    } finally {
      setIsProcessing(false);
    }
  }, [addLog]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return {
    isConnected,
    isProcessing,
    logs,
    agents,
    plan,
    result,
    error,
    startResearch,
    clearLogs,
  };
}

/**
 * Format Modal response into markdown for display
 */
function formatModalResponse(data: {
  executive_summary?: string;
  detailed_analysis?: string;
  themes?: Array<{ theme: string; confidence: number }>;
  contradictions?: Array<{ claims: string[]; resolution: string }>;
  open_questions?: string[];
  limitations?: string[];
  confidence?: number;
}): string {
  const sections: string[] = [];

  if (data.executive_summary) {
    sections.push(`## Executive Summary\n\n${data.executive_summary}`);
  }

  if (data.detailed_analysis) {
    sections.push(`## Detailed Analysis\n\n${data.detailed_analysis}`);
  }

  if (data.themes && data.themes.length > 0) {
    const themesContent = data.themes
      .map(t => `- **${t.theme}** (${Math.round(t.confidence * 100)}% confidence)`)
      .join('\n');
    sections.push(`## Key Themes\n\n${themesContent}`);
  }

  if (data.contradictions && data.contradictions.length > 0) {
    const contradictionsContent = data.contradictions
      .map(c => `- **Contradiction**: ${c.claims.join(' vs ')}\n  - **Resolution**: ${c.resolution}`)
      .join('\n');
    sections.push(`## Contradictions Found\n\n${contradictionsContent}`);
  }

  if (data.open_questions && data.open_questions.length > 0) {
    const questionsContent = data.open_questions.map(q => `- ${q}`).join('\n');
    sections.push(`## Open Questions\n\n${questionsContent}`);
  }

  if (data.limitations && data.limitations.length > 0) {
    const limitationsContent = data.limitations.map(l => `- ${l}`).join('\n');
    sections.push(`## Limitations\n\n${limitationsContent}`);
  }

  if (data.confidence !== undefined) {
    sections.push(`\n---\n\n**Research Confidence**: ${Math.round(data.confidence * 100)}%`);
  }

  return sections.join('\n\n') || 'No research data available.';
}