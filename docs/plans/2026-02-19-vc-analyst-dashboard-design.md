# VC Analyst Dashboard Design

**Date:** 2026-02-19
**Feature:** Build an impressive dark-mode dashboard for evaluating early-stage startups
**Goal:** Create a professional analyst tool that demonstrates full-stack development, AI integration, and product thinking for VC job application

---

## Overview

The VC Analyst Dashboard is a single-page application that helps investors quickly evaluate early-stage startups across three critical dimensions: competitive intelligence, market sizing, and founder evaluation. By synthesizing these analyses into a cohesive dashboard, it reduces due diligence time from hours to minutes while maintaining analytical rigor.

The tool demonstrates:
- AI prompt engineering (batched analysis in single API call)
- Professional UI/UX design (dark mode, data visualization)
- Full-stack development (React frontend, Node.js backend)
- Product thinking (solving real analyst workflows)

---

## Current State vs. Target State

**Current State:** Nothing (greenfield project)

**Target State:**
- VC Analyst Dashboard MVP deployed and running
- Single-search interface for startup analysis
- Four comprehensive analysis cards (Competitive, Market, Founder, Investment Thesis)
- Professional data visualizations (charts, graphs, network positioning)
- Interactive features (hover effects, expandable details)
- Dark premium aesthetic (emerald/gold/purple color scheme)
- Error handling and fallbacks for incomplete data
- Responsive design (mobile/tablet/desktop)
- GitHub repo with clean commit history

---

## Architecture & Data Model

### Backend Architecture

**API Structure:**
- `POST /api/analyze` - Core analysis endpoint
  - Input: `{ startup: string }`
  - Output: `{ competitive, market, founder, thesis, metadata }`
  - Single OpenAI API call with structured prompt
  - Response includes confidence levels for each section

**Data Cache (optional but recommended):**
- In-memory cache for recent analyses
- Reduces API calls if same startup analyzed twice
- Can use simple object or Redis

**Error Handling:**
- OpenAI timeout/failure → graceful error response
- Ambiguous input → confidence indicators in response
- Missing data → fallback values and "limited data" indicators

### Frontend Architecture

**Component Structure:**
1. **App.jsx** - Main container, state management
2. **SearchBar.jsx** - Input component with suggestions
3. **Dashboard.jsx** - Grid layout for four analysis cards
4. **CompetitiveCard.jsx** - Competitor network + positioning
5. **MarketCard.jsx** - TAM/SAM/SOM + growth charts
6. **FounderCard.jsx** - Team composition + backgrounds
7. **ThesisCard.jsx** - Investment recommendation
8. **Charts.jsx** - Recharts-based visualizations

**Data Flow:**
```
User enters startup name
  ↓
SearchBar validates input
  ↓
Dashboard calls POST /api/analyze
  ↓
Backend synthesizes OpenAI response
  ↓
Frontend renders 4 cards with data visualizations
  ↓
User can hover/expand for deeper insights
```

### Color-Coded Card System

| Card | Primary Color | Secondary | Use |
|------|---------------|-----------|-----|
| Competitive Intelligence | #10b981 (Emerald) | #059669 | Competitor analysis |
| Market Sizing | #f59e0b (Gold/Amber) | #d97706 | Market metrics |
| Founder Evaluation | #7c3aed (Purple) | #6d28d9 | Team assessment |
| Investment Thesis | #4f46e5 (Indigo) | #4338ca | Recommendation |

All cards have:
- 4px left border in section color
- Gradient header background
- Subtle background overlay
- Consistent padding and border radius
- Hover effects (shadow, slight lift)

---

## Visual Design System

**Dark Premium Aesthetic:**
- Background: #0f172a (very dark slate)
- Text primary: #f1f5f9 (off-white)
- Text secondary: #cbd5e1 (light gray)
- Borders: rgba(255,255,255,0.1) or subtle color-matched

**Typography:**
- Headers: Space Grotesk or similar geometric sans-serif
- Body: Inter or similar clean sans-serif
- Charts: System default (Recharts defaults)

**Spacing & Layout:**
- Max width: 1400px container
- Card padding: 24px
- Gap between cards: 16px
- Responsive grid: 2 columns (mobile), 4 columns (desktop)

**Interactive Elements:**
- Hover: Box shadow increase, slight translateY
- Click: Expand card or show modal
- Loading: Skeleton screens or spinner
- Success: Toast notification (API successful)
- Error: Red error message with retry button

---

## Section Specifications

### 1. Competitive Intelligence Card

**Data from OpenAI:**
- 5-10 direct competitors identified
- Market positioning for each (feature set, price, market segment)
- Differentiation assessment (what makes target startup unique)
- Threat level for each competitor (1-10 scale)

**Visualization:**
- 2D scatter plot showing competitor positioning (Market Size vs. Feature Completeness or similar axes)
- Grid of competitor cards below with: name, description, threat level indicator
- Key differentiators highlighted

**Interactive:**
- Hover over competitor bubble to see details
- Click competitor card to expand full profile
- Filter by threat level (high/medium/low)

---

### 2. Market Sizing Card

**Data from OpenAI:**
- TAM (Total Addressable Market) - full market size
- SAM (Serviceable Addressable Market) - realistic addressable portion
- SOM (Serviceable Obtainable Market) - first-year achievable portion
- Market growth trajectory (3-5 year CAGR)
- Target segments and their sizes

**Visualization:**
- Stacked bar chart: TAM → SAM → SOM with dollar amounts
- Line chart: Market growth projection
- Segment breakdown as colored pills/badges
- Key metrics highlighted (e.g., "CAGR: 28%", "TAM: $4.2B")

**Interactive:**
- Hover on bar chart to see exact values
- Click segment pill to see segment-specific metrics
- Toggle between USD and percentage views

---

### 3. Founder Evaluation Card

**Data from OpenAI:**
- Founder names, titles, backgrounds
- Previous experience and exits (timeline)
- Domain expertise assessment (match to market/problem)
- Track record analysis (successes, failures, lessons learned)
- Team composition strength assessment

**Visualization:**
- Team avatar grid (initials) with names/titles
- Timeline of founder experience (horizontal bar chart)
- Expertise match chart (radar or skill tags)
- Track record summary (X exits, Y failures, Z years experience)
- Founder-market fit score (1-10)

**Interactive:**
- Click team member to see full bio
- Hover on experience timeline to see details
- Expand track record for deeper analysis

---

### 4. Investment Thesis Card

**Data from OpenAI:**
- Go/No-go recommendation
- Confidence percentage (how certain are we in this assessment)
- Top 3-5 investment highlights (why this is a good/bad investment)
- Top 3-5 key risks (what could go wrong)
- One-line thesis statement

**Visualization:**
- Large confidence percentage (70%, 85%, etc.) with color coding
- Go/No-go recommendation with visual indicator (green/yellow/red)
- Risk gauge showing risk level (low/medium/high)
- Bulleted highlights and risks
- Color-coded recommendation badge

**Interactive:**
- Click risk to see mitigation strategies
- Click highlight to see supporting data
- Toggle between summary and detailed view

---

## Error Handling

**Per-Card Fallbacks:**
- **Competitive Intelligence:** If competitors unclear, show "Generic market dynamics with top 5 industry players"
- **Market Sizing:** If specific numbers unavailable, show industry benchmarks and adjust confidence
- **Founder Evaluation:** If limited founder data, show team composition and note "Limited founder history available"
- **Investment Thesis:** If insufficient data, show "Incomplete analysis - provide more context" with request for additional info

**General Error Handling:**
- Network failures: "Unable to load analysis. Please try again."
- API timeouts: "Analysis took too long. Please try a different startup or try again in 30 seconds."
- Ambiguous input: "Did you mean [Company A] or [Company B]? Click to select."

**Per-Section Confidence Indicators:**
- Each card shows confidence level (High/Medium/Low)
- Users understand which insights are reliable vs. uncertain

---

## Success Criteria

✅ **Technical:**
- All 4 cards render correctly with data visualizations
- Single OpenAI API call per analysis (batched)
- No additional API costs beyond OpenAI
- Responsive design works mobile/tablet/desktop
- Error handling catches all edge cases
- Load time < 3 seconds after API response

✅ **UX:**
- Analyst can get full analysis in < 30 seconds
- Dashboard feels organized and professional
- Color system creates clear visual hierarchy
- Interactive features (hover, expand) work smoothly
- All text readable with good contrast

✅ **Impression:**
- Demonstrates full-stack capability
- Shows AI/prompt engineering skill
- Professional polish and attention to detail
- Solves real VC analyst pain point
- Ready for portfolio/interview presentation

---

## Implementation Phases

### Phase 1: Backend (OpenAI Integration)
- Set up Node.js/Express server
- Create POST /api/analyze endpoint
- Build comprehensive OpenAI prompt for 3-in-1 analysis
- Implement response parsing and error handling
- Test with multiple startup inputs

### Phase 2: Frontend Components
- Build search interface
- Create 4 analysis card components
- Implement Recharts visualizations
- Add interactive features (hover, expand)
- Connect to backend API

### Phase 3: Design & Polish
- Apply dark theme with emerald/gold/purple colors
- Add animations and hover effects
- Ensure responsive design
- Test on mobile/tablet/desktop

### Phase 4: Deployment
- Deploy backend (Railway/Render)
- Deploy frontend (Vercel)
- Push to GitHub
- Final testing

---

**Plan Status:** Ready for implementation

