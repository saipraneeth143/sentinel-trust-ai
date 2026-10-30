import { Router } from 'express';
import { handleCopilotChat } from '../controllers/copilot.controller';
import { validateBody } from '../middlewares/validateRequest';
import { CopilotChatSchema } from '../schemas/scan.schema';

export const copilotRouter = Router();

copilotRouter.post('/chat', validateBody(CopilotChatSchema), handleCopilotChat);

