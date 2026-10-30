import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { env } from './env';

const isSupabaseOrSsl =
  env.DATABASE_SSL === 'true' ||
  env.DATABASE_URL.includes('supabase.com') ||
  env.DATABASE_URL.includes('supabase.co');

export const pool = new Pool({
  connectionString: env.DIRECT_URL || env.DATABASE_URL,
  ssl: isSupabaseOrSsl ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 4000,
});

let pgConnected: boolean | null = null;

export async function checkPostgresConnection(): Promise<boolean> {
  if (pgConnected !== null) {
    return pgConnected;
  }
  if (env.DATABASE_URL.includes('your-project-ref')) {
    pgConnected = false;
    return false;
  }
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    pgConnected = true;
    return true;
  } catch {
    pgConnected = false;
    return false;
  }
}

/**
 * Executes a query within an isolated Supabase PostgreSQL transaction with
 * `app.current_workspace_id` configured for Row Level Security (RLS) enforcement.
 */
export async function queryWithTenantRLS<T extends QueryResultRow = QueryResultRow>(
  workspaceId: string,
  queryText: string,
  params: unknown[] = []
): Promise<QueryResult<T>> {
  const client: PoolClient = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`SELECT set_config('app.current_workspace_id', $1, true)`, [workspaceId]);
    const result = await client.query<T>(queryText, params);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
