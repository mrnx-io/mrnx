'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
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
    <div className="h-full w-full flex flex-col bg-black/40 border-t border-white/10 backdrop-blur-md relative overflow-hidden font-mono text-[10px] md:text-xs">
      <div className="absolute top-0 left-0 px-2 py-1 bg-white/5 text-white/30 text-[10px] uppercase tracking-widest z-10">
        System Trace
      </div>
      
      <div 
        className="flex-1 overflow-y-auto p-4 pt-8 custom-scrollbar space-y-1"
      >
        <AnimatePresence initial={false}>
          {logs.map((log, i) => (
            <motion.div
              key={`${log.timestamp}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start space-x-3 hover:bg-white/5 rounded px-2 py-0.5 transition-colors group"
            >
              <span className="text-white/20 w-20 shrink-0">
                {formatTimestamp(log.timestamp)}
              </span>
              <span className={clsx(
                "w-24 shrink-0 font-bold uppercase tracking-wider text-[10px] py-0.5",
                getColorForSource(log.source)
              )}>
                {log.source}
              </span>
              <span className={clsx(
                "flex-1 break-all",
                log.level === 'ERROR' ? "text-red-400" : "text-white/60 group-hover:text-white"
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
  const ms = Math.floor((timestamp * 1000) % 1000).toString().padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${ms}`;
}

function getColorForSource(source: string): string {
  if (source.includes('grok')) return 'text-purple-400';
  if (source.includes('claude')) return 'text-orange-400';
  if (source.includes('core')) return 'text-blue-400';
  if (source.includes('orch')) return 'text-cyan-400';
  if (source.includes('metrics')) return 'text-green-400';
  if (source.includes('user')) return 'text-yellow-400';
  if (source.includes('system')) return 'text-white/50';
  return 'text-white/30';
}

export default Trace;