import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanSearch,
  ShieldAlert,
  Bot,
  Sliders,
  Home,
  Database,
  CheckCircle2,
} from 'lucide-react';

interface SidebarProps {
  activeIncidentCount: number;
  workspaceId: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeIncidentCount,
  workspaceId,
}) => {
  const navItems = [
    { to: '/', label: 'Overview & Architecture', icon: Home },
    { to: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
    { to: '/scanner', label: 'Security & PII Scanner', icon: ScanSearch },
    {
      to: '/incidents',
      label: 'Incident Log',
      icon: ShieldAlert,
      badge: activeIncidentCount > 0 ? activeIncidentCount : undefined,
    },
    { to: '/copilot', label: 'Grok Security Copilot', icon: Bot },
    { to: '/settings', label: 'Policies & RLS Settings', icon: Sliders },
  ];

  return (
    <aside className="no-print w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/60 hidden md:flex flex-col justify-between p-4">
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Platform Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            PostgreSQL RLS
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Enforced
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Session isolated via{' '}
          <code className="text-cyan-300 font-mono text-[10px]">
            app.current_workspace_id
          </code>
        </p>
        <div className="text-[10px] font-mono text-slate-400 truncate bg-slate-950 px-2 py-1 rounded border border-slate-800">
          UUID: {workspaceId}
        </div>
      </div>
    </aside>
  );
};

