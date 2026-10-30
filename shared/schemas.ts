import { z } from 'zod';

export const ScanRequestSchema = z.object({
  payload: z.string().min(1, 'Payload cannot be empty').max(50000, 'Payload exceeds max length of 50,000 characters'),
  sensitivity_level: z.enum(['Strict', 'Standard', 'Permissive']).default('Standard'),
  target_frameworks: z.array(z.enum(['GDPR', 'HIPAA', 'PCI-DSS', 'OWASP-LLM-Top10'])).default(['OWASP-LLM-Top10']),
  auto_redact: z.boolean().default(true),
  workspace_id: z.string().uuid('Invalid workspace ID'),
});

export type ScanRequest = z.infer<typeof ScanRequestSchema>;

export const FlaggedItemSchema = z.object({
  category: z.enum(['PROMPT_INJECTION', 'PII_LEAK', 'SECRET_EXPOSURE', 'CODE_INJECTION', 'COMPLIANCE_VIOLATION']),
  severity: z.enum(['Critical', 'High', 'Medium', 'Low']),
  token_found: z.string(),
  description: z.string(),
  remediation: z.string(),
  line_number: z.number().int().positive().optional(),
  redacted_equivalent: z.string().optional(),
});

export const ScanResponseSchema = z.object({
  scan_id: z.string().uuid(),
  trust_score: z.number().min(0).max(100),
  risk_level: z.enum(['Critical', 'High', 'Medium', 'Low', 'Pass']),
  has_pii: z.boolean(),
  has_security_threat: z.boolean(),
  redacted_payload: z.string(),
  flagged_items: z.array(FlaggedItemSchema),
  executive_summary: z.string(),
  created_at: z.string(),
});

export type ScanResponse = z.infer<typeof ScanResponseSchema>;

export const UpdateIncidentStatusSchema = z.object({
  status: z.enum(['Open', 'In Review', 'Resolved', 'Ignored']),
});

export const CopilotChatSchema = z.object({
  message: z.string().min(1),
  incident_id: z.string().uuid().optional(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
});

