import { Pool, QueryResult, QueryResultRow } from 'pg';
export declare const pool: Pool;
export declare function checkPostgresConnection(): Promise<boolean>;
/**
 * Executes a query within an isolated Supabase PostgreSQL transaction with
 * `app.current_workspace_id` configured for Row Level Security (RLS) enforcement.
 */
export declare function queryWithTenantRLS<T extends QueryResultRow = QueryResultRow>(workspaceId: string, queryText: string, params?: unknown[]): Promise<QueryResult<T>>;
