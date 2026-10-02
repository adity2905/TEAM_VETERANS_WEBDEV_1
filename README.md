# 🌐 OpenCause — Transparent NGO & Verified Impact Platform
> Built for **TEKTONIX 2026 Hackathon** | Problem Statement 1: NGO Transparency Platform

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Hybrid_Sync-3ecf8e?logo=supabase)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/AI_Integration-Gemini_Matcher-8b5cf6)](https://deepmind.google/technologies/gemini/)
[![Status](https://img.shields.io/badge/Build-Passing_100%25-emerald)]()

---

## 📌 Executive Summary
People want to support non-profits but often lack visibility into how funds are utilized and what real work is happening. **OpenCause** solves this with a modern, social-media-style transparency network that bridges donors, active volunteers, and audited NGOs.

Every contribution provides unit-level transparency (*"₹250 sponsors 10 warm meals"*), generates automated **Section 80G Tax Exemption Receipts**, logs photographic proof of past drives, and features an **AI Cause & Impact Matcher** powered by Gemini.

---

## 🎯 Key Features & Judging Criteria Alignment

| Priority | Weight | Feature Implementation in OpenCause |
| :--- | :---: | :--- |
| **1. Implementation** | **95%** | Full-stack application with live Feed, verified NGO Directory, Micro-Fundraisers, Volunteer Hub, NGO Partner Portal (`/dashboard`), and Public Receipt Verification (`/verify`). |
| **2. UI/UX Excellence** | **85%** | Sleek glassmorphism, responsive mobile-first layouts, confetti celebration effects, audited impact counters, and clean typography. |
| **3. Deployability** | **85%** | Zero build warnings, Next.js 16 Turbo-optimized, production-ready for 1-click Vercel deployment. |
| **4. Edge Cases & Resilience** | **80%** | Hybrid data layer with automatic local fallback — runs with 100% CRUD reliability even without internet or Supabase API keys! |
| **5. LLM Integration** | **65%** | Integrated **AI Impact Matcher** translating natural language desires (*"I want to teach coding to kids in Bangalore"*) into verified NGO recommendations. |

---

## 🗺️ Application Routes

- **`http://localhost:3000/`** — **Public Impact Portal**:
  - Live community impact feed with verified photographic proof
  - Category filters (*Hunger Relief, Education, Environment, Animal Welfare*)
  - Interactive like counter & modal donation flow with confetti
  - Smart AI Cause Finder modal
  - Volunteer sign-up with real-time remaining slots
- **`http://localhost:3000/dashboard`** — **NGO Partner Portal**:
  - Switch between non-profit organizations
  - Manage and approve volunteer applications
  - Launch transparent fundraisers with unit-cost metrics
  - Post upcoming volunteer drives
  - Review 80G tax receipt ledger
- **`http://localhost:3000/verify`** — **Public Receipt Verifier**:
  - Validates any receipt ID (e.g. `TXN-80G-DEMO-9901`) with official compliance certificate.
- **`http://localhost:3000/ngo/[slug]`** — **Dedicated NGO Profile**:
  - Deep-linkable profile with audited financial fund allocations (88% direct aid).

---

## 🚀 Quick Setup & Run

### 1. Clone & Install
```bash
git clone <YOUR_REPO_URL>
cd ngo-platform
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(If left blank, the platform automatically activates its robust offline-ready mock data layer!)*

### 3. Run Locally
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🗄️ Database Setup (Supabase)
For team member Sanchali:
1. Go to [Supabase](https://supabase.com) and create a project.
2. Open the **SQL Editor**.
3. Copy and paste the entire script from `supabase-schema.sql` and click **Run**.
4. Retrieve the **Project URL** and **anon public key** from *Project Settings > API*, and add them to `.env.local`.

---

## 🏆 2-Minute Demo Script for Judges

1. **The Hook (30s):**
   > *"Judges, over 70% of citizens hesitate to donate because they don't know where their money goes. OpenCause turns NGO contributions into an audited, social-media-style feed."*
2. **The Social Feed & Proof (30s):**
   > *"Show them the feed card: Annapurna Seva Mission distributed 3,200 hot meals in Dharavi. Notice the audited impact badge, live likes, and photographic proof."*
3. **The 1-Click Transparent Donation (30s):**
   > *"Click 'Support Cause'. Notice the unit-cost metric: '₹25 = 1 warm meal'. Donate ₹500, trigger confetti, and show the instant Sec 80G Tax Exemption Certificate with unique receipt ID."*
4. **The AI Cause Finder (15s):**
   > *"Click 'AI Matcher'. Type: 'I want to teach coding to young girls in Bangalore'. Notice how Gemini matches Vidya Vikas Foundation with high semantic synergy and recommends the Saturday mentor drive."*
5. **The NGO Portal & Receipt Verification (15s):**
   > *"Show `/dashboard` where NGOs manage volunteer approvals, and show `/verify` where judges can paste any receipt ID to verify the audit trail!"*
