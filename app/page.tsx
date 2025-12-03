"use client";

import { useState } from "react";
import { useResearch } from "@/hooks/useResearch";

export default function Home() {
  const [query, setQuery] = useState("");
  const { isLoading, error, result, stages, runResearch, reset } = useResearch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await runResearch(query);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">
          🔬 R&D Engine
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Autonomous Research with Adversarial Verification
        </p>
      </header>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your research query..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-blue-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Researching..." : "Research"}
          </button>
          {result && (
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-gray-300 px-4 py-3 text-lg transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Reset
            </button>
          )}
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Progress Stages */}
      {isLoading && (
        <div className="mb-8 rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <h2 className="mb-4 text-xl font-semibold">Research Progress</h2>
          <div className="space-y-3">
            {stages.map((stage) => (
              <div key={stage.name} className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${
                    stage.status === "completed"
                      ? "bg-green-500"
                      : stage.status === "running"
                      ? "animate-pulse bg-blue-500"
                      : stage.status === "failed"
                      ? "bg-red-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
                <span
                  className={
                    stage.status === "running"
                      ? "font-semibold"
                      : stage.status === "completed"
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }
                >
                  {stage.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-8">
          {/* Executive Summary */}
          <section className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
            <h2 className="mb-4 text-2xl font-bold">Executive Summary</h2>
            <p className="text-lg leading-relaxed">{result.executive_summary}</p>
            <div className="mt-4 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>⏱ {result.duration_seconds}s</span>
              <span>🎯 {(result.verification.adjusted_confidence * 100).toFixed(0)}% confidence</span>
              <span>🔢 {result.tokens_used.toLocaleString()} tokens</span>
            </div>
          </section>

          {/* Themes */}
          {result.themes.length > 0 && (
            <section className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <h2 className="mb-4 text-2xl font-bold">Key Themes</h2>
              <div className="space-y-4">
                {result.themes.map((theme, i) => (
                  <div key={i} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold">{theme.name}</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {theme.description}
                    </p>
                    <span className="text-sm text-gray-500">
                      {(theme.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contradictions */}
          {result.contradictions.length > 0 && (
            <section className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
              <h2 className="mb-4 text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                ⚠️ Contradictions Found
              </h2>
              <div className="space-y-4">
                {result.contradictions.map((c, i) => (
                  <div key={i} className="rounded border border-yellow-300 bg-white p-4 dark:border-yellow-700 dark:bg-gray-800">
                    <p className="mb-2">
                      <strong>A:</strong> {c.claim_a}
                    </p>
                    <p className="mb-2">
                      <strong>B:</strong> {c.claim_b}
                    </p>
                    <p className="text-green-700 dark:text-green-400">
                      <strong>Resolution:</strong> {c.resolution}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Verification */}
          <section className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
            <h2 className="mb-4 text-2xl font-bold">
              🛡️ Verification: {result.verification.verdict}
            </h2>
            {result.verification.vulnerabilities.length > 0 && (
              <div className="space-y-3">
                {result.verification.vulnerabilities.map((v, i) => (
                  <div
                    key={i}
                    className={`rounded p-3 ${
                      v.severity === "critical"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : v.severity === "high"
                        ? "bg-orange-100 dark:bg-orange-900/30"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    <span
                      className={`font-semibold uppercase ${
                        v.severity === "critical"
                          ? "text-red-700 dark:text-red-400"
                          : v.severity === "high"
                          ? "text-orange-700 dark:text-orange-400"
                          : ""
                      }`}
                    >
                      [{v.severity}]
                    </span>{" "}
                    {v.finding}
                    {v.suggested_fix && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Fix: {v.suggested_fix}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {result.verification.vulnerabilities.length === 0 && (
              <p className="text-green-600 dark:text-green-400">
                ✓ No critical vulnerabilities detected
              </p>
            )}
          </section>

          {/* Open Questions */}
          {result.open_questions.length > 0 && (
            <section className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <h2 className="mb-4 text-2xl font-bold">❓ Open Questions</h2>
              <ul className="space-y-2">
                {result.open_questions.map((q, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-gray-400">•</span>
                    <div>
                      <p className="font-medium">{q.question}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {q.reason}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}