"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const EnvSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('5000'),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    FRONTEND_URL: zod_1.z.string().default('http://localhost:5173'),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:5173'),
    DATABASE_URL: zod_1.z
        .string()
        .default('postgresql://postgres.your-project-ref:your-db-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true'),
    DIRECT_URL: zod_1.z.string().optional(),
    DATABASE_SSL: zod_1.z.string().default('true'),
    SUPABASE_URL: zod_1.z.string().default('https://your-project-ref.supabase.co'),
    SUPABASE_ANON_KEY: zod_1.z.string().default(''),
    SUPABASE_SERVICE_ROLE_KEY: zod_1.z.string().default(''),
    XAI_API_KEY: zod_1.z.string().default(''),
    JWT_SECRET: zod_1.z.string().default('sentineltrust-enterprise-jwt-secret-key-2026'),
});
const parsed = EnvSchema.safeParse(process.env);
exports.env = parsed.success
    ? parsed.data
    : {
        PORT: '5000',
        NODE_ENV: 'development',
        FRONTEND_URL: 'http://localhost:5173',
        CORS_ORIGIN: 'http://localhost:5173',
        DATABASE_URL: 'postgresql://postgres.your-project-ref:your-db-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
        DIRECT_URL: undefined,
        DATABASE_SSL: 'true',
        SUPABASE_URL: 'https://your-project-ref.supabase.co',
        SUPABASE_ANON_KEY: '',
        SUPABASE_SERVICE_ROLE_KEY: '',
        XAI_API_KEY: '',
        JWT_SECRET: 'sentineltrust-enterprise-jwt-secret-key-2026',
    };
