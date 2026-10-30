import { NextFunction, Request, Response } from 'express';
import { resolveWorkspaceId } from '../middlewares/validateRequest';
import { ScanRequest } from '../schemas/scan.schema';
import { saveScanAndIncidents } from '../services/db.service';
import { analyzePayloadWithGrok } from '../services/grok.service';

export async function handleScanPayload(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as ScanRequest;
    const workspaceId = body.workspace_id || resolveWorkspaceId(req);

    const analysisResult = await analyzePayloadWithGrok(
      body.payload,
      body.sensitivity_level,
      body.target_frameworks,
      body.auto_redact
    );

    const savedScan = await saveScanAndIncidents(
      workspaceId,
      body.payload,
      analysisResult,
      body.sensitivity_level,
      body.target_frameworks
    );

    res.status(200).json(savedScan);
  } catch (error) {
    next(error);
  }
}

