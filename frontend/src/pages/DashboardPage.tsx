import React from 'react';
import { Link } from 'react-router-dom';
import {
  ScanSearch,
  ShieldAlert,
  Lock,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { DashboardStats, IncidentRecord, IncidentStatus } from '../types';
import { StatCard } from '../components/StatCard';
import { TrustGauge } from '../components/TrustGauge';
import { ExportReportButton } from '../components/ExportReportButton';
import { IncidentTable } from '../components/IncidentTable';

interface DashboardPageProps {
  stats: DashboardStats;
  onStatusChange: (incidentId: string, status: IncidentStatus) => void;
  onInvestigateWithCopilot: (incident: IncidentRecord) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats,
  onStatusChange,
  onInvestigateWithCopilot,
}) => {
  const totalRiskCount =
    Object.values(stats.risk_distribution).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-6 pb-10">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Security &amp; Trust Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time telemetry across Grok-4.7 payload inspections, PII/PHI
            redactions, and tenant RLS incident logs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportReportButton
            data={stats}
            filenamePrefix="sentineltrust-command-center"
          />
          <Link
            to="/scanner"
            className="no-print inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            New Payload Scan
          </Link>
        </div>
      </div>

      {/* Key Metric StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Payload Scans"
          value={stats.total_scans}
          trend="+14.2% vs last 7d"
          trendPositive={true}
          icon={ScanSearch}
          accentColor="cyan"
        />
        <StatCard
          label="Active Security Incidents"
          value={stats.active_incidents}
          trend={
            stats.active_incidents > 0
              ? `${stats.active_incidents} require triage`
              : 'Zero open alerts'
          }
          trendPositive={stats.active_incidents === 0}
          icon={ShieldAlert}
          accentColor="rose"
        />
        <StatCard
          label="PII / PHI Leak Detection Rate"
          value={`${stats.pii_leak_rate}%`}
          trend="100% auto-redacted"
          trendPositive={true}
          icon={Lock}
          accentColor="amber"
        />
        <StatCard
          label="Average Workspace Trust Score"
          value={`${stats.average_trust_score}/100`}
          trend={stats.average_trust_score >= 75 ? 'Policy Compliant' : 'Below 75 Target'}
          trendPositive={stats.average_trust_score >= 75}
          icon={ShieldCheck}
          accentColor="emerald"
        />
      </div>

      {/* Middle Row: Trust Gauge + Risk Distribution + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-6 flex flex-col items-center justify-center">
          <TrustGauge
            score={stats.average_trust_score}
            label="Aggregate Workspace Trust Score"
          />
        </div>

        {/* Risk Distribution Bar Chart */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">
              Scan Risk Severity Distribution
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              {stats.total_scans} audits
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {(
              [
                {
                  level: 'Critical',
                  color: 'bg-rose-500',
                  text: 'text-rose-300',
                },
                {
                  level: 'High',
                  color: 'bg-orange-500',
                  text: 'text-orange-300',
                },
                {
                  level: 'Medium',
                  color: 'bg-amber-500',
                  text: 'text-amber-300',
                },
                { level: 'Low', color: 'bg-sky-500', text: 'text-sky-300' },
                {
                  level: 'Pass',
                  color: 'bg-emerald-500',
                  text: 'text-emerald-300',
                },
              ] as const
            ).map((row) => {
              const count = stats.risk_distribution[row.level] || 0;
              const pct = Math.round((count / totalRiskCount) * 100);
              return (
                <div key={row.level} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-semibold ${row.text}`}>
                      {row.level}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${row.color} transition-all duration-500`}
                      style={{ width: `${Math.max(pct, count > 0 ? 6 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Threat Vector Category Breakdown */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">
              Threat &amp; Privacy Vector Breakdown
            </h2>
            <Link
              to="/incidents"
              className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              View All
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {[
              {
                key: 'PROMPT_INJECTION',
                label: 'Prompt Injection & Jailbreak',
                badge: 'OWASP LLM01',
              },
              {
                key: 'PII_LEAK',
                label: 'PII / Financial PAN Exposure',
                badge: 'GDPR / PCI',
              },
              {
                key: 'SECRET_EXPOSURE',
                label: 'API Keys, AWS & JWT Secrets',
                badge: 'OWASP LLM06',
              },
              {
                key: 'CODE_INJECTION',
                label: 'SQLi, XSS & Command Injection',
                badge: 'CWE-89 / 79',
              },
              {
                key: 'COMPLIANCE_VIOLATION',
                label: 'HIPAA PHI & Policy Violations',
                badge: 'HIPAA 164.514',
              },
            ].map((cat) => {
              const count = stats.category_breakdown[cat.key] || 0;
              return (
                <div
                  key={cat.key}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      {cat.label}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400">
                      {cat.badge}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs font-bold text-emerald-300">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Flagged Incidents Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">
              Recent Security &amp; Privacy Incidents
            </h2>
            <p className="text-xs text-slate-400">
              Inline status triage or launch a contextual Grok-4.7 Copilot
              investigation
            </p>
          </div>
          <Link
            to="/incidents"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Open Full Incident Log →
          </Link>
        </div>

        <IncidentTable
          incidents={stats.recent_incidents}
          onStatusChange={onStatusChange}
          onInvestigateWithCopilot={onInvestigateWithCopilot}
        />
      </div>
    </div>
  );
};

