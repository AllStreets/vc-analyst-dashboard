# VC Analyst Dashboard

An AI-powered dashboard for evaluating early-stage startups across competitive intelligence, market sizing, and founder evaluation.

## Features

- Single-search interface for startup analysis
- 4 comprehensive analysis cards (Competitive, Market, Founder, Investment Thesis)
- Professional data visualizations with Recharts
- Dark premium aesthetic with emerald/gold/purple colors
- Interactive hover/expand features
- Error handling and confidence indicators

## Tech Stack

- **Frontend:** React 18, Tailwind CSS, Recharts, Vite
- **Backend:** Node.js, Express, OpenAI API
- **Deployment:** Vercel (frontend), Railway (backend)

## Getting Started

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Add your OPENAI_API_KEY to .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173

## Deployment

Frontend: Deploy to Vercel
Backend: Deploy to Railway
