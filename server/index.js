/**
 * Ground Up Cloud API Server
 * 
 * Endpoints:
 *   GET  /api/stats              — Global statistics
 *   GET  /api/countries          — All countries with scores
 *   GET  /api/countries/:id      — Single country detail
 *   POST /api/analyze/:id        — Gemini deep-dive analysis
 *   POST /api/briefing           — Generate weekly AI briefing
 *   POST /api/rank               — Gemini intervention ranking
 *   POST /api/forecast/:id       — Job creation forecast
 */

const http = require('http');
const url = require('url');
const GroundUpAnalyzer = require('./analyzer');

const PORT = process.env.PORT || 8080;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'https://groundup-cloud.surge.sh';

const analyzer = new GroundUpAnalyzer(GEMINI_API_KEY);

// Country data (same as frontend)
const COUNTRIES = [
  { id: 'DJI', name: 'Djibouti', fuse: 100, accessGap: 58, impact: 76, reach: 17,
    pillars: { power: 65, internet: 65, devices: 74, inference: 16 } },
  { id: 'ZAF', name: 'South Africa', fuse: 100, accessGap: 18, impact: 42, reach: 83,
    pillars: { power: 88, internet: 78, devices: 89, inference: 20 } },
  { id: 'SWZ', name: 'Eswatini', fuse: 79, accessGap: 35, impact: 53, reach: 8,
    pillars: { power: 86, internet: 63, devices: 82, inference: 16 } },
  { id: 'VCT', name: 'St. Vincent and the Grenadines', fuse: 100, accessGap: 27, impact: 52, reach: 100,
    pillars: { power: 100, internet: 76, devices: 88, inference: 19 } },
  { id: 'LBY', name: 'Libya', fuse: 100, accessGap: 20, impact: 45, reach: 8,
    pillars: { power: 73, internet: 82, devices: 90, inference: 21 } },
  { id: 'COG', name: 'Congo, Rep.', fuse: 100, accessGap: 71, impact: 84, reach: 18,
    pillars: { power: 51, internet: 47, devices: 59, inference: 12 } },
  { id: 'BWA', name: 'Botswana', fuse: 78, accessGap: 33, impact: 51, reach: 83,
    pillars: { power: 76, internet: 57, devices: 91, inference: 14 } },
  { id: 'TUN', name: 'Tunisia', fuse: 65, accessGap: 24, impact: 40, reach: 63,
    pillars: { power: 100, internet: 77, devices: 91, inference: 19 } },
  { id: 'JOR', name: 'Jordan', fuse: 66, accessGap: 24, impact: 40, reach: 33,
    pillars: { power: 100, internet: 96, devices: 86, inference: 24 } },
  { id: 'NAM', name: 'Namibia', fuse: 78, accessGap: 52, impact: 64, reach: 75,
    pillars: { power: 57, internet: 65, devices: 82, inference: 16 } },
];

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function json(res, status, data) {
  cors(res);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const path = parsed.pathname;

  if (req.method === 'OPTIONS') {
    cors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // GET /api/stats
    if (path === '/api/stats' && req.method === 'GET') {
      json(res, 200, {
        totalCountries: COUNTRIES.length,
        avgFuse: Math.round(COUNTRIES.reduce((s, c) => s + c.fuse, 0) / COUNTRIES.length),
        avgAccessGap: Math.round(COUNTRIES.reduce((s, c) => s + c.accessGap, 0) / COUNTRIES.length),
        criticalCount: COUNTRIES.filter(c => c.impact > 60).length,
      });
      return;
    }

    // GET /api/countries
    if (path === '/api/countries' && req.method === 'GET') {
      const sort = parsed.query.sort || 'impact';
      const limit = parseInt(parsed.query.limit) || COUNTRIES.length;
      const sorted = [...COUNTRIES].sort((a, b) => b[sort] - a[sort]).slice(0, limit);
      json(res, 200, { countries: sorted });
      return;
    }

    // Country-specific: /api/countries/:id/...
    const countryMatch = path.match(/^\/api\/countries\/([^/]+)(?:\/(.+))?$/);
    if (countryMatch) {
      const id = countryMatch[1];
      const sub = countryMatch[2] || '';
      const country = COUNTRIES.find(c => c.id === id);
      if (!country) return json(res, 404, { error: 'Country not found' });

      // GET /api/countries/:id
      if (!sub && req.method === 'GET') {
        json(res, 200, { country });
        return;
      }

      // POST /api/countries/:id/analyze
      if (sub === 'analyze' && req.method === 'POST') {
        const result = await analyzer.analyzeCountry(country);
        json(res, 200, { success: true, ...result });
        return;
      }

      // POST /api/countries/:id/forecast
      if (sub === 'forecast' && req.method === 'POST') {
        const { intervention } = await new Promise((resolve) => {
          let b = '';
          req.on('data', c => b += c);
          req.on('end', () => resolve(JSON.parse(b || '{}')));
        });
        const result = await analyzer.forecastJobs(country.name, intervention || 'full infrastructure');
        json(res, 200, { success: true, country: country.name, ...result });
        return;
      }
    }

    // POST /api/briefing
    if (path === '/api/briefing' && req.method === 'POST') {
      const stats = {
        totalCountries: COUNTRIES.length,
        avgFuse: Math.round(COUNTRIES.reduce((s, c) => s + c.fuse, 0) / COUNTRIES.length),
        avgAccessGap: Math.round(COUNTRIES.reduce((s, c) => s + c.accessGap, 0) / COUNTRIES.length),
        criticalCount: COUNTRIES.filter(c => c.impact > 60).length,
      };
      const top = COUNTRIES.sort((a, b) => b.impact - a.impact).slice(0, 10);
      const result = await analyzer.generateBriefing(stats, top);
      json(res, 200, { success: true, ...result });
      return;
    }

    // POST /api/rank
    if (path === '/api/rank' && req.method === 'POST') {
      const result = await analyzer.rankInterventions(COUNTRIES);
      json(res, 200, { success: true, ...result });
      return;
    }

    json(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error('Error:', err);
    json(res, 500, { error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`Ground Up Cloud API on port ${PORT}`);
  console.log(`Gemini analysis: ${GEMINI_API_KEY ? 'enabled' : 'disabled'}`);
});
