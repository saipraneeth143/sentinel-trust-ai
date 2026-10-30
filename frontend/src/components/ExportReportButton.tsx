import React from 'react';
import { Download, Printer } from 'lucide-react';

interface ExportReportButtonProps {
  data: unknown;
  filenamePrefix?: string;
}

export const ExportReportButton: React.FC<ExportReportButtonProps> = ({
  data,
  filenamePrefix = 'sentineltrust-audit-report',
}) => {
  const handleExportJson = () => {
    const jsonString = JSON.stringify(
      {
        platform: 'SentinelTrust AI Security, Privacy & Trust Platform',
        engine: 'xAI Grok-4.7',
        exported_at: new Date().toISOString(),
        audit_data: data,
      },
      null,
      2
    );
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="no-print flex items-center gap-2">
      <button
        type="button"
        onClick={handleExportJson}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
      >
        <Download className="w-3.5 h-3.5 text-emerald-400" />
        Export JSON Audit
      </button>
      <button
        type="button"
        onClick={handlePrintPdf}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
      >
        <Printer className="w-3.5 h-3.5 text-cyan-400" />
        Print / Save PDF
      </button>
    </div>
  );
};

