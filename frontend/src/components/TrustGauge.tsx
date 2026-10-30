import React from 'react';

interface TrustGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

export const TrustGauge: React.FC<TrustGaugeProps> = ({
  score,
  size = 168,
  label = 'Trust & Compliance Score',
}) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const strokeWidth = 12;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedScore / 100) * circumference;

  // Dynamic color coding: Green = 80-100, Yellow = 50-79, Red = 0-49
  const getColorScheme = (val: number) => {
    if (val >= 80) {
      return {
        stroke: '#10b981', // emerald-500
        text: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
        statusText: 'Trusted & Compliant',
      };
    }
    if (val >= 50) {
      return {
        stroke: '#f59e0b', // amber-500
        text: 'text-amber-400',
        badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
        statusText: 'Elevated Privacy / Policy Risk',
      };
    }
    return {
      stroke: '#f43f5e', // rose-500
      text: 'text-rose-400',
      badgeBg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
      statusText: 'Critical Security / PII Violation',
    };
  };

  const scheme = getColorScheme(clampedScore);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={scheme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-extrabold tracking-tight ${scheme.text}`}>
            {clampedScore}
          </span>
          <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
            / 100
          </span>
        </div>
      </div>
      <p className="text-xs font-medium text-slate-300 mt-2">{label}</p>
      <span
        className={`mt-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${scheme.badgeBg}`}
      >
        {scheme.statusText}
      </span>
    </div>
  );
};

