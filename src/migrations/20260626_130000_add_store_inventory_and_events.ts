import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Inventory feed (B3) + owner analytics (B4).
 *
 * Adds two collections layered on the existing schema:
 *   - store_inventory: owner-curated per-store bottle list (price / in-stock / featured).
 *   - store_events:    append-only first-party interaction log (view/call/directions/whatsapp)
 *                      powering the owner analytics dashboard.
 *
 * Plus the join columns on payload_locked_documents_rels that Payload maintains for
 * every collection. Statements are idempotent (IF NOT EXISTS / guarded) to match the
 * project's hand-written migration style.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Enum for store_events.type — CREATE TYPE has no IF NOT EXISTS, so guard it.
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_store_events_type" AS ENUM('view', 'call', 'directions', 'whatsapp');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "store_inventory" (
      "id" serial PRIMARY KEY NOT NULL,
      "store_id" integer NOT NULL,
      "bottle_id" integer NOT NULL,
      "price_inr" numeric,
      "in_stock" boolean DEFAULT true,
      "featured" boolean DEFAULT false,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "store_inventory_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE set null ON UPDATE no action,
      CONSTRAINT "store_inventory_bottle_id_bottles_id_fk" FOREIGN KEY ("bottle_id") REFERENCES "public"."bottles"("id") ON DELETE set null ON UPDATE no action
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "store_events" (
      "id" serial PRIMARY KEY NOT NULL,
      "store_id" integer NOT NULL,
      "type" "enum_store_events_type" NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "store_events_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE set null ON UPDATE no action
    );
  `)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "store_inventory_store_idx" ON "store_inventory" USING btree ("store_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "store_inventory_bottle_idx" ON "store_inventory" USING btree ("bottle_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "store_inventory_updated_at_idx" ON "store_inventory" USING btree ("updated_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "store_inventory_created_at_idx" ON "store_inventory" USING btree ("created_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "store_events_store_idx" ON "store_events" USING btree ("store_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "store_events_type_idx" ON "store_events" USING btree ("type");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "store_events_updated_at_idx" ON "store_events" USING btree ("updated_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "store_events_created_at_idx" ON "store_events" USING btree ("created_at");`)

  // Payload tracks document locks via join columns on payload_locked_documents_rels.
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "store_inventory_id" integer;`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "store_events_id" integer;`)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_store_inventory_fk" FOREIGN KEY ("store_inventory_id") REFERENCES "public"."store_inventory"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_store_events_fk" FOREIGN KEY ("store_events_id") REFERENCES "public"."store_events"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_store_inventory_id_idx" ON "payload_locked_documents_rels" USING btree ("store_inventory_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_store_events_id_idx" ON "payload_locked_documents_rels" USING btree ("store_events_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_store_inventory_fk";`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_store_events_fk";`)
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_store_inventory_id_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_store_events_id_idx";`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "store_inventory_id";`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "store_events_id";`)
  await db.execute(sql`DROP TABLE IF EXISTS "store_inventory" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "store_events" CASCADE;`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_store_events_type";`)
}
