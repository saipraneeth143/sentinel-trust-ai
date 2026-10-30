import { Router } from 'express';
import {
  handleGetDashboardStats,
  handleHealthCheck,
} from '../controllers/dashboard.controller';
import { apiRateLimiter } from '../middlewares/rateLimiter';
import { copilotRouter } from './copilot.router';
import { incidentRouter } from './incident.router';
import { policyRouter } from './policy.router';
import { scanRouter } from './scan.router';

export const apiRouter = Router();

apiRouter.use(apiRateLimiter);

apiRouter.get('/health', handleHealthCheck);
apiRouter.get('/dashboard/stats', handleGetDashboardStats);

apiRouter.use('/scan', scanRouter);
apiRouter.use('/incidents', incidentRouter);
apiRouter.use('/copilot', copilotRouter);
apiRouter.use('/policies', policyRouter);

