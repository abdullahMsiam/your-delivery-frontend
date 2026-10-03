# Your Delivery — Frontend Project Plan (Start → Production → Deploy)

I'll keep everything you've shared in context. Below is a structured, learner-friendly roadmap you can follow step by step. We'll go slowly and only move to the next phase when the previous one is working.

---

## 🎨 Design Decisions (Locked In)

| Aspect | Decision |
|---|---|
| Primary Color | Close-to-red (e.g., `hsl(0 72% 51%)` — like a deep crimson/red-600) |
| Theme | Light + Dark mode (via `next-themes`) |
| UI Style | Simple, not fancy. Clean cards, clear spacing, minimal shadows, high contrast |
| Component Library | shadcn/ui + Tailwind CSS (mandatory-friendly, accessible via Radix) |
| Font | Inter (or Geist) — clean, readable |
| Icons | Lucide React |
| Radius | Small (`0.5rem`) for a serious, utility feel |

---

## 🧭 Phase-by-Phase Plan

### **Phase 0 — Learning & Setup (Before Coding)**
**Goal:** Understand the backend + set up tooling.

1. Read the backend guide end-to-end (already done above). Note:
   - Base URL: `http://localhost:5000/api/v1`
   - Health: `/api/health` (not `/api/v1/health`)
   - Auth: Bearer JWT (access) + opaque refresh token
   - Roles: `CUSTOMER`, `AGENT`, `ADMIN`
   - Enums: delivery statuses, payment methods/statuses
2. Set up accounts/tools:
   - Node.js (LTS), pnpm/npm
   - Git + GitHub repo
   - VS Code + ESLint/Prettier extensions
   - Postman or Thunder Client (to test backend manually)
3. Get backend running locally (or use the Render URL). Ask backend owner for:
   - Working CORS origin
   - 3 demo accounts (CUSTOMER, AGENT, ADMIN)
   - Confirmation Stripe test keys + webhook are configured

**Deliverable:** Backend reachable, demo accounts known.

---

### **Phase 1 — Project Scaffolding**
**Goal:** Next.js App Router project with all base tooling.

1. `npx create-next-app@latest` → TypeScript, App Router, Tailwind, ESLint, `src/` dir
2. Install:
   - `shadcn/ui` (init + components: button, input, card, dialog, dropdown, table, badge, skeleton, toast, form, select, tabs, avatar, sheet, alert, separator)
   - `@tanstack/react-query`, `@tanstack/react-query-devtools`
   - `zustand`
   - `react-hook-form`, `zod`, `@hookform/resolvers`
   - `next-themes`
   - `sonner`
   - `lucide-react`
   - `recharts`
   - `axios` (or use native fetch — pick one and stick to it)
   - `date-fns`
   - `clsx`, `tailwind-merge`
3. Configure:
   - Tailwind theme: primary red, dark mode via `class`
   - `ThemeProvider` (next-themes) in root layout
   - `QueryClientProvider` in a client provider file
   - `Toaster` (sonner) globally
   - Folder structure:
     ```
     src/
       app/
         (public)/         → home, about, services, contact, pricing
         (auth)/           → login, register
         (customer)/dashboard/...
         (agent)/provider/...
         (admin)/admin/...
         payment/          → success, cancel
         api/              → only if needed (proxy)
         layout.tsx, error.tsx, not-found.tsx, loading.tsx
       components/
         ui/               → shadcn
         shared/           → DataTable, StatCard, StatusBadge, SearchInput, Pagination, EmptyState
         layout/           → Navbar, Sidebar, Footer, ThemeToggle, RoleGuard
       features/
         auth/ deliveries/ payments/ notifications/ users/
       lib/
         api-client.ts, query-client.ts, utils.ts, constants.ts, enums.ts, types.ts
       hooks/
         useAuth, useDebounce, usePagination, useSearchParamsSync
       store/
         auth-store.ts (zustand)
       middleware.ts
     ```
4. `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

**Deliverable:** App runs, theme toggle works, toast works. Commit: `chore: scaffold project with next.js, tailwind, shadcn, query, theme`.

---

### **Phase 2 — Foundation: Types, Enums, API Client, Auth Store**
**Goal:** One source of truth for backend contracts.

1. `lib/enums.ts` — delivery statuses, payment method/status, roles, notification types.
2. `lib/types.ts` — TS interfaces for every response you'll consume:
   - `ApiResponse<T>`, `PaginatedResponse<T>`
   - `User`, `AuthResponse`, `Delivery`, `Address`, `Payment`, `Notification`, `HistoryEntry`, `DashboardStats`, etc.
3. `lib/api-client.ts`:
   - Axios instance with `baseURL`, JSON headers
   - Request interceptor: attach `Authorization: Bearer <accessToken>` from store
   - Response interceptor:
     - On 401 → call `/auth/refresh-token` once → retry original request
     - If refresh fails → logout + redirect to `/login`
     - Normalize errors → throw typed `ApiError`
4. `store/auth-store.ts` (zustand + persist):
   - `user`, `accessToken`, `refreshToken`, `isAuthenticated`, `role`
   - actions: `login`, `logout`, `setTokens`, `setUser`
   - **Note:** Store tokens in memory + `localStorage` (simplest for learner). Mention httpOnly cookie as a future improvement.
5. `hooks/useAuth.ts` — convenience wrapper.

**Deliverable:** Can call `/auth/login`, store tokens, call `/auth/me`. Commit: `feat: api client with auth interceptors and zustand auth store`.

---

### **Phase 3 — Auth Flow + Middleware + Role Guard**
**Goal:** Login, register, protected routes.

1. `/login` page (client):
   - React Hook Form + Zod (email, password 8–100)
   - Main login card
   - Divider "OR"
   - **Quick Demo Login** section:
     - 3 buttons: 👨‍💼 Admin, 👤 Customer, 🛠️ Agent
     - Each calls `/auth/login` with hardcoded demo creds → redirects to role dashboard
   - Show loading, toasts on error (401/403)
2. `/register` page: name (2–50), email, password (8–100), phone (10–15). After success → toast + redirect to `/login` (backend doesn't auto-login).
3. `middleware.ts`:
   - Read token from cookie (mirror it there on login) or use a lightweight cookie set alongside localStorage
   - Protect `/dashboard/*` (CUSTOMER), `/provider/*` (AGENT), `/admin/*` (ADMIN)
   - Redirect unauthenticated → `/login?next=...`
   - Redirect wrong role → their own dashboard
4. `RoleGuard` client component for UI-level hiding (sidebar items, action buttons).

**Deliverable:** Full auth working, demo login works for all 3 roles. Commit: `feat: auth pages, demo login buttons, role-based middleware`.

---

### **Phase 4 — Public Pages (5 pages)**
**Goal:** SEO-friendly Server Components.

1. `/` Home — hero, how it works, CTA, tracking input (redirects to `/track/[id]`)
2. `/about` — mission, team, values
3. `/services` — parcel types, pricing tiers, coverage
4. `/contact` — contact form (RHF+Zod), map placeholder (real embed), office info
5. `/pricing` — table of charges, FAQ accordion
6. `/track` — **public tracking** page using `GET /deliveries/track/{trackingId}` (no auth) — big value-add
7. Shared `Navbar` (with ThemeToggle, Login/Register or Dashboard link), `Footer`
8. Metadata for each (`export const metadata`), Open Graph tags

**Deliverable:** All public pages responsive + dark mode. Commit: `feat: public pages with metadata and tracking`.

---

### **Phase 5 — Customer Dashboard (3–4 pages)**
**Goal:** Customer flow end-to-end.

1. `/dashboard` — My Deliveries list
   - **URL state sync**: `?page=1&limit=10&status=IN_TRANSIT&trackingId=...&dateFrom=&dateTo=` via `useSearchParams` + `router.replace`
   - Reusable `<DataTable />`, `<Pagination />`, `<StatusBadge />`, `<EmptyState />`
   - Skeleton via `loading.tsx`
2. `/dashboard/deliveries/new` — **multi-step wizard** (mandatory complex workflow):
   - Step 1: Pickup address
   - Step 2: Delivery address
   - Step 3: Parcel details (type, weight, charge, COD)
   - Step 4: Payment method (STRIPE / COD)
   - Step 5: Review & submit → `POST /deliveries`
   - Use RHF + Zod per step, Zustand for wizard state, progress indicator
3. `/dashboard/deliveries/[id]` — details + history + cancel button (only if PENDING/ASSIGNED)
4. `/dashboard/payments` — payment history + Stripe payment action
   - "Pay Now" → `POST /payments/create-intent` → Stripe Elements → confirm
   - Poll `GET /payments/{deliveryId}` after success
5. `/dashboard/notifications` — list + mark read + unread count badge
6. `/dashboard/profile` — `PATCH /users/me`, `PATCH /auth/change-password`

**Deliverable:** Full customer flow. Commits per page: `feat: customer dashboard list with url state`, `feat: delivery creation wizard`, etc.

---

### **Phase 6 — Agent (Provider) Dashboard (3 pages)**
1. `/provider` — Assigned deliveries list (paginated, filter by status)
2. `/provider/deliveries/[id]` — details + status update buttons
   - Allowed: ASSIGNED→PICKED_UP→IN_TRANSIT→OUT_FOR_DELIVERY→DELIVERED/FAILED
   - `PATCH /agent/deliveries/{id}/status`
   - COD: show "Mark COD Paid" button after DELIVERED → `PATCH /payments/{deliveryId}/cod-paid`
3. `/provider/earnings` — Recharts: deliveries by status, success rate, count cards
4. `/provider/profile` — `GET /agent/me` + edit profile

**Deliverable:** Agent flow working. Commit: `feat: agent dashboard with status workflow and earnings charts`.

---

### **Phase 7 — Admin Dashboard (3–4 pages)**
1. `/admin` — Overview
   - StatCards: totals, revenue
   - Recharts: deliveries by status (bar), payments by method (pie), recent activity (line)
   - `GET /admin/dashboard`
2. `/admin/deliveries` — Search & filter table
   - URL state: page, limit, status, trackingId, customerId, agentId, dateFrom, dateTo
   - Actions: view, assign agent, reassign, cancel
   - Assign modal: fetch agents via `GET /admin/users?role=AGENT`
3. `/admin/users` — Table with role filter (note: `isActive=false` is buggy — don't rely on it)
   - Actions: activate/deactivate, change role (with confirm dialog)
4. `/admin/agents/[id]` — Agent profile + statistics
5. `/admin/reports` — Export CSV (client-side), audit-ish view, settings

**Deliverable:** Admin full control. Commit: `feat: admin dashboard with charts and delivery management`.

---

### **Phase 8 — Payments (Stripe) Integration**
**Goal:** Mandatory real payment flow.

1. `@stripe/react-stripe-js` + `@stripe/stripe-js`
2. `<StripePaymentForm />` — Elements with `clientSecret`
3. `/payment/success` — confirm, poll payment status, toast, link to delivery
4. `/payment/cancel` — message + retry link
5. Handle Stripe.js errors gracefully with Sonner toasts
6. **Never** touch `STRIPE_SECRET_KEY` on frontend.

**Deliverable:** Test card `4242 4242 4242 4242` works end-to-end. Commit: `feat: stripe payment flow with success/cancel pages`.

---

### **Phase 9 — Shared Utilities & Polish**
1. `not-found.tsx` (custom 404 with illustration)
2. `error.tsx` (global error boundary)
3. `loading.tsx` for every data-fetching route (skeletons, not spinners)
4. `EmptyState` component reused everywhere
5. `useDebounce`, `usePagination`, `useSearchParamsSync` hooks
6. Accessibility pass: focus rings, ARIA labels, keyboard nav in modals
7. Responsive audit: mobile → tablet → desktop
8. Metadata pass on all pages

**Deliverable:** No blank screens, no console errors. Commit: `feat: error boundaries, empty states, skeletons, a11y pass`.

---

### **Phase 10 — State, Performance, and Testing**
1. TanStack Query tuning: `staleTime`, `cacheTime`, invalidation after mutations
2. Prefetch on hover for detail pages
3. `next/image` for all images
4. Check no `any` in TS; run `tsc --noEmit`
5. Manual test matrix: 3 roles × main flows
6. Test refresh-token flow (shorten access token locally if possible)

**Deliverable:** Stable app. Commit: `perf: query caching, prefetching, image optimization`.

---

### **Phase 11 — Deployment**
1. Push to GitHub, connect to **Vercel**
2. Env vars in Vercel:
   - `NEXT_PUBLIC_API_URL=https://your-delivery.onrender.com/api/v1`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`
3. Ask backend owner to add your Vercel domain to `CORS_ORIGINS` and restart backend
4. Verify:
   - Demo login works on live URL
   - Stripe test payment works on live URL
   - `/api/health` reachable from browser (CORS check)
5. Add custom domain (optional)

**Deliverable:** Live URL. Commit: `chore: deployment config and env docs`.

---

### **Phase 12 — Submission Deliverables**
1. **README.md**:
   - Live URL, GitHub URL
   - Demo credentials for all 3 roles
   - Tech stack, features, route map
   - Env var setup
   - Known backend quirks (from the guide)
2. **20+ meaningful commits** — plan them per phase above (you'll exceed 20 naturally).
3. **5–10 min video**:
   - Walk through public pages
   - Demo login for each role
   - Customer: create delivery → Stripe pay → track
   - Agent: update status → mark COD paid
   - Admin: assign agent → dashboard charts
   - Show dark mode + mobile view
4. Submit.

---

## 📄 Page Count Check (Target ≥ 18)

| # | Route | Type |
|---|---|---|
| 1 | `/` | Public |
| 2 | `/about` | Public |
| 3 | `/services` | Public |
| 4 | `/contact` | Public |
| 5 | `/pricing` | Public |
| 6 | `/track` + `/track/[trackingId]` | Public |
| 7 | `/login` | Auth |
| 8 | `/register` | Auth |
| 9 | `/dashboard` | Customer |
| 10 | `/dashboard/deliveries/new` | Customer (wizard) |
| 11 | `/dashboard/deliveries/[id]` | Customer |
| 12 | `/dashboard/payments` | Customer |
| 13 | `/dashboard/notifications` | Customer |
| 14 | `/dashboard/profile` | Customer |
| 15 | `/provider` | Agent |
| 16 | `/provider/deliveries/[id]` | Agent |
| 17 | `/provider/earnings` | Agent |
| 18 | `/provider/profile` | Agent |
| 19 | `/admin` | Admin |
| 20 | `/admin/deliveries` | Admin |
| 21 | `/admin/users` | Admin |
| 22 | `/admin/agents/[id]` | Admin |
| 23 | `/admin/reports` | Admin |
| 24 | `/payment/success` | Payment |
| 25 | `/payment/cancel` | Payment |
| 26 | `not-found.tsx` | Utility |
| 27 | `error.tsx` | Utility |

✅ Well over 18.

---

## 🔑 Key Reminders (Backend Quirks to Design Around)

- Registration does **not** return tokens → always redirect to login.
- `PATCH /auth/change-password` doesn't enforce schema → validate on frontend.
- COD payments: agent marks paid **after** DELIVERED. On frontend, hide the button otherwise.
- `GET /users` is public & unpaginated → **don't** use as a directory.
- `isActive=false` filter on `/admin/users` is broken → avoid or note it.
- Admin cancel note limit (500 chars) not enforced backend-side → enforce on frontend.
- Stripe webhook is authoritative → poll payment status after UI confirms.
- Decimals come as **strings** in JSON → parse with care (e.g., `parseFloat` for display only).
- No WebSocket/SSE for notifications → poll `unread-count` every 30–60s.

---

## ▶️ Next Step (when you're ready)

Tell me which phase to start, and I'll walk you through it **step by step** — file by file, command by command, with explanations. I recommend starting with **Phase 0 → Phase 1**, and I'll hold your hand through the scaffolding.

Ready when you are. 🚀