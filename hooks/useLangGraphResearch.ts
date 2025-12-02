import { useState, useCallback, useRef } from 'react';
import { LogEntry, AgentState, ResearchPlan, ResearchResult } from '../types/research';

interface UseLangGraphResearchReturn {
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

export function useLangGraphResearch(): UseLangGraphResearchReturn {
  const [isConnected] = useState(true); // REST is always "connected"
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
    setAgents([]);
    
    addLog('INFO', `Initializing research: ${query}`, 'user');

    const apiUrl = process.env.NEXT_PUBLIC_LANGGRAPH_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_LANGGRAPH_API_KEY;

    if (!apiUrl || !apiKey) {
      setError('LangGraph API credentials not configured');
      addLog('ERROR', 'LangGraph API credentials not configured', 'system');
      setIsProcessing(false);
      return;
    }

    try {
      // Step 1: Create a run
      addLog('INFO', 'Creating research run...', 'core');
      
      const createResponse = await fetch(`${apiUrl}/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          assistant_id: 'research_graph',
          input: { query },
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!createResponse.ok) {
        throw new Error(`Failed to create run: ${createResponse.statusText}`);
      }

      const { run_id } = await createResponse.json();
      addLog('INFO', `Run created: ${run_id.substring(0, 8)}...`, 'core');

      // Simulate plan arrival (in real impl, this would come from streaming)
      const simulatedPlan: ResearchPlan = {
        query,
        goal_hash: run_id,
        angles: ['primary', 'secondary', 'synthesis'],
        agent_count: 3,
        grok_agents: ['grok-analyst'],
        claude_agents: ['claude-synthesizer', 'claude-validator'],
        search_queries: {
          primary: [`${query} overview`, `${query} latest research`],
          secondary: [`${query} implications`, `${query} trends`],
        },
        depth: 'comprehensive',
      };
      setPlan(simulatedPlan);
      addLog('INFO', 'Research plan generated', 'orchestrator');

      // Simulate agent activation
      setAgents([
        { agent_id: 'grok-analyst', state: 'active', details: {}, timestamp: Date.now() / 1000 },
        { agent_id: 'claude-synthesizer', state: 'pending', details: {}, timestamp: Date.now() / 1000 },
        { agent_id: 'claude-validator', state: 'pending', details: {}, timestamp: Date.now() / 1000 },
      ]);

      // Step 2: Poll for result (LangGraph Cloud doesn't have /wait endpoint)
      addLog('INFO', 'Executing research agents...', 'orchestrator');
      
      let attempts = 0;
      const maxAttempts = 120; // 10 minutes max (5s intervals)
      let runComplete = false;
      let resultData: Record<string, unknown> | null = null;

      while (!runComplete && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        attempts++;

        const statusResponse = await fetch(`${apiUrl}/runs/${run_id}`, {
          headers: {
            'x-api-key': apiKey,
          },
          signal: abortControllerRef.current.signal,
        });

        if (!statusResponse.ok) {
          const errorBody = await statusResponse.text();
          addLog('ERROR', `Status check failed: ${statusResponse.status} - ${errorBody}`, 'core');
          throw new Error(`Failed to get run status: ${statusResponse.status} - ${errorBody}`);
        }

        const statusData = await statusResponse.json();
        const status = statusData.status;

        addLog('INFO', `Run status: ${status} (attempt ${attempts})`, 'orchestrator');

        if (status === 'success') {
          runComplete = true;
          resultData = statusData.output || statusData;
        } else if (status === 'error' || status === 'failed') {
          throw new Error(`Run failed: ${statusData.error || 'Unknown error'}`);
        }
        // Otherwise still running, continue polling
      }

      if (!runComplete) {
        throw new Error('Research timed out after 10 minutes');
      }

      setResult({
        final_output: (resultData as Record<string, unknown>)?.final_output as string || JSON.stringify(resultData, null, 2),
        run_id,
        status: 'success',
      });
      
      addLog('INFO', 'Research complete', 'system');
      
      // Update agents to complete
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