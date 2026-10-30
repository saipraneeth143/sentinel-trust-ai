import { z } from 'zod';
export declare const ComplianceFrameworkEnum: z.ZodEnum<["GDPR", "HIPAA", "PCI-DSS", "OWASP-LLM-Top10"]>;
export declare const SensitivityLevelEnum: z.ZodEnum<["Strict", "Standard", "Permissive"]>;
export declare const ScanRequestSchema: z.ZodObject<{
    payload: z.ZodString;
    sensitivity_level: z.ZodDefault<z.ZodEnum<["Strict", "Standard", "Permissive"]>>;
    target_frameworks: z.ZodDefault<z.ZodArray<z.ZodEnum<["GDPR", "HIPAA", "PCI-DSS", "OWASP-LLM-Top10"]>, "many">>;
    auto_redact: z.ZodDefault<z.ZodBoolean>;
    workspace_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    workspace_id: string;
    payload: string;
    sensitivity_level: "Strict" | "Standard" | "Permissive";
    target_frameworks: ("GDPR" | "HIPAA" | "PCI-DSS" | "OWASP-LLM-Top10")[];
    auto_redact: boolean;
}, {
    workspace_id: string;
    payload: string;
    sensitivity_level?: "Strict" | "Standard" | "Permissive" | undefined;
    target_frameworks?: ("GDPR" | "HIPAA" | "PCI-DSS" | "OWASP-LLM-Top10")[] | undefined;
    auto_redact?: boolean | undefined;
}>;
export type ScanRequest = z.infer<typeof ScanRequestSchema>;
export declare const IncidentCategoryEnum: z.ZodEnum<["PROMPT_INJECTION", "PII_LEAK", "SECRET_EXPOSURE", "CODE_INJECTION", "COMPLIANCE_VIOLATION"]>;
export declare const SeverityEnum: z.ZodEnum<["Critical", "High", "Medium", "Low"]>;
export declare const RiskLevelEnum: z.ZodEnum<["Critical", "High", "Medium", "Low", "Pass"]>;
export declare const IncidentStatusEnum: z.ZodEnum<["Open", "In Review", "Resolved", "Ignored"]>;
export declare const FlaggedItemSchema: z.ZodObject<{
    category: z.ZodEnum<["PROMPT_INJECTION", "PII_LEAK", "SECRET_EXPOSURE", "CODE_INJECTION", "COMPLIANCE_VIOLATION"]>;
    severity: z.ZodEnum<["Critical", "High", "Medium", "Low"]>;
    token_found: z.ZodString;
    description: z.ZodString;
    remediation: z.ZodString;
    line_number: z.ZodOptional<z.ZodNumber>;
    redacted_equivalent: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category: "PROMPT_INJECTION" | "PII_LEAK" | "SECRET_EXPOSURE" | "CODE_INJECTION" | "COMPLIANCE_VIOLATION";
    severity: "Critical" | "High" | "Medium" | "Low";
    token_found: string;
    description: string;
    remediation: string;
    line_number?: number | undefined;
    redacted_equivalent?: string | undefined;
}, {
    category: "PROMPT_INJECTION" | "PII_LEAK" | "SECRET_EXPOSURE" | "CODE_INJECTION" | "COMPLIANCE_VIOLATION";
    severity: "Critical" | "High" | "Medium" | "Low";
    token_found: string;
    description: string;
    remediation: string;
    line_number?: number | undefined;
    redacted_equivalent?: string | undefined;
}>;
export type FlaggedItem = z.infer<typeof FlaggedItemSchema>;
export declare const GrokAnalysisOutputSchema: z.ZodObject<{
    trust_score: z.ZodNumber;
    risk_level: z.ZodEnum<["Critical", "High", "Medium", "Low", "Pass"]>;
    has_pii: z.ZodBoolean;
    has_security_threat: z.ZodBoolean;
    redacted_payload: z.ZodString;
    flagged_items: z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["PROMPT_INJECTION", "PII_LEAK", "SECRET_EXPOSURE", "CODE_INJECTION", "COMPLIANCE_VIOLATION"]>;
        severity: z.ZodEnum<["Critical", "High", "Medium", "Low"]>;
        token_found: z.ZodString;
        description: z.ZodString;
        remediation: z.ZodString;
        line_number: z.ZodOptional<z.ZodNumber>;
        redacted_equivalent: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        category: "PROMPT_INJECTION" | "PII_LEAK" | "SECRET_EXPOSURE" | "CODE_INJECTION" | "COMPLIANCE_VIOLATION";
        severity: "Critical" | "High" | "Medium" | "Low";
        token_found: string;
        description: string;
        remediation: string;
        line_number?: number | undefined;
        redacted_equivalent?: string | undefined;
    }, {
        category: "PROMPT_INJECTION" | "PII_LEAK" | "SECRET_EXPOSURE" | "CODE_INJECTION" | "COMPLIANCE_VIOLATION";
        severity: "Critical" | "High" | "Medium" | "Low";
        token_found: string;
        description: string;
        remediation: string;
        line_number?: number | undefined;
        redacted_equivalent?: string | undefined;
    }>, "many">;
    executive_summary: z.ZodString;
}, "strip", z.ZodTypeAny, {
    trust_score: number;
    risk_level: "Critical" | "High" | "Medium" | "Low" | "Pass";
    has_pii: boolean;
    has_security_threat: boolean;
    redacted_payload: string;
    flagged_items: {
        category: "PROMPT_INJECTION" | "PII_LEAK" | "SECRET_EXPOSURE" | "CODE_INJECTION" | "COMPLIANCE_VIOLATION";
        severity: "Critical" | "High" | "Medium" | "Low";
        token_found: string;
        description: string;
        remediation: string;
        line_number?: number | undefined;
        redacted_equivalent?: string | undefined;
    }[];
    executive_summary: string;
}, {
    trust_score: number;
    risk_level: "Critical" | "High" | "Medium" | "Low" | "Pass";
    has_pii: boolean;
    has_security_threat: boolean;
    redacted_payload: string;
    flagged_items: {
        category: "PROMPT_INJECTION" | "PII_LEAK" | "SECRET_EXPOSURE" | "CODE_INJECTION" | "COMPLIANCE_VIOLATION";
        severity: "Critical" | "High" | "Medium" | "Low";
        token_found: string;
        description: string;
        remediation: string;
        line_number?: number | undefined;
        redacted_equivalent?: string | undefined;
    }[];
    executive_summary: string;
}>;
export type GrokAnalysisOutput = z.infer<typeof GrokAnalysisOutputSchema>;
export declare const ScanResponseSchema: z.ZodObject<{
    scan_id: z.ZodString;
    workspace_id: z.ZodOptional<z.ZodString>;
    trust_score: z.ZodNumber;
    risk_level: z.ZodEnum<["Critical", "High", "Medium", "Low", "Pass"]>;
    has_pii: z.ZodBoolean;
    has_security_threat: z.ZodBoolean;
    raw_payload_hash: z.ZodOptional<z.ZodString>;
    redacted_payload: z.ZodString;
    flagged_items: z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["PROMPT_INJECTION", "PII_LEAK", "SECRET_EXPOSURE", "CODE_INJECTION", "COMPLIANCE_VIOLATION"]>;
        severity: z.ZodEnum<["Critical", "High", "Medium", "Low"]>;
        token_found: z.ZodString;
        description: z.ZodString;
        remediation: z.ZodString;
        line_number: z.ZodOptional<z.ZodNumber>;
        redacted_equivalent: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        category: "PROMPT_INJECTION" | "PII_LEAK" | "SECRET_EXPOSURE" | "CODE_INJECTION" | "COMPLIANCE_VIOLATION";
        severity: "Critical" | "High" | "Medium" | "Low";
        token_found: string;
        description: string;
        remediation: string;
        line_number?: number | undefined;
        redacted_equivalent?: string | undefined;
    }, {
        category: "PROMPT_INJECTION" | "PII_LEAK" | "SECRET_EXPOSURE" | "CODE_INJECTION" | "COMPLIANCE_VIOLATION";
        severity: "Critical" | "High" | "Medium" | "Low";
        token_found: string;
        description: string;
        remediation: string;
        line_number?: number | undefined;
        redacted_equivalent?: string | undefined;
    }>, "many">;
    executive_summary: z.ZodString;
    sensitivity_level: z.ZodOptional<z.ZodEnum<["Strict", "Standard", "Permissive"]>>;
    target_frameworks: z.ZodOptional<z.ZodArray<z.ZodEnum<["GDPR", "HIPAA", "PCI-DSS", "OWASP-LLM-Top10"]>, "many">>;
    created_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    trust_score: number;
    risk_level: "Critical" | "High" | "Medium" | "Low" | "Pass";
    has_pii: boolean;
    has_security_threat: boolean;
    redacted_payload: string;
    flagged_items: {
        category: "PROMPT_INJECTION" | "PII_LEAK" | "SECRET_EXPOSURE" | "CODE_INJECTION" | "COMPLIANCE_VIOLATION";
        severity: "Critical" | "High" | "Medium" | "Low";
        token_found: string;
        description: string;
        remediation: string;
        line_number?: number | undefined;
        redacted_equivalent?: string | undefined;
    }[];
    executive_summary: string;
    scan_id: string;
    created_at: string;
    workspace_id?: string | undefined;
    sensitivity_level?: "Strict" | "Standard" | "Permissive" | undefined;
    target_frameworks?: ("GDPR" | "HIPAA" | "PCI-DSS" | "OWASP-LLM-Top10")[] | undefined;
    raw_payload_hash?: string | undefined;
}, {
    trust_score: number;
    risk_level: "Critical" | "High" | "Medium" | "Low" | "Pass";
    has_pii: boolean;
    has_security_threat: boolean;
    redacted_payload: string;
    flagged_items: {
        category: "PROMPT_INJECTION" | "PII_LEAK" | "SECRET_EXPOSURE" | "CODE_INJECTION" | "COMPLIANCE_VIOLATION";
        severity: "Critical" | "High" | "Medium" | "Low";
        token_found: string;
        description: string;
        remediation: string;
        line_number?: number | undefined;
        redacted_equivalent?: string | undefined;
    }[];
    executive_summary: string;
    scan_id: string;
    created_at: string;
    workspace_id?: string | undefined;
    sensitivity_level?: "Strict" | "Standard" | "Permissive" | undefined;
    target_frameworks?: ("GDPR" | "HIPAA" | "PCI-DSS" | "OWASP-LLM-Top10")[] | undefined;
    raw_payload_hash?: string | undefined;
}>;
export type ScanResponse = z.infer<typeof ScanResponseSchema>;
export declare const UpdateIncidentStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["Open", "In Review", "Resolved", "Ignored"]>;
}, "strip", z.ZodTypeAny, {
    status: "Open" | "In Review" | "Resolved" | "Ignored";
}, {
    status: "Open" | "In Review" | "Resolved" | "Ignored";
}>;
export declare const CopilotChatSchema: z.ZodObject<{
    message: z.ZodString;
    incident_id: z.ZodOptional<z.ZodString>;
    workspace_id: z.ZodOptional<z.ZodString>;
    history: z.ZodOptional<z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: "user" | "assistant";
        content: string;
    }, {
        role: "user" | "assistant";
        content: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    message: string;
    workspace_id?: string | undefined;
    incident_id?: string | undefined;
    history?: {
        role: "user" | "assistant";
        content: string;
    }[] | undefined;
}, {
    message: string;
    workspace_id?: string | undefined;
    incident_id?: string | undefined;
    history?: {
        role: "user" | "assistant";
        content: string;
    }[] | undefined;
}>;
export type CopilotChatRequest = z.infer<typeof CopilotChatSchema>;
export declare const PolicyUpsertSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    workspace_id: z.ZodString;
    policy_name: z.ZodString;
    framework: z.ZodEnum<["GDPR", "HIPAA", "PCI-DSS", "OWASP-LLM-Top10", "OWASP"]>;
    rules_json: z.ZodObject<{
        min_trust_score: z.ZodDefault<z.ZodNumber>;
        block_on_critical: z.ZodDefault<z.ZodBoolean>;
        auto_redact_pii: z.ZodDefault<z.ZodBoolean>;
        sensitivity_level: z.ZodDefault<z.ZodEnum<["Strict", "Standard", "Permissive"]>>;
        monitored_categories: z.ZodDefault<z.ZodArray<z.ZodEnum<["PROMPT_INJECTION", "PII_LEAK", "SECRET_EXPOSURE", "CODE_INJECTION", "COMPLIANCE_VIOLATION"]>, "many">>;
    }, "strip", z.ZodTypeAny, {
        sensitivity_level: "Strict" | "Standard" | "Permissive";
        min_trust_score: number;
        block_on_critical: boolean;
        auto_redact_pii: boolean;
        monitored_categories: ("PROMPT_INJECTION" | "PII_LEAK" | "SECRET_EXPOSURE" | "CODE_INJECTION" | "COMPLIANCE_VIOLATION")[];
    }, {
        sensitivity_level?: "Strict" | "Standard" | "Permissive" | undefined;
        min_trust_score?: number | undefined;
        block_on_critical?: boolean | undefined;
        auto_redact_pii?: boolean | undefined;
        monitored_categories?: ("PROMPT_INJECTION" | "PII_LEAK" | "SECRET_EXPOSURE" | "CODE_INJECTION" | "COMPLIANCE_VIOLATION")[] | undefined;
    }>;
    is_active: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    workspace_id: string;
    policy_name: string;
    framework: "GDPR" | "HIPAA" | "PCI-DSS" | "OWASP-LLM-Top10" | "OWASP";
    rules_json: {
        sensitivity_level: "Strict" | "Standard" | "Permissive";
        min_trust_score: number;
        block_on_critical: boolean;
        auto_redact_pii: boolean;
        monitored_categories: ("PROMPT_INJECTION" | "PII_LEAK" | "SECRET_EXPOSURE" | "CODE_INJECTION" | "COMPLIANCE_VIOLATION")[];
    };
    is_active: boolean;
    id?: string | undefined;
}, {
    workspace_id: string;
    policy_name: string;
    framework: "GDPR" | "HIPAA" | "PCI-DSS" | "OWASP-LLM-Top10" | "OWASP";
    rules_json: {
        sensitivity_level?: "Strict" | "Standard" | "Permissive" | undefined;
        min_trust_score?: number | undefined;
        block_on_critical?: boolean | undefined;
        auto_redact_pii?: boolean | undefined;
        monitored_categories?: ("PROMPT_INJECTION" | "PII_LEAK" | "SECRET_EXPOSURE" | "CODE_INJECTION" | "COMPLIANCE_VIOLATION")[] | undefined;
    };
    id?: string | undefined;
    is_active?: boolean | undefined;
}>;
export type PolicyUpsertRequest = z.infer<typeof PolicyUpsertSchema>;
