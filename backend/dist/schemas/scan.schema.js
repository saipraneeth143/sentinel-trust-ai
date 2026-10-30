"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyUpsertSchema = exports.CopilotChatSchema = exports.UpdateIncidentStatusSchema = exports.ScanResponseSchema = exports.GrokAnalysisOutputSchema = exports.FlaggedItemSchema = exports.IncidentStatusEnum = exports.RiskLevelEnum = exports.SeverityEnum = exports.IncidentCategoryEnum = exports.ScanRequestSchema = exports.SensitivityLevelEnum = exports.ComplianceFrameworkEnum = void 0;
const zod_1 = require("zod");
exports.ComplianceFrameworkEnum = zod_1.z.enum([
    'GDPR',
    'HIPAA',
    'PCI-DSS',
    'OWASP-LLM-Top10',
]);
exports.SensitivityLevelEnum = zod_1.z.enum(['Strict', 'Standard', 'Permissive']);
exports.ScanRequestSchema = zod_1.z.object({
    payload: zod_1.z
        .string()
        .min(1, 'Payload cannot be empty')
        .max(50000, 'Payload exceeds max length of 50,000 characters'),
    sensitivity_level: exports.SensitivityLevelEnum.default('Standard'),
    target_frameworks: zod_1.z
        .array(exports.ComplianceFrameworkEnum)
        .min(1, 'Select at least one target compliance framework')
        .default(['OWASP-LLM-Top10']),
    auto_redact: zod_1.z.boolean().default(true),
    workspace_id: zod_1.z.string().uuid('Invalid workspace ID'),
});
exports.IncidentCategoryEnum = zod_1.z.enum([
    'PROMPT_INJECTION',
    'PII_LEAK',
    'SECRET_EXPOSURE',
    'CODE_INJECTION',
    'COMPLIANCE_VIOLATION',
]);
exports.SeverityEnum = zod_1.z.enum(['Critical', 'High', 'Medium', 'Low']);
exports.RiskLevelEnum = zod_1.z.enum(['Critical', 'High', 'Medium', 'Low', 'Pass']);
exports.IncidentStatusEnum = zod_1.z.enum(['Open', 'In Review', 'Resolved', 'Ignored']);
exports.FlaggedItemSchema = zod_1.z.object({
    category: exports.IncidentCategoryEnum,
    severity: exports.SeverityEnum,
    token_found: zod_1.z.string(),
    description: zod_1.z.string(),
    remediation: zod_1.z.string(),
    line_number: zod_1.z.number().int().positive().optional(),
    redacted_equivalent: zod_1.z.string().optional(),
});
exports.GrokAnalysisOutputSchema = zod_1.z.object({
    trust_score: zod_1.z.number().int().min(0).max(100),
    risk_level: exports.RiskLevelEnum,
    has_pii: zod_1.z.boolean(),
    has_security_threat: zod_1.z.boolean(),
    redacted_payload: zod_1.z.string(),
    flagged_items: zod_1.z.array(exports.FlaggedItemSchema),
    executive_summary: zod_1.z.string(),
});
exports.ScanResponseSchema = zod_1.z.object({
    scan_id: zod_1.z.string().uuid(),
    workspace_id: zod_1.z.string().uuid().optional(),
    trust_score: zod_1.z.number().min(0).max(100),
    risk_level: exports.RiskLevelEnum,
    has_pii: zod_1.z.boolean(),
    has_security_threat: zod_1.z.boolean(),
    raw_payload_hash: zod_1.z.string().optional(),
    redacted_payload: zod_1.z.string(),
    flagged_items: zod_1.z.array(exports.FlaggedItemSchema),
    executive_summary: zod_1.z.string(),
    sensitivity_level: exports.SensitivityLevelEnum.optional(),
    target_frameworks: zod_1.z.array(exports.ComplianceFrameworkEnum).optional(),
    created_at: zod_1.z.string(),
});
exports.UpdateIncidentStatusSchema = zod_1.z.object({
    status: exports.IncidentStatusEnum,
});
exports.CopilotChatSchema = zod_1.z.object({
    message: zod_1.z.string().min(1, 'Message cannot be empty').max(10000),
    incident_id: zod_1.z.string().uuid().optional(),
    workspace_id: zod_1.z.string().uuid().optional(),
    history: zod_1.z
        .array(zod_1.z.object({
        role: zod_1.z.enum(['user', 'assistant']),
        content: zod_1.z.string(),
    }))
        .optional(),
});
exports.PolicyUpsertSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    workspace_id: zod_1.z.string().uuid('Invalid workspace ID'),
    policy_name: zod_1.z.string().min(2, 'Policy name is required').max(255),
    framework: zod_1.z.enum(['GDPR', 'HIPAA', 'PCI-DSS', 'OWASP-LLM-Top10', 'OWASP']),
    rules_json: zod_1.z.object({
        min_trust_score: zod_1.z.number().min(0).max(100).default(75),
        block_on_critical: zod_1.z.boolean().default(true),
        auto_redact_pii: zod_1.z.boolean().default(true),
        sensitivity_level: exports.SensitivityLevelEnum.default('Standard'),
        monitored_categories: zod_1.z.array(exports.IncidentCategoryEnum).default([
            'PROMPT_INJECTION',
            'PII_LEAK',
            'SECRET_EXPOSURE',
            'CODE_INJECTION',
            'COMPLIANCE_VIOLATION',
        ]),
    }),
    is_active: zod_1.z.boolean().default(true),
});
