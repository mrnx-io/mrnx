'use client';

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, MessageSquare, Layers, Send } from 'lucide-react';
import clsx from 'clsx';
import { ResearchPlan, ResearchResult } from '../../types/research';

interface ConsoleProps {
  plan: ResearchPlan | null;
  result: ResearchResult | null;
  onSearch: (query: string) => void;
  isProcessing: boolean;
}

type Mode = 'architect' | 'creator' | 'twin';

export function Console({ plan, result, onSearch, isProcessing }: ConsoleProps) {
  const [manualMode, setManualMode] = useState<Mode | null>(null);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Derive mode from state - user can override with manual selection
  const mode: Mode = useMemo(() => {
    if (manualMode) return manualMode;
    if (result) return 'creator';
    if (plan) return 'architect';
    return 'twin';
  }, [manualMode, plan, result]);

  const handleModeChange = (newMode: Mode) => {
    setManualMode(newMode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSearch(input);
      setInput('');
      setManualMode(null); // Reset manual mode on new search
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden font-mono text-sm">
      {/* Header / Tabs */}
      <div className="flex items-center space-x-1 p-4 border-b border-white/10 bg-black/40 backdrop-blur-md z-10">
        <ModeTab 
          active={mode === 'architect'} 
          onClick={() => handleModeChange('architect')} 
          icon={<Cpu size={14} />} 
          label="ARCHITECT" 
        />
        <ModeTab 
          active={mode === 'creator'} 
          onClick={() => handleModeChange('creator')} 
          icon={<Layers size={14} />} 
          label="CREATOR" 
        />
        <ModeTab 
          active={mode === 'twin'} 
          onClick={() => handleModeChange('twin')} 
          icon={<MessageSquare size={14} />} 
          label="TWIN" 
        />
        <div className="flex-1" />
        <div className="text-xs text-white/30 uppercase tracking-widest">
          neural:console v1.0
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {mode === 'twin' && (
            <motion.div 
              key="twin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8"
            >
              <div className="max-w-2xl w-full space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-4xl font-light tracking-tighter text-white font-[family-name:var(--font-machina)]">
                    Shape me.
                  </h1>
                  <p className="text-white/40">
                    The system awaits your intent.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="relative group">
                  <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-3 backdrop-blur-sm focus-within:border-blue-500/50 focus-within:bg-white/10 transition-all duration-300">
                    <Terminal className="text-blue-400 mr-3" size={18} />
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter research objective..."
                      className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/20 font-mono"
                      autoFocus
                      disabled={isProcessing}
                    />
                    <button 
                      type="submit"
                      disabled={!input.trim() || isProcessing}
                      className="ml-2 p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors disabled:opacity-30"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </form>

                <div className="flex justify-center space-x-4 text-xs text-white/20">
                  <span>[M] Market Analysis</span>
                  <span>[T] Tech Deep Dive</span>
                  <span>[X] Cross-Domain Synthesis</span>
                </div>
              </div>
            </motion.div>
          )}

          {mode === 'architect' && (
            <motion.div
              key="architect"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-0 p-8 overflow-y-auto custom-scrollbar"
            >
              {!plan ? (
                <div className="h-full flex items-center justify-center text-white/20">
                  <span className="animate-pulse">Waiting for system architecture...</span>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-[family-name:var(--font-machina)] text-blue-400">
                      System Architecture
                    </h2>
                    <span className="text-xs text-white/40 font-mono">
                      ID: {plan.goal_hash?.substring(0, 8)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <SectionTitle>Research Angles</SectionTitle>
                      <div className="flex flex-wrap gap-2">
                        {plan.angles?.map((angle) => (
                          <Badge key={angle} color="blue">{angle}</Badge>
                        ))}
                      </div>

                      <SectionTitle>Agent Swarm ({plan.agent_count})</SectionTitle>
                      <div className="space-y-2">
                        {plan.grok_agents?.length > 0 && (
                          <div className="p-3 bg-white/5 rounded border border-white/5">
                            <div className="text-xs text-white/40 mb-2">GROK SQUADRON</div>
                            <div className="flex flex-wrap gap-2">
                              {plan.grok_agents.map(a => <Badge key={a} color="purple">{a}</Badge>)}
                            </div>
                          </div>
                        )}
                        {plan.claude_agents?.length > 0 && (
                          <div className="p-3 bg-white/5 rounded border border-white/5">
                            <div className="text-xs text-white/40 mb-2">CLAUDE SQUADRON</div>
                            <div className="flex flex-wrap gap-2">
                              {plan.claude_agents.map(a => <Badge key={a} color="orange">{a}</Badge>)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <SectionTitle>Execution Strategy</SectionTitle>
                      <div className="space-y-2 text-xs text-white/70">
                        <Metric label="Depth" value={plan.depth} />
                        <Metric label="Query" value={plan.query} truncate />
                        <Metric label="MCTS" value="enabled" />
                      </div>
                      
                      <div className="mt-4">
                        <SectionTitle>Planned Queries</SectionTitle>
                        <div className="space-y-2 mt-2">
                          {Object.entries(plan.search_queries || {}).map(([angle, queries]) => (
                            <div key={angle} className="text-xs">
                              <span className="text-blue-400/80 uppercase">{angle}</span>
                              <ul className="list-disc list-inside text-white/50 pl-2">
                                {queries.slice(0, 2).map((q, i) => (
                                  <li key={i} className="truncate">{q}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {mode === 'creator' && (
            <motion.div
              key="creator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 p-8 overflow-y-auto custom-scrollbar"
            >
              {!result ? (
                <div className="h-full flex items-center justify-center text-white/30">
                  <div className="text-center">
                    <h2 className="text-xl font-[family-name:var(--font-machina)] mb-2">Glass Box Artifacts</h2>
                    <p>No artifacts generated yet.</p>
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-[family-name:var(--font-machina)] text-green-400">
                      Research Output
                    </h2>
                    <span className="text-xs text-white/40 font-mono">
                      ID: {result.run_id?.substring(0, 8)}
                    </span>
                  </div>
                  
                  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                    <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono">
                      {result.final_output}
                    </pre>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ModeTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center space-x-2 px-3 py-1.5 rounded text-xs font-medium transition-all duration-300",
        active 
          ? "bg-white/10 text-blue-400 shadow-[0_0_15px_rgba(77,150,255,0.2)]" 
          : "text-white/40 hover:text-white hover:bg-white/5"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs uppercase tracking-wider text-white/40 font-bold mb-2">{children}</h3>;
}

function Badge({ children, color }: { children: React.ReactNode; color: 'blue' | 'purple' | 'orange' }) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };
  
  return (
    <span className={clsx("px-2 py-0.5 rounded text-[10px] border uppercase tracking-wider", colors[color])}>
      {children}
    </span>
  );
}

function Metric({ label, value, truncate }: { label: string; value: string; truncate?: boolean }) {
  return (
    <div className="flex justify-between border-b border-white/5 py-1">
      <span className="text-white/40">{label}</span>
      <span className={clsx("text-white/80 font-mono", truncate && "truncate max-w-[200px]")}>{value}</span>
    </div>
  );
}