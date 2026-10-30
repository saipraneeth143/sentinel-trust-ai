import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import {
  fetchDashboardStats,
  patchIncidentStatus,
  WORKSPACE_PRESETS,
} from './api/client';
import {
  DashboardStats,
  IncidentRecord,
  IncidentStatus,
  ScanResponse,
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScannerPage } from './pages/ScannerPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { CopilotPage } from './pages/CopilotPage';
import { SettingsPage } from './pages/SettingsPage';

const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(
    WORKSPACE_PRESETS[0].id
  );
  const [copilotIncident, setCopilotIncident] =
    useState<IncidentRecord | null>(null);

  const [stats, setStats] = useState<DashboardStats>({
    workspace_id: WORKSPACE_PRESETS[0].id,
    workspaces: WORKSPACE_PRESETS,
    total_scans: 3,
    active_incidents: 4,
    flagged_threats: 5,
    pii_leak_rate: 66.7,
    average_trust_score: 62,
    risk_distribution: {
      Critical: 1,
      High: 1,
      Medium: 0,
      Low: 0,
      Pass: 1,
    },
    category_breakdown: {
      PROMPT_INJECTION: 1,
      PII_LEAK: 3,
      SECRET_EXPOSURE: 1,
      CODE_INJECTION: 0,
      COMPLIANCE_VIOLATION: 0,
    },
    recent_scans: [],
    recent_incidents: [],
  });

  const refreshDashboard = async (wsId: string = activeWorkspaceId) => {
    const updated = await fetchDashboardStats(wsId);
    setStats(updated);
  };

  useEffect(() => {
    refreshDashboard(activeWorkspaceId);
  }, [activeWorkspaceId]);

  const handleStatusChange = async (
    incidentId: string,
    newStatus: IncidentStatus
  ) => {
    await patchIncidentStatus(activeWorkspaceId, incidentId, newStatus);
    await refreshDashboard(activeWorkspaceId);
  };

  const handleScanComplete = async (_scan: ScanResponse) => {
    await refreshDashboard(activeWorkspaceId);
  };

  const handleInvestigateWithCopilot = (incident: IncidentRecord) => {
    setCopilotIncident(incident);
    navigate('/copilot');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar
        workspaces={stats.workspaces || WORKSPACE_PRESETS}
        activeWorkspaceId={activeWorkspaceId}
        onSelectWorkspace={(id) => {
          setActiveWorkspaceId(id);
          setCopilotIncident(null);
        }}
        activeIncidentCount={stats.active_incidents}
      />

      <div className="flex-1 flex">
        <Sidebar
          activeIncidentCount={stats.active_incidents}
          workspaceId={activeWorkspaceId}
        />

        <main className="flex-1 p-5 lg:p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/dashboard"
              element={
                <DashboardPage
                  stats={stats}
                  onStatusChange={handleStatusChange}
                  onInvestigateWithCopilot={handleInvestigateWithCopilot}
                />
              }
            />
            <Route
              path="/scanner"
              element={
                <ScannerPage
                  workspaceId={activeWorkspaceId}
                  onScanComplete={handleScanComplete}
                  onInvestigateItem={handleInvestigateWithCopilot}
                />
              }
            />
            <Route
              path="/incidents"
              element={
                <IncidentsPage
                  workspaceId={activeWorkspaceId}
                  onStatusChange={handleStatusChange}
                  onInvestigateWithCopilot={handleInvestigateWithCopilot}
                />
              }
            />
            <Route
              path="/copilot"
              element={
                <CopilotPage
                  workspaceId={activeWorkspaceId}
                  activeIncident={copilotIncident}
                  onClearIncident={() => setCopilotIncident(null)}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <SettingsPage
                  workspaceId={activeWorkspaceId}
                  workspaces={stats.workspaces || WORKSPACE_PRESETS}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
};

export default App;

