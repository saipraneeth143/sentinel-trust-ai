import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  AlertTriangle,
  Sparkles,
  Lock,
  Activity,
} from 'lucide-react';
import { Workspace } from '../types';

interface NavbarProps {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  activeIncidentCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  activeIncidentCount,
}) => {
  const location = useLocation();
  const currentWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  return (
    <header className="no-print sticky top-0 z-40 h-16 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-950/50 group-hover:border-emerald-400 transition-colors">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base">
                SentinelTrust
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Grok 4.7
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Enterprise Security, Privacy &amp; Trust Guardrail
            </p>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-1 text-xs font-medium text-slate-400 border-l border-slate-800 pl-6">
          <Link
            to="/dashboard"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname === '/dashboard'
                ? 'bg-slate-800 text-white'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Command Center
          </Link>
          <Link
            to="/scanner"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname === '/scanner'
                ? 'bg-slate-800 text-white'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Real-Time Inspector
          </Link>
          <Link
            to="/incidents"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname === '/incidents'
                ? 'bg-slate-800 text-white'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Incidents
          </Link>
          <Link
            to="/copilot"
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              location.pathname === '/copilot'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'hover:text-emerald-300 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Grok Copilot
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {/* RLS Tenant Isolation Indicator + Selector */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5">
          <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-emerald-400" />
              RLS Workspace Tenant
            </span>
            <select
              aria-label="Select Workspace Tenant"
              value={activeWorkspaceId}
              onChange={(e) => onSelectWorkspace(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer pr-2"
            >
              {workspaces.map((ws) => (
                <option
                  key={ws.id}
                  value={ws.id}
                  className="bg-slate-900 text-slate-100"
                >
                  {ws.name} ({ws.slug})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Threat Alerts Pill */}
        <Link
          to="/incidents"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            activeIncidentCount > 0
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
          title={`Tenant: ${currentWorkspace?.name}`}
        >
          {activeIncidentCount > 0 ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{activeIncidentCount} Active Threats</span>
            </>
          ) : (
            <>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>All Clear</span>
            </>
          )}
        </Link>
      </div>
    </header>
  );
};

