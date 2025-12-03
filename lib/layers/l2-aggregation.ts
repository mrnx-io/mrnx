/**
 * L2: Aggregation Layer
 * 
 * Semantic deduplication using cloud embeddings.
 * Replaces Python's Model2Vec + SemHash with Anthropic embeddings.
 * 
 * Algorithm:
 * 1. Generate embeddings for all findings
 * 2. Compute cosine similarity matrix
 * 3. Remove duplicates above threshold (0.85)
 * 4. Return unique findings
 */

import type { Finding, AggregationResult } from "../types/research";

const VOYAGE_API_URL = "https://api.voyageai.com/v1/embeddings";

export interface AggregationConfig {
  voyageApiKey?: string;
  anthropicApiKey?: string;
  dedupThreshold?: number;  // Default 0.85
  maxFindings?: number;     // Default 30
}

/**
 * Compute cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

/**
 * Get embeddings using Voyage AI (fast, cheap embeddings)
 * Falls back to simple text similarity if no API key
 */
async function getEmbeddings(
  texts: string[],
  config: AggregationConfig
): Promise<number[][]> {
  // If no API key, use simple text-based deduplication
  if (!config.voyageApiKey) {
    return simpleTextEmbeddings(texts);
  }

  const response = await fetch(VOYAGE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.voyageApiKey}`,
    },
    body: JSON.stringify({
      model: "voyage-3-lite",  // Fast, cheap model
      input: texts,
      input_type: "document",
    }),
  });

  if (!response.ok) {
    console.warn("Voyage API failed, using simple embeddings");
    return simpleTextEmbeddings(texts);
  }

  const data = await response.json();
  return data.data.map((item: { embedding: number[] }) => item.embedding);
}

/**
 * Simple text-based embedding using character n-grams
 * Used as fallback when no embedding API is available
 */
function simpleTextEmbeddings(texts: string[]): number[][] {
  const ngrams = 3;
  const vocabSize = 1000;
  
  return texts.map(text => {
    const normalized = text.toLowerCase().replace(/[^a-z0-9 ]/g, "");
    const vector = new Array(vocabSize).fill(0);
    
    for (let i = 0; i <= normalized.length - ngrams; i++) {
      const gram = normalized.substring(i, i + ngrams);
      const hash = simpleHash(gram) % vocabSize;
      vector[hash] += 1;
    }
    
    // Normalize
    const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
    return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
  });
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Deduplicate findings based on semantic similarity
 */
export async function aggregateFindings(
  findings: Finding[],
  config: AggregationConfig
): Promise<AggregationResult> {
  const startTime = Date.now();
  const threshold = config.dedupThreshold ?? 0.85;
  const maxFindings = config.maxFindings ?? 30;
  
  if (findings.length === 0) {
    return {
      originalCount: 0,
      deduplicatedCount: 0,
      findings: [],
      duplicatesRemoved: 0,
      processingTimeMs: 0,
    };
  }

  // Extract text for embedding
  const texts = findings.map(f => `${f.claim} ${f.evidence}`.substring(0, 1000));
  
  // Get embeddings
  const embeddings = await getEmbeddings(texts, config);
  
  // Store embeddings on findings
  findings.forEach((f, i) => {
    f.embedding = embeddings[i];
  });
  
  // Greedy deduplication: keep first occurrence, remove similar ones
  const kept: number[] = [];
  const removed: number[] = [];
  
  for (let i = 0; i < findings.length; i++) {
    let isDuplicate = false;
    
    for (const keptIdx of kept) {
      const similarity = cosineSimilarity(embeddings[i], embeddings[keptIdx]);
      if (similarity >= threshold) {
        isDuplicate = true;
        removed.push(i);
        break;
      }
    }
    
    if (!isDuplicate) {
      kept.push(i);
    }
  }
  
  // Get unique findings, limited to maxFindings
  let uniqueFindings = kept.map(i => findings[i]);
  
  // If still too many, sort by confidence and take top
  if (uniqueFindings.length > maxFindings) {
    uniqueFindings.sort((a, b) => b.confidence - a.confidence);
    uniqueFindings = uniqueFindings.slice(0, maxFindings);
  }
  
  // Remove embedding data to reduce payload size
  uniqueFindings.forEach(f => {
    delete f.embedding;
  });

  return {
    originalCount: findings.length,
    deduplicatedCount: uniqueFindings.length,
    findings: uniqueFindings,
    duplicatesRemoved: removed.length,
    processingTimeMs: Date.now() - startTime,
  };
}