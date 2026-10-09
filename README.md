# Your Delivery — Frontend

A production-ready customer, agent, and administrator dashboard for a parcel
delivery platform, built with Next.js 15 App Router, TypeScript, Tailwind CSS,
shadcn/ui, TanStack Query, Zustand, React Hook Form, Zod, Recharts, and Stripe.

**Live demo:** [your-vercel-url] (deploy in progress)

---

## Tech Stack

| Category             | Technology                                     |
| -------------------- | ---------------------------------------------- |
| Framework            | Next.js 15 (App Router) + TypeScript           |
| Styling              | Tailwind CSS v4 + shadcn/ui (Radix primitives) |
| Server state         | TanStack Query                                 |
| Client state         | Zustand (with persist)                         |
| Forms                | React Hook Form + Zod                          |
| Payments             | Stripe Elements (test mode)                    |
| Charts               | Recharts                                       |
| Notifications/toasts | Sonner                                         |
| Icons                | Lucide React                                   |
| Dates                | date-fns                                       |
| Deployment           | Vercel                                         |

---

## Features

### Three roles, each with a distinct dashboard

- **Customer** — book deliveries via a 5-step wizard, track status, pay online,
  manage notifications and profile
- **Agent** — view assigned deliveries, advance status through the delivery
  lifecycle, mark COD payments received, view earnings analytics
- **Admin** — full delivery management, assign/reassign agents, manage users
  and roles, view dashboard analytics and CSV reports

### Notable implementation details

- **Role-based routing** enforced at the edge via `middleware.ts` (cookie-based)
- **URL-synced filters** — every list page reflects `page`, `limit`, `status`,
  `trackingId`, `dateFrom`, `dateTo` in the query string (bookmarkable)
- **Secure demo login** — one-click buttons call a server-side route
  (`/api/demo-login`) that reads credentials from server-only env vars;
  passwords never reach the browser bundle
- **Real Stripe integration** — server-side PaymentIntent creation,
  Stripe Elements on the pay page, success/cancel flows, and status polling
  until the backend webhook confirms payment
- **Public tracking** — a no-auth tracking page with a live timeline,
  server-rendered with `revalidate: 30`
- **Custom 404** and **global error boundary**
- **Accessibility** — skip-link, focus rings, aria-labels on icon-only buttons,
  semantic HTML throughout

---

## Pages

### Public

| Route         | Description                            |
| ------------- | -------------------------------------- |
| `/`           | Landing page with tracking input       |
| `/about`      | Mission, values, timeline, team        |
| `/services`   | Service catalog + coverage table       |
| `/pricing`    | Plans + FAQ accordion                  |
| `/contact`    | Contact form (validated) + office info |
| `/track`      | Public tracking lookup                 |
| `/track/[id]` | Public tracking detail (no auth)       |

### Auth

| Route       | Description                       |
| ----------- | --------------------------------- |
| `/login`    | Login with one-click demo buttons |
| `/register` | Customer registration             |

### Customer

| Route                          | Description                             |
| ------------------------------ | --------------------------------------- |
| `/dashboard`                   | Overview with stats + recent deliveries |
| `/dashboard/deliveries`        | Filterable list with URL-synced state   |
| `/dashboard/deliveries/new`    | 5-step delivery creation wizard         |
| `/dashboard/deliveries/[id]`   | Detail with cancel + pay actions        |
| `/dashboard/notifications`     | Notification inbox                      |
| `/dashboard/profile`           | Edit profile + change password          |
| `/dashboard/payments/pay/[id]` | Stripe payment page                     |
| `/payment/success`             | Post-payment receipt (polls until PAID) |
| `/payment/cancel`              | Payment cancel/retry                    |

### Agent

| Route                       | Description                                 |
| --------------------------- | ------------------------------------------- |
| `/provider`                 | Overview with statistics + status breakdown |
| `/provider/deliveries`      | Assigned deliveries list                    |
| `/provider/deliveries/[id]` | Detail with status workflow + COD mark-paid |
| `/provider/earnings`        | Recharts analytics (area, bar, donut)       |
| `/provider/notifications`   | Notification inbox                          |
| `/provider/profile`         | Profile settings                            |

### Admin

| Route                    | Description                             |
| ------------------------ | --------------------------------------- |
| `/admin`                 | Dashboard with charts + recent activity |
| `/admin/deliveries`      | Full list with 7 filters                |
| `/admin/deliveries/[id]` | Detail with assign/reassign/cancel      |
| `/admin/users`           | User management with role filter        |
| `/admin/agents/[id]`     | Agent performance view                  |
| `/admin/notifications`   | Notification inbox                      |
| `/admin/reports`         | Date range reports + CSV export         |

---

## Local Development

### Prerequisites

- Node.js 20+
- Backend API running (see backend project)

### Setup

```bash
git clone [your-github-repo-url]
cd your-delivery-frontend
npm install
cp .env.example .env.local
# fill in .env.local (see below)
npm run dev
```
