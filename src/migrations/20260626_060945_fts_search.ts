import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Full-text search: STORED GENERATED tsvector columns + GIN indexes on the four
 * searchable collections (stores, bottles, articles, categories), plus a pg_trgm
 * trigram GIN index on each primary name/title column for the substring/fuzzy
 * fallback used by /api/search.
 *
 * Generated columns auto-populate every existing row at ADD COLUMN time and
 * auto-recompute on every write — no triggers, no manual backfill.
 *
 * The `simple` text-search config is used (no stemming/stopwords) because the
 * route does prefix-autocomplete (`:*`) over short proper-noun fields. The
 * column config MUST match the `to_tsquery('simple', …)` used in the route.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pg_trgm;`)

  // ---- STORES: name (A) > area/city (B) > tagline (C)
  await db.execute(sql`
    ALTER TABLE "stores" ADD COLUMN "search_vector" tsvector GENERATED ALWAYS AS (
      setweight(to_tsvector('simple', coalesce("name", '')),    'A') ||
      setweight(to_tsvector('simple', coalesce("area", '')),    'B') ||
      setweight(to_tsvector('simple', coalesce("city", '')),    'B') ||
      setweight(to_tsvector('simple', coalesce("tagline", '')), 'C')
    ) STORED;
  `)
  await db.execute(sql`CREATE INDEX "stores_search_idx" ON "stores" USING gin ("search_vector");`)
  await db.execute(
    sql`CREATE INDEX "stores_name_trgm_idx" ON "stores" USING gin ("name" gin_trgm_ops);`,
  )

  // ---- BOTTLES: name (A) > brand (B) > region (C)
  await db.execute(sql`
    ALTER TABLE "bottles" ADD COLUMN "search_vector" tsvector GENERATED ALWAYS AS (
      setweight(to_tsvector('simple', coalesce("name", '')),   'A') ||
      setweight(to_tsvector('simple', coalesce("brand", '')),  'B') ||
      setweight(to_tsvector('simple', coalesce("region", '')), 'C')
    ) STORED;
  `)
  await db.execute(sql`CREATE INDEX "bottles_search_idx" ON "bottles" USING gin ("search_vector");`)
  await db.execute(
    sql`CREATE INDEX "bottles_name_trgm_idx" ON "bottles" USING gin ("name" gin_trgm_ops);`,
  )

  // ---- ARTICLES: title (A) > excerpt (B)
  await db.execute(sql`
    ALTER TABLE "articles" ADD COLUMN "search_vector" tsvector GENERATED ALWAYS AS (
      setweight(to_tsvector('simple', coalesce("title", '')),   'A') ||
      setweight(to_tsvector('simple', coalesce("excerpt", '')), 'B')
    ) STORED;
  `)
  await db.execute(
    sql`CREATE INDEX "articles_search_idx" ON "articles" USING gin ("search_vector");`,
  )
  await db.execute(
    sql`CREATE INDEX "articles_title_trgm_idx" ON "articles" USING gin ("title" gin_trgm_ops);`,
  )

  // ---- CATEGORIES: name (A) > blurb (B)
  await db.execute(sql`
    ALTER TABLE "categories" ADD COLUMN "search_vector" tsvector GENERATED ALWAYS AS (
      setweight(to_tsvector('simple', coalesce("name", '')),  'A') ||
      setweight(to_tsvector('simple', coalesce("blurb", '')), 'B')
    ) STORED;
  `)
  await db.execute(
    sql`CREATE INDEX "categories_search_idx" ON "categories" USING gin ("search_vector");`,
  )
  await db.execute(
    sql`CREATE INDEX "categories_name_trgm_idx" ON "categories" USING gin ("name" gin_trgm_ops);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP INDEX IF EXISTS "stores_name_trgm_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "stores_search_idx";`)
  await db.execute(sql`ALTER TABLE "stores" DROP COLUMN IF EXISTS "search_vector";`)

  await db.execute(sql`DROP INDEX IF EXISTS "bottles_name_trgm_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "bottles_search_idx";`)
  await db.execute(sql`ALTER TABLE "bottles" DROP COLUMN IF EXISTS "search_vector";`)

  await db.execute(sql`DROP INDEX IF EXISTS "articles_title_trgm_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "articles_search_idx";`)
  await db.execute(sql`ALTER TABLE "articles" DROP COLUMN IF EXISTS "search_vector";`)

  await db.execute(sql`DROP INDEX IF EXISTS "categories_name_trgm_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "categories_search_idx";`)
  await db.execute(sql`ALTER TABLE "categories" DROP COLUMN IF EXISTS "search_vector";`)

  // Note: pg_trgm extension is intentionally left installed (may be used elsewhere).
}
