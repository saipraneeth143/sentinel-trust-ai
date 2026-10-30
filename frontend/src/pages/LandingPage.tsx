import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  Lock,
  Database,
  FileSearch,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const pillars = [
    {
      title: 'Prompt Injection & Jailbreak Defense',
      description:
        'Detects adversarial instruction overrides, DAN jailbreaks, system delimiter spoofing, and indirect prompt injection before execution.',
      icon: AlertTriangle,
      badge: 'OWASP LLM01',
    },
    {
      title: 'Real-Time PII / PHI & Secret Redaction',
      description:
        'Automatically masks emails, SSNs, credit cards (PAN), HIPAA MRNs, AWS keys, and live API secrets with deterministic bracketed tokens.',
      icon: Lock,
      badge: 'GDPR / HIPAA / PCI',
    },
    {
      title: 'xAI Grok-4.7 Structured Intelligence',
      description:
        'Uses @ai-sdk/xai with strict JSON Schema output validation to compute a 0–100 Trust Score and generate executive remediation guidance.',
      icon: Cpu,
      badge: 'grok-4.7 SDK',
    },
    {
      title: 'PostgreSQL Row Level Security (RLS)',
      description:
        'Multi-tenant workspace isolation enforced at the database layer via current_setting(app.current_workspace_id) policies.',
      icon: Database,
      badge: 'Multi-Tenant RLS',
    },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-950/40 border border-slate-800 p-8 lg:p-12 shadow-2xl">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by xAI Grok-4.7 • Enterprise AI Security, Privacy &amp; Trust
            Platform
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Zero-Trust Guardrails for{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Enterprise AI &amp; Sensitive Data
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            SentinelTrust AI inspects prompts, source code, and document streams
            in real time—preventing PII/PHI leakage, neutralizing prompt
            injections, exposing leaked credentials, and enforcing{' '}
            <strong>GDPR, HIPAA, PCI-DSS, and OWASP LLM Top 10</strong>{' '}
            compliance before payloads reach external LLMs or databases.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/scanner"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950/50 transition-all"
            >
              <FileSearch className="w-4 h-4" />
              Launch Real-Time Inspector
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-100 border border-slate-700 font-semibold text-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Open Security Command Center
            </Link>
          </div>
        </div>
      </section>

      {/* Core Capabilities Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pillars.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-6 hover:border-emerald-500/40 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* End-to-End Architecture Pipeline */}
      <section className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-6 lg:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white">
              End-to-End Inspection &amp; Persistence Architecture
            </h2>
            <p className="text-xs text-slate-400">
              How SentinelTrust AI processes, sanitizes, and isolates tenant
              telemetry
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg">
            POST /api/v1/scan → Grok-4.7 → PostgreSQL RLS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Zod & Control-Char Gate',
              desc: 'Validates payload schema (max 50KB), verifies X-Workspace-ID UUID header, and strips non-printable ASCII control bytes.',
            },
            {
              step: '02',
              title: 'Grok-4.7 Threat Classification',
              desc: 'Evaluates payload against PROMPT_INJECTION, PII_LEAK, SECRET_EXPOSURE, CODE_INJECTION, and COMPLIANCE_VIOLATION.',
            },
            {
              step: '03',
              title: 'Zero-Trust PII Redaction',
              desc: 'Replaces sensitive tokens with [REDACTED_EMAIL], [REDACTED_SSN], [REDACTED_API_KEY] and computes SHA-256 payload hash.',
            },
            {
              step: '04',
              title: 'RLS Audit & Copilot Triage',
              desc: 'Persists audit logs inside tenant-scoped PostgreSQL transactions and enables 1-click Grok Copilot investigation.',
            },
          ].map((s) => (
            <div
              key={s.step}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  STEP {s.step}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <h4 className="text-sm font-bold text-white">{s.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

