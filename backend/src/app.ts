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
      if (!origin || allowedOrigins.has(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not permitted by SentinelTrust CORS policy`));
      }
    },
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Workspace-ID'],
    credentials: true,
  })
);

app.use(express.json({ limit: '150kb' }));

app.use('/api/v1', apiRouter);

app.use(errorHandler);

