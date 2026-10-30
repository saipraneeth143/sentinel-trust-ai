import React, { useEffect, useState } from 'react';
import { Filter, Search, ShieldAlert } from 'lucide-react';
import { fetchIncidents } from '../api/client';
import { IncidentRecord, IncidentStatus } from '../types';
import { IncidentTable } from '../components/IncidentTable';
import { ExportReportButton } from '../components/ExportReportButton';

interface IncidentsPageProps {
  workspaceId: string;
  onStatusChange: (incidentId: string, newStatus: IncidentStatus) => void;
  onInvestigateWithCopilot: (incident: IncidentRecord) => void;
}

export const IncidentsPage: React.FC<IncidentsPageProps> = ({
  workspaceId,
  onStatusChange,
  onInvestigateWithCopilot,
}) => {
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadIncidents = async () => {
    const list = await fetchIncidents(workspaceId, {
      severity: severityFilter,
      status: statusFilter,
      category: categoryFilter,
      search: searchQuery,
    });
    setIncidents(list);
  };

  useEffect(() => {
    loadIncidents();
  }, [workspaceId, severityFilter, statusFilter, categoryFilter, searchQuery]);

  const handleInlineStatusChange = async (
    incidentId: string,
    newStatus: IncidentStatus
  ) => {
    await onStatusChange(incidentId, newStatus);
    await loadIncidents();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            Incident Management &amp; Triage Log
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Workspace-isolated security threats, PII/PHI leaks, and secret
            exposures tracked in PostgreSQL RLS
          </p>
        </div>

        <ExportReportButton
          data={incidents}
          filenamePrefix="sentineltrust-incidents-log"
        />
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search token, category, or description..."
            className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[11px] text-slate-400">Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white focus:outline-none flex-1"
          >
            <option value="ALL" className="bg-slate-900">
              All Severities
            </option>
            <option value="Critical" className="bg-slate-900">
              Critical
            </option>
            <option value="High" className="bg-slate-900">
              High
            </option>
            <option value="Medium" className="bg-slate-900">
              Medium
            </option>
            <option value="Low" className="bg-slate-900">
              Low
            </option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[11px] text-slate-400">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white focus:outline-none flex-1"
          >
            <option value="ALL" className="bg-slate-900">
              All Categories
            </option>
            <option value="PROMPT_INJECTION" className="bg-slate-900">
              PROMPT_INJECTION
            </option>
            <option value="PII_LEAK" className="bg-slate-900">
              PII_LEAK
            </option>
            <option value="SECRET_EXPOSURE" className="bg-slate-900">
              SECRET_EXPOSURE
            </option>
            <option value="CODE_INJECTION" className="bg-slate-900">
              CODE_INJECTION
            </option>
            <option value="COMPLIANCE_VIOLATION" className="bg-slate-900">
              COMPLIANCE_VIOLATION
            </option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[11px] text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white focus:outline-none flex-1"
          >
            <option value="ALL" className="bg-slate-900">
              All Statuses
            </option>
            <option value="Open" className="bg-slate-900">
              Open
            </option>
            <option value="In Review" className="bg-slate-900">
              In Review
            </option>
            <option value="Resolved" className="bg-slate-900">
              Resolved
            </option>
            <option value="Ignored" className="bg-slate-900">
              Ignored
            </option>
          </select>
        </div>
      </div>

      <IncidentTable
        incidents={incidents}
        onStatusChange={handleInlineStatusChange}
        onInvestigateWithCopilot={onInvestigateWithCopilot}
      />
    </div>
  );
};

