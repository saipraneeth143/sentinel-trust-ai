import React from 'react';
import { CopilotChatWindow } from '../components/CopilotChatWindow';
import { IncidentRecord } from '../types';

interface CopilotPageProps {
  workspaceId: string;
  activeIncident?: IncidentRecord | null;
  onClearIncident?: () => void;
}

export const CopilotPage: React.FC<CopilotPageProps> = ({
  workspaceId,
  activeIncident,
  onClearIncident,
}) => {
  return (
    <div className="space-y-5 pb-10">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Grok AI Security Analyst Copilot
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Conversational root-cause threat investigation, vulnerability patch
          synthesis, and regulatory compliance engineering
        </p>
      </div>

      <CopilotChatWindow
        workspaceId={workspaceId}
        activeIncident={activeIncident}
        onClearIncident={onClearIncident}
      />
    </div>
  );
};

