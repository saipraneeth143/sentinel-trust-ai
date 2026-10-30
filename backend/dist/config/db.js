"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.checkPostgresConnection = checkPostgresConnection;
exports.queryWithTenantRLS = queryWithTenantRLS;
const pg_1 = require("pg");
const env_1 = require("./env");
const isSupabaseOrSsl = env_1.env.DATABASE_SSL === 'true' ||
    env_1.env.DATABASE_URL.includes('supabase.com') ||
    env_1.env.DATABASE_URL.includes('supabase.co');
exports.pool = new pg_1.Pool({
    connectionString: env_1.env.DIRECT_URL || env_1.env.DATABASE_URL,
    ssl: isSupabaseOrSsl ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 4000,
});
let pgConnected = null;
async function checkPostgresConnection() {
    if (pgConnected !== null) {
        return pgConnected;
    }
    if (env_1.env.DATABASE_URL.includes('your-project-ref')) {
        pgConnected = false;
        return false;
    }
    try {
        const client = await exports.pool.connect();
        await client.query('SELECT 1');
        client.release();
        pgConnected = true;
        return true;
    }
    catch {
        pgConnected = false;
        return false;
    }
}
/**
 * Executes a query within an isolated Supabase PostgreSQL transaction with
 * `app.current_workspace_id` configured for Row Level Security (RLS) enforcement.
 */
async function queryWithTenantRLS(workspaceId, queryText, params = []) {
    const client = await exports.pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(`SELECT set_config('app.current_workspace_id', $1, true)`, [workspaceId]);
        const result = await client.query(queryText, params);
        await client.query('COMMIT');
        return result;
    }
    catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
    finally {
        client.release();
    }
}
