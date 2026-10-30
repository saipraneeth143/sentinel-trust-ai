import { GrokAnalysisOutput, PolicyUpsertRequest, ScanResponse } from '../schemas/scan.schema';
export interface WorkspaceRecord {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}
export interface IncidentRecord {
    id: string;
    scan_id: string;
    workspace_id: string;
    category: 'PROMPT_INJECTION' | 'PII_LEAK' | 'SECRET_EXPOSURE' | 'CODE_INJECTION' | 'COMPLIANCE_VIOLATION';
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    description: string;
    flagged_token: string | null;
    remediation_suggestion: string;
    status: 'Open' | 'In Review' | 'Resolved' | 'Ignored';
    created_at: string;
}
export interface TrustPolicyRecord {
    id: string;
    workspace_id: string;
    policy_name: string;
    framework: string;
    rules_json: {
        min_trust_score: number;
        block_on_critical: boolean;
        auto_redact_pii: boolean;
        sensitivity_level: 'Strict' | 'Standard' | 'Permissive';
        monitored_categories: string[];
    };
    is_active: boolean;
    created_at: string;
}
export interface DashboardStatsResponse {
    total_scans: number;
    active_incidents: number;
    flagged_threats: number;
    pii_leak_rate: number;
    average_trust_score: number;
    risk_distribution: {
        Critical: number;
        High: number;
        Medium: number;
        Low: number;
        Pass: number;
    };
    category_breakdown: Record<string, number>;
    recent_scans: ScanResponse[];
    recent_incidents: IncidentRecord[];
}
export declare const DEFAULT_WORKSPACES: WorkspaceRecord[];
export declare function getWorkspaces(): Promise<WorkspaceRecord[]>;
export declare function saveScanAndIncidents(workspaceId: string, rawPayload: string, analysis: GrokAnalysisOutput, sensitivityLevel?: 'Strict' | 'Standard' | 'Permissive', targetFrameworks?: ('GDPR' | 'HIPAA' | 'PCI-DSS' | 'OWASP-LLM-Top10')[]): Promise<ScanResponse>;
export declare function getIncidentsForWorkspace(workspaceId: string, filters?: {
    severity?: string;
    status?: string;
    category?: string;
    search?: string;
}): Promise<IncidentRecord[]>;
export declare function getIncidentById(workspaceId: string, incidentId: string): Promise<IncidentRecord | null>;
export declare function updateIncidentStatus(workspaceId: string, incidentId: string, status: 'Open' | 'In Review' | 'Resolved' | 'Ignored'): Promise<IncidentRecord | null>;
export declare function getDashboardStats(workspaceId: string): Promise<DashboardStatsResponse>;
export declare function getPoliciesForWorkspace(workspaceId: string): Promise<TrustPolicyRecord[]>;
export declare function upsertPolicyForWorkspace(payload: PolicyUpsertRequest): Promise<TrustPolicyRecord>;
