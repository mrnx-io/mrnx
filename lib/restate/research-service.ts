/**
 * Restate Research Service
 * 
 * Orchestrates the 5-layer R&D Engine pipeline with durable execution.
 * Designed for Vercel Functions + Restate Cloud deployment.
 */

import * as restate from "@restatedev/restate-sdk";
import { planQuery, type QueryPlannerConfig } from "../layers/l0-query-planner";
import { runDiscovery, type DiscoveryConfig } from "../layers/l1-discovery";
import { aggregateFindings, type AggregationConfig } from "../layers/l2-aggregation";
import { synthesizeAndVerify, type SynthesisConfig } from "../layers/l3-synthesis";
import type { 
  ResearchState, 
  FinalOutput,
  Finding,
  FieldReport,
} from "../types/research";

// Environment configuration
const getConfig = () => ({
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
  xaiApiKey: process.env.XAI_API_KEY || "",
  voyageApiKey: process.env.VOYAGE_API_KEY || "",
});

// ═══════════════════════════════════════════════════════════════════════════
// Research Service (Stateless)
// ═══════════════════════════════════════════════════════════════════════════

export const researchService = restate.service({
  name: "ResearchEngine",
  handlers: {
    /**
     * Execute full research pipeline
     */
    runResearch: async (
      ctx: restate.Context,
      request: { query: string; sessionId?: string }
    ): Promise<{
      requestId: string;
      output: FinalOutput;
      stagesCompleted: string[];
      durationSeconds: number;
      tokensUsed: number;
    }> => {
      const startTime = Date.now();
      const config = getConfig();
      
      if (!request.query) {
        throw new restate.TerminalError("Query is required");
      }

      const requestId = `research-${ctx.rand.uuidv4()}`;
      const stagesCompleted: string[] = [];
      let tokensUsed = 0;

      // Initialize state
      const state: ResearchState = {
        requestId,
        query: request.query,
        layerTimings: {},
        tokensUsed: 0,
      };

      // ═══════════════════════════════════════════════════════════════════
      // L0: Query Planning
      // ═══════════════════════════════════════════════════════════════════
      
      const plan = await ctx.run("L0_query_planning", async () => {
        const planConfig: QueryPlannerConfig = {
          anthropicApiKey: config.anthropicApiKey,
        };
        return planQuery(request.query, planConfig);
      });
      
      state.plan = plan;
      state.clarifiedQuery = plan.clarifiedQuery;
      state.goalHash = plan.goalHash;
      stagesCompleted.push("L0_query_planning");

      // ═══════════════════════════════════════════════════════════════════
      // L1: Discovery (5 Grok Agents)
      // ═══════════════════════════════════════════════════════════════════
      
      const fieldReports = await ctx.run("L1_discovery", async () => {
        const discoveryConfig: DiscoveryConfig = {
          xaiApiKey: config.xaiApiKey,
        };
        return runDiscovery(plan.grokAgents, discoveryConfig);
      });
      
      state.fieldReports = fieldReports;
      stagesCompleted.push("L1_discovery");
      
      // Flatten findings from all reports
      const allFindings: Finding[] = fieldReports.flatMap(
        (report: FieldReport) => report.findings
      );

      // ═══════════════════════════════════════════════════════════════════
      // L2: Aggregation (Deduplication)
      // ═══════════════════════════════════════════════════════════════════
      
      const aggregation = await ctx.run("L2_aggregation", async () => {
        const aggConfig: AggregationConfig = {
          voyageApiKey: config.voyageApiKey,
          dedupThreshold: 0.85,
          maxFindings: 30,
        };
        return aggregateFindings(allFindings, aggConfig);
      });
      
      state.aggregatedFindings = aggregation.findings;
      stagesCompleted.push("L2_aggregation");

      // ═══════════════════════════════════════════════════════════════════
      // L3: Synthesis + Verification
      // ═══════════════════════════════════════════════════════════════════
      
      const { synthesis, verification } = await ctx.run("L3_synthesis", async () => {
        const synthConfig: SynthesisConfig = {
          anthropicApiKey: config.anthropicApiKey,
          maxIterations: 2,
        };
        return synthesizeAndVerify(
          aggregation.findings,
          plan.goalObjective,
          synthConfig
        );
      });
      
      state.synthesis = synthesis;
      state.verification = verification;
      tokensUsed += synthesis.tokensUsed;
      stagesCompleted.push("L3_synthesis");

      // ═══════════════════════════════════════════════════════════════════
      // L4: Format Output
      // ═══════════════════════════════════════════════════════════════════
      
      const output: FinalOutput = {
        requestId,
        query: request.query,
        goal: plan.goalObjective,
        executiveSummary: synthesis.executiveSummary,
        themes: synthesis.themes,
        contradictions: synthesis.contradictions,
        openQuestions: synthesis.openQuestions,
        verification,
        sources: aggregation.findings,
        metadata: {
          durationSeconds: (Date.now() - startTime) / 1000,
          tokensUsed,
          layerTimings: state.layerTimings,
          agentContributions: fieldReports.reduce((acc: Record<string, number>, r: FieldReport) => {
            acc[r.agentName] = r.findings.length;
            return acc;
          }, {}),
          confidence: verification.adjustedConfidence,
          iterationsUsed: synthesis.iterationsUsed,
        },
      };
      
      stagesCompleted.push("L4_output");

      // Persist to session if provided
      if (request.sessionId) {
        ctx.objectSendClient(sessionManager, request.sessionId).addResearch({
          requestId,
          query: request.query,
          timestamp: new Date().toISOString(),
        });
      }

      return {
        requestId,
        output,
        stagesCompleted,
        durationSeconds: output.metadata.durationSeconds,
        tokensUsed,
      };
    },

    /**
     * Health check
     */
    health: async (): Promise<{ status: string; timestamp: string }> => {
      return {
        status: "healthy",
        timestamp: new Date().toISOString(),
      };
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// Session Manager (Virtual Object - Stateful)
// ═══════════════════════════════════════════════════════════════════════════

export const sessionManager = restate.object({
  name: "SessionManager",
  handlers: {
    createSession: async (
      ctx: restate.ObjectContext
    ): Promise<{ sessionId: string; createdAt: string }> => {
      const sessionId = ctx.key;
      const createdAt = new Date().toISOString();
      
      await ctx.set("createdAt", createdAt);
      await ctx.set("history", []);
      await ctx.set("researchIds", []);
      
      return { sessionId, createdAt };
    },

    addMessage: async (
      ctx: restate.ObjectContext,
      message: { role: string; content: string }
    ): Promise<void> => {
      const history = (await ctx.get<Array<{ role: string; content: string; timestamp: string }>>("history")) || [];
      history.push({
        ...message,
        timestamp: new Date().toISOString(),
      });
      await ctx.set("history", history);
    },

    addResearch: async (
      ctx: restate.ObjectContext,
      research: { requestId: string; query: string; timestamp: string }
    ): Promise<void> => {
      const researchIds = (await ctx.get<string[]>("researchIds")) || [];
      researchIds.push(research.requestId);
      await ctx.set("researchIds", researchIds);
    },

    getHistory: restate.handlers.object.shared(
      async (ctx: restate.ObjectSharedContext): Promise<Array<{ role: string; content: string; timestamp: string }>> => {
        return (await ctx.get<Array<{ role: string; content: string; timestamp: string }>>("history")) || [];
      }
    ),

    getSessionInfo: restate.handlers.object.shared(
      async (ctx: restate.ObjectSharedContext): Promise<{
        sessionId: string;
        createdAt: string;
        messageCount: number;
        researchCount: number;
      }> => {
        const history = (await ctx.get<unknown[]>("history")) || [];
        const researchIds = (await ctx.get<string[]>("researchIds")) || [];
        const createdAt = (await ctx.get<string>("createdAt")) || "";
        
        return {
          sessionId: ctx.key,
          createdAt,
          messageCount: history.length,
          researchCount: researchIds.length,
        };
      }
    ),
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// Export combined endpoint
// ═══════════════════════════════════════════════════════════════════════════

export const endpoint = restate.endpoint().bind(researchService).bind(sessionManager);