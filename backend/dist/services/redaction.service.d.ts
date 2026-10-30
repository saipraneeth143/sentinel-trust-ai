import { GrokAnalysisOutput } from '../schemas/scan.schema';
/**
 * Strips non-printable control characters (except \n, \r, \t) from input payloads
 * prior to dispatching to Grok API or internal scanners.
 */
export declare function sanitizeControlCharacters(input: string): string;
/**
 * Computes a deterministic SHA-256 hash of the raw payload for audit logging
 * without storing raw unredacted sensitive payloads in plain text.
 */
export declare function computePayloadHash(payload: string): string;
/**
 * Finds the 1-based line number where a token first appears in the payload.
 */
export declare function findLineNumber(payload: string, token: string): number;
/**
 * Deterministic security, privacy, and compliance scanner & redactor.
 * Used both to pre-enrich/verify Grok AI findings and as a zero-downtime fallback.
 */
export declare function runDeterministicScan(rawPayload: string, sensitivityLevel?: 'Strict' | 'Standard' | 'Permissive', targetFrameworks?: string[], autoRedact?: boolean): GrokAnalysisOutput;
