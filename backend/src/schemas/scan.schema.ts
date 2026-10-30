import { z } from 'zod';

export const ComplianceFrameworkEnum = z.enum([
  'GDPR',
  'HIPAA',
  'PCI-DSS',
  'OWASP-LLM-Top10',
]);

export const SensitivityLevelEnum = z.enum(['Strict', 'Standard', 'Permissive']);

export const ScanRequestSchema = z.object({
  payload: z
    .string()
    .min(1, 'Payload cannot be empty')
    .max(50000, 'Payload exceeds max length of 50,000 characters'),
  sensitivity_level: SensitivityLevelEnum.default('Standard'),
  target_frameworks: z
    .array(ComplianceFrameworkEnum)
    .min(1, 'Select at least one target compliance framework')
    .default(['OWASP-LLM-Top10']),
  auto_redact: z.boolean().default(true),
  workspace_id: z.string().uuid('Invalid workspace ID'),
});

export type ScanRequest = z.infer<typeof ScanRequestSchema>;

export const IncidentCategoryEnum = z.enum([
  'PROMPT_INJECTION',
  'PII_LEAK',
  'SECRET_EXPOSURE',
  'CODE_INJECTION',
  'COMPLIANCE_VIOLATION',
]);

export const SeverityEnum = z.enum(['Critical', 'High', 'Medium', 'Low']);

export const RiskLevelEnum = z.enum(['Critical', 'High', 'Medium', 'Low', 'Pass']);

export const IncidentStatusEnum = z.enum(['Open', 'In Review', 'Resolved', 'Ignored']);

export const FlaggedItemSchema = z.object({
  category: IncidentCategoryEnum,
  severity: SeverityEnum,
  token_found: z.string(),
  description: z.string(),
  remediation: z.string(),
  line_number: z.number().int().positive().optional(),
  redacted_equivalent: z.string().optional(),
});

export type FlaggedItem = z.infer<typeof FlaggedItemSchema>;

export const GrokAnalysisOutputSchema = z.object({
  trust_score: z.number().int().min(0).max(100),
  risk_level: RiskLevelEnum,
  has_pii: z.boolean(),
  has_security_threat: z.boolean(),
  redacted_payload: z.string(),
  flagged_items: z.array(FlaggedItemSchema),
  executive_summary: z.string(),
});

export type GrokAnalysisOutput = z.infer<typeof GrokAnalysisOutputSchema>;

export const ScanResponseSchema = z.object({
  scan_id: z.string().uuid(),
  workspace_id: z.string().uuid().optional(),
  trust_score: z.number().min(0).max(100),
  risk_level: RiskLevelEnum,
  has_pii: z.boolean(),
  has_security_threat: z.boolean(),
  raw_payload_hash: z.string().optional(),
  redacted_payload: z.string(),
  flagged_items: z.array(FlaggedItemSchema),
  executive_summary: z.string(),
  sensitivity_level: SensitivityLevelEnum.optional(),
  target_frameworks: z.array(ComplianceFrameworkEnum).optional(),
  created_at: z.string(),
});

export type ScanResponse = z.infer<typeof ScanResponseSchema>;

export const UpdateIncidentStatusSchema = z.object({
  status: IncidentStatusEnum,
});

export const CopilotChatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(10000),
  incident_id: z.string().uuid().optional(),
  workspace_id: z.string().uuid().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .optional(),
});

export type CopilotChatRequest = z.infer<typeof CopilotChatSchema>;

export const PolicyUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  workspace_id: z.string().uuid('Invalid workspace ID'),
  policy_name: z.string().min(2, 'Policy name is required').max(255),
  framework: z.enum(['GDPR', 'HIPAA', 'PCI-DSS', 'OWASP-LLM-Top10', 'OWASP']),
  rules_json: z.object({
    min_trust_score: z.number().min(0).max(100).default(75),
    block_on_critical: z.boolean().default(true),
    auto_redact_pii: z.boolean().default(true),
    sensitivity_level: SensitivityLevelEnum.default('Standard'),
    monitored_categories: z.array(IncidentCategoryEnum).default([
      'PROMPT_INJECTION',
      'PII_LEAK',
      'SECRET_EXPOSURE',
      'CODE_INJECTION',
      'COMPLIANCE_VIOLATION',
    ]),
  }),
  is_active: z.boolean().default(true),
});

export type PolicyUpsertRequest = z.infer<typeof PolicyUpsertSchema>;

