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
      // Step 1: Create a thread
      addLog('INFO', 'Creating thread...', 'core');
      
      const threadResponse = await fetch(`${apiUrl}/threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({}),
        signal: abortControllerRef.current.signal,
      });

      if (!threadResponse.ok) {
        const errorBody = await threadResponse.text();
        throw new Error(`Failed to create thread: ${threadResponse.status} - ${errorBody}`);
      }

      const { thread_id } = await threadResponse.json();
      addLog('INFO', `Thread created: ${thread_id.substring(0, 8)}...`, 'core');

      // Step 2: Create a run within the thread
      addLog('INFO', 'Creating research run...', 'core');
      
      const createResponse = await fetch(`${apiUrl}/threads/${thread_id}/runs`, {
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
        const errorBody = await createResponse.text();
        throw new Error(`Failed to create run: ${createResponse.status} - ${errorBody}`);
      }

      const { run_id } = await createResponse.json();
      addLog('INFO', `Run created: ${run_id.substring(0, 8)}...`, 'core');

      // Simulate plan
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

      setAgents([
        { agent_id: 'grok-analyst', state: 'active', details: {}, timestamp: Date.now() / 1000 },
        { agent_id: 'claude-synthesizer', state: 'pending', details: {}, timestamp: Date.now() / 1000 },
        { agent_id: 'claude-validator', state: 'pending', details: {}, timestamp: Date.now() / 1000 },
      ]);

      // Step 3: Poll for result using thread endpoint
      addLog('INFO', 'Executing research agents...', 'orchestrator');
      
      let attempts = 0;
      const maxAttempts = 120;
      let runComplete = false;
      let resultData: Record<string, unknown> | null = null;

      while (!runComplete && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;

        const statusResponse = await fetch(`${apiUrl}/threads/${thread_id}/runs/${run_id}`, {
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
          // Fetch the actual output from thread state
          addLog('INFO', 'Fetching research results...', 'core');
          const stateResponse = await fetch(`${apiUrl}/threads/${thread_id}/state`, {
            headers: {
              'x-api-key': apiKey,
            },
            signal: abortControllerRef.current.signal,
          });
          
          if (stateResponse.ok) {
            const stateData = await stateResponse.json();
            // The output should be in the state values
            resultData = stateData.values || stateData;
          } else {
            resultData = statusData;
          }
        } else if (status === 'error' || status === 'failed') {
          throw new Error(`Run failed: ${statusData.error || 'Unknown error'}`);
        }
      }

      if (!runComplete) {
        throw new Error('Research timed out after 10 minutes');
      }

      // Complete research output formatter
      const formatCompleteOutput = (data: Record<string, unknown>): string => {
        const finalOutput = data?.final_output as Record<string, unknown>;
        if (!finalOutput) return JSON.stringify(data, null, 2);
        
        const answer = finalOutput?.answer as Record<string, unknown>;
        const evidence = finalOutput?.evidence as Record<string, unknown>;
        const openQuestions = finalOutput?.open_questions as Array<Record<string, unknown>>;
        const limitations = finalOutput?.limitations as string[];
        const fieldReports = data?.field_reports as Array<Record<string, unknown>>;
        
        let output = '';
        
        // Executive Summary
        if (answer?.executive_summary) {
          output += `# Executive Summary\n\n${answer.executive_summary}\n\n`;
        }
        
        // Detailed Analysis
        if (answer?.detailed_analysis) {
          output += `# Detailed Analysis\n\n${answer.detailed_analysis}\n\n`;
        }
        
        // Key Themes
        const themes = answer?.themes as Array<Record<string, unknown>>;
        if (themes?.length) {
          output += `# Key Themes\n\n`;
          themes.forEach((theme) => {
            output += `**${theme.name}** (Confidence: ${Math.round((theme.confidence as number || 0) * 100)}%)\n`;
            output += `${theme.description}\n\n`;
          });
        }
        
        // Field Reports (Agent Findings)
        if (fieldReports?.length) {
          output += `# Research Findings\n\n`;
          fieldReports.forEach((report) => {
            output += `## ${report.agent_id || report.agent_type}\n`;
            const findings = report.findings as Array<Record<string, unknown>>;
            findings?.forEach((finding) => {
              output += `${finding.claim}\n`;
              if (finding.source_url) {
                output += `📎 Source: ${finding.source_url}\n`;
              }
              output += '\n';
            });
          });
        }
        
        // Contradictions
        const contradictions = answer?.contradictions as Array<Record<string, unknown>>;
        if (contradictions?.length) {
          output += `# Contradictions Found\n\n`;
          contradictions.forEach((c) => {
            const claims = c.claims as string[];
            output += `- **Claims:** ${claims?.join(' vs ')}\n`;
            output += `  **Resolution:** ${c.resolution}\n\n`;
          });
        }
        
        // Open Questions
        if (openQuestions?.length) {
          output += `# Open Questions\n\n`;
          openQuestions.forEach((q) => {
            output += `- **${q.question}**\n  ${q.reason}\n\n`;
          });
        }
        
        // Limitations
        if (limitations?.length) {
          output += `# Limitations\n\n`;
          limitations.forEach((l) => {
            output += `- ${l}\n`;
          });
          output += '\n';
        }
        
        // Sources
        const sources = evidence?.sources as Array<Record<string, unknown>>;
        if (sources?.length) {
          output += `# Sources\n\n`;
          sources.forEach((s, i) => {
            output += `${i + 1}. ${s.url || s.source || JSON.stringify(s)}\n`;
          });
        }
        
        // Confidence Score
        if (answer?.confidence || answer?.adjusted_confidence) {
          const conf = (answer.adjusted_confidence || answer.confidence) as number;
          output += `\n---\n**Research Confidence:** ${Math.round(conf * 100)}%\n`;
        }
        
        return output.trim() || JSON.stringify(data, null, 2);
      };

      setResult({
        final_output: formatCompleteOutput(resultData as Record<string, unknown>),
        run_id,
        status: 'success',
      });
      
      addLog('INFO', 'Research complete', 'system');
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