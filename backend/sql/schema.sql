-- SentinelTrust AI - Production PostgreSQL Schema & Row Level Security (RLS)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Workspaces Table
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'analyst' CHECK (role IN ('admin', 'analyst', 'auditor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Scan Audits Table
CREATE TABLE IF NOT EXISTS scan_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    raw_payload_hash VARCHAR(64) NOT NULL,
    redacted_payload TEXT NOT NULL,
    trust_score INT NOT NULL CHECK (trust_score BETWEEN 0 AND 100),
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('Critical', 'High', 'Medium', 'Low', 'Pass')),
    has_pii BOOLEAN DEFAULT FALSE,
    has_security_threat BOOLEAN DEFAULT FALSE,
    executive_summary TEXT DEFAULT '',
    sensitivity_level VARCHAR(20) DEFAULT 'Standard',
    target_frameworks TEXT[] DEFAULT ARRAY['OWASP-LLM-Top10'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Incident Logs Table
CREATE TABLE IF NOT EXISTS incident_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id UUID NOT NULL REFERENCES scan_audits(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- e.g., 'PROMPT_INJECTION', 'PII_LEAK', 'SECRET_EXPOSURE', 'CODE_INJECTION', 'COMPLIANCE_VIOLATION'
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
    description TEXT NOT NULL,
    flagged_token TEXT,
    remediation_suggestion TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Open' CHECK (status IN ('Open', 'In Review', 'Resolved', 'Ignored')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trust Policies Table
CREATE TABLE IF NOT EXISTS trust_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    policy_name VARCHAR(255) NOT NULL,
    framework VARCHAR(50) NOT NULL, -- 'GDPR', 'HIPAA', 'PCI-DSS', 'OWASP-LLM-Top10'
    rules_json JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scan_audits_workspace ON scan_audits(workspace_id);
CREATE INDEX IF NOT EXISTS idx_incident_logs_workspace ON incident_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_incident_logs_scan ON incident_logs(scan_id);
CREATE INDEX IF NOT EXISTS idx_incident_logs_status ON incident_logs(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) / DATA ISOLATION RULES
-- ============================================================================

ALTER TABLE scan_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_policies ENABLE ROW LEVEL SECURITY;

-- Helper function to fetch current tenant workspace from application session
CREATE OR REPLACE FUNCTION current_workspace_id() RETURNS UUID AS $$
    SELECT NULLIF(current_setting('app.current_workspace_id', true), '')::UUID;
$$ LANGUAGE sql STABLE;

-- Scan Audits RLS Policy
DROP POLICY IF EXISTS scan_audits_isolation_policy ON scan_audits;
CREATE POLICY scan_audits_isolation_policy ON scan_audits
    FOR ALL
    USING (workspace_id = current_workspace_id());

-- Incident Logs RLS Policy
DROP POLICY IF EXISTS incident_logs_isolation_policy ON incident_logs;
CREATE POLICY incident_logs_isolation_policy ON incident_logs
    FOR ALL
    USING (workspace_id = current_workspace_id());

-- Trust Policies RLS Policy
DROP POLICY IF EXISTS trust_policies_isolation_policy ON trust_policies;
CREATE POLICY trust_policies_isolation_policy ON trust_policies
    FOR ALL
    USING (workspace_id = current_workspace_id());

-- Seed Default Workspaces and Users
INSERT INTO workspaces (id, name, slug) VALUES
    ('11111111-1111-4111-8111-111111111111', 'Acme FinTech Global', 'acme-fintech'),
    ('22222222-2222-4222-8222-222222222222', 'Aegis Health Systems', 'aegis-health'),
    ('33333333-3333-4333-8333-333333333333', 'CloudScale Defense AI', 'cloudscale-defense')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, workspace_id, email, full_name, role) VALUES
    ('a1111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111', 'elena.vance@acmefintech.io', 'Elena Vance', 'admin'),
    ('a2222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111', 'marcus.chen@acmefintech.io', 'Marcus Chen', 'analyst'),
    ('a3333333-3333-4333-8333-333333333333', '11111111-1111-4111-8111-111111111111', 'sophia.patel@acmefintech.io', 'Sophia Patel', 'auditor')
ON CONFLICT (id) DO NOTHING;

