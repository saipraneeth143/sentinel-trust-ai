import { NextFunction, Request, Response } from 'express';
import { resolveWorkspaceId } from '../middlewares/validateRequest';
import { UpdateIncidentStatusSchema } from '../schemas/scan.schema';
import {
  getIncidentsForWorkspace,
  updateIncidentStatus,
} from '../services/db.service';

export async function handleGetIncidents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const workspaceId = resolveWorkspaceId(req);
    const severity = typeof req.query.severity === 'string' ? req.query.severity : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    const incidents = await getIncidentsForWorkspace(workspaceId, {
      severity,
      status,
      category,
      search,
    });

    res.status(200).json({
      workspace_id: workspaceId,
      total: incidents.length,
      incidents,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateIncidentStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const workspaceId = resolveWorkspaceId(req);
    const incidentId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const parsed = UpdateIncidentStatusSchema.parse(req.body);

    const updated = await updateIncidentStatus(
      workspaceId,
      incidentId,
      parsed.status
    );

    if (!updated) {
      res.status(404).json({
        error: 'NotFound',
        message: `Incident ${incidentId} not found in workspace ${workspaceId}.`,
      });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}

