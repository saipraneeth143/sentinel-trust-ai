import React, { useState } from 'react';
import {
  Sparkles,
  Eye,
  X,
  AlertOctagon,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { IncidentRecord, IncidentStatus, SeverityLevel } from '../types';

interface IncidentTableProps {
  incidents: IncidentRecord[];
  onStatusChange: (incidentId: string, newStatus: IncidentStatus) => void;
  onInvestigateWithCopilot: (incident: IncidentRecord) => void;
}

export const IncidentTable: React.FC<IncidentTableProps> = ({
  incidents,
  onStatusChange,
  onInvestigateWithCopilot,
}) => {
  const [selectedIncident, setSelectedIncident] =
    useState<IncidentRecord | null>(null);

  const severityBadgeClass = (severity: SeverityLevel) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'High':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Low':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
    }
  };

  const categoryBadgeClass = (category: IncidentRecord['category']) => {
    switch (category) {
      case 'PROMPT_INJECTION':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'SECRET_EXPOSURE':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'PII_LEAK':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'CODE_INJECTION':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'COMPLIANCE_VIOLATION':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
  };

  if (incidents.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-10 text-center space-y-2">
        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
        <h3 className="text-sm font-bold text-white">
          No Matching Security or Privacy Incidents
        </h3>
        <p className="text-xs text-slate-400">
          All inspected payloads in this workspace filter meet active compliance
          thresholds.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Flagged Token</th>
                <th className="py-3.5 px-4">Description &amp; Remediation</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs">
              {incidents.map((inc) => (
                <tr
                  key={inc.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${severityBadgeClass(
                        inc.severity
                      )}`}
                    >
                      <AlertOctagon className="w-3 h-3" />
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${categoryBadgeClass(
                        inc.category
                      )}`}
                    >
                      {inc.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <code className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-rose-300 font-mono text-[11px] block max-w-[180px] truncate">
                      {inc.flagged_token || 'N/A'}
                    </code>
                  </td>
                  <td className="py-3.5 px-4 max-w-md">
                    <p className="text-slate-200 font-medium line-clamp-1">
                      {inc.description}
                    </p>
                    <p className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">
                      Fix: {inc.remediation_suggestion}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <select
                      aria-label={`Status for incident ${inc.id}`}
                      value={inc.status}
                      onChange={(e) =>
                        onStatusChange(inc.id, e.target.value as IncidentStatus)
                      }
                      className="rounded-lg bg-slate-950 border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Open">Open</option>
                      <option value="In Review">In Review</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Ignored">Ignored</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedIncident(inc)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                        title="Inspect Incident Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onInvestigateWithCopilot(inc)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-all"
                      >
                        <Sparkles className="w-3 h-3" />
                        Investigate with Copilot
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      Incident Forensic Detail
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${severityBadgeClass(
                        selectedIncident.severity
                      )}`}
                    >
                      {selectedIncident.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    ID: {selectedIncident.id} • Scan:{' '}
                    {selectedIncident.scan_id.slice(0, 12)}...
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIncident(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">
                    Threat Category
                  </span>
                  <span className="font-mono font-bold text-emerald-300 mt-1 block">
                    {selectedIncident.category}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">
                    Detected Timestamp
                  </span>
                  <span className="font-mono text-slate-200 mt-1 block">
                    {new Date(selectedIncident.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400 block mb-1">
                  Flagged Raw Token / Vector
                </span>
                <code className="font-mono text-xs text-rose-200 break-all">
                  {selectedIncident.flagged_token || 'N/A'}
                </code>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Vulnerability Description
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {selectedIncident.description}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300 block">
                  Grok-4.7 Executive Remediation Guidance
                </span>
                <p className="text-emerald-100 leading-relaxed">
                  {selectedIncident.remediation_suggestion}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Status:</span>
                <select
                  value={selectedIncident.status}
                  onChange={(e) => {
                    const updated = e.target.value as IncidentStatus;
                    onStatusChange(selectedIncident.id, updated);
                    setSelectedIncident({
                      ...selectedIncident,
                      status: updated,
                    });
                  }}
                  className="rounded-lg bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  <option value="Open">Open</option>
                  <option value="In Review">In Review</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Ignored">Ignored</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const inc = selectedIncident;
                    setSelectedIncident(null);
                    onInvestigateWithCopilot(inc);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Launch Grok Copilot Investigation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

