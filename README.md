# Mybooz

Premium editorial directory for Indian liquor stores and spirits, built with **Next.js 16.2** + **Payload CMS v3.84.1**.

- Public site lives in `src/app/(frontend)/`
- Admin panel + REST/GraphQL API live in `src/app/(payload)/` (mounted on `/admin` and `/api/*`)
- PostgreSQL via `@payloadcms/db-postgres`
- S3 media storage via `@payloadcms/storage-s3`
- Editorial workflow: **draft → pending review → published** (only admins can publish)

## First run

```bash
cp .env.example .env.local
# fill PAYLOAD_SECRET (openssl rand -hex 32), DATABASE_URI, S3_*

pnpm install
pnpm generate:types       # regenerates src/payload-types.ts from collections
pnpm dev                  # starts Next + Payload at http://localhost:3000
```

Visit `http://localhost:3000/admin` and create the first user (this user becomes the seed admin — set `role: admin` on it).

Optional: seed the design's mock content:

```bash
pnpm seed
```

## Workflow

- **Editors** create/update content; status options are `draft` and `pending`.
- **Admins** can flip status to `published`. The `afterChange` hook on each content collection calls `revalidatePath()` so published changes appear on the public site within seconds.
- Public users see only `published` records. Logged-in editors/admins see all statuses in the admin.

## Routes

| Route | Source |
|---|---|
| `/` | `src/app/(frontend)/page.tsx` |
| `/stores` | directory + filters |
| `/stores/[slug]` | store detail (LocalBusiness JSON-LD) |
| `/spirits` | category hub |
| `/spirits/[slug]` | category detail |
| `/bottles/[slug]` | bottle detail (Product JSON-LD) |
| `/guides` | articles hub |
| `/guides/[slug]` | article (Article JSON-LD, Lexical body) |
| `/owners` | claim flow + intake form (writes a `pending` Store) |
| `/sitemap.xml`, `/robots.txt` | generated from Payload |
| `/admin` | Payload admin UI |
| `/api/*`, `/api/graphql` | Payload REST + GraphQL |

## Type-checking

This project runs TypeScript in a **dual setup** during the v7 beta period:

| Tool | Version | Used for |
|---|---|---|
| `typescript@^6.0.3` | 6.0.3 | Next.js's built-in type pass, Payload's `generate:types` CLI, IDE language server, ESLint type-aware rules |
| `@typescript/native-preview@beta` (binary `tsgo`) | 7.0 beta (Go-native) | Fast standalone type-checks via `pnpm typecheck` — 10×+ faster than `tsc` |

Why both: the Go-native compiler doesn't yet expose a stable programmatic API (planned for 7.1+), and Payload's type generator + Next's internal type pipeline both call into `typescript`'s API directly. Replacing the `typescript` package outright would break those tools today. The recommended migration path during the beta is to run `tsgo` as a side-by-side checker.

```bash
pnpm typecheck          # tsgo (fast, Go-native)
pnpm typecheck:legacy   # tsc 6 (slower, identical results)
```

Both read the same `tsconfig.json`. Treat any error `tsgo` reports that `tsc` doesn't as advance warning of what TypeScript 7.0 stable will catch — fix it, since it'll bite when we flip the default later.

When TS 7.0 stable ships and Payload + Next confirm support, swap is a one-line change: replace `"typescript": "^6.0.3"` with `"typescript": "^7.0.0"` and remove `@typescript/native-preview`.

### TS 6 / 7 tsconfig compatibility (already aligned)

Both versions enforce the same stricter defaults. Our `tsconfig.json` is set up for both:

- `strict: true`
- `target: ES2025`
- `module: esnext`, `moduleResolution: bundler`
- `esModuleInterop: true`
- No `baseUrl` (TS 7 removed it — we use `paths` directly with `@/*` and `@payload-config`)
- No deprecated flags (`outFile`, `downlevelIteration`, `module: amd|umd|systemjs`, `moduleResolution: node10|classic`)

## Notes

- The design's CSS placeholder cards (diagonal stripes) render whenever a Media field is empty — once editors upload images, real photos take over.
- Map placeholders are decorative SVG. Swap for Mapbox/Google Maps if real geo is needed.
