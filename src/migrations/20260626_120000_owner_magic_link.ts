import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Magic-link (passwordless) sign-in for owners.
 *
 * Adds two nullable columns to `owners`:
 *   - login_token_hash: SHA-256 of the one-time sign-in token (raw token is
 *     never stored; it lives only in the emailed URL).
 *   - login_token_expires_at: token expiry (15 min after issue).
 *
 * Plus an index on the hash for the verify lookup.
 *
 * In development `db push` applies these automatically; this migration is for
 * production deploys.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "owners" ADD COLUMN IF NOT EXISTS "login_token_hash" varchar;
  `)
  await db.execute(sql`
    ALTER TABLE "owners" ADD COLUMN IF NOT EXISTS "login_token_expires_at" timestamp(3) with time zone;
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "owners_login_token_hash_idx" ON "owners" ("login_token_hash");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP INDEX IF EXISTS "owners_login_token_hash_idx";`)
  await db.execute(sql`ALTER TABLE "owners" DROP COLUMN IF EXISTS "login_token_expires_at";`)
  await db.execute(sql`ALTER TABLE "owners" DROP COLUMN IF EXISTS "login_token_hash";`)
}
