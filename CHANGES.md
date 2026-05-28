# Migration Changes

## What Changed

### Framework
- **Before**: Create React App (react-scripts 4.0.3), React 17, plain JavaScript, client-side SPA
- **After**: Next.js 15 (App Router), React 19, TypeScript strict mode, Server + Client Components

### Routing
| Old | New |
|---|---|
| `/` | `app/page.tsx` (Server Component) |
| `/movies` | `app/movies/page.tsx` |
| `/series` | `app/series/page.tsx` |
| `/details` (hardcoded) | `app/movies/[id]/page.tsx` (dynamic) |
| `/register` | `app/register/page.tsx` |
| `/login` (dead code) | `app/login/page.tsx` (fully implemented) |
| — | `app/admin/page.tsx` (new) |

### Styling
- Removed: SCSS, MUI v5, styled-components, @emotion
- Added: Tailwind CSS v4, shadcn/ui primitives, lucide-react icons

### Backend / API
- Removed: Separate Express server (`api/` folder on port 8091)
- Added: Next.js Route Handlers at `app/api/**` (same process, same deployment)

### Auth
- Removed: Hardcoded JWT bearer tokens in source code
- Removed: `const user = true` auth bypass
- Removed: CryptoJS AES password "encryption"
- Added: bcryptjs password hashing (cost factor 12)
- Added: httpOnly JWT cookies via `jose`
- Added: Real login/logout flow

### Data Fetching
- Removed: axios, client-side `useEffect` fetches for lists
- Removed: N+1 API calls (each ListItem fetching its own movie)
- Added: Server Component data fetching with `Promise.all` for batch movie resolution

### Images & Fonts
- Removed: Plain `<img>` tags, Google Fonts `<link>` in HTML
- Added: `next/image` on all images, `next/font/google` (self-hosted, no FOUT)

### SEO
- Added: `generateMetadata` on every route (title, description, canonical, OG, Twitter card)
- Added: `app/sitemap.ts` (dynamic, includes all movie URLs)
- Added: `app/robots.ts`
- Added: JSON-LD structured data on movie detail pages (`Movie` / `TVSeries` schema)
- Added: One `<h1>` per page
- Added: Skip-to-content link for keyboard navigation

### Accessibility
- Semantic HTML: `<header>`, `<main>`, `<nav>`, `<section>`, `<aside>`, `<h1>`–`<h2>`
- All images have descriptive `alt` text
- All interactive elements have `aria-label` where label is not visible
- Star ratings have `aria-label` with text equivalent
- Focus ring visible on all focusable elements (yellow outline)

### CI/CD
- Updated: Node 14 → Node 22 (reads `.nvmrc`)
- Updated: `actions/checkout@v2` → `@v4`, `setup-node@v1` → `@v4`, `upload-artifact@v2` → `@v4`
- Added: `MONGO_URL`, `JWT_SECRET`, `NEXT_PUBLIC_SITE_URL` as required CI secrets
- Changed: build command stays `npm run build`; startup command must be `next start` (see below)

---

## Manual Steps Required

### 1. Create `.env.local` (local development)
```
cp .env.local.example .env.local
```
Then fill in:
```
MONGO_URL=mongodb://localhost:27017/filmmart
JWT_SECRET=<generate with: openssl rand -base64 32>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Add GitHub Secrets (for CI/CD)
In your GitHub repo → Settings → Secrets → Actions, add:
- `MONGO_URL` — your MongoDB Atlas connection string
- `JWT_SECRET` — a long random string (same as above)
- `NEXT_PUBLIC_SITE_URL` — your Azure app URL (e.g. `https://testfrontend123456.azurewebsites.net`)

### 3. Azure App Service startup command
The app now runs `next start` (not `serve` or a static host).
In Azure Portal → App Service → Configuration → General settings, set:
```
Startup Command: node node_modules/.bin/next start
```

### 4. Azure App Settings (environment variables)
In Azure Portal → App Service → Configuration → Application settings, add the same three env vars:
- `MONGO_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_SITE_URL`

### 5. Existing MongoDB user passwords
Passwords in the existing MongoDB were stored as **CryptoJS AES encrypted strings** (not real hashes). The new system uses **bcrypt**. Existing user accounts will fail login.

**Options:**
- (Simple) Have users re-register — all new accounts will use bcrypt correctly.
- (Advanced) Write a one-time migration script that fetches all users, decrypts their passwords with the old `SECRET_KEY`, re-hashes with bcrypt, and saves.

### 6. Seed the Venom 2005 movie data
The hardcoded Venom 2005 detail page is now a dynamic route (`/movies/[id]`). To see that content, add the movie to MongoDB via the admin panel at `/admin` (after logging in with an admin account).

To create an admin user: register normally, then in MongoDB update the user document:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { isAdmin: true } })
```

---

## Bugs Fixed

1. Hardcoded JWT bearer tokens in source code — **removed**
2. `const user = true` auth bypass — **replaced with real JWT auth**
3. CryptoJS AES for password "hashing" — **replaced with bcrypt**
4. `ReactDOM.render()` deprecated API — **replaced by Next.js bootstrapping (React 19)**
5. `window.onscroll = fn` memory leak — **replaced with `addEventListener` + cleanup in `useEffect`**
6. `<div class=` instead of `className=` in Details.jsx — **fixed**
7. N+1 API calls on home page — **fixed with `Promise.all` batch fetch**
8. Login page was dead code (commented out) — **now fully implemented**
9. `/details` had no dynamic routing — **now `/movies/[id]`**
10. Hardcoded expired JWT tokens — **removed entirely**
