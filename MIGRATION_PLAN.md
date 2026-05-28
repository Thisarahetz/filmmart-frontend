# Filmmart – Migration Plan: CRA → Next.js 15 (App Router)

> **PHASE 1 ANALYSIS – READ ONLY. No code has been changed.**
> Approve this plan before Phase 2 begins.

---

## 1. Current State Audit

### Framework & Tooling
| Item | Current |
|---|---|
| Framework | **Create React App** (react-scripts 4.0.3) — NOT Next.js |
| React | 17.0.2 (uses deprecated `ReactDOM.render`) |
| TypeScript | None (plain `.js` / `.jsx`) |
| Node target | 14.x (pinned in CI workflow) |
| Build output | Static SPA (`build/`) |

### Routing
- **react-router-dom 6.2.2** (client-side SPA routing, no SSR)
- Routes are defined in `src/App.jsx`

| Route | Component | Purpose |
|---|---|---|
| `/` | `Home` | Landing: hero banner + scrollable list rows |
| `/movies` | `Home type="movie"` | Same as home filtered to movies |
| `/series` | `Home type="series"` | Same as home filtered to series |
| `/details` | `Details` | Movie detail — **hardcoded static Venom 2005 content** |
| `/register` | `Register` | Two-step email→password signup UI (no API call wired up) |
| `/login` | `Login` | Sign-in form — **commented out / dead code, never rendered** |

### Styling
- **SCSS modules** (sass) — colocated `.scss` per component
- **MUI v5** (`@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`)
- **styled-components** (installed, not visibly used)
- Color scheme: black background `#000`, gold accents `#F5C517` / `#d0b15f`, dark cards `#1a1a1a`

### State Management
- None global — local `useState` + `useEffect` only
- Auth state: **hardcoded `const user = true`** in `App.jsx`

### Data Fetching
- **axios** pointed at `http://localhost:8091/api/`
- **Hardcoded JWT bearer tokens** in two places:
  - `src/pages/home/Home.jsx` — fetches lists
  - `src/components/listItem/ListItem.jsx` — fetches individual movies
- **N+1 problem**: each `ListItem` fires its own `GET /movies/find/:id` independently

### Auth
- Backend: custom JWT via `jsonwebtoken`, stored in response body
- Frontend: completely mocked — no login/logout flow, no token storage, hardcoded tokens
- Password "hashing": **CryptoJS AES encryption** — wrong tool, not a hash, reversible

### Backend (`/api` — separate Express server)
| Item | Value |
|---|---|
| Server | Express on port 8091 |
| Database | MongoDB via Mongoose |
| Auth | JWT + CryptoJS AES (insecure) |
| Routes | `/api/auth`, `/api/users`, `/api/movies`, `/api/list` |

**MongoDB schemas:**

- **Movie**: `title, desc, img, imgTitle, imgSm, trailer, video, year, limit, genre, isSeries`
- **List**: `title, type, genre, content (Array of Movie IDs)`
- **User**: `username, email, password, profilePic, isAdmin`

### Images & Fonts
- All images are **external URLs** (ibb.co, baiscopedownloads.co) via plain `<img>` tags — not optimized
- Fonts: **Google Fonts Roboto** loaded via `<link>` in `public/index.html`
- No local image assets

### CI/CD
- GitHub Actions → Azure App Service ("testfrontend123456")
- Node 14.x (EOL), `actions/checkout@v2` (deprecated)
- No environment variable injection in workflow

### `admin/` Folder
- **Completely empty** — nothing to migrate

---

## 2. Critical Bugs Found During Analysis

These must be fixed during migration (not optional cleanup):

1. **Hardcoded JWT tokens in source** — tokens in `Home.jsx:20` and `ListItem.jsx:20` are committed secrets
2. **`const user = true`** — auth gate is permanently bypassed
3. **`ReactDOM.render()`** — deprecated since React 18; current code runs React 17 so it works, but migration to React 18 requires `createRoot`
4. **`window.onscroll = fn`** in `Navbar.jsx` — overwrites any other scroll handler, and the cleanup attempt (`return () => window.onscroll = null`) is inside the wrong scope (it's inside the event handler, not a `useEffect` cleanup)
5. **`<div class=` not `className=`** in `Details.jsx:25` — silent bug (React warns but renders)
6. **CryptoJS AES for passwords** — AES is symmetric encryption, not a password hash; anyone with the `SECRET_KEY` can decrypt all passwords in the DB. Must replace with bcrypt
7. **N+1 API calls** — the `List` component maps over content IDs and each `ListItem` fires its own API call; 10 lists × N items = many requests on page load
8. **`/details` has no route parameter** — it always shows hardcoded Venom 2005 content regardless of which movie is clicked

---

## 3. Target Stack

| Layer | Current | Target |
|---|---|---|
| Framework | CRA (SPA) | Next.js 15 (App Router, RSC) |
| React | 17 | 18 (concurrent features) |
| TypeScript | None | Strict mode |
| Routing | react-router-dom | Next.js file-based routing |
| Styling | SCSS + MUI + styled-components | Tailwind CSS + shadcn/ui |
| Icons | MUI icons | lucide-react |
| Images | `<img>` | `next/image` |
| Fonts | Google Fonts `<link>` | `next/font/google` |
| Data fetching | axios + client useEffect | Server Components (fetch) + Route Handlers |
| Auth | Hardcoded / mocked | Custom JWT with httpOnly cookies |
| Passwords | CryptoJS AES | bcryptjs |
| Dark mode | Hardcoded black | next-themes |
| Validation | None | Zod |
| Linting | react-app eslint | ESLint flat config + Prettier |
| API server | Express (separate process) | Next.js Route Handlers (same app) |
| Node | 14.x | 22.x (LTS), pinned in `.nvmrc` |
| CI | Node 14, deprecated actions | Node 22, current action versions |

---

## 4. Folder Structure (Target)

```
filmmart-frontend/
├── .nvmrc                         # Node 22
├── .env.local                     # MONGO_URL, JWT_SECRET (gitignored)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── .prettierrc
├── app/
│   ├── layout.tsx                 # Root layout: fonts, ThemeProvider, Navbar
│   ├── page.tsx                   # Home (/) — Server Component
│   ├── loading.tsx                # Root loading skeleton
│   ├── error.tsx                  # Root error boundary
│   ├── not-found.tsx              # 404
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── movies/
│   │   ├── page.tsx               # /movies — filtered home
│   │   ├── loading.tsx
│   │   └── [id]/
│   │       ├── page.tsx           # /movies/[id] — dynamic detail
│   │       ├── loading.tsx
│   │       └── error.tsx
│   ├── series/
│   │   ├── page.tsx               # /series — filtered home
│   │   └── loading.tsx
│   ├── login/
│   │   └── page.tsx               # Client Component (form)
│   ├── register/
│   │   └── page.tsx               # Client Component (form)
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts
│       │   └── login/route.ts
│       ├── movies/
│       │   ├── route.ts           # GET all, POST create
│       │   └── [id]/route.ts      # GET one, PUT update, DELETE
│       ├── lists/
│       │   ├── route.ts           # GET (with type/genre query), POST, DELETE
│       └── users/
│           ├── route.ts           # GET all (admin), stats
│           └── [id]/route.ts      # GET one, PUT, DELETE
├── components/
│   ├── ui/                        # shadcn/ui primitives (auto-generated)
│   └── features/
│       ├── navbar/
│       │   ├── Navbar.tsx
│       │   └── Sidebar.tsx
│       ├── hero/
│       │   └── HeroBanner.tsx     # renamed from Features
│       ├── movies/
│       │   ├── MovieList.tsx      # renamed from List
│       │   └── MovieCard.tsx      # renamed from ListItem
│       └── search/
│           └── SearchBar.tsx
├── lib/
│   ├── db.ts                      # Mongoose connection singleton
│   ├── auth.ts                    # JWT sign/verify helpers
│   └── types.ts                   # Shared TS types (Movie, List, User)
└── types/
    └── index.ts                   # Global type augmentations
```

---

## 5. What Stays, What Is Replaced, What Is Deleted

### Stays (concept preserved, code rewritten)
- Movie/series concept and black+gold visual theme
- MongoDB schemas (Movie, List, User) — ported to Mongoose in `lib/db.ts`
- JWT auth pattern — replaced with httpOnly cookies
- Horizontal scrollable list component — rebuilt with Tailwind + CSS scroll snapping
- Hero banner section — rebuilt without MUI dependency
- Genre/type filter dropdown
- Social icons in navbar

### Replaced (direct swap)
| Old | New | Reason |
|---|---|---|
| react-scripts | next | Framework upgrade |
| react-router-dom | Next.js routing | Built into framework |
| SCSS | Tailwind CSS | Target stack |
| MUI v5 | shadcn/ui + lucide-react | Lighter, Tailwind-native |
| axios | native `fetch` | No extra dep needed in Next.js |
| styled-components | Tailwind | Target stack |
| `<img>` | `next/image` | Optimization |
| Google Fonts `<link>` | `next/font/google` | No FOUT, self-hosted |
| CryptoJS AES | bcryptjs | Correct password hashing |
| Express server | Next.js Route Handlers | Single unified deployment |

### Deleted (removed entirely)
| File/Folder | Why |
|---|---|
| `src/` (entire directory) | Replaced by `app/` and `components/` |
| `public/index.html` | Next.js generates its own HTML shell |
| `api/` (entire directory) | Logic migrated to `app/api/` route handlers |
| `admin/` (empty) | Nothing to migrate |
| `package.json` deps: MUI, emotion, styled-components, sass, react-scripts, react-router-dom, axios, cra-template | All replaced |
| Hardcoded JWT tokens | Security fix |

---

## 6. Route Mapping

| Old CRA route | New Next.js route | Notes |
|---|---|---|
| `/` | `app/page.tsx` | |
| `/movies` | `app/movies/page.tsx` | |
| `/series` | `app/series/page.tsx` | |
| `/details` | `app/movies/[id]/page.tsx` | Now dynamic; ListItem links to `/movies/:id` |
| `/register` | `app/register/page.tsx` | |
| `/login` | `app/login/page.tsx` | Uncommented and properly wired |

---

## 7. Page-by-Page Migration Notes

### Home (`/`, `/movies`, `/series`)
- **Current**: Client Component, fetches lists in `useEffect` with hardcoded token
- **Target**: Server Component — `fetch` lists on the server (no token needed from client; auth cookie passed automatically), pass data to Client Components only for interactive parts
- Fix: N+1 calls — the server fetches each list's movies in a `Promise.all` before render

### Details (`/details` → `/movies/[id]`)
- **Current**: Static, hardcoded Sinhala content for Venom 2005
- **Target**: Dynamic Server Component using `params.id` to `fetch` from `/api/movies/[id]`
- The `ListItem` links will be updated to navigate to `/movies/${movie._id}`

### Register (`/register`)
- **Current**: Two-step UI that captures email then password, no API call
- **Target**: Single form with Server Action or `POST /api/auth/register`, proper validation with Zod

### Login (`/login`)
- **Current**: Dead code (commented out in App.jsx)
- **Target**: Proper login form → `POST /api/auth/login` → sets httpOnly JWT cookie

### Navbar
- **Current**: Client Component with `window.onscroll` (memory leak), MUI components
- **Target**: Client Component (scroll detection), Tailwind + shadcn/ui Sheet for mobile drawer

---

## 8. API Migration Notes

The Express `/api` folder becomes Next.js Route Handlers in `app/api/`. Behavior is identical to current Express routes. MongoDB connection uses a singleton pattern to survive HMR.

**Key auth change**: Instead of passing `token: "Bearer ..."` in request headers from client JS, login will set an httpOnly cookie. Server-side Route Handlers read `cookies()` to verify the JWT. This eliminates the need to store tokens in JS (prevents XSS token theft).

---

## 9. Trade-off Decision Points

These are the places where I'd normally guess and proceed, but I'm stopping to ask you:

### Decision A — Backend consolidation
**Option 1 (Recommended)**: Migrate the Express `/api` to Next.js Route Handlers. Single app, single deployment, type-safe end-to-end.
**Option 2**: Keep the Express server running separately, have Next.js frontend call it via env-var `NEXT_PUBLIC_API_URL`. Less churn on the backend, but two services to deploy.

*My recommendation: Option 1 — the Express routes are simple CRUD with no streaming or WebSocket needs that would require a dedicated server.*

### Decision B — Auth implementation
**Option 1 (Recommended)**: Custom JWT with httpOnly cookies. Matches the existing pattern, no new dependencies beyond `jsonwebtoken` + `bcryptjs`.
**Option 2**: NextAuth.js (Auth.js v5). More features (OAuth providers, sessions), but heavier and requires configuring adapter for MongoDB.

*My recommendation: Option 1 — keep it simple since the current app only has email/password auth.*

### Decision C — Details page content
The current `/details` page has hardcoded Sinhala movie content for Venom 2005.
**Option 1 (Recommended)**: Replace with a proper dynamic `/movies/[id]` page that fetches real data from the DB. The hardcoded content is lost, but you'd seed the DB with real movies.
**Option 2**: Preserve the hardcoded Venom page as a reference, but also build the dynamic route.

*My recommendation: Option 1 — the hardcoded page is placeholder content, not real data worth preserving.*

### Decision D — Admin panel
The `admin/` folder is empty. Should Phase 2 scaffold a basic admin dashboard, or skip it?

*No recommendation — depends on your plans. If you want it, I can scaffold `/admin` protected route with a movies table.*

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| MongoDB connection pooling in serverless Next.js | High | Use singleton pattern in `lib/db.ts` |
| Azure App Service workflow needs updating for Next.js | Medium | Update workflow: Node 22, `npm run build`, `next start` |
| External images on ibb.co breaking | Medium | Add `images.remotePatterns` in `next.config.ts`; optionally download locally |
| Sinhala unicode in filenames/content | Low | Next.js handles UTF-8 fine; just ensure `charset=utf-8` |
| `MONGO_URL` and `SECRET_KEY` env vars | High | Must be set in `.env.local` (local) and Azure App Settings (deploy) |
| bcrypt migration for existing user passwords | Medium | Existing passwords in DB are CryptoJS-encrypted — they cannot be rehashed without users logging in. On first login, verify CryptoJS then re-save as bcrypt hash. Document as a manual step. |

---

## 11. New Packages (must confirm before install)

These are all covered by your stated target stack:

```
next@latest
react@18 react-dom@18
typescript @types/react @types/react-dom @types/node
tailwindcss postcss autoprefixer
shadcn-ui (via npx shadcn@latest init — installs components on demand)
next-themes
lucide-react
mongoose @types/mongoose (or mongoose ships its own types now)
jsonwebtoken @types/jsonwebtoken
bcryptjs @types/bcryptjs
zod
eslint eslint-config-next prettier eslint-config-prettier
```

**Packages I will ask before adding if needed** (not in your stated stack):
- `sharp` (next/image optimization in production — almost certainly needed)
- `@hookform/react-hook-form` + `@hookform/resolvers` (form handling)

---

## 12. Step Order (Phase 2 execution sequence)

1. **Scaffold** — `npx create-next-app@latest` with TypeScript, Tailwind, ESLint, App Router, `src/` off, alias `@/`
2. **Pin Node** — write `.nvmrc`
3. **Configure** — `tsconfig.json` strict, Prettier, shadcn init, next-themes provider
4. **DB + Types** — `lib/db.ts` singleton, `lib/types.ts` (Movie, List, User interfaces)
5. **API routes** — migrate Express routes to `app/api/**` Route Handlers with bcrypt auth
6. **Root layout** — `app/layout.tsx` with `next/font`, ThemeProvider, Navbar
7. **Navbar + Sidebar** — Tailwind + shadcn Sheet, fix scroll listener
8. **Hero banner** — `components/features/hero/HeroBanner.tsx`
9. **MovieCard + MovieList** — Server-fetched list data, fixed N+1, hover card
10. **Home / Movies / Series pages** — Server Components, `generateMetadata`
11. **Movie detail page** — dynamic `[id]` Server Component
12. **Login + Register** — Client Components with Zod validation, Server Actions
13. **Loading / Error / Not-found** — for every route group
14. **Dark mode** — next-themes toggle in navbar
15. **SEO** — `generateMetadata`, `sitemap.ts`, `robots.ts`, JSON-LD for movie pages
16. **CI/CD update** — update GitHub Actions workflow (Node 22, next start)
17. **Phase 5 verify** — build, lint, tsc, Lighthouse

---

## 13. Manual Steps You'll Still Own After Migration

1. **Environment variables**: Set `MONGO_URL` and `JWT_SECRET` in `.env.local` (and Azure App Settings for deploy)
2. **Existing user passwords**: Passwords in MongoDB are CryptoJS-encrypted. The migration step will add a "re-hash on first login" path. Existing users must log in once to get their password re-saved as bcrypt.
3. **External images**: The ibb.co image URLs are external-hosted. If they go down, images break. Consider downloading them locally or uploading to a CDN.
4. **Azure deploy config**: After migration, the Azure workflow will need `next start` instead of `serve`; Azure Web App must have `SCM_DO_BUILD_DURING_DEPLOYMENT=true` or use the artifact approach.
5. **MongoDB seeding**: The hardcoded Venom 2005 detail page content should be seeded into MongoDB as a real Movie document so the dynamic detail page has data to show.

---

*Ready for your approval. Once you confirm (and answer Decisions A–D), Phase 2 begins.*
