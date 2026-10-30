import { NextFunction, Request, Response } from 'express';
import { checkPostgresConnection } from '../config/db';
import { resolveWorkspaceId } from '../middlewares/validateRequest';
import { getDashboardStats, getWorkspaces } from '../services/db.service';

export async function handleHealthCheck(
  _req: Request,
  res: Response
): Promise<void> {
  const dbConnected = await checkPostgresConnection();
  const grokConfigured = Boolean(
    process.env.XAI_API_KEY &&
      process.env.XAI_API_KEY !== 'xai-your-grok-api-key-here'
  );

  res.status(200).json({
    status: 'ok',
    service: 'SentinelTrust AI Platform API',
    version: '1.0.0',
    engine: 'grok-4.7',
    grok_api_configured: grokConfigured,
    database_mode: dbConnected ? 'postgresql-rls' : 'in-memory-rls-replica',
    timestamp: new Date().toISOString(),
  });
}

export async function handleGetDashboardStats(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const workspaceId = resolveWorkspaceId(req);
    const stats = await getDashboardStats(workspaceId);
    const workspaces = await getWorkspaces();

    res.status(200).json({
      workspace_id: workspaceId,
      workspaces,
      ...stats,
    });
  } catch (error) {
    next(error);
  }
}

