export type ComplianceFramework =
  | 'GDPR'
  | 'HIPAA'
  | 'PCI-DSS'
  | 'OWASP-LLM-Top10';

export type SensitivityLevel = 'Strict' | 'Standard' | 'Permissive';

export type IncidentCategory =
  | 'PROMPT_INJECTION'
  | 'PII_LEAK'
  | 'SECRET_EXPOSURE'
  | 'CODE_INJECTION'
  | 'COMPLIANCE_VIOLATION';

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Pass';

export type IncidentStatus = 'Open' | 'In Review' | 'Resolved' | 'Ignored';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface FlaggedItem {
  category: IncidentCategory;
  severity: SeverityLevel;
  token_found: string;
  description: string;
  remediation: string;
  line_number?: number;
  redacted_equivalent?: string;
}

export interface ScanRequestPayload {
  payload: string;
  sensitivity_level: SensitivityLevel;
  target_frameworks: ComplianceFramework[];
  auto_redact: boolean;
  workspace_id: string;
}

export interface ScanResponse {
  scan_id: string;
  workspace_id?: string;
  trust_score: number;
  risk_level: RiskLevel;
  has_pii: boolean;
  has_security_threat: boolean;
  raw_payload_hash?: string;
  redacted_payload: string;
  flagged_items: FlaggedItem[];
  executive_summary: string;
  sensitivity_level?: SensitivityLevel;
  target_frameworks?: ComplianceFramework[];
  created_at: string;
}

export interface IncidentRecord {
  id: string;
  scan_id: string;
  workspace_id: string;
  category: IncidentCategory;
  severity: SeverityLevel;
  description: string;
  flagged_token: string | null;
  remediation_suggestion: string;
  status: IncidentStatus;
  created_at: string;
}

export interface DashboardStats {
  workspace_id: string;
  workspaces: Workspace[];
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

export interface TrustPolicy {
  id: string;
  workspace_id: string;
  policy_name: string;
  framework: ComplianceFramework | 'OWASP';
  rules_json: {
    min_trust_score: number;
    block_on_critical: boolean;
    auto_redact_pii: boolean;
    sensitivity_level: SensitivityLevel;
    monitored_categories: IncidentCategory[];
  };
  is_active: boolean;
  created_at: string;
}

export interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  model?: string;
  recommendations?: string[];
}

