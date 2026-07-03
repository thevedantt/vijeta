<p align="center">
  <img src="frontend/public/banner.png" alt="Vijeta Banner" width="100%" />
</p>

<h1 align="center">"..विजेता.."</h1>
<h3 align="center">The Operating System for Ambitious Students</h3>

<p align="center">
  <strong>विजेता</strong> — One who conquers. One who wins.
</p>

<p align="center">
  <a href="https://vijeta.vercel.app">🌐 Live Demo</a> •
  <a href="#-the-problem">Problem</a> •
  <a href="#-solution">Solution</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Get Started</a>
</p>

<p align="center">
  <i>Every year thousands of talented students never participate in scholarships, hackathons, and competitions — not because they lack ability, but because they don't know where to start, can't find teammates, or don't have proper guidance.</i>
</p>

<p align="center">
  <b>Vijeta removes every barrier between "I want to participate" and "I became a winner."</b>
</p>

---

## 📋 Table of Contents

- [The Problem](#-the-problem)
- [Solution](#-solution)
- [How It Works](#-how-it-works)
- [Features](#-features)
- [Why Vijeta?](#-why-vijeta)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Use Cases](#-use-cases)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Roadmap](#%EF%B8%8F-roadmap)
- [Contributing](#-contributing)

---

## 🔥 The Problem

Today, Indian students face five critical barriers that prevent them from reaching their full potential:

### 1. 🔍 Discovery is Broken
Relevant opportunities — hackathons, scholarships, competitions, fellowships — are scattered across dozens of websites, WhatsApp groups, and Instagram posts. Students miss deadlines simply because they never knew the opportunity existed.

### 2. 👥 Team Formation is a Wall
Most students skip competitions not because they lack skill, but because they cannot find teammates. There is no platform to discover peers with complementary skills who are looking for a team.

### 3. 📚 Guidance is Invisible
Even after finding an opportunity, students don't know where to begin — what previous winners built, how judging works, what resources are useful. The hard-earned knowledge of past winners evaporates after every competition.

### 4. 🚪 Participation Feels Exclusive
Students believe "I don't know coding, so I can't participate." But competitions need designers, researchers, presenters, writers, marketers, video editors, and product managers. This misunderstanding locks out thousands of talented students.

### 5. 🗑️ Knowledge Loss Every Cycle
Every winning project disappears after the competition ends. Future students start from absolute zero. The same mistakes are repeated. The same lessons are re-learned. Year after year.

---

## 💡 Solution

Vijeta creates **one continuous journey** that transforms a curious student into a published winner, and then into a mentor who guides the next generation.

```
              ┌─────────────────────────────────────┐
              │                                     │
              ▼                                     │
    ┌─────────────┐    ┌─────────┐    ┌─────────┐  │
    │  DISCOVER   │───▶│ TEAM UP │───▶│  LEARN  │  │
    └─────────────┘    └─────────┘    └─────────┘  │
                                              │    │
    ┌─────────────┐    ┌─────────┐    ┌─────────┘  │
    │   MENTOR    │◀───│ PUBLISH │◀───│  BUILD   │  │
    └─────────────┘    └─────────┘    └─────────┘  │
         │                                          │
         └──────────────────────────────────────────┘
                     COMPETE & WIN
```

This isn't just a platform. It's a **self-sustaining ecosystem of excellence** where every winner automatically produces the resources that create the next generation of winners.

---

## 🎯 How It Works

### The Pillars

| Pillar | What It Does |
|---|---|
| **Discover** | A unified feed of hackathons, scholarships, competitions, fellowships, internships, and research — with smart filters, location-based search, and an interactive geographic map |
| **Team Up** | Find teammates by skills, college, city, and availability. Create open teams with defined roles. Apply or invite. Built-in friend network |
| **Guidance** | AI-powered mentorship through **Margdarshak** — a context-aware assistant that knows your profile, your stats, and the opportunity landscape. Slash commands like `/findhackathon`, `/mystats`, `/findteam` give instant answers |
| **Build** | Real-time chat via Firebase for seamless team communication. Activity feed keeps everyone in sync |
| **Showcase** | Publish winning projects with GitHub repos, live demos, and PPT decks. Every showcase becomes a learning resource for future students |
| **Knowledge Loop** | Winners automatically become mentors. Their projects, insights, and paths are preserved. The next batch never starts from zero |

---

## ✨ Features

### 🧠 AI-Powered Everything

- **Margdarshak (मार्गदर्शक)** — The AI guide that knows your skills, your deadlines, your teams, and the entire opportunity database. Ask it anything.
- **3 Modes**: Default (OpenRouter GPT), Mentor (Google Gemini — warm, concise, Hindi-friendly), and Debate (both AIs side-by-side for comparison)
- **Slash Commands**: `/mystats`, `/findhackathon`, `/findteam`, `/suggest`, `/summarize`, `/compare`, `/recentactivity`

### 🗺️ Discover Opportunities

- Unified feed across 6 opportunity types: Hackathons, Scholarships, Competitions, Fellowships, Internships, Research
- Filter by difficulty, type, location, remote/in-person, and tags
- Interactive MapLibre GL map showing opportunities geographically
- Bookmark and track deadlines with calendar popup

### 👥 Smart Team Formation

- Browse open teams or find individual members by skills and location
- 19 distinct team roles: AI/ML Engineer, Frontend, Backend, Full Stack, UI/UX, Designer, Researcher, Presenter, Writer, Video Editor, Marketing, Project Manager, etc.
- Role-based applications and invites
- Friend network with request/accept/reject flow

### 🏆 Winner Showcase

- Permanent gallery of winning projects with metadata, tech stacks, team details
- Search by year, college, tags, or category
- GitHub, live demo, and presentation links
- Like and engage with winning projects

### 📊 Personalized Dashboard

- Stats: saved opportunities, active teams, wins, profile views
- Upcoming deadlines with calendar view
- Active teams snapshot
- AI-powered opportunity recommendations
- Friend activity and notifications

### 💬 Real-time Communication

- Firebase Firestore-powered direct messaging
- Conversation list with unread counts and timestamps
- Cross-platform — works seamlessly across devices

---

## 🏅 Why Vijeta?

| | Traditional Approach | Vijeta |
|---|---|---|
| **Discovery** | Scattered across websites, groups, DMs | **Unified feed** with smart filters + map |
| **Teammates** | Luck or college WhatsApp groups | **Skill-based matching** with role system |
| **Guidance** | Non-existent after the event ends | **AI mentor** that knows you + previous winners |
| **Knowledge** | Lost after every competition | **Permanent showcase** + mentorship loop |
| **Inclusivity** | "I don't code" = "I can't participate" | **19 roles** — everyone belongs |

---

## ⚙️ Tech Stack

### 🖥️ Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![ShadCN](https://img.shields.io/badge/ShadCN_UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

### ⚙️ Backend

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![SVG Rendering](https://img.shields.io/badge/SVG_Rendering-FFB13B?style=for-the-badge)
![PDF Export](https://img.shields.io/badge/PDF_Export-EC1C24?style=for-the-badge)

### 🗄️ Database

![Neon](https://img.shields.io/badge/Neon_PostgreSQL-00E599?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)

### 🤖 AI Models

![GPT OSS 120B](https://img.shields.io/badge/GPT_OSS_120B-412991?style=for-the-badge)
![Gemini 3.5 Flash](https://img.shields.io/badge/Gemini_3.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![OpenRouter](https://img.shields.io/badge/OpenRouter-000000?style=for-the-badge&logo=openrouter&logoColor=white)

### 🎨 Diagram Engine

![SVG](https://img.shields.io/badge/SVG_Rendering-FFB13B?style=for-the-badge)
![Physics Engine](https://img.shields.io/badge/Physics_Diagram_Engine-7B61FF?style=for-the-badge)
![Blueprint Compiler](https://img.shields.io/badge/Blueprint_Compiler-22C55E?style=for-the-badge)

### 🛠️ Development

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

---

## 🏗️ Architecture

```
Browser
  │
  ├── Next.js App Router (Frontend)
  │     ├── (marketing)/   → Public pages (Landing, Showcase)
  │     ├── (app)/         → Authenticated pages (Dashboard, Discover, Teams, Chat)
  │     ├── api/           → REST API route handlers
  │     └── auth/          → Clerk sign-in / sign-up
  │
  ├── Backend (TypeScript, monolith within Next.js)
  │     ├── db/queries/    → Drizzle ORM query modules (11 modules)
  │     ├── ai/            → AI orchestration (Gemini + OpenRouter)
  │     └── services/      → Business logic (activity tracking, notifications)
  │
  ├── Database Layer
  │     ├── Neon PostgreSQL → Primary database (Drizzle ORM, 16 tables)
  │     └── Firebase Firestore → Real-time chat messaging
  │
  └── External Services
        ├── Clerk           → Authentication & user management
        ├── Google Gemini   → AI mentor mode
        ├── OpenRouter      → AI default mode / debate mode
        └── MapLibre GL     → Geographic opportunity map
```

### Data Model (16 Tables)

```
users ───┬── opportunities ───┬── bookmarks
          │                   └── opportunity_tags
          ├── teams ─────┬───── team_members
          │              ├───── team_applications
          │              └───── team_tags
          ├── showcases ─┬───── showcase_likes
          │              └───── showcase_tags
          ├── friendships
          ├── activities
          ├── notifications
          ├── tags ───────┬── user_tags
          └── mentors
```

---

## 🎬 Use Cases

### 👨‍🎓 For Students

> *"I'm a second-year CS student who wants to participate in SIH but have no team. What do I do?"*

1. Sign up on Vijeta, set your skills (Frontend, UI/UX)
2. Browse open teams looking for a Frontend dev
3. Apply to 3 teams, get accepted by one
4. Use Margdarshak AI to understand SIH problem statements
5. Chat with your team in real-time
6. Win → Publish your project on Showcase
7. Next year: become a mentor for new students

### 🏫 For Colleges

> *"We want our students to know about every opportunity and win consistently."*

Vijeta provides a unified view of student participation, wins, and active teams across your institution. Track your college's standing and celebrate wins publicly.

### 🏢 For Organizers

> *"We run a national hackathon and want maximum participation from quality teams."*

List your opportunity on Vijeta to reach India's most ambitious students — pre-filtered by skills, ready with teams, and backed by a track record of wins.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **PostgreSQL** (Neon account or local instance)
- **Firebase** project (for real-time chat)
- **Clerk** account (for authentication)
- **OpenRouter** API key (for AI features)
- **Google Gemini** API key (for mentor mode)

### Installation

```bash
# Clone the repository
git clone https://github.com/vedanttalekar/vijeta.git
cd vijeta

# Install frontend dependencies
cd frontend
npm install

# Configure environment
cp .env.example .env.local
```

Fill in your `.env.local` with the following:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Publishable Key |
| `CLERK_SECRET_KEY` | Clerk Secret Key |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase project config |
| `GEMINI_API_KEY` | Google Gemini API key |
| `OPENROUTER_API_KEY` | OpenRouter API key |

```bash
# Push the database schema
npm run db:push

# Seed with sample data (25+ students, 15+ opportunities, 8+ teams, 8+ showcases)
npm run db:seed

# Start development
npm run dev
```

Visit `http://localhost:3000` — you're in.

---

## 📁 Project Structure

```
vijeta/
├── frontend/
│   ├── app/
│   │   ├── (marketing)/     # Public landing pages
│   │   ├── (app)/           # Authenticated app pages
│   │   ├── api/             # REST API route handlers
│   │   └── layout.tsx       # Root layout
│   ├── backend/
│   │   ├── ai/              # AI integration (Gemini, OpenRouter)
│   │   ├── db/queries/      # Database query modules
│   │   └── services/        # Business logic services
│   ├── components/
│   │   ├── ui/              # shadcn/ui primitives
│   │   ├── layout/          # Navbar, Sidebar, Footer
│   │   ├── landing/         # Landing page sections
│   │   └── shared/          # Reusable components
│   ├── lib/                 # Utilities & Firebase client
│   ├── src/db/              # Drizzle schema & client
│   ├── public/              # Static assets
│   └── types/               # TypeScript type definitions
├── PRD.md                   # Product Requirements Document
├── DESGIN.md                # Design System
├── flow.md                  # Product Flows
└── tech.md                  # Technical Documentation
```

---

## 📚 Documentation

| Document | Description |
|---|---|
| [PRD.md](PRD.md) | Complete product requirements, vision, problem statement, and MVP scope (616 lines) |
| [DESGIN.md](DESGIN.md) | Full design system — colors, typography, spacing, components, accessibility (867 lines) |
| [flow.md](flow.md) | All product flows — auth, discover, team formation, AI assistant, showcase (574 lines) |
| [tech.md](tech.md) | Technical stack overview and architecture decisions (175 lines) |

---

## 🗺️ Roadmap

### ✅ MVP (Current)
- [x] Opportunity discovery with filters & map
- [x] Team formation with role system
- [x] AI assistant (Margdarshak) with 3 modes
- [x] Real-time chat & messaging
- [x] Winner showcase gallery
- [x] Student profiles & friend network
- [x] Activity feed & notifications
- [x] Personalized dashboard

### 🚧 In Progress
- [ ] Mentorship marketplace — connect winners with newcomers
- [ ] Guided project builder with milestones
- [ ] College leaderboards & inter-college competitions
- [ ] Email/WhatsApp notifications for deadlines

### 🔮 Future
- [ ] Resume builder from your Vijeta activity
- [ ] Interview prep with AI mock panels
- [ ] Sponsor discovery & direct applications
- [ ] Vijeta API for third-party integrations
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Vijeta is an open-source platform built for students, by students. Contributions of all kinds are welcome:

- 🐛 **Found a bug?** Open an issue
- 💡 **Have an idea?** Start a discussion
- 🔧 **Want to contribute?** Fork the repo, create a branch, and submit a PR

---

<p>
  <strong>Vijeta</strong> — विजेता (Victory)
</p>
