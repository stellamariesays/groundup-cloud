/**
 * Ground Up — Gemini-powered country analysis and forecasting
 * 
 * Uses Gemini to:
 * 1. Analyze country conditions beyond raw data
 * 2. Forecast escalation risk
 * 3. Recommend intervention priorities
 * 4. Generate actionable briefings for each high-impact region
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

class GroundUpAnalyzer {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  /**
   * Generate a deep-dive analysis for a specific country
   */
  async analyzeCountry(countryData) {
    const prompt = `You are an expert analyst for Ground Up, a platform that identifies where young male unemployment creates instability and routes infrastructure investment.

Analyze this country:

Country: ${countryData.name}
Fuse score (unemployment + violence + unrest): ${countryData.fuse}/100
Access gap (power + internet + devices + AI): ${countryData.accessGap}/100
Impact score (√fuse × access): ${countryData.impact}/100
Reach (Freedom House): ${countryData.reach}/100

Pillars:
- Power access: ${countryData.pillars.power}%
- Internet access: ${countryData.pillars.internet}%
- Device access: ${countryData.pillars.devices}%
- AI/inference access: ${countryData.pillars.inference}%

Provide:
1. Risk assessment — what's likely to happen in the next 6 months?
2. Intervention priority — which pillar should be addressed FIRST and why?
3. Escalation forecast — 3-month and 12-month outlook
4. Comparison — how does this compare to similar-profile countries?
5. Recommendation — specific, actionable intervention plan

Be direct and specific. No hedging. Real analysts have opinions.`;

    try {
      const result = await this.model.generateContent(prompt);
      return {
        country: countryData.name,
        analysis: result.response.text(),
        analyzedAt: new Date().toISOString(),
        model: 'gemini-2.0-flash',
      };
    } catch (err) {
      console.error(`Analysis failed for ${countryData.name}:`, err.message);
      return { country: countryData.name, analysis: null, error: err.message };
    }
  }

  /**
   * Compare multiple countries and rank intervention priority
   */
  async rankInterventions(countries) {
    const countrySummaries = countries.map(c =>
      `${c.name}: fuse=${c.fuse}, access=${c.accessGap}, impact=${c.impact}, reach=${c.reach}`
    ).join('\n');

    const prompt = `You are ranking countries for infrastructure intervention priority.

Countries:
${countrySummaries}

Rank these by "where would $1M in infrastructure investment create the most economic opportunity and reduce the most instability?"

Consider:
- Impact score (higher = more urgent + more access gap)
- Reach (higher = easier to operate in)
- Cost-effectiveness (some interventions are cheaper per person)
- Likelihood of success (political stability, existing infrastructure)

Return a ranked list with reasoning. Be opinionated.`;

    try {
      const result = await this.model.generateContent(prompt);
      return {
        ranking: result.response.text(),
        generatedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.error('Ranking failed:', err.message);
      return { ranking: null, error: err.message };
    }
  }

  /**
   * Generate a weekly global briefing
   */
  async generateBriefing(stats, topCountries) {
    const summary = topCountries.map(c =>
      `${c.rank}. ${c.name}: fuse=${c.fuse}, access=${c.accessGap}, impact=${c.impact}`
    ).join('\n');

    const prompt = `You are writing a weekly intelligence briefing for Ground Up, an AI-powered platform that routes infrastructure to at-risk regions.

GLOBAL STATS:
- Countries tracked: ${stats.totalCountries}
- Average fuse: ${stats.avgFuse}/100
- Average access gap: ${stats.avgAccessGap}/100
- Countries in critical zone (impact > 60): ${stats.criticalCount}

TOP 10 BY IMPACT:
${summary}

Write a concise briefing (3-5 paragraphs) covering:
1. Overall risk landscape — is it getting better or worse?
2. Notable changes — any countries that should concern us?
3. Intervention wins — where would investment matter most this week?
4. What to watch — what signals should we monitor?

Write like a real intelligence brief — direct, specific, no filler.`;

    try {
      const result = await this.model.generateContent(prompt);
      return {
        briefing: result.response.text(),
        generatedAt: new Date().toISOString(),
        stats,
      };
    } catch (err) {
      console.error('Briefing failed:', err.message);
      return { briefing: null, error: err.message };
    }
  }

  /**
   * Forecast job creation potential for a specific intervention
   */
  async forecastJobs(countryName, interventionType) {
    const prompt = `Forecast the job creation potential for this intervention:

Country: ${countryName}
Intervention: ${interventionType}

Based on:
- Mobile internet penetration → enables gig economy, remote work, digital commerce
- Device access → enables app-based businesses, content creation, freelancing
- AI access → enables code assistance, translation, business automation
- Power access → enables all of the above

Estimate:
1. Direct jobs created in first 12 months (people employed by the rollout)
2. Indirect jobs enabled in first 24 months (people who start businesses because they now have access)
3. Economic multiplier effect
4. Comparison to similar interventions in comparable countries

Be realistic. Cite patterns from similar deployments if you know them.`;

    try {
      const result = await this.model.generateContent(prompt);
      return {
        forecast: result.response.text(),
        generatedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.error('Job forecast failed:', err.message);
      return { forecast: null, error: err.message };
    }
  }
}

module.exports = GroundUpAnalyzer;
