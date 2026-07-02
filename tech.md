# tech.md

# Vijeta - Technical Stack

Version: 1.0

---

# Frontend

Framework

- Next.js (App Router)

UI

- shadcn/ui
- Tailwind CSS

Animations

- Framer Motion

Icons

- Lucide React

Purpose

Build a fast, responsive and modern SaaS experience.

---

# Backend

Framework

- Python
- FastAPI (REST API)

Responsibilities

- Authentication
- Business Logic
- Opportunity Management
- Team Management
- AI Integration
- Showcase APIs

---

# AI

Model

- Google Gemini

Responsibilities

- AI Assistant
- Opportunity Guidance
- Project Roadmaps
- Resume & SOP Review
- Knowledge Extraction
- AI Search

---

# Database

Primary

- Neon PostgreSQL

Stores

- Users
- Opportunities
- Teams
- Projects
- Showcases
- AI Metadata

---

# Authentication

- Better Auth

Purpose

- Secure Authentication
- Session Management

---

# File Storage

- Cloudinary (Media)
- Local Storage (Development)

Stores

- Project Images
- PPTs
- Documents
- Showcase Assets

---

# API Communication

Architecture

Frontend ↔ REST API ↔ Database / AI

Communication

- JSON over HTTPS

---

# Deployment

Frontend

- Vercel

Backend

- Railway / Render

Database

- Neon PostgreSQL

---

# Project Structure

frontend/
├── app/
├── components/
├── lib/
├── hooks/
└── types/

backend/
├── app/
├── api/
├── services/
├── models/
├── schemas/
└── utils/

---

# Design Principles

- Keep the architecture simple.
- Build API-first.
- Mobile-first responsive UI.
- AI should assist, not replace users.
- Prefer maintainability over complexity.
- Ship fast and iterate.

---

# Future Integrations

- GitHub
- Google Calendar
- Discord
- Email Notifications
- Vector Database (if AI knowledge base grows)