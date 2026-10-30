import React, { useEffect, useState } from 'react';
import {
  Sliders,
  PlusCircle,
  ShieldCheck,
  Users,
  Database,
  CheckCircle2,
} from 'lucide-react';
import {
  fetchWorkspacePolicies,
  saveWorkspacePolicy,
} from '../api/client';
import {
  ComplianceFramework,
  SensitivityLevel,
  TrustPolicy,
  Workspace,
} from '../types';

interface SettingsPageProps {
  workspaceId: string;
  workspaces: Workspace[];
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  workspaceId,
  workspaces,
}) => {
  const [policies, setPolicies] = useState<TrustPolicy[]>([]);
  const [policyName, setPolicyName] = useState(
    'Zero-Trust Production Prompt Policy'
  );
  const [framework, setFramework] =
    useState<ComplianceFramework>('OWASP-LLM-Top10');
  const [minTrustScore, setMinTrustScore] = useState<number>(80);
  const [sensitivityLevel, setSensitivityLevel] =
    useState<SensitivityLevel>('Strict');
  const [blockOnCritical, setBlockOnCritical] = useState<boolean>(true);
  const [autoRedactPii, setAutoRedactPii] = useState<boolean>(true);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const currentWorkspace =
    workspaces.find((w) => w.id === workspaceId) || workspaces[0];

  const loadPolicies = async () => {
    const list = await fetchWorkspacePolicies(workspaceId);
    setPolicies(list);
  };

  useEffect(() => {
    loadPolicies();
  }, [workspaceId]);

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyName.trim()) return;

    await saveWorkspacePolicy(workspaceId, {
      policy_name: policyName,
      framework,
      min_trust_score: minTrustScore,
      block_on_critical: blockOnCritical,
      auto_redact_pii: autoRedactPii,
      sensitivity_level: sensitivityLevel,
      is_active: true,
    });

    await loadPolicies();
    setSavedNotice(`Saved policy "${policyName}" for workspace ${currentWorkspace?.name}`);
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const teamMembers = [
    {
      name: 'Elena Vance',
      email: 'elena.vance@acmefintech.io',
      role: 'admin',
      clearance: 'Principal Security Architect',
    },
    {
      name: 'Marcus Chen',
      email: 'marcus.chen@acmefintech.io',
      role: 'analyst',
      clearance: 'Lead SOC Threat Analyst',
    },
    {
      name: 'Sophia Patel',
      email: 'sophia.patel@acmefintech.io',
      role: 'auditor',
      clearance: 'GDPR / HIPAA Privacy Officer',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Sliders className="w-6 h-6 text-emerald-400" />
          Workspace &amp; Compliance Policy Settings
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage custom Trust Score thresholds, active regulatory frameworks,
          and tenant Row Level Security (RLS) team access
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create / Update Policy Form */}
        <form
          onSubmit={handleCreatePolicy}
          className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-6 space-y-4 shadow-xl"
        >
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">
              Create / Update Compliance Policy
            </h2>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Policy Name
            </label>
            <input
              type="text"
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Framework
              </label>
              <select
                value={framework}
                onChange={(e) =>
                  setFramework(e.target.value as ComplianceFramework)
                }
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
              >
                <option value="OWASP-LLM-Top10">OWASP-LLM-Top10</option>
                <option value="GDPR">GDPR</option>
                <option value="HIPAA">HIPAA</option>
                <option value="PCI-DSS">PCI-DSS</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Sensitivity
              </label>
              <select
                value={sensitivityLevel}
                onChange={(e) =>
                  setSensitivityLevel(e.target.value as SensitivityLevel)
                }
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
              >
                <option value="Strict">Strict</option>
                <option value="Standard">Standard</option>
                <option value="Permissive">Permissive</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">
                Minimum Required Trust Score
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {minTrustScore} / 100
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={minTrustScore}
              onChange={(e) => setMinTrustScore(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs cursor-pointer">
              <span className="text-slate-200">
                Block Payload on Critical Threat
              </span>
              <input
                type="checkbox"
                checked={blockOnCritical}
                onChange={(e) => setBlockOnCritical(e.target.checked)}
                className="accent-emerald-500"
              />
            </label>
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs cursor-pointer">
              <span className="text-slate-200">
                Enforce Automatic PII / PHI Redaction
              </span>
              <input
                type="checkbox"
                checked={autoRedactPii}
                onChange={(e) => setAutoRedactPii(e.target.checked)}
                className="accent-emerald-500"
              />
            </label>
          </div>

          {savedNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{savedNotice}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs shadow-md"
          >
            Save Workspace Policy Rule
          </button>
        </form>

        {/* Active Workspace Policies List */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800/90 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">
                Active Compliance Policies ({currentWorkspace?.name})
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {policies.length} active rule(s)
            </span>
          </div>

          <div className="space-y-3">
            {policies.map((pol) => (
              <div
                key={pol.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      {pol.policy_name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      {pol.framework}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Min Trust Score:{' '}
                    <strong className="text-emerald-300">
                      {pol.rules_json.min_trust_score}/100
                    </strong>{' '}
                    • Sensitivity:{' '}
                    <strong className="text-slate-200">
                      {pol.rules_json.sensitivity_level}
                    </strong>{' '}
                    • Auto-Redact PII:{' '}
                    <strong className="text-emerald-300">
                      {pol.rules_json.auto_redact_pii ? 'Enabled' : 'Disabled'}
                    </strong>
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Active Guardrail
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workspace Team Members & RLS Isolation Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">
              Workspace RBAC Team Members
            </h2>
          </div>

          <div className="space-y-2.5">
            {teamMembers.map((m) => (
              <div
                key={m.email}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-white">{m.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {m.email} • {m.clearance}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-800 text-emerald-300 border border-slate-700">
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">
              PostgreSQL Row Level Security (RLS) Verification
            </h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every query on <code className="text-cyan-300">scan_audits</code>,{' '}
            <code className="text-cyan-300">incident_logs</code>, and{' '}
            <code className="text-cyan-300">trust_policies</code> is isolated to
            the active tenant session via:
          </p>
          <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
{`-- Session Tenant Isolation Policy
SELECT set_config('app.current_workspace_id', '${workspaceId}', true);

CREATE POLICY scan_audits_isolation_policy ON scan_audits
  FOR ALL USING (workspace_id = current_workspace_id());`}
          </pre>
        </div>
      </div>
    </div>
  );
};

