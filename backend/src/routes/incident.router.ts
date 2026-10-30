import { Router } from 'express';
import {
  handleGetIncidents,
  handleUpdateIncidentStatus,
} from '../controllers/incident.controller';

export const incidentRouter = Router();

incidentRouter.get('/', handleGetIncidents);
incidentRouter.patch('/:id/status', handleUpdateIncidentStatus);

