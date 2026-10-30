import { Router } from 'express';
import {
  handleGetPolicies,
  handleUpsertPolicy,
} from '../controllers/policy.controller';
import { validateBody } from '../middlewares/validateRequest';
import { PolicyUpsertSchema } from '../schemas/scan.schema';

export const policyRouter = Router();

policyRouter.get('/', handleGetPolicies);
policyRouter.post('/', validateBody(PolicyUpsertSchema), handleUpsertPolicy);

