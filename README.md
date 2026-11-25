# SAHARA — Mental Health & Community Support Platform

A modern, empathetic, and full-stack web application designed to provide confidential mental health support, anonymous community discussions, professional counselling bookings, emergency crisis helplines, and a dedicated staff/admin management portal.

---

## 🌟 Key Features

- **🤝 Anonymous Peer Community Forum:**
  - Create and participate in topic-based mental health discussions.
  - Categorized by tags: General, Anxiety, Depression, Student Life, Relationships, and Recovery.
  - Threaded replies, real-time upvoting/downvoting, and active moderation.
  
- **📅 3-Step Confidential Counselling Booking:**
  - Step 1: Select counselling domain (Anxiety, Depression, Academic Stress, Relationship, Trauma).
  - Step 2: Choose preferred date and available time slot.
  - Step 3: Choose session format (Encrypted Video Call, Voice Call, or Confidential Live Chat) and provide optional notes.

- **🚨 24/7 Crisis Helplines & Resources:**
  - Instant one-tap access to national verified emergency support helplines in India:
    - **Tele-MANAS:** `14416` (Government of India 24/7 Mental Health Helpline)
    - **NCW Helpline:** `7827170170` (National Commission for Women Crisis Support)
    - **Vandrevala Foundation:** `9999 666 555` (24/7 Free Mental Health Support)
    - **KIRAN Helpline:** `1800-599-0019` (Ministry of Social Justice & Empowerment)

- **🛡️ Role-Based Staff & Admin Portal (`/admin`):**
  - Restricted access for `admin`, `counsellor`, and `community_worker` roles.
  - Manage and update counselling booking statuses (`confirmed`, `completed`, `cancelled`).
  - Moderate community posts and view user accounts.

- **🔒 Custom Authentication & Route Protection:**
  - Secure session-cookie authentication using salted SHA-256 password hashing.
  - Protected routes powered by Next.js 16's `proxy.ts` convention to ensure privacy.

- **⚡ Zero-Dependency Native SQLite Database:**
  - Uses Node.js native `node:sqlite` — requires no external database drivers or paid cloud database clusters.
  - Automatic fallback to `/tmp/app.db` when deployed in serverless environments (e.g. Vercel).

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Route Handlers, Turbopack)
- **Frontend:** [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/), Motion
- **Database:** Node.js native `node:sqlite` (`src/lib/db.ts`)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 📁 Project Structure

```text
├── data/                    # Local SQLite database storage (app.db)
├── public/                  # Public static assets
├── src/
│   ├── app/
│   │   ├── (frontend)/      # Application pages (Next.js App Router)
│   │   │   ├── page.tsx     # Landing / Home page
│   │   │   ├── about/       # Mission, team, and approach
│   │   │   ├── admin/       # Staff & Administrator portal
│   │   │   ├── community/   # Peer discussion forum
│   │   │   ├── login/       # Authentication (Sign In & Sign Up)
│   │   │   ├── resources/   # Crisis helplines and self-help articles
│   │   │   └── support/     # Counselling appointment booking flow
│   │   └── api/             # REST API endpoints
│   │       ├── bookings/    # Fetch and schedule appointments
│   │       └── posts/       # Forum posts, replies, and voting
│   ├── components/          # Reusable UI components
│   ├── lib/
│   │   ├── auth.ts          # Session management & SHA-256 hashing
│   │   ├── db.ts            # Native SQLite setup, tables & seed data
│   │   └── types.ts         # TypeScript models and interfaces
│   └── proxy.ts             # Route protection & request interception
├── package.json
└── vercel.json              # Vercel deployment configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v22.x or higher (recommended for native `node:sqlite` support)
- **Package Manager:** `pnpm` (or `npm`)

### 1. Clone the Repository

```bash
git clone https://github.com/DeepakLakinana/fsdproject.git
cd fsdproject
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Start the Development Server

```bash
pnpm run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
pnpm run build
# or
npm run build
```

---

## 🔑 Demo & Test Accounts

The local database auto-seeds with pre-configured accounts for testing different roles:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@sahara.org` | `admin123` | Full administrative control & `/admin` dashboard |
| **Counsellor** | `counsellor@sahara.org` | `counsellor123` | Manages appointments & access to `/admin` |
| **Community Worker** | `worker@sahara.org` | `worker123` | Community moderation & access to `/admin` |
| **General Member** | `member@sahara.org` | `member123` | Standard community and booking access |

*(You can also create a new account using the Sign Up form on the `/login` page).*

---

## 🌐 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/posts` | List discussion posts (filters: `category`, `sort`) |
| `POST` | `/api/posts` | Create a new community post |
| `GET` | `/api/posts/[id]/replies` | Fetch thread replies for a post |
| `POST` | `/api/posts/[id]/replies` | Add a reply to a post |
| `POST` | `/api/posts/[id]/vote` | Cast an upvote or downvote |
| `GET` | `/api/bookings` | Fetch user appointments (or all for staff) |
| `POST` | `/api/bookings` | Book a counselling session |

---

## ⚠️ Important Disclaimer

SAHARA is a digital support platform designed for peer connection, resources, and appointment coordination. It is **not** a replacement for emergency psychiatric intervention or urgent medical care. In a critical life-threatening situation, please contact local emergency services or the designated 24/7 crisis numbers provided on the platform.

---

## 📄 License

This project is created for educational and community support purposes.
