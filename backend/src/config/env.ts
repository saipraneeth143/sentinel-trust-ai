import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  DATABASE_URL: z
    .string()
    .default(
      'postgresql://postgres.your-project-ref:your-db-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
    ),
  DIRECT_URL: z.string().optional(),
  DATABASE_SSL: z.string().default('true'),
  SUPABASE_URL: z.string().default('https://your-project-ref.supabase.co'),
  SUPABASE_ANON_KEY: z.string().default(''),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default(''),
  XAI_API_KEY: z.string().default(''),
  JWT_SECRET: z.string().default('sentineltrust-enterprise-jwt-secret-key-2026'),
});

const parsed = EnvSchema.safeParse(process.env);

export const env = parsed.success
  ? parsed.data
  : {
      PORT: '5000',
      NODE_ENV: 'development' as const,
      FRONTEND_URL: 'http://localhost:5173',
      CORS_ORIGIN: 'http://localhost:5173',
      DATABASE_URL:
        'postgresql://postgres.your-project-ref:your-db-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
      DIRECT_URL: undefined,
      DATABASE_SSL: 'true',
      SUPABASE_URL: 'https://your-project-ref.supabase.co',
      SUPABASE_ANON_KEY: '',
      SUPABASE_SERVICE_ROLE_KEY: '',
      XAI_API_KEY: '',
      JWT_SECRET: 'sentineltrust-enterprise-jwt-secret-key-2026',
    };
