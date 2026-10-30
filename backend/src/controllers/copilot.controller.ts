import { NextFunction, Request, Response } from 'express';
import { resolveWorkspaceId } from '../middlewares/validateRequest';
import { CopilotChatRequest } from '../schemas/scan.schema';
import { getIncidentById } from '../services/db.service';
import { chatWithGrokCopilot } from '../services/grok.service';

export async function handleCopilotChat(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const workspaceId = resolveWorkspaceId(req);
    const body = req.body as CopilotChatRequest;

    const incidentContext = body.incident_id
      ? await getIncidentById(workspaceId, body.incident_id)
      : null;

    const response = await chatWithGrokCopilot(
      body.message,
      body.history || [],
      incidentContext
    );

    res.status(200).json({
      workspace_id: workspaceId,
      incident_id: body.incident_id || null,
      reply: response.reply,
      model: response.model,
      recommendations: response.recommendations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

