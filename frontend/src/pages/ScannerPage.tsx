import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  FileWarning,
  Lock,
} from 'lucide-react';
import {
  FlaggedItem,
  IncidentRecord,
  ScanRequestPayload,
  ScanResponse,
} from '../types';
import { runSecurityScan } from '../api/client';
import { PayloadScannerForm } from '../components/PayloadScannerForm';
import { RedactedDiffViewer } from '../components/RedactedDiffViewer';
import { TrustGauge } from '../components/TrustGauge';
import { ExportReportButton } from '../components/ExportReportButton';

interface ScannerPageProps {
  workspaceId: string;
  onScanComplete: (result: ScanResponse) => void;
  onInvestigateItem: (incident: IncidentRecord) => void;
}

export const ScannerPage: React.FC<ScannerPageProps> = ({
  workspaceId,
  onScanComplete,
  onInvestigateItem,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [rawInput, setRawInput] = useState<string>('');
  const [scanResult, setScanResult] = useState<ScanResponse | null>(null);

  const handleScan = async (
    request: ScanRequestPayload,
    rawPayloadText: string
  ) => {
    setIsScanning(true);
    setRawInput(rawPayloadText);
    try {
      const response = await runSecurityScan(request);
      setScanResult(response);
      onScanComplete(response);
    } finally {
      setIsScanning(false);
    }
  };

  const riskBadgeStyle = (risk: ScanResponse['risk_level']) => {
    switch (risk) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'High':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Low':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'Pass':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  const handleInvestigateFlagged = (item: FlaggedItem) => {
    if (!scanResult) return;
    onInvestigateItem({
      id: scanResult.scan_id,
      scan_id: scanResult.scan_id,
      workspace_id: workspaceId,
      category: item.category,
      severity: item.severity,
      description: item.description,
      flagged_token: item.token_found,
      remediation_suggestion: item.remediation,
      status: 'Open',
      created_at: scanResult.created_at,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Real-Time Security &amp; Privacy Inspector
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspect prompts, code snippets, or logs with Grok-4.7 structured
            threat intelligence and automated PII redaction
          </p>
        </div>

        {scanResult && (
          <ExportReportButton
            data={scanResult}
            filenamePrefix={`sentineltrust-scan-${scanResult.scan_id.slice(0, 8)}`}
          />
        )}
      </div>

      {/* Input Form */}
      <PayloadScannerForm
        workspaceId={workspaceId}
        isScanning={isScanning}
        onScan={handleScan}
      />

      {/* Advisory Output Panel */}
      {scanResult && (
        <div className="space-y-6">
          {/* Top Summary Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-6 flex items-center justify-center">
              <TrustGauge
                score={scanResult.trust_score}
                label="Payload Trust Score"
              />
            </div>

            <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800/90 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Grok-4.7 Executive Remediation Summary
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold border ${riskBadgeStyle(
                        scanResult.risk_level
                      )}`}
                    >
                      Risk Level: {scanResult.risk_level}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  {scanResult.executive_summary}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">PII / PHI Leak</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      scanResult.has_pii
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {scanResult.has_pii ? 'DETECTED' : 'CLEAN'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Security Threat
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      scanResult.has_security_threat
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {scanResult.has_security_threat ? 'DETECTED' : 'CLEAN'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Flagged Entities
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {scanResult.flagged_items.length} finding(s)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-Side Redacted Diff Viewer */}
          <RedactedDiffViewer
            rawPayload={rawInput}
            redactedPayload={scanResult.redacted_payload}
          />

          {/* Flagged Entities Table (Type, Raw Value, Redacted Equivalent, Line Number, Remediation) */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileWarning className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Flagged Entities &amp; Actionable Remediation Table
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Scan ID: {scanResult.scan_id.slice(0, 12)}...
              </span>
            </div>

            {scanResult.flagged_items.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-white">
                  Zero Threats or PII Exposures Detected
                </p>
                <p className="text-xs text-slate-400">
                  Payload is compliant and safe for downstream LLM or database
                  consumption.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Category / Type</th>
                      <th className="py-3 px-4">Severity</th>
                      <th className="py-3 px-4">Line #</th>
                      <th className="py-3 px-4">Raw Value</th>
                      <th className="py-3 px-4">Redacted Equivalent</th>
                      <th className="py-3 px-4">Actionable Fix</th>
                      <th className="py-3 px-4 text-right">Copilot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-xs">
                    {scanResult.flagged_items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-mono font-semibold text-cyan-300 whitespace-nowrap">
                          {item.category}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                              item.severity === 'Critical'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : item.severity === 'High'
                                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                                  : item.severity === 'Medium'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                    : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                            }`}
                          >
                            {item.severity}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                          Line {item.line_number || 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <code className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-[11px] block max-w-[180px] truncate">
                            {item.token_found}
                          </code>
                        </td>
                        <td className="py-3.5 px-4">
                          <code className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
                            {item.redacted_equivalent || '[REDACTED_TOKEN]'}
                          </code>
                        </td>
                        <td className="py-3.5 px-4 max-w-sm">
                          <p className="text-slate-200 font-medium">
                            {item.description}
                          </p>
                          <p className="text-slate-400 text-[11px] mt-0.5">
                            {item.remediation}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleInvestigateFlagged(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold"
                          >
                            <Sparkles className="w-3 h-3" />
                            Investigate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

