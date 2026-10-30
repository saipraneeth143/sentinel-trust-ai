import { Router } from 'express';
import { handleScanPayload } from '../controllers/scan.controller';
import { scanRateLimiter } from '../middlewares/rateLimiter';
import { validateBody } from '../middlewares/validateRequest';
import { ScanRequestSchema } from '../schemas/scan.schema';

export const scanRouter = Router();

scanRouter.post(
  '/',
  scanRateLimiter,
  validateBody(ScanRequestSchema),
  handleScanPayload
);

