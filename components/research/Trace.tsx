'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Terminal, Activity } from 'lucide-react';
import { LogEntry } from '../../types/research';

interface TraceProps {
  logs: LogEntry[];
}

export function Trace({ logs }: TraceProps) {
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden font-mono text-[10px] md:text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/20 border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center space-x-2 text-white/40">
          <Terminal size={12} />
          <span className="uppercase tracking-widest font-bold text-[10px]">System Trace</span>
        </div>
        <div className="flex items-center space-x-2">
          <Activity size={12} className="text-emerald-500/50 animate-pulse" />
          <span className="text-white/20 text-[10px]">{logs.length} events</span>
        </div>
      </div>
      
      {/* Logs Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-0.5">
        <AnimatePresence initial={false}>
          {logs.map((log, i) => (
            <motion.div
              key={`${log.timestamp}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start space-x-3 hover:bg-white/5 rounded px-2 py-1 transition-colors group"
            >
              <span className="text-white/20 w-16 shrink-0 font-light tabular-nums select-none">
                {formatTimestamp(log.timestamp)}
              </span>
              <span className={clsx(
                "w-20 shrink-0 font-bold uppercase tracking-wider text-[9px] py-0.5 select-none",
                getColorForSource(log.source)
              )}>
                {log.source}
              </span>
              <span className={clsx(
                "flex-1 break-all font-light",
                log.level === 'ERROR' ? "text-red-400" : "text-white/60 group-hover:text-white/90 transition-colors"
              )}>
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </div>
    </div>
  );
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function getColorForSource(source: string): string {
  if (source.includes('grok')) return 'text-purple-400';
  if (source.includes('claude')) return 'text-orange-400';
  if (source.includes('core')) return 'text-blue-400';
  if (source.includes('orch')) return 'text-cyan-400';
  if (source.includes('metrics')) return 'text-emerald-400';
  if (source.includes('user')) return 'text-yellow-400';
  if (source.includes('system')) return 'text-white/50';
  return 'text-white/30';
}

export default Trace;