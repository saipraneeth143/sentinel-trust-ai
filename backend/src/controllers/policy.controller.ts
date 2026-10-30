import { NextFunction, Request, Response } from 'express';
import { resolveWorkspaceId } from '../middlewares/validateRequest';
import { PolicyUpsertRequest } from '../schemas/scan.schema';
import {
  getPoliciesForWorkspace,
  upsertPolicyForWorkspace,
} from '../services/db.service';

export async function handleGetPolicies(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const workspaceId = resolveWorkspaceId(req);
    const policies = await getPoliciesForWorkspace(workspaceId);
    res.status(200).json({
      workspace_id: workspaceId,
      policies,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleUpsertPolicy(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const workspaceId = resolveWorkspaceId(req);
    const body = req.body as PolicyUpsertRequest;
    const saved = await upsertPolicyForWorkspace({
      ...body,
      workspace_id: body.workspace_id || workspaceId,
    });
    res.status(200).json(saved);
  } catch (error) {
    next(error);
  }
}

