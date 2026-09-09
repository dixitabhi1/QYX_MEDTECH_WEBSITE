# Qyx Medtech — Website Platform

Official website and specialist onboarding platform for **Qyx Medtech** — a clinical consultancy platform for male reproductive healthcare.

## 🚀 Overview

Qyx Medtech launches doctor-first (Phase 1), connecting verified male fertility specialists (andrologists and urologists) directly with patients for private video consultations.

### Key Features
- **Doctor-First Experience:** High-converting application flow for reproductive specialists with zero administrative overhead.
- **Regulatory Alignment:** Strict adherence to data privacy protocols (Working toward ISO 27001, HIPAA-aligned, and DPDP-compliant architecture).
- **Dual-Track How-It-Works:** Step-by-step interactive paths for both doctors and patients, featuring a 6-step photographic storyboard.
- **Global AI Concierge:** Rule-based virtual concierge guiding visitors to specialist booking with clinical safety redirects.
- **Multi-View Lead Capture:** Persona-tailored lead generation modal with 60-day suppression.

## 📁 Project Structure

```
├── index.html            # Homepage (Doctor-first framing, stats, factors, CTAs)
├── for-doctors.html      # Specialist onboarding & application portal
├── how-it-works.html     # Dual-track journey & 6-step photographic storyboard
├── about.html            # Mission, male-factor clinical wedge & governance
├── contact.html          # Routing for Doctors, Patients, and Partnerships
├── vercel.json           # Vercel deployment configuration & security headers
├── css/
│   ├── variables.css     # Design tokens (Teal #123C3C, Coral #E2694B, Sand #F6F3EC)
│   ├── base.css          # Reset, typography, 12-column grid
│   ├── components.css    # Cards, buttons, tabs, comparison table, accordions
│   └── chatbot.css       # Concierge dock & chat drawer styles
├── js/
│   ├── app.js            # Sticky nav, mobile drawer, accessible accordions, form handling
│   ├── chatbot.js        # AI Concierge conversation tree & medical safety guardrails
│   └── popup.js          # Multi-view 3-screen lead popup
└── assets/               # Photographic assets & branding
```

## 🛠️ Local Development

Serve locally using any static file server:

```bash
# Using Python
python -m http.server 3000

# Using Node.js
npx serve .
```

Then visit `http://localhost:3000`.

## 🌐 Deployment on Vercel

This repository is pre-configured with `vercel.json` for zero-config Vercel deployment:
1. Connect this GitHub repository to [Vercel](https://vercel.com).
2. Root Directory: `./`
3. Framework Preset: `Other`
4. Click **Deploy**.
