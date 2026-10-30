import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  trendPositive?: boolean;
  icon: LucideIcon;
  accentColor?: 'emerald' | 'rose' | 'amber' | 'cyan';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendPositive = true,
  icon: Icon,
  accentColor = 'emerald',
}) => {
  const colorMap = {
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
    rose: 'from-rose-500/20 to-rose-500/5 border-rose-500/30 text-rose-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 shadow-lg hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br border flex items-center justify-center ${colorMap[accentColor]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-3xl font-extrabold tracking-tight text-white">
          {value}
        </span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trendPositive
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
          }`}
        >
          {trend}
        </span>
      </div>
    </div>
  );
};

