'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useLangGraphResearch } from '../../hooks/useLangGraphResearch';
import { Console } from '../../components/research/Console';
import { Trace } from '../../components/research/Trace';

// Dynamically import Orbit so it only runs on client (R3F requirement)
const Orbit = dynamic(() => import('../../components/research/Orbit').then(mod => mod.Orbit), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full absolute inset-0 -z-10 bg-gradient-to-b from-[#020202] to-[#0a0a0a]" />
  )
});

export default function ResearchPage() {
  const { 
    isConnected, 
    isProcessing, 
    logs, 
    agents, 
    plan, 
    result,
    startResearch 
  } = useLangGraphResearch();

  return (
    <main className="h-screen w-screen flex flex-col relative overflow-hidden bg-obsidian">
      {/* Layer 1: Orbit (Background / Top) */}
      <div className="absolute inset-0 z-0">
        <Orbit agents={agents} isProcessing={isProcessing} />
      </div>

      {/* Layer 2: Console (Middle / Interaction) */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-full max-w-5xl h-[60vh] pointer-events-auto">
          <Console 
            plan={plan} 
            result={result}
            onSearch={startResearch} 
            isProcessing={isProcessing} 
          />
        </div>
      </div>

      {/* Layer 3: Trace (Bottom / Logs) */}
      <div className="relative z-20 h-[20vh] w-full border-t border-white/10 pointer-events-auto">
        <Trace logs={logs} />
      </div>
      
      {/* Connection Status Indicator */}
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'} transition-colors duration-500`} />
        <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">
          {isConnected ? 'Neural Link Active' : 'Offline'}
        </span>
      </div>
    </main>
  );
}