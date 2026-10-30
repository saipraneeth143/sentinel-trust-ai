import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  Terminal,
  User,
} from 'lucide-react';
import { sendCopilotMessage } from '../api/client';
import { CopilotMessage, IncidentRecord } from '../types';

interface CopilotChatWindowProps {
  workspaceId: string;
  activeIncident?: IncidentRecord | null;
  onClearIncident?: () => void;
}

const QUICK_PROMPTS = [
  'Generate an Express middleware to block prompt injection & redact PII',
  'How do we enforce GDPR Art. 25 & HIPAA Safe Harbor before calling LLMs?',
  'Write a PostgreSQL Row Level Security (RLS) policy for tenant isolation',
  'Remediation steps for exposed sk-live API keys and JWT secrets',
];

export const CopilotChatWindow: React.FC<CopilotChatWindowProps> = ({
  workspaceId,
  activeIncident,
  onClearIncident,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      role: 'assistant',
      content: activeIncident
        ? `I have loaded forensic context for Incident **${activeIncident.id.slice(0, 8)}** (\`${activeIncident.category}\` — **${activeIncident.severity}**).\n\nFlagged token: \`${activeIncident.flagged_token || 'Redacted'}\`\n\nAsk me to generate a security patch, write a compliance policy rule, or perform root-cause analysis.`
        : `Welcome to the **SentinelTrust Grok-4.7 Security Analyst Copilot**.\n\nI can help you investigate flagged incidents, author zero-trust sanitization middleware, or map findings to **GDPR**, **HIPAA**, **PCI-DSS**, and **OWASP LLM Top 10** controls.`,
      model: 'grok-4.7',
      timestamp: new Date().toISOString(),
      recommendations: [
        'Inspect active Critical incidents for secret rotation',
        'Verify pre-LLM PII redaction rules in /scanner',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (promptText?: string) => {
    const textToSend = (promptText ?? input).trim();
    if (!textToSend || loading) return;

    const userMsg: CopilotMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    if (!promptText) setInput('');
    setLoading(true);

    try {
      const res = await sendCopilotMessage(
        workspaceId,
        textToSend,
        updatedHistory,
        activeIncident?.id
      );
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.reply,
          model: res.model,
          recommendations: res.recommendations,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl flex flex-col h-[680px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">
                Grok AI Security Analyst Copilot
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                grok-4.7
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive threat investigation, patch code synthesis &amp;
              compliance advisory
            </p>
          </div>
        </div>

        {activeIncident && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs">
            <span className="text-rose-300 font-semibold">
              Investigating: {activeIncident.category} ({activeIncident.severity})
            </span>
            {onClearIncident && (
              <button
                type="button"
                onClick={onClearIncident}
                className="text-slate-400 hover:text-white underline ml-1"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto">
        <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        {QUICK_PROMPTS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => handleSend(q)}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-emerald-300 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
            )}

            <div
              className={`max-w-3xl rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                msg.role === 'user'
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-slate-100'
                  : 'bg-slate-950/90 border border-slate-800 text-slate-200'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                    Recommended Next Actions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.recommendations.map((rec, rIdx) => (
                      <button
                        key={rIdx}
                        type="button"
                        onClick={() => handleSend(`Provide code for: ${rec}`)}
                        className="text-left px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-cyan-300 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 shrink-0" />
                        {rec}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-cyan-400" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium px-3 py-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            Grok-4.7 Security Analyst is synthesizing remediation guidance...
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Grok-4.7 to analyze an incident, write patch code, or draft a GDPR/HIPAA rule..."
          className="flex-1 rounded-xl bg-slate-900 border border-slate-800 focus:border-emerald-500/60 focus:outline-none px-4 py-2.5 text-xs text-white placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs disabled:opacity-50 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          Send
        </button>
      </form>
    </div>
  );
};

