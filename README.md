# Mybooz

Premium editorial directory for Indian liquor stores and spirits, focused on Delhi NCR. Mybooz is **not a vendor** — it does not sell or deliver alcohol. It is a discovery + content platform that helps consumers find verified retailers and make informed choices, while giving licensed store owners a free place to be found.

Built with **Next.js 16.2.4** + **Payload CMS v3.84.1** + **PostgreSQL** + **S3**.

---

## 1. Application overview

| Audience | What they do here |
|---|---|
| **Consumers** | Browse stores by city/area, filter by spirit/price/features, read tasting notes and buying guides, view store hours and contact info. |
| **Editors** | Author articles, review user-submitted store claims, curate categories and FAQs. Cannot publish — only submit for review. |
| **Admins** | Approve and publish editor-submitted content, manage users, configure site-wide globals (header, footer). |
| **Store owners** | Submit claim requests via the Owners page; their store enters as a `pending` record awaiting admin verification against state excise records. |

The site is **search-first** (large city/area/brand search bar on every key page), **SEO-heavy** (breadcrumbs, FAQ schema, JSON-LD on every detail page, sitemap, semantic headings), and **age-gated** with a soft cookie modal that does not block crawlers.

---

## 2. Functional requirements

### Public site

- **Age gate** — soft 21+ confirmation on first visit, persisted via `mybooz_age_ok` cookie (30-day expiry). Does not block search engines.
- **Homepage** — editorial hero (configurable via the `pages` collection), category grid, top-rated stores, featured article, popular bottles, guides row, FAQ, owner CTA strip.
- **Stores directory** — server-side filtering by spirit, open-now, verified, pickup, delivery, price tier, and free-text query; sorting by rating/reviews/distance/recency; sticky filter bar; sidebar map with pins.
- **Store detail** — photo grid, license/verification badges, tabs (Overview / Bottles / Reviews / Hours / Pairing), sticky address sidebar with call/directions/WhatsApp buttons, similar stores.
- **Spirits hub** — all 12 categories.
- **Category page** — popular bottles, budget bands, related guides, stocking stores, FAQs, related categories.
- **Bottle detail** — typical price range, tasting notes, ABV/volume/region/brand specs, list of stocking stores, food/cocktail pairings, similar bottles.
- **Guides hub** — featured + side list, category filter (Buying Guides / Education / City Guides), full grid.
- **Article** — Lexical rich-text body rendered server-side, in-article CTA, related guides.
- **Owners** — pitch + dashboard preview + 3-tier plan grid + intake form (server action creates a `pending` Store record).
- **Static utilities** — `/sitemap.xml`, `/robots.txt`, `/not-found`.

### Admin / CMS

- **Editorial workflow** — every content collection has `versions: { drafts: true }` plus a custom `status` field with three values:
  - `draft` — work in progress, not visible to public.
  - `pending` — submitted for review, not visible to public.
  - `published` — visible to public; only `admin` role can transition to this state.
- **Public submissions** — the Owners intake form creates Stores with `status: pending`; the Reviews collection allows public POST with the same default. Admins triage in the admin UI.
- **Auto-revalidation** — every content collection's `afterChange` hook calls Next.js `revalidatePath()` for the affected route(s) when status flips to `published`, so the public site reflects edits within seconds.
- **Globals** — Editors edit Header nav and Footer columns once; the public layout reads them on every render.

### SEO

- Per-page `generateMetadata` (title, description, OG).
- JSON-LD on every detail page: `LocalBusiness` (stores), `Product` (bottles), `Article` (guides), `FAQPage` (any page with the FAQ accordion), `BreadcrumbList` (everywhere with breadcrumbs), `WebSite` + `SearchAction` (root layout).
- `sitemap.ts` enumerates all published Stores, Bottles, Categories, Articles + static routes.
- `robots.ts` allows `/`, disallows `/admin` and `/api`.

---

## 3. Non-functional requirements

| Concern | Approach |
|---|---|
| **Performance** | RSC by default; client components only where state is required (age gate, FAQ accordion, store tabs, filter bar, search box, claim form). Page-level `revalidate` set to 300–600s. Next/font self-hosts Fraunces + JetBrains Mono. |
| **SEO** | All detail pages render fully server-side. JSON-LD is inlined per page. `noindex` is **not** applied to pages with the age gate — the gate is cookie-only. |
| **Accessibility** | Semantic HTML (`<article>`, `<nav aria-label>`, `<header>`), ARIA labels on icon buttons, focusable form controls, aria-expanded on accordion. Color tokens use OKLCH for accurate dark/sepia contrast. |
| **Security** | Field-level access control on `status` (only admins can publish). Public `read` returns a query constraint (`status = published`), not a post-filter, so unpublished records never leave the DB. Server actions for the claim form (no public REST surface). |
| **Reliability** | `afterChange` hooks wrap `revalidatePath` in try/catch so seed scripts (which run outside Next's runtime) don't crash. Idempotent seed script — checks before inserting. |
| **Type safety** | `strict: true`, no `any` in app code. Payload-generated types (`src/payload-types.ts`) are the single source of truth. Side-by-side TypeScript 6 + 7 beta type-check via `pnpm typecheck`. |
| **Compliance** | "Mybooz does not sell alcohol" disclaimer in footer + on every store page. Responsible-drinking notice on store detail and homepage FAQ. License field surfaces L-1/L-2/FL-2 status publicly. |

---

## 4. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16.2.4** (App Router) | RSC for SEO; route groups isolate `(frontend)` and `(payload)`; built-in image optimization for S3-hosted media. |
| CMS | **Payload v3.84.1** | v3 mounts inside Next — single deploy, single `pnpm dev`, shared TypeScript types end-to-end. Versions/drafts and granular access control built in. |
| Database | **PostgreSQL** via `@payloadcms/db-postgres` | Relational fits store↔bottle↔category joins. Numeric primary keys (Postgres serial). |
| Object storage | **S3** via `@payloadcms/storage-s3` | Production-ready from day one. Compatible with AWS S3, Cloudflare R2, MinIO, Tigris (set `S3_ENDPOINT` for non-AWS). |
| Editor | **Lexical** via `@payloadcms/richtext-lexical` | Default Payload v3 editor; renders cleanly server-side via `<RichText />`. |
| UI | Plain CSS variables + minimal CSS-in-JS via `style` prop | Design uses OKLCH custom props. No Tailwind dependency. |
| Fonts | **Fraunces** (display serif) + **JetBrains Mono** (monospace) via `next/font` | Self-hosted, no CLS. |
| Package manager | **pnpm** | Fast, content-addressable. Works well with Next + Payload's many transitive deps. |
| Runtime | **Node 20 LTS** (or newer) | Required by Next 16 + Payload 3. |
| Type checking | **TypeScript 6.0.3** (toolchain) + **TS 7 beta** (`tsgo`) for fast checks | See [Type-checking](#type-checking) below. |

---

## 5. System architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         Browser                                │
└──────────────────────────────┬─────────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼─────────────────────────────────┐
│                 Next.js 16 (App Router)                        │
│                                                                │
│  ┌───────────────────────┐  ┌─────────────────────────────┐   │
│  │  (frontend) route     │  │  (payload) route group      │   │
│  │  group — public RSC   │  │  — admin UI + REST/GraphQL  │   │
│  │                       │  │                             │   │
│  │  - / (home)           │  │  - /admin/[[...segments]]   │   │
│  │  - /stores, /spirits, │  │  - /api/[...slug]           │   │
│  │    /bottles, /guides, │  │  - /api/graphql             │   │
│  │    /owners            │  │                             │   │
│  │  - /sitemap.xml       │  │                             │   │
│  │  - /robots.txt        │  │                             │   │
│  └───────────┬───────────┘  └──────────────┬──────────────┘   │
│              │ getPayload() local API       │                 │
│              ▼                              ▼                 │
│        ┌────────────────────────────────────────────┐         │
│        │  Payload core (collections, hooks,         │         │
│        │  access control, drafts/versions)          │         │
│        └────┬───────────────────────────────────┬───┘         │
└─────────────┼───────────────────────────────────┼─────────────┘
              │                                   │
              │ SQL                               │ HTTPS
              ▼                                   ▼
       ┌──────────────┐                   ┌──────────────┐
       │  PostgreSQL  │                   │  S3-compat   │
       │  (data)      │                   │  (media)     │
       └──────────────┘                   └──────────────┘
```

**Single-process design.** Payload v3 is not a separate server. The same Next.js process serves public pages, the admin UI, the REST/GraphQL API, and the file uploads. Server Components query Payload **directly** via `getPayload()` — no HTTP hop, no deserialization overhead, full TypeScript types.

**Two route groups** keep the public site visually + functionally isolated from the admin:
- `(frontend)/layout.tsx` owns the public `<html>` shell, navigation, footer, and age gate.
- `(payload)/layout.tsx` is generated by Payload and renders the admin UI in its own scope.

Both are valid root layouts in the App Router (Next supports multiple root layouts via route groups).

**Cache strategy.** Each public page sets `export const revalidate = N` (300–600s). When an admin publishes a change, the collection's `afterChange` hook calls `revalidatePath()` on the affected route(s), invalidating the cache without waiting for the timer.

---

## 6. Directory layout

```
mybooze/
├── package.json
├── next.config.ts                  # withPayload() wrapper
├── tsconfig.json                   # strict, ES2025, no baseUrl
├── payload.config.ts               # Payload init: db, storage, collections, globals
├── .env.example                    # all required env vars
├── README.md                       # ← you are here
├── public/                         # static assets
├── scripts/
│   └── seed.ts                     # idempotent seed of design's mock content
└── src/
    ├── app/
    │   ├── (frontend)/             # public site (RSC by default)
    │   │   ├── layout.tsx          # html shell + AgeGate + TopBar + Footer
    │   │   ├── page.tsx            # Home
    │   │   ├── globals.css         # design tokens + utility classes
    │   │   ├── sitemap.ts          # auto-generated from Payload
    │   │   ├── robots.ts
    │   │   ├── not-found.tsx
    │   │   ├── stores/
    │   │   │   ├── page.tsx        # directory + filters
    │   │   │   ├── StoreFilters.tsx (client)
    │   │   │   └── [slug]/page.tsx # store detail (LocalBusiness JSON-LD)
    │   │   ├── spirits/
    │   │   │   ├── page.tsx
    │   │   │   └── [slug]/page.tsx
    │   │   ├── bottles/[slug]/page.tsx
    │   │   ├── guides/
    │   │   │   ├── page.tsx
    │   │   │   └── [slug]/page.tsx
    │   │   └── owners/
    │   │       ├── page.tsx
    │   │       ├── ClaimForm.tsx   (client)
    │   │       └── claimAction.ts  (server action → creates pending Store)
    │   └── (payload)/              # admin + API (Payload-managed)
    │       ├── layout.tsx
    │       ├── custom.scss
    │       ├── admin/[[...segments]]/{page,not-found}.tsx
    │       ├── admin/importMap.js
    │       ├── api/[...slug]/route.ts          # REST
    │       ├── api/graphql/route.ts            # GraphQL
    │       └── api/graphql-playground/route.ts
    ├── collections/                # Payload collections (one file each)
    │   ├── Users.ts                # auth + role: admin|editor
    │   ├── Media.ts                # uploads → S3
    │   ├── Categories.ts
    │   ├── Stores.ts
    │   ├── Bottles.ts
    │   ├── Articles.ts             # Lexical rich text
    │   ├── Reviews.ts              # public POST allowed (defaults to pending)
    │   ├── Faqs.ts
    │   └── Pages.ts                # editable hero copy for landing pages
    ├── globals/
    │   ├── Header.ts               # nav items
    │   └── Footer.ts               # footer columns
    ├── access/                     # reusable access functions
    │   ├── isAdmin.ts
    │   ├── isEditorOrAdmin.ts
    │   └── publishedOrLoggedIn.ts  # returns query constraint, not boolean
    ├── fields/
    │   └── status.ts               # shared draft|pending|published field
    ├── hooks/
    │   ├── revalidate.ts           # afterChange → revalidatePath
    │   └── slugify.ts              # auto-slug from name/title
    ├── components/                 # ported from design as TS
    │   ├── AgeGate.tsx
    │   ├── TopBar.tsx
    │   ├── Footer.tsx
    │   ├── SearchBox.tsx           (client)
    │   ├── Crumbs.tsx
    │   ├── StoreCard.tsx
    │   ├── BottleCard.tsx
    │   ├── ArticleCard.tsx
    │   ├── CategoryTile.tsx
    │   ├── FAQ.tsx                 (client — accordion state)
    │   ├── Stars.tsx
    │   ├── MapPlaceholder.tsx      # decorative SVG, not real maps
    │   ├── Placeholder.tsx         # falls back to design's diagonal-stripe boxes
    │   ├── Logo.tsx
    │   └── primitives/
    │       ├── SectionHead.tsx
    │       ├── Stat.tsx
    │       └── Spec.tsx
    ├── lib/
    │   ├── payload.ts              # getPayload() singleton
    │   └── schema.tsx              # JSON-LD builders
    └── payload-types.ts            # generated by `pnpm generate:types`
```

---

## 7. Data model

| Collection | Purpose | Drafts | Public POST | Notable fields |
|---|---|---|---|---|
| `users` | Auth + role | — | no | `role: 'admin' \| 'editor'` |
| `media` | S3 uploads | — | no | `alt`, `caption`, image sizes (thumb/card/hero) |
| `categories` | Spirit types | ✓ | no | `slug`, `count`, `blurb`, `heroImage`, `faqs[]` |
| `stores` | Liquor stores | ✓ | no (admin creates; public submits via Owners form) | `slug`, `area`, `city`, `address`, `lat/lng`, `rating`, `hours[]`, `verified`, `license`, `categories[]` |
| `bottles` | Individual SKUs | ✓ | no | `slug`, `brand`, `category` (rel), `priceLow/High`, `tastingNotes[]`, `availableAt[]` (rel→stores) |
| `articles` | Editorial content | ✓ | no | Lexical `body`, `category`, `readMin`, `datePublished`, `related[]` |
| `reviews` | User reviews | ✓ | **yes** | `authorName`, `store` (rel), `stars`, `text` |
| `faqs` | FAQ entries | ✓ | no | `scope: 'home' \| 'category' \| 'bottle' \| 'store'`, `category` (rel, when scope=category) |
| `pages` | Landing-page copy | ✓ | no | `hero` (group), `stats[]`, `seo` |

**Globals:** `header` (nav items), `footer` (link columns).

**Workflow field** (shared across all content collections — see [src/fields/status.ts](src/fields/status.ts)):

```ts
status: 'draft' | 'pending' | 'published'
// access.update enforces: only admin role can set to 'published'
```

Public `read` access uses [`publishedOrLoggedIn`](src/access/publishedOrLoggedIn.ts), which returns `{ status: { equals: 'published' } }` as a query constraint. Logged-in editors/admins see all statuses.

---

## 8. Editorial workflow

```
        ┌───────┐    submit    ┌─────────┐   approve    ┌──────────┐
Editor →│ Draft │ ───────────→ │ Pending │ ───────────→ │ Published│
        └───────┘              └─────────┘  (admin only)└────┬─────┘
                                                             │
                                                             ▼
                                                   afterChange hook
                                                             │
                                                             ▼
                                       revalidatePath(/stores/[slug])
                                                             │
                                                             ▼
                                              public RSC re-renders
```

- Public store-claim submissions enter as `pending` Stores via the Owners intake form (server action, see [claimAction.ts](src/app/(frontend)/owners/claimAction.ts)).
- Public review submissions enter as `pending` Reviews.
- Editors can edit anything but cannot publish.
- Admins approve in the Payload admin UI (`/admin`); the next render of the public page picks up the change immediately.

---

## 9. Requirements & prerequisites

### Runtime

| Requirement | Version | Why |
|---|---|---|
| Node.js | ≥ 20.9.0 (LTS) | Next 16 + Payload 3 minimum |
| pnpm | ≥ 9.x | Lockfile + workspace compat |
| PostgreSQL | ≥ 14 | Drizzle adapter; v15+ recommended |
| S3-compatible store | any | AWS S3, Cloudflare R2, MinIO, Tigris |

### Environment variables (see [.env.example](.env.example))

| Var | Required | Notes |
|---|---|---|
| `PAYLOAD_SECRET` | yes | Generate with `openssl rand -hex 32`. Without it, `/admin` 500s. |
| `DATABASE_URI` | yes | `postgres://user:pass@host:5432/db` |
| `S3_BUCKET` | yes (for uploads) | Bucket name |
| `S3_REGION` | yes | e.g. `us-east-1`, `apac-south-1` |
| `S3_ACCESS_KEY_ID` | yes | |
| `S3_SECRET_ACCESS_KEY` | yes | |
| `S3_ENDPOINT` | optional | Set for MinIO / R2 / Tigris; leave blank for AWS |
| `NEXT_PUBLIC_SERVER_URL` | yes | `http://localhost:3000` in dev; production URL in prod (used in JSON-LD `url` and sitemap) |

### Browser support

Modern evergreen only — uses CSS `oklch()`, `color-mix()`, `backdrop-filter`. Polyfills not provided.

---

## 10. First run

```bash
cp .env.example .env.local
# Fill PAYLOAD_SECRET, DATABASE_URI, S3_*

pnpm install
pnpm generate:types       # generates src/payload-types.ts from collections
pnpm dev                  # http://localhost:3000 — public site + /admin
```

Visit `http://localhost:3000/admin` and create the first user — this user becomes the seed admin. Set `role: 'admin'` on it (defaults to `editor`).

Optional: load the design's mock content:

```bash
pnpm seed
```

The seed script is idempotent — re-running it skips existing records.

---

## 11. Routes reference

| Route | Source | SEO schema |
|---|---|---|
| `/` | [src/app/(frontend)/page.tsx](src/app/(frontend)/page.tsx) | `WebSite` + `SearchAction` + `FAQPage` |
| `/stores` | [src/app/(frontend)/stores/page.tsx](src/app/(frontend)/stores/page.tsx) | `BreadcrumbList` |
| `/stores/[slug]` | [src/app/(frontend)/stores/[slug]/page.tsx](src/app/(frontend)/stores/[slug]/page.tsx) | `LocalBusiness` (LiquorStore) + `BreadcrumbList` |
| `/spirits` | [src/app/(frontend)/spirits/page.tsx](src/app/(frontend)/spirits/page.tsx) | `BreadcrumbList` |
| `/spirits/[slug]` | [src/app/(frontend)/spirits/[slug]/page.tsx](src/app/(frontend)/spirits/[slug]/page.tsx) | `CollectionPage` + `FAQPage` + `BreadcrumbList` |
| `/bottles/[slug]` | [src/app/(frontend)/bottles/[slug]/page.tsx](src/app/(frontend)/bottles/[slug]/page.tsx) | `Product` + `BreadcrumbList` |
| `/guides` | [src/app/(frontend)/guides/page.tsx](src/app/(frontend)/guides/page.tsx) | `BreadcrumbList` |
| `/guides/[slug]` | [src/app/(frontend)/guides/[slug]/page.tsx](src/app/(frontend)/guides/[slug]/page.tsx) | `Article` + `BreadcrumbList` |
| `/owners` | [src/app/(frontend)/owners/page.tsx](src/app/(frontend)/owners/page.tsx) | `BreadcrumbList` |
| `/privacy` | [src/app/(frontend)/privacy/page.tsx](src/app/(frontend)/privacy/page.tsx) | `BreadcrumbList` |
| `/terms` | [src/app/(frontend)/terms/page.tsx](src/app/(frontend)/terms/page.tsx) | `BreadcrumbList` |
| `/cancellation` | [src/app/(frontend)/cancellation/page.tsx](src/app/(frontend)/cancellation/page.tsx) | `BreadcrumbList` |
| `/sitemap.xml` | [src/app/(frontend)/sitemap.ts](src/app/(frontend)/sitemap.ts) | — |
| `/robots.txt` | [src/app/(frontend)/robots.ts](src/app/(frontend)/robots.ts) | — |
| `/admin/*` | Payload admin UI | excluded from indexing |
| `/api/*`, `/api/graphql` | Payload REST + GraphQL | excluded from indexing |

---

## 12. Type-checking

This project runs TypeScript in a **dual setup** during the v7 beta period:

| Tool | Version | Used for |
|---|---|---|
| `typescript@^6.0.3` | 6.0.3 | Next.js's built-in type pass, Payload's `generate:types` CLI, IDE language server, ESLint type-aware rules |
| `@typescript/native-preview@beta` (binary `tsgo`) | 7.0 beta (Go-native) | Fast standalone type-checks via `pnpm typecheck` — 10×+ faster than `tsc` |

The Go-native compiler doesn't yet expose a stable programmatic API (planned for 7.1+), and Payload's type generator + Next's internal type pipeline both call into `typescript`'s API directly. Replacing the `typescript` package outright would break those tools today. The recommended migration path during the beta is to run `tsgo` as a side-by-side checker.

```bash
pnpm typecheck          # tsgo (fast, Go-native)
pnpm typecheck:legacy   # tsc 6 (slower, identical results)
```

Both read the same `tsconfig.json`. Treat any error `tsgo` reports that `tsc` doesn't as advance warning of what TypeScript 7.0 stable will catch — fix it, since it'll bite when we flip the default later.

When TS 7.0 stable ships and Payload + Next confirm support, swap is a one-line change: replace `"typescript": "^6.0.3"` with `"typescript": "^7.0.0"` and remove `@typescript/native-preview`.

### tsconfig already aligned with both v6 and v7

- `strict: true`
- `target: ES2025`
- `module: esnext`, `moduleResolution: bundler`
- `esModuleInterop: true`
- No `baseUrl` (TS 7 removed it — we use `paths` with `@/*` and `@payload-config`)
- No deprecated flags (`outFile`, `downlevelIteration`, `module: amd|umd|systemjs`, `moduleResolution: node10|classic`)

---

## 13. Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Starts Next.js dev server (admin + public on `:3000`) |
| `pnpm build` | Production build (Next + Payload admin bundle) |
| `pnpm start` | Run the production build |
| `pnpm lint` | `next lint` |
| `pnpm typecheck` | TS 7 beta `tsgo --noEmit` |
| `pnpm typecheck:legacy` | TS 6 `tsc --noEmit` |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` from collection configs |
| `pnpm migrate` | Apply Postgres migrations (production) |
| `pnpm migrate:create` | Create a new migration from current schema diff |
| `pnpm seed` | Load design's mock content (idempotent) |

---

## 14. Deployment notes

- Run `pnpm migrate` in your deploy step **before** the new app starts serving traffic. The Postgres adapter's dev-mode `push` is disabled in production (see [payload.config.ts](payload.config.ts)).
- `NEXT_PUBLIC_SERVER_URL` must be set to the production URL — it's used in JSON-LD URLs and the sitemap. Stale value will produce wrong canonical URLs.
- S3 credentials must be present **before** the first user uploads media. Without them, uploads fail silently in the admin.
- `PAYLOAD_SECRET` must be stable across deploys — rotating it invalidates all admin sessions.
- Recommended hosts: any platform that runs a long-lived Node process (Vercel, Railway, Fly.io, AWS ECS, Render). Pure edge runtimes won't work — Payload needs Node + a Postgres connection pool.

---

## 15. Known limitations / tradeoffs

- **No real maps.** [MapPlaceholder.tsx](src/components/MapPlaceholder.tsx) renders a decorative SVG. Swap for Mapbox GL or Google Maps when actual geo lookup matters.
- **Placeholder images.** [Placeholder.tsx](src/components/Placeholder.tsx) renders the design's diagonal-stripe boxes whenever a Media field is empty. Once editors upload, real photos take over.
- **No store-owner login yet.** The Owners page submits a `pending` Store via server action, but there's no per-owner login or dashboard. Owners are notified out-of-band; admins manage everything in `/admin`.
- **No payment processing.** Plan tiers on the Owners page are static — no Stripe / Razorpay integration.
- **Tasting / budget filter chips** on category pages are visual placeholders — they don't filter the bottle grid yet.
- **Drop cap + in-article TOC** on guide articles aren't rendered; would need a custom Lexical converter.
- **Tweaks panel** from the design (theme/density/hero variant) was deliberately skipped — design-time only.
- **TypeScript v7 stable** isn't available yet; we run v6 as the toolchain default and v7 beta side-by-side for fast checks.
