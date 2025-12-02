import { useState, useCallback, useRef } from 'react';
import { LogEntry, AgentState, ResearchPlan, ResearchResult } from '../types/research';

interface UseRailwayResearchReturn {
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
 * Hook for streaming research from Railway-deployed Autonomous R&D Engine.
 * Uses Server-Sent Events (SSE) for real-time streaming of polished markdown output.
 */
export function useRailwayResearch(): UseRailwayResearchReturn {
  const [isConnected] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [plan, setPlan] = useState<ResearchPlan | null>(null);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const outputBufferRef = useRef<string>('');

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
    setAgents([]);
    outputBufferRef.current = '';
    
    addLog('INFO', `Initializing research: ${query}`, 'user');

    const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_API_URL;

    if (!apiUrl) {
      setError('Railway API URL not configured');
      addLog('ERROR', 'Railway API URL not configured. Set NEXT_PUBLIC_RAILWAY_API_URL', 'system');
      setIsProcessing(false);
      return;
    }

    // Set up simulated plan (we don't know the actual plan until backend processes)
    const simulatedPlan: ResearchPlan = {
      query,
      goal_hash: `rail-${Date.now().toString(16).substring(0, 8)}`,
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
    setPlan(simulatedPlan);
    addLog('INFO', 'Research plan initialized', 'orchestrator');

    // Set agent states
    setAgents([
      { agent_id: 'grok_tech', state: 'active', details: {}, timestamp: Date.now() / 1000 },
      { agent_id: 'grok_news', state: 'active', details: {}, timestamp: Date.now() / 1000 },
      { agent_id: 'grok_contrarian', state: 'active', details: {}, timestamp: Date.now() / 1000 },
      { agent_id: 'grok_academic', state: 'active', details: {}, timestamp: Date.now() / 1000 },
      { agent_id: 'grok_practical', state: 'active', details: {}, timestamp: Date.now() / 1000 },
      { agent_id: 'claude-synthesizer', state: 'pending', details: {}, timestamp: Date.now() / 1000 },
      { agent_id: 'claude-verifier', state: 'pending', details: {}, timestamp: Date.now() / 1000 },
    ]);

    try {
      addLog('INFO', 'Connecting to Railway backend...', 'core');
      
      // Use SSE streaming endpoint
      const response = await fetch(`${apiUrl}/research/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({ query }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Research request failed: ${response.status} - ${errorBody}`);
      }

      addLog('INFO', 'Stream connected, receiving data...', 'core');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        
        // Process complete SSE events
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            // Handle event type
            const eventType = line.substring(7).trim();
            
            // Get data from next line
            const dataLineIndex = lines.indexOf(line) + 1;
            if (dataLineIndex < lines.length && lines[dataLineIndex].startsWith('data: ')) {
              const data = lines[dataLineIndex].substring(6);
              
              switch (eventType) {
                case 'status':
                  addLog('INFO', data, 'orchestrator');
                  // Update agent states based on status
                  if (data.includes('L0') || data.includes('Planning')) {
                    setAgents(prev => prev.map(a => 
                      a.agent_id === 'claude-synthesizer' 
                        ? { ...a, state: 'active' }
                        : a
                    ));
                  }
                  break;
                  
                case 'content':
                  // Accumulate content
                  outputBufferRef.current += data;
                  // Update result progressively
                  setResult({
                    final_output: outputBufferRef.current,
                    run_id: simulatedPlan.goal_hash,
                    status: 'streaming',
                  });
                  break;
                  
                case 'done':
                  addLog('INFO', 'Research complete', 'system');
                  setAgents(prev => prev.map(a => ({ ...a, state: 'complete' })));
                  setResult({
                    final_output: outputBufferRef.current,
                    run_id: simulatedPlan.goal_hash,
                    status: 'success',
                  });
                  break;
                  
                case 'error':
                  throw new Error(data);
              }
            }
          } else if (line.startsWith('data: ')) {
            // Handle data-only lines (simpler SSE format)
            const data = line.substring(6);
            if (data && data !== '[DONE]') {
              try {
                const parsed = JSON.parse(data);
                if (parsed.event === 'content') {
                  outputBufferRef.current += parsed.data || '';
                  setResult({
                    final_output: outputBufferRef.current,
                    run_id: simulatedPlan.goal_hash,
                    status: 'streaming',
                  });
                }
              } catch {
                // Not JSON, treat as plain content
                outputBufferRef.current += data;
                setResult({
                  final_output: outputBufferRef.current,
                  run_id: simulatedPlan.goal_hash,
                  status: 'streaming',
                });
              }
            }
          }
        }
      }

      // Final result if not already set
      if (outputBufferRef.current && result?.status !== 'success') {
        setResult({
          final_output: outputBufferRef.current,
          run_id: simulatedPlan.goal_hash,
          status: 'success',
        });
      }
      
      addLog('INFO', 'Research stream complete', 'system');
      setAgents(prev => prev.map(a => ({ ...a, state: 'complete' })));

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        addLog('INFO', 'Research cancelled', 'system');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        addLog('ERROR', `Research failed: ${errorMessage}`, 'system');
      }
    } finally {
      setIsProcessing(false);
    }
  }, [addLog, result?.status]);

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