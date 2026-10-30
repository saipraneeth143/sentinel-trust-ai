import React, { useState } from 'react';
import { Eye, EyeOff, Columns, Copy, Check, ShieldCheck } from 'lucide-react';

interface RedactedDiffViewerProps {
  rawPayload: string;
  redactedPayload: string;
}

export const RedactedDiffViewer: React.FC<RedactedDiffViewerProps> = ({
  rawPayload,
  redactedPayload,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'redacted' | 'raw'>('split');
  const [copied, setCopied] = useState(false);

  const handleCopySanitized = () => {
    navigator.clipboard.writeText(redactedPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Highlight bracketed redaction placeholders like [REDACTED_EMAIL], [REDACTED_API_KEY]
  const renderHighlightedRedacted = (text: string) => {
    const parts = text.split(/(\[(?:REDACTED|BLOCKED)_[A-Z0-9_]+\])/g);
    return parts.map((part, idx) => {
      if (/^\[(?:REDACTED|BLOCKED)_[A-Z0-9_]+\]$/.test(part)) {
        const isSecurityBlock = part.startsWith('[BLOCKED_');
        return (
          <span
            key={idx}
            className={`inline-block font-mono text-[11px] font-bold px-1.5 py-0.5 mx-0.5 rounded border ${
              isSecurityBlock
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {part}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 shadow-lg space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white">
              Real-Time Sanitization &amp; Redacted Diff Viewer
            </h3>
            <p className="text-xs text-slate-400">
              All PII, PHI, payment cards, and secrets are masked with
              bracketed placeholders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                viewMode === 'split'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setViewMode('redacted')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                viewMode === 'redacted'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              Sanitized Only
            </button>
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                viewMode === 'raw'
                  ? 'bg-rose-500/20 text-rose-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Raw Input
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopySanitized}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied Safe Payload
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Sanitized
              </>
            )}
          </button>
        </div>
      </div>

      <div
        className={`grid gap-4 ${
          viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {(viewMode === 'split' || viewMode === 'raw') && (
          <div className="rounded-xl bg-slate-950 border border-rose-500/20 p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                Raw Untrusted Payload (Unredacted)
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Do Not Forward to External LLM
              </span>
            </div>
            <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap break-words leading-relaxed max-h-64 overflow-y-auto">
              {rawPayload}
            </pre>
          </div>
        )}

        {(viewMode === 'split' || viewMode === 'redacted') && (
          <div className="rounded-xl bg-slate-950 border border-emerald-500/30 p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Sanitized / Redacted Output (Safe for LLM Ingestion)
              </span>
              <span className="text-[10px] font-mono text-emerald-300">
                Zero-Trust Guardrail Verified
              </span>
            </div>
            <div className="font-mono text-xs text-slate-100 whitespace-pre-wrap break-words leading-relaxed max-h-64 overflow-y-auto">
              {renderHighlightedRedacted(redactedPayload)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

