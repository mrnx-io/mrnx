'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, MessageSquare, Layers, Send, Sparkles, ChevronRight, Activity } from 'lucide-react';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
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

  // Derive mode from state - result takes precedence
  const mode: Mode = useMemo(() => {
    if (result) return 'creator';     // Result always wins - user must see output
    if (manualMode) return manualMode;
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
    <div className="h-full w-full flex flex-col relative overflow-hidden font-sans text-sm bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50">
      {/* Header / Tabs */}
      <div className="flex items-center space-x-2 p-4 border-b border-white/5 bg-white/5 z-10">
        <div className="flex items-center space-x-1 bg-black/20 p-1 rounded-lg border border-white/5">
          <ModeTab 
            active={mode === 'twin'} 
            onClick={() => handleModeChange('twin')} 
            icon={<MessageSquare size={14} />} 
            label="TWIN" 
          />
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
        </div>
        
        <div className="flex-1" />
        
        {isProcessing && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <Activity size={12} className="text-blue-400 animate-pulse" />
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">Processing</span>
          </div>
        )}
        
        <div className="text-[10px] text-white/20 uppercase tracking-widest font-mono px-2">
          neural:console v2.0
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {mode === 'twin' && (
            <motion.div 
              key="twin"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8"
            >
              <div className="max-w-2xl w-full space-y-10">
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h1 className="text-5xl md:text-6xl font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 font-[family-name:var(--font-machina)]">
                      Shape me.
                    </h1>
                  </motion.div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/40 text-lg font-light"
                  >
                    The system awaits your intent.
                  </motion.p>
                </div>

                <motion.form 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onSubmit={handleSubmit} 
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
                  <div className="relative flex items-center bg-[#0A0A0A] border border-white/10 rounded-xl px-6 py-5 shadow-2xl focus-within:border-white/20 transition-all duration-300">
                    <Sparkles className="text-blue-400 mr-4 animate-pulse" size={20} />
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="What shall we discover today?"
                      className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-white/20 font-light"
                      autoFocus
                      disabled={isProcessing}
                    />
                    <button 
                      type="submit"
                      disabled={!input.trim() || isProcessing}
                      className="ml-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </motion.form>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center gap-6 text-xs text-white/20 font-mono"
                >
                  <span className="flex items-center hover:text-white/40 transition-colors cursor-default">
                    <ChevronRight size={12} className="mr-1" /> Market Analysis
                  </span>
                  <span className="flex items-center hover:text-white/40 transition-colors cursor-default">
                    <ChevronRight size={12} className="mr-1" /> Tech Deep Dive
                  </span>
                  <span className="flex items-center hover:text-white/40 transition-colors cursor-default">
                    <ChevronRight size={12} className="mr-1" /> Cross-Domain Synthesis
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {mode === 'architect' && (
            <motion.div
              key="architect"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 p-8 overflow-y-auto custom-scrollbar"
            >
              {!plan ? (
                <div className="h-full flex flex-col items-center justify-center text-white/20 space-y-4">
                  <Cpu size={48} className="animate-pulse opacity-50" />
                  <span className="font-mono text-sm tracking-widest uppercase">Waiting for system architecture...</span>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto space-y-10">
                  <div className="flex items-end justify-between border-b border-white/10 pb-6">
                    <div>
                      <h2 className="text-3xl font-[family-name:var(--font-machina)] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        System Architecture
                      </h2>
                      <p className="text-white/40 mt-2 font-light">Blueprint generated for execution</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/30 font-mono uppercase tracking-widest mb-1">Goal Hash</div>
                      <div className="font-mono text-blue-400/80">{plan.goal_hash?.substring(0, 8)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <div>
                        <SectionTitle>Research Angles</SectionTitle>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {plan.angles?.map((angle) => (
                            <Badge key={angle} color="blue">{angle}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <SectionTitle>Agent Swarm ({plan.agent_count})</SectionTitle>
                        <div className="space-y-3 mt-3">
                          {plan.grok_agents?.length > 0 && (
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                              <div className="text-xs text-purple-400/80 font-mono mb-3 uppercase tracking-wider">GROK SQUADRON</div>
                              <div className="flex flex-wrap gap-2">
                                {plan.grok_agents.map(a => <Badge key={a} color="purple">{a}</Badge>)}
                              </div>
                            </div>
                          )}
                          {plan.claude_agents?.length > 0 && (
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-orange-500/30 transition-colors">
                              <div className="text-xs text-orange-400/80 font-mono mb-3 uppercase tracking-wider">CLAUDE SQUADRON</div>
                              <div className="flex flex-wrap gap-2">
                                {plan.claude_agents.map(a => <Badge key={a} color="orange">{a}</Badge>)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <SectionTitle>Execution Strategy</SectionTitle>
                        <div className="space-y-3 mt-3 bg-white/5 p-4 rounded-xl border border-white/5">
                          <Metric label="Depth" value={plan.depth} />
                          <Metric label="Query" value={plan.query} truncate />
                          <Metric label="MCTS" value="enabled" />
                        </div>
                      </div>
                      
                      <div>
                        <SectionTitle>Planned Queries</SectionTitle>
                        <div className="space-y-4 mt-3">
                          {Object.entries(plan.search_queries || {}).map(([angle, queries]) => (
                            <div key={angle} className="group">
                              <div className="text-xs font-mono text-blue-400/80 uppercase mb-1 group-hover:text-blue-300 transition-colors">{angle}</div>
                              <ul className="space-y-1">
                                {queries.slice(0, 2).map((q, i) => (
                                  <li key={i} className="text-white/50 text-xs truncate pl-3 border-l border-white/10 group-hover:border-blue-500/30 transition-colors">
                                    {q}
                                  </li>
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 p-8 overflow-y-auto custom-scrollbar"
            >
              {!result ? (
                <div className="h-full flex flex-col items-center justify-center text-white/20 space-y-4">
                  <Layers size={48} className="animate-pulse opacity-50" />
                  <div className="text-center">
                    <h2 className="text-xl font-[family-name:var(--font-machina)] mb-2">Glass Box Artifacts</h2>
                    <p className="font-mono text-xs">No artifacts generated yet.</p>
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto space-y-8 pb-20">
                  <div className="flex items-end justify-between border-b border-white/10 pb-6">
                    <div>
                      <h2 className="text-3xl font-[family-name:var(--font-machina)] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                        Research Output
                      </h2>
                      <p className="text-white/40 mt-2 font-light">Synthesized intelligence artifacts</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/30 font-mono uppercase tracking-widest mb-1">Run ID</div>
                      <div className="font-mono text-emerald-400/80">{result.run_id?.substring(0, 8)}</div>
                    </div>
                  </div>
                  
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-2xl font-[family-name:var(--font-machina)] text-white mt-8 mb-4 border-b border-white/10 pb-2" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-xl font-light text-blue-300 mt-6 mb-3" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-lg font-medium text-white/90 mt-4 mb-2" {...props} />,
                        p: ({node, ...props}) => <p className="text-white/70 leading-relaxed mb-4" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-outside ml-4 space-y-1 text-white/70 mb-4" {...props} />,
                        li: ({node, ...props}) => <li className="pl-1" {...props} />,
                        strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-blue-500/50 pl-4 italic text-white/50 my-4" {...props} />,
                        code: ({node, ...props}) => <code className="bg-white/10 rounded px-1 py-0.5 font-mono text-xs text-blue-300" {...props} />,
                      }}
                    >
                      {result.final_output}
                    </ReactMarkdown>
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
        "flex items-center space-x-2 px-4 py-2 rounded-md text-xs font-medium transition-all duration-300 font-mono tracking-wide",
        active 
          ? "bg-white/10 text-white shadow-lg shadow-white/5 border border-white/10" 
          : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center space-x-2 mb-2">
      <div className="h-px w-4 bg-white/20" />
      <h3 className="text-xs uppercase tracking-widest text-white/40 font-bold">{children}</h3>
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: 'blue' | 'purple' | 'orange' }) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20",
  };
  
  return (
    <span className={clsx("px-2.5 py-1 rounded text-[10px] border uppercase tracking-wider font-mono transition-colors cursor-default", colors[color])}>
      {children}
    </span>
  );
}

function Metric({ label, value, truncate }: { label: string; value: string; truncate?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-white/40 text-xs font-mono uppercase tracking-wider">{label}</span>
      <span className={clsx("text-white/90 font-mono text-xs", truncate && "truncate max-w-[150px]")}>{value}</span>
    </div>
  );
}