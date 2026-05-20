# Ground Up Cloud

**AI-powered early warning and intervention routing for the world's most at-risk regions.**

Ground Up Cloud is a Gemini-powered platform that identifies where young male unemployment is creating instability, scores the access gap (power, internet, devices, AI), and routes infrastructure investment to where it matters most. Built for the [Build with Gemini XPRIZE](https://www.geminixprize.com/).

## What It Does

- **Real-time risk scoring** — Fuse (unemployment + violence + unrest), Access Gap (power + internet + devices + AI), Impact (√fuse × access)
- **Gemini-powered analysis** — AI evaluates country conditions, forecasts escalation risk, and recommends intervention priority
- **Intervention routing** — Matches infrastructure providers (solar, satellite, devices) with high-impact regions
- **Creator pipeline** — Once the pipe is open, connects enabled individuals with opportunity (jobs, education, business tools)

## Live

- **v1 Dashboard:** [thegroundup.xyz](https://www.thegroundup.xyz/)
- **Data sources:** World Bank, ILOSTAT, Freedom House, ITU, GSMA

## Stack

- **Frontend:** Next.js + Three.js globe + Tailwind
- **Backend:** Node.js + Gemini API
- **Data pipeline:** 50+ countries, 7 dimensions, daily refresh
- **Infra:** Google Cloud Run (target)

## Quick Start

```bash
git clone https://github.com/stellamariesays/groundup-cloud
cd groundup-cloud
npm install
cp .env.example .env
# Add GEMINI_API_KEY
npm run dev
```

## XPRIZE Category

**Entrepreneurship & Job Creation** — Ground Up identifies where enabling tools would create the most economic opportunity, then routes them in. People with power, internet, devices, and AI access can build businesses, access global markets, and create jobs in their communities.

## Status

🚀 Day 1 of 90 (May 20, 2026) — v1 live at thegroundup.xyz

## License

MIT
