import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_owners_plan" AS ENUM('free', 'verified', 'featured');
  CREATE TYPE "public"."enum_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_stores_hours_day" AS ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');
  CREATE TYPE "public"."enum_stores_payment" AS ENUM('Cash', 'UPI', 'Card', 'Wallet');
  CREATE TYPE "public"."enum_stores_price_tier" AS ENUM('₹', '₹₹', '₹₹₹', '₹₹₹₹');
  CREATE TYPE "public"."enum_stores_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stores_v_version_hours_day" AS ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');
  CREATE TYPE "public"."enum__stores_v_version_payment" AS ENUM('Cash', 'UPI', 'Card', 'Wallet');
  CREATE TYPE "public"."enum__stores_v_version_price_tier" AS ENUM('₹', '₹₹', '₹₹₹', '₹₹₹₹');
  CREATE TYPE "public"."enum__stores_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_store_events_type" AS ENUM('view', 'call', 'directions', 'whatsapp');
  CREATE TYPE "public"."enum_bottles_best" AS ENUM('Sipping', 'Mixers', 'Cocktails', 'Pairing');
  CREATE TYPE "public"."enum_bottles_occasion" AS ENUM('Everyday', 'Gifting', 'Collector', 'Party', 'Dinner');
  CREATE TYPE "public"."enum_bottles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__bottles_v_version_best" AS ENUM('Sipping', 'Mixers', 'Cocktails', 'Pairing');
  CREATE TYPE "public"."enum__bottles_v_version_occasion" AS ENUM('Everyday', 'Gifting', 'Collector', 'Party', 'Dinner');
  CREATE TYPE "public"."enum__bottles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_articles_category" AS ENUM('Buying Guides', 'Education', 'City Guides');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_category" AS ENUM('Buying Guides', 'Education', 'City Guides');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_reviews_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__reviews_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faqs_scope" AS ENUM('home', 'category', 'bottle', 'store');
  CREATE TYPE "public"."enum_faqs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faqs_v_version_scope" AS ENUM('home', 'category', 'bottle', 'store');
  CREATE TYPE "public"."enum__faqs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_hero_variant" AS ENUM('editorial', 'centered');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_hero_variant" AS ENUM('editorial', 'centered');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"bio" varchar,
  	"credentials" varchar,
  	"avatar_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "owners_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "owners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"phone" varchar,
  	"plan" "enum_owners_plan" DEFAULT 'free' NOT NULL,
  	"razorpay_customer_id" varchar,
  	"razorpay_subscription_id" varchar,
  	"plan_renews_at" timestamp(3) with time zone,
  	"login_token_hash" varchar,
  	"login_token_expires_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"prefix" varchar DEFAULT 'media',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"blurb" varchar,
  	"count" numeric,
  	"hero_image_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"status" "enum_categories_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_categories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "categories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"faqs_id" integer
  );
  
  CREATE TABLE "_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_blurb" varchar,
  	"version_count" numeric,
  	"version_hero_image_id" integer,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_status" "enum__categories_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_categories_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"faqs_id" integer
  );
  
  CREATE TABLE "stores_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_stores_hours_day",
  	"open" varchar,
  	"close" varchar
  );
  
  CREATE TABLE "stores_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "stores_payment" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_stores_payment",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "stores" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"tagline" varchar,
  	"area" varchar,
  	"city" varchar,
  	"address" varchar,
  	"phone" varchar,
  	"lat" numeric,
  	"lng" numeric,
  	"rating" numeric,
  	"reviews_count" numeric DEFAULT 0,
  	"distance_km" numeric,
  	"price_tier" "enum_stores_price_tier",
  	"license" varchar,
  	"verified" boolean DEFAULT false,
  	"open_now" boolean DEFAULT true,
  	"pickup" boolean DEFAULT false,
  	"delivery" boolean DEFAULT false,
  	"parking" boolean DEFAULT false,
  	"owner_id" integer,
  	"status" "enum_stores_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_stores_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "stores_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "_stores_v_version_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" "enum__stores_v_version_hours_day",
  	"open" varchar,
  	"close" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stores_v_version_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stores_v_version_payment" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__stores_v_version_payment",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_stores_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_tagline" varchar,
  	"version_area" varchar,
  	"version_city" varchar,
  	"version_address" varchar,
  	"version_phone" varchar,
  	"version_lat" numeric,
  	"version_lng" numeric,
  	"version_rating" numeric,
  	"version_reviews_count" numeric DEFAULT 0,
  	"version_distance_km" numeric,
  	"version_price_tier" "enum__stores_v_version_price_tier",
  	"version_license" varchar,
  	"version_verified" boolean DEFAULT false,
  	"version_open_now" boolean DEFAULT true,
  	"version_pickup" boolean DEFAULT false,
  	"version_delivery" boolean DEFAULT false,
  	"version_parking" boolean DEFAULT false,
  	"version_owner_id" integer,
  	"version_status" "enum__stores_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__stores_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_stores_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "store_inventory" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"store_id" integer NOT NULL,
  	"bottle_id" integer NOT NULL,
  	"price_inr" numeric,
  	"in_stock" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "store_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"store_id" integer NOT NULL,
  	"type" "enum_store_events_type" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "bottles_tasting_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "bottles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"brand" varchar,
  	"category_id" integer,
  	"region" varchar,
  	"abv" numeric,
  	"volume" varchar,
  	"price_low" numeric,
  	"price_high" numeric,
  	"rating" numeric,
  	"best" "enum_bottles_best",
  	"occasion" "enum_bottles_occasion",
  	"image_id" integer,
  	"status" "enum_bottles_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_bottles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "bottles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"stores_id" integer
  );
  
  CREATE TABLE "_bottles_v_version_tasting_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_bottles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_brand" varchar,
  	"version_category_id" integer,
  	"version_region" varchar,
  	"version_abv" numeric,
  	"version_volume" varchar,
  	"version_price_low" numeric,
  	"version_price_high" numeric,
  	"version_rating" numeric,
  	"version_best" "enum__bottles_v_version_best",
  	"version_occasion" "enum__bottles_v_version_occasion",
  	"version_image_id" integer,
  	"version_status" "enum__bottles_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__bottles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_bottles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"stores_id" integer
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"category" "enum_articles_category",
  	"excerpt" varchar,
  	"hero_image_id" integer,
  	"body" jsonb,
  	"read_min" numeric DEFAULT 5,
  	"date_published" timestamp(3) with time zone,
  	"author_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"status" "enum_articles_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" integer
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_category" "enum__articles_v_version_category",
  	"version_excerpt" varchar,
  	"version_hero_image_id" integer,
  	"version_body" jsonb,
  	"version_read_min" numeric DEFAULT 5,
  	"version_date_published" timestamp(3) with time zone,
  	"version_author_id" integer,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_articles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" integer
  );
  
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author_name" varchar,
  	"store_id" integer,
  	"stars" numeric,
  	"text" varchar,
  	"when" varchar,
  	"verified" boolean DEFAULT false,
  	"status" "enum_reviews_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_reviews_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_reviews_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_author_name" varchar,
  	"version_store_id" integer,
  	"version_stars" numeric,
  	"version_text" varchar,
  	"version_when" varchar,
  	"version_verified" boolean DEFAULT false,
  	"version_status" "enum__reviews_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__reviews_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"scope" "enum_faqs_scope" DEFAULT 'home',
  	"category_id" integer,
  	"order" numeric DEFAULT 0,
  	"status" "enum_faqs_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_faqs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_faqs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_question" varchar,
  	"version_answer" varchar,
  	"version_scope" "enum__faqs_v_version_scope" DEFAULT 'home',
  	"version_category_id" integer,
  	"version_order" numeric DEFAULT 0,
  	"version_status" "enum__faqs_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__faqs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "pages_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_subheading" varchar,
  	"hero_variant" "enum_pages_hero_variant" DEFAULT 'editorial',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"status" "enum_pages_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v_version_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_subheading" varchar,
  	"version_hero_variant" "enum__pages_v_version_hero_variant" DEFAULT 'editorial',
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"owners_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"stores_id" integer,
  	"store_inventory_id" integer,
  	"store_events_id" integer,
  	"bottles_id" integer,
  	"articles_id" integer,
  	"reviews_id" integer,
  	"faqs_id" integer,
  	"pages_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"owners_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "owners_sessions" ADD CONSTRAINT "owners_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."owners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_categories_v" ADD CONSTRAINT "_categories_v_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_categories_v" ADD CONSTRAINT "_categories_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_categories_v_rels" ADD CONSTRAINT "_categories_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_categories_v_rels" ADD CONSTRAINT "_categories_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stores_hours" ADD CONSTRAINT "stores_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stores_photos" ADD CONSTRAINT "stores_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stores_photos" ADD CONSTRAINT "stores_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stores_payment" ADD CONSTRAINT "stores_payment_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stores" ADD CONSTRAINT "stores_owner_id_owners_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."owners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stores_rels" ADD CONSTRAINT "stores_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stores_rels" ADD CONSTRAINT "stores_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stores_v_version_hours" ADD CONSTRAINT "_stores_v_version_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stores_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stores_v_version_photos" ADD CONSTRAINT "_stores_v_version_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stores_v_version_photos" ADD CONSTRAINT "_stores_v_version_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stores_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stores_v_version_payment" ADD CONSTRAINT "_stores_v_version_payment_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_stores_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stores_v" ADD CONSTRAINT "_stores_v_parent_id_stores_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stores"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stores_v" ADD CONSTRAINT "_stores_v_version_owner_id_owners_id_fk" FOREIGN KEY ("version_owner_id") REFERENCES "public"."owners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stores_v_rels" ADD CONSTRAINT "_stores_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_stores_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stores_v_rels" ADD CONSTRAINT "_stores_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "store_inventory" ADD CONSTRAINT "store_inventory_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "store_inventory" ADD CONSTRAINT "store_inventory_bottle_id_bottles_id_fk" FOREIGN KEY ("bottle_id") REFERENCES "public"."bottles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "store_events" ADD CONSTRAINT "store_events_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bottles_tasting_notes" ADD CONSTRAINT "bottles_tasting_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."bottles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "bottles" ADD CONSTRAINT "bottles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bottles" ADD CONSTRAINT "bottles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bottles_rels" ADD CONSTRAINT "bottles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."bottles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "bottles_rels" ADD CONSTRAINT "bottles_rels_stores_fk" FOREIGN KEY ("stores_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_bottles_v_version_tasting_notes" ADD CONSTRAINT "_bottles_v_version_tasting_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_bottles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_bottles_v" ADD CONSTRAINT "_bottles_v_parent_id_bottles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."bottles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_bottles_v" ADD CONSTRAINT "_bottles_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_bottles_v" ADD CONSTRAINT "_bottles_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_bottles_v_rels" ADD CONSTRAINT "_bottles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_bottles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_bottles_v_rels" ADD CONSTRAINT "_bottles_v_rels_stores_fk" FOREIGN KEY ("stores_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_parent_id_reviews_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reviews"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_version_store_id_stores_id_fk" FOREIGN KEY ("version_store_id") REFERENCES "public"."stores"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_parent_id_faqs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_stats" ADD CONSTRAINT "pages_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_stats" ADD CONSTRAINT "_pages_v_version_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_owners_fk" FOREIGN KEY ("owners_id") REFERENCES "public"."owners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stores_fk" FOREIGN KEY ("stores_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_store_inventory_fk" FOREIGN KEY ("store_inventory_id") REFERENCES "public"."store_inventory"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_store_events_fk" FOREIGN KEY ("store_events_id") REFERENCES "public"."store_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bottles_fk" FOREIGN KEY ("bottles_id") REFERENCES "public"."bottles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_owners_fk" FOREIGN KEY ("owners_id") REFERENCES "public"."owners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_items" ADD CONSTRAINT "header_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "owners_sessions_order_idx" ON "owners_sessions" USING btree ("_order");
  CREATE INDEX "owners_sessions_parent_id_idx" ON "owners_sessions" USING btree ("_parent_id");
  CREATE INDEX "owners_login_token_hash_idx" ON "owners" USING btree ("login_token_hash");
  CREATE INDEX "owners_updated_at_idx" ON "owners" USING btree ("updated_at");
  CREATE INDEX "owners_created_at_idx" ON "owners" USING btree ("created_at");
  CREATE UNIQUE INDEX "owners_email_idx" ON "owners" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_hero_image_idx" ON "categories" USING btree ("hero_image_id");
  CREATE INDEX "categories_status_idx" ON "categories" USING btree ("status");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "categories__status_idx" ON "categories" USING btree ("_status");
  CREATE INDEX "categories_rels_order_idx" ON "categories_rels" USING btree ("order");
  CREATE INDEX "categories_rels_parent_idx" ON "categories_rels" USING btree ("parent_id");
  CREATE INDEX "categories_rels_path_idx" ON "categories_rels" USING btree ("path");
  CREATE INDEX "categories_rels_faqs_id_idx" ON "categories_rels" USING btree ("faqs_id");
  CREATE INDEX "_categories_v_parent_idx" ON "_categories_v" USING btree ("parent_id");
  CREATE INDEX "_categories_v_version_version_slug_idx" ON "_categories_v" USING btree ("version_slug");
  CREATE INDEX "_categories_v_version_version_hero_image_idx" ON "_categories_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_categories_v_version_version_status_idx" ON "_categories_v" USING btree ("version_status");
  CREATE INDEX "_categories_v_version_version_updated_at_idx" ON "_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_categories_v_version_version_created_at_idx" ON "_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_categories_v_version_version__status_idx" ON "_categories_v" USING btree ("version__status");
  CREATE INDEX "_categories_v_created_at_idx" ON "_categories_v" USING btree ("created_at");
  CREATE INDEX "_categories_v_updated_at_idx" ON "_categories_v" USING btree ("updated_at");
  CREATE INDEX "_categories_v_latest_idx" ON "_categories_v" USING btree ("latest");
  CREATE INDEX "_categories_v_rels_order_idx" ON "_categories_v_rels" USING btree ("order");
  CREATE INDEX "_categories_v_rels_parent_idx" ON "_categories_v_rels" USING btree ("parent_id");
  CREATE INDEX "_categories_v_rels_path_idx" ON "_categories_v_rels" USING btree ("path");
  CREATE INDEX "_categories_v_rels_faqs_id_idx" ON "_categories_v_rels" USING btree ("faqs_id");
  CREATE INDEX "stores_hours_order_idx" ON "stores_hours" USING btree ("_order");
  CREATE INDEX "stores_hours_parent_id_idx" ON "stores_hours" USING btree ("_parent_id");
  CREATE INDEX "stores_photos_order_idx" ON "stores_photos" USING btree ("_order");
  CREATE INDEX "stores_photos_parent_id_idx" ON "stores_photos" USING btree ("_parent_id");
  CREATE INDEX "stores_photos_image_idx" ON "stores_photos" USING btree ("image_id");
  CREATE INDEX "stores_payment_order_idx" ON "stores_payment" USING btree ("order");
  CREATE INDEX "stores_payment_parent_idx" ON "stores_payment" USING btree ("parent_id");
  CREATE UNIQUE INDEX "stores_slug_idx" ON "stores" USING btree ("slug");
  CREATE INDEX "stores_city_idx" ON "stores" USING btree ("city");
  CREATE INDEX "stores_owner_idx" ON "stores" USING btree ("owner_id");
  CREATE INDEX "stores_status_idx" ON "stores" USING btree ("status");
  CREATE INDEX "stores_updated_at_idx" ON "stores" USING btree ("updated_at");
  CREATE INDEX "stores_created_at_idx" ON "stores" USING btree ("created_at");
  CREATE INDEX "stores__status_idx" ON "stores" USING btree ("_status");
  CREATE INDEX "stores_rels_order_idx" ON "stores_rels" USING btree ("order");
  CREATE INDEX "stores_rels_parent_idx" ON "stores_rels" USING btree ("parent_id");
  CREATE INDEX "stores_rels_path_idx" ON "stores_rels" USING btree ("path");
  CREATE INDEX "stores_rels_categories_id_idx" ON "stores_rels" USING btree ("categories_id");
  CREATE INDEX "_stores_v_version_hours_order_idx" ON "_stores_v_version_hours" USING btree ("_order");
  CREATE INDEX "_stores_v_version_hours_parent_id_idx" ON "_stores_v_version_hours" USING btree ("_parent_id");
  CREATE INDEX "_stores_v_version_photos_order_idx" ON "_stores_v_version_photos" USING btree ("_order");
  CREATE INDEX "_stores_v_version_photos_parent_id_idx" ON "_stores_v_version_photos" USING btree ("_parent_id");
  CREATE INDEX "_stores_v_version_photos_image_idx" ON "_stores_v_version_photos" USING btree ("image_id");
  CREATE INDEX "_stores_v_version_payment_order_idx" ON "_stores_v_version_payment" USING btree ("order");
  CREATE INDEX "_stores_v_version_payment_parent_idx" ON "_stores_v_version_payment" USING btree ("parent_id");
  CREATE INDEX "_stores_v_parent_idx" ON "_stores_v" USING btree ("parent_id");
  CREATE INDEX "_stores_v_version_version_slug_idx" ON "_stores_v" USING btree ("version_slug");
  CREATE INDEX "_stores_v_version_version_city_idx" ON "_stores_v" USING btree ("version_city");
  CREATE INDEX "_stores_v_version_version_owner_idx" ON "_stores_v" USING btree ("version_owner_id");
  CREATE INDEX "_stores_v_version_version_status_idx" ON "_stores_v" USING btree ("version_status");
  CREATE INDEX "_stores_v_version_version_updated_at_idx" ON "_stores_v" USING btree ("version_updated_at");
  CREATE INDEX "_stores_v_version_version_created_at_idx" ON "_stores_v" USING btree ("version_created_at");
  CREATE INDEX "_stores_v_version_version__status_idx" ON "_stores_v" USING btree ("version__status");
  CREATE INDEX "_stores_v_created_at_idx" ON "_stores_v" USING btree ("created_at");
  CREATE INDEX "_stores_v_updated_at_idx" ON "_stores_v" USING btree ("updated_at");
  CREATE INDEX "_stores_v_latest_idx" ON "_stores_v" USING btree ("latest");
  CREATE INDEX "_stores_v_rels_order_idx" ON "_stores_v_rels" USING btree ("order");
  CREATE INDEX "_stores_v_rels_parent_idx" ON "_stores_v_rels" USING btree ("parent_id");
  CREATE INDEX "_stores_v_rels_path_idx" ON "_stores_v_rels" USING btree ("path");
  CREATE INDEX "_stores_v_rels_categories_id_idx" ON "_stores_v_rels" USING btree ("categories_id");
  CREATE INDEX "store_inventory_store_idx" ON "store_inventory" USING btree ("store_id");
  CREATE INDEX "store_inventory_bottle_idx" ON "store_inventory" USING btree ("bottle_id");
  CREATE INDEX "store_inventory_updated_at_idx" ON "store_inventory" USING btree ("updated_at");
  CREATE INDEX "store_inventory_created_at_idx" ON "store_inventory" USING btree ("created_at");
  CREATE INDEX "store_events_store_idx" ON "store_events" USING btree ("store_id");
  CREATE INDEX "store_events_type_idx" ON "store_events" USING btree ("type");
  CREATE INDEX "store_events_updated_at_idx" ON "store_events" USING btree ("updated_at");
  CREATE INDEX "store_events_created_at_idx" ON "store_events" USING btree ("created_at");
  CREATE INDEX "bottles_tasting_notes_order_idx" ON "bottles_tasting_notes" USING btree ("_order");
  CREATE INDEX "bottles_tasting_notes_parent_id_idx" ON "bottles_tasting_notes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "bottles_slug_idx" ON "bottles" USING btree ("slug");
  CREATE INDEX "bottles_category_idx" ON "bottles" USING btree ("category_id");
  CREATE INDEX "bottles_image_idx" ON "bottles" USING btree ("image_id");
  CREATE INDEX "bottles_status_idx" ON "bottles" USING btree ("status");
  CREATE INDEX "bottles_updated_at_idx" ON "bottles" USING btree ("updated_at");
  CREATE INDEX "bottles_created_at_idx" ON "bottles" USING btree ("created_at");
  CREATE INDEX "bottles__status_idx" ON "bottles" USING btree ("_status");
  CREATE INDEX "bottles_rels_order_idx" ON "bottles_rels" USING btree ("order");
  CREATE INDEX "bottles_rels_parent_idx" ON "bottles_rels" USING btree ("parent_id");
  CREATE INDEX "bottles_rels_path_idx" ON "bottles_rels" USING btree ("path");
  CREATE INDEX "bottles_rels_stores_id_idx" ON "bottles_rels" USING btree ("stores_id");
  CREATE INDEX "_bottles_v_version_tasting_notes_order_idx" ON "_bottles_v_version_tasting_notes" USING btree ("_order");
  CREATE INDEX "_bottles_v_version_tasting_notes_parent_id_idx" ON "_bottles_v_version_tasting_notes" USING btree ("_parent_id");
  CREATE INDEX "_bottles_v_parent_idx" ON "_bottles_v" USING btree ("parent_id");
  CREATE INDEX "_bottles_v_version_version_slug_idx" ON "_bottles_v" USING btree ("version_slug");
  CREATE INDEX "_bottles_v_version_version_category_idx" ON "_bottles_v" USING btree ("version_category_id");
  CREATE INDEX "_bottles_v_version_version_image_idx" ON "_bottles_v" USING btree ("version_image_id");
  CREATE INDEX "_bottles_v_version_version_status_idx" ON "_bottles_v" USING btree ("version_status");
  CREATE INDEX "_bottles_v_version_version_updated_at_idx" ON "_bottles_v" USING btree ("version_updated_at");
  CREATE INDEX "_bottles_v_version_version_created_at_idx" ON "_bottles_v" USING btree ("version_created_at");
  CREATE INDEX "_bottles_v_version_version__status_idx" ON "_bottles_v" USING btree ("version__status");
  CREATE INDEX "_bottles_v_created_at_idx" ON "_bottles_v" USING btree ("created_at");
  CREATE INDEX "_bottles_v_updated_at_idx" ON "_bottles_v" USING btree ("updated_at");
  CREATE INDEX "_bottles_v_latest_idx" ON "_bottles_v" USING btree ("latest");
  CREATE INDEX "_bottles_v_rels_order_idx" ON "_bottles_v_rels" USING btree ("order");
  CREATE INDEX "_bottles_v_rels_parent_idx" ON "_bottles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_bottles_v_rels_path_idx" ON "_bottles_v_rels" USING btree ("path");
  CREATE INDEX "_bottles_v_rels_stores_id_idx" ON "_bottles_v_rels" USING btree ("stores_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_hero_image_idx" ON "articles" USING btree ("hero_image_id");
  CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");
  CREATE INDEX "articles_status_idx" ON "articles" USING btree ("status");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_articles_id_idx" ON "articles_rels" USING btree ("articles_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_hero_image_idx" ON "_articles_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_articles_v_version_version_author_idx" ON "_articles_v" USING btree ("version_author_id");
  CREATE INDEX "_articles_v_version_version_status_idx" ON "_articles_v" USING btree ("version_status");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_rels_order_idx" ON "_articles_v_rels" USING btree ("order");
  CREATE INDEX "_articles_v_rels_parent_idx" ON "_articles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_articles_v_rels_path_idx" ON "_articles_v_rels" USING btree ("path");
  CREATE INDEX "_articles_v_rels_articles_id_idx" ON "_articles_v_rels" USING btree ("articles_id");
  CREATE INDEX "reviews_store_idx" ON "reviews" USING btree ("store_id");
  CREATE INDEX "reviews_status_idx" ON "reviews" USING btree ("status");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE INDEX "reviews__status_idx" ON "reviews" USING btree ("_status");
  CREATE INDEX "_reviews_v_parent_idx" ON "_reviews_v" USING btree ("parent_id");
  CREATE INDEX "_reviews_v_version_version_store_idx" ON "_reviews_v" USING btree ("version_store_id");
  CREATE INDEX "_reviews_v_version_version_status_idx" ON "_reviews_v" USING btree ("version_status");
  CREATE INDEX "_reviews_v_version_version_updated_at_idx" ON "_reviews_v" USING btree ("version_updated_at");
  CREATE INDEX "_reviews_v_version_version_created_at_idx" ON "_reviews_v" USING btree ("version_created_at");
  CREATE INDEX "_reviews_v_version_version__status_idx" ON "_reviews_v" USING btree ("version__status");
  CREATE INDEX "_reviews_v_created_at_idx" ON "_reviews_v" USING btree ("created_at");
  CREATE INDEX "_reviews_v_updated_at_idx" ON "_reviews_v" USING btree ("updated_at");
  CREATE INDEX "_reviews_v_latest_idx" ON "_reviews_v" USING btree ("latest");
  CREATE INDEX "faqs_category_idx" ON "faqs" USING btree ("category_id");
  CREATE INDEX "faqs_status_idx" ON "faqs" USING btree ("status");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "faqs__status_idx" ON "faqs" USING btree ("_status");
  CREATE INDEX "_faqs_v_parent_idx" ON "_faqs_v" USING btree ("parent_id");
  CREATE INDEX "_faqs_v_version_version_category_idx" ON "_faqs_v" USING btree ("version_category_id");
  CREATE INDEX "_faqs_v_version_version_status_idx" ON "_faqs_v" USING btree ("version_status");
  CREATE INDEX "_faqs_v_version_version_updated_at_idx" ON "_faqs_v" USING btree ("version_updated_at");
  CREATE INDEX "_faqs_v_version_version_created_at_idx" ON "_faqs_v" USING btree ("version_created_at");
  CREATE INDEX "_faqs_v_version_version__status_idx" ON "_faqs_v" USING btree ("version__status");
  CREATE INDEX "_faqs_v_created_at_idx" ON "_faqs_v" USING btree ("created_at");
  CREATE INDEX "_faqs_v_updated_at_idx" ON "_faqs_v" USING btree ("updated_at");
  CREATE INDEX "_faqs_v_latest_idx" ON "_faqs_v" USING btree ("latest");
  CREATE INDEX "pages_stats_order_idx" ON "pages_stats" USING btree ("_order");
  CREATE INDEX "pages_stats_parent_id_idx" ON "pages_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_status_idx" ON "pages" USING btree ("status");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_version_stats_order_idx" ON "_pages_v_version_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_version_stats_parent_id_idx" ON "_pages_v_version_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_status_idx" ON "_pages_v" USING btree ("version_status");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_owners_id_idx" ON "payload_locked_documents_rels" USING btree ("owners_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_stores_id_idx" ON "payload_locked_documents_rels" USING btree ("stores_id");
  CREATE INDEX "payload_locked_documents_rels_store_inventory_id_idx" ON "payload_locked_documents_rels" USING btree ("store_inventory_id");
  CREATE INDEX "payload_locked_documents_rels_store_events_id_idx" ON "payload_locked_documents_rels" USING btree ("store_events_id");
  CREATE INDEX "payload_locked_documents_rels_bottles_id_idx" ON "payload_locked_documents_rels" USING btree ("bottles_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_rels_owners_id_idx" ON "payload_preferences_rels" USING btree ("owners_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_items_order_idx" ON "header_items" USING btree ("_order");
  CREATE INDEX "header_items_parent_id_idx" ON "header_items" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "owners_sessions" CASCADE;
  DROP TABLE "owners" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_rels" CASCADE;
  DROP TABLE "_categories_v" CASCADE;
  DROP TABLE "_categories_v_rels" CASCADE;
  DROP TABLE "stores_hours" CASCADE;
  DROP TABLE "stores_photos" CASCADE;
  DROP TABLE "stores_payment" CASCADE;
  DROP TABLE "stores" CASCADE;
  DROP TABLE "stores_rels" CASCADE;
  DROP TABLE "_stores_v_version_hours" CASCADE;
  DROP TABLE "_stores_v_version_photos" CASCADE;
  DROP TABLE "_stores_v_version_payment" CASCADE;
  DROP TABLE "_stores_v" CASCADE;
  DROP TABLE "_stores_v_rels" CASCADE;
  DROP TABLE "store_inventory" CASCADE;
  DROP TABLE "store_events" CASCADE;
  DROP TABLE "bottles_tasting_notes" CASCADE;
  DROP TABLE "bottles" CASCADE;
  DROP TABLE "bottles_rels" CASCADE;
  DROP TABLE "_bottles_v_version_tasting_notes" CASCADE;
  DROP TABLE "_bottles_v" CASCADE;
  DROP TABLE "_bottles_v_rels" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_rels" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "_reviews_v" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "_faqs_v" CASCADE;
  DROP TABLE "pages_stats" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_version_stats" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_owners_plan";
  DROP TYPE "public"."enum_categories_status";
  DROP TYPE "public"."enum__categories_v_version_status";
  DROP TYPE "public"."enum_stores_hours_day";
  DROP TYPE "public"."enum_stores_payment";
  DROP TYPE "public"."enum_stores_price_tier";
  DROP TYPE "public"."enum_stores_status";
  DROP TYPE "public"."enum__stores_v_version_hours_day";
  DROP TYPE "public"."enum__stores_v_version_payment";
  DROP TYPE "public"."enum__stores_v_version_price_tier";
  DROP TYPE "public"."enum__stores_v_version_status";
  DROP TYPE "public"."enum_store_events_type";
  DROP TYPE "public"."enum_bottles_best";
  DROP TYPE "public"."enum_bottles_occasion";
  DROP TYPE "public"."enum_bottles_status";
  DROP TYPE "public"."enum__bottles_v_version_best";
  DROP TYPE "public"."enum__bottles_v_version_occasion";
  DROP TYPE "public"."enum__bottles_v_version_status";
  DROP TYPE "public"."enum_articles_category";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_category";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum_reviews_status";
  DROP TYPE "public"."enum__reviews_v_version_status";
  DROP TYPE "public"."enum_faqs_scope";
  DROP TYPE "public"."enum_faqs_status";
  DROP TYPE "public"."enum__faqs_v_version_scope";
  DROP TYPE "public"."enum__faqs_v_version_status";
  DROP TYPE "public"."enum_pages_hero_variant";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_hero_variant";
  DROP TYPE "public"."enum__pages_v_version_status";`)
}
