import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { errorHandler } from './middlewares/error.middleware';
import { apiRouter } from './routes/api.router';

export const app = express();

const allowedOrigins = new Set([
  env.CORS_ORIGIN,
  env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.has(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com')
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Workspace-ID'],
    credentials: true,
  })
);

app.use(express.json({ limit: '150kb' }));

// Root health check route for Render / cloud load balancers
app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'SentinelTrust AI Backend API',
    health_endpoint: '/api/v1/health',
    docs: 'Use /api/v1/scan, /api/v1/dashboard/stats, /api/v1/incidents, /api/v1/copilot/chat, /api/v1/policies',
  });
});

app.use('/api/v1', apiRouter);

app.use(errorHandler);
