'use client';

import React, { useState } from 'react';
import { useLangGraphResearch } from '../../hooks/useLangGraphResearch';

export default function ResearchPage() {
  const { isProcessing, logs, result, error, startResearch } = useLangGraphResearch();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      startResearch(query);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl mb-6">Research Test</h1>
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter research query..."
          className="w-full max-w-xl p-3 bg-white/10 border border-white/20 rounded text-white mb-4"
          disabled={isProcessing}
        />
        <button 
          type="submit" 
          disabled={isProcessing || !query.trim()}
          className="px-6 py-2 bg-blue-600 rounded disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Start Research'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="p-4 mb-4 bg-red-500/20 border border-red-500 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="p-6 bg-green-500/10 border border-green-500/50 rounded mb-8">
          <h2 className="text-xl text-green-400 mb-4">✓ Result Received</h2>
          <pre className="whitespace-pre-wrap text-sm bg-black/50 p-4 rounded overflow-auto max-h-[50vh]">
            {result.final_output}
          </pre>
          <p className="text-xs text-white/40 mt-2">Run ID: {result.run_id}</p>
        </div>
      )}

      {/* Logs */}
      <div className="border border-white/10 rounded">
        <h3 className="p-3 border-b border-white/10 text-sm text-white/60">Logs ({logs.length})</h3>
        <div className="p-3 max-h-[30vh] overflow-auto font-mono text-xs">
          {logs.map((log, i) => (
            <div key={i} className={`py-1 ${log.level === 'ERROR' ? 'text-red-400' : 'text-white/60'}`}>
              [{log.source}] {log.message}
            </div>
          ))}
          {logs.length === 0 && <span className="text-white/30">No logs yet</span>}
        </div>
      </div>
    </main>
  );
}