import Head from 'next/head'
import dynamic from 'next/dynamic'
import { getTopCountries, getGlobalStats } from '../lib/data'

const GlobeBackground = dynamic(() => import('../components/GlobeBackground'), { ssr: false })

export default function Home() {
  const countries = getTopCountries(10)
  const stats = getGlobalStats()

  return (
    <div className="heat-bg min-h-screen relative">
      <GlobeBackground />
      <Head>
        <title>Ground Up Cloud — AI-Powered Crisis Intelligence</title>
        <meta name="description" content="AI identifies where unemployment creates instability. Gemini scores intervention priority. Infrastructure gets routed where it matters most." />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </Head>

      {/* Nav */}
      <nav className="relative z-10 border-b border-[--border] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌍</span>
            <span className="font-semibold text-lg">Ground Up <span className="text-[--accent-warm]">Cloud</span></span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[--text-secondary]">
            <a href="#dashboard" className="hover:text-white transition">Dashboard</a>
            <a href="#analysis" className="hover:text-white transition">AI Analysis</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="https://www.thegroundup.xyz/" target="_blank" className="hover:text-white transition">v1 Site</a>
            <a href="#pricing" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
              Free API
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-6">
        <section className="py-20 text-center">
          <div className="inline-block mb-6 px-3 py-1 rounded-full border border-[--border] text-xs mono text-[--accent-warm]">
            Built for the Gemini XPRIZE · Powered by Google Cloud + Gemini
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Where the fuse is burning.<br />
            <span className="text-[--accent]">AI routes the intervention.</span>
          </h1>
          <p className="text-xl text-[--text-secondary] max-w-2xl mx-auto mb-10">
            Gemini analyzes 50+ at-risk countries in real-time. Scores unemployment, violence, 
            access gaps, and intervention priority. Routes infrastructure where it creates the most jobs.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="/dashboard" className="bg-[--accent] hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition">
              Access Dashboard →
            </a>
            <a href="https://github.com/stellamariesays/groundup-cloud" className="border border-[--border] hover:border-[--accent] text-[--text-secondary] hover:text-white px-8 py-3 rounded-lg font-medium text-lg transition">
              View Source
            </a>
          </div>
        </section>

        {/* Stats */}
        <section className="py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[--bg-secondary] border border-[--border] rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-[--accent]">{stats.totalCountries}</div>
              <div className="text-sm text-[--text-secondary] mt-1">Countries Tracked</div>
            </div>
            <div className="bg-[--bg-secondary] border border-[--border] rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-[--accent-warm]">{stats.avgFuse}</div>
              <div className="text-sm text-[--text-secondary] mt-1">Avg Fuse Score</div>
            </div>
            <div className="bg-[--bg-secondary] border border-[--border] rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-[--accent]">{stats.criticalCount}</div>
              <div className="text-sm text-[--text-secondary] mt-1">Critical Regions</div>
            </div>
            <div className="bg-[--bg-secondary] border border-[--border] rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-[--accent-warm]">4x</div>
              <div className="text-sm text-[--text-secondary] mt-1">Daily Analysis Cycles</div>
            </div>
          </div>
        </section>

        {/* Dashboard - Top Countries */}
        <section id="dashboard" className="py-16">
          <h2 className="text-3xl font-bold mb-2">Top 10 — Highest Impact</h2>
          <p className="text-[--text-secondary] mb-8">Where intervention matters most. Impact = √(fuse × access gap) — both must be high.</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[--border] text-left text-[--text-secondary]">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4 text-center">
                    <span className="text-[--accent]">Fuse</span>
                  </th>
                  <th className="py-3 px-4 text-center">
                    <span className="text-[--accent-warm]">Access Gap</span>
                  </th>
                  <th className="py-3 px-4 text-center">Impact</th>
                  <th className="py-3 px-4 text-center">Reach</th>
                </tr>
              </thead>
              <tbody>
                {countries.map((c, i) => (
                  <tr key={c.id} className="border-b border-[--border] hover:bg-[--bg-secondary] transition">
                    <td className="py-3 px-4 mono text-[--text-secondary]">{String(i + 1).padStart(2, '0')}</td>
                    <td className="py-3 px-4 font-medium">{c.name}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`mono font-bold ${c.fuse >= 80 ? 'text-[--accent]' : c.fuse >= 60 ? 'text-[--accent-warm]' : 'text-[--text-secondary]'}`}>
                        {c.fuse}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`mono font-bold ${c.accessGap >= 50 ? 'text-[--accent]' : c.accessGap >= 30 ? 'text-[--accent-warm]' : 'text-green-400'}`}>
                        {c.accessGap}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="mono font-bold text-white">{c.impact}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="mono text-[--text-secondary]">{c.reach}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* AI Analysis Section */}
        <section id="analysis" className="py-16">
          <h2 className="text-3xl font-bold mb-4">AI runs this business.</h2>
          <p className="text-[--text-secondary] max-w-3xl mb-8">
            Gemini executes the core business operations: country analysis, risk forecasting, 
            intervention ranking, job creation estimates, and weekly intelligence briefings. 
            4x daily analysis cycles. No human in the loop for routing decisions.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[--bg-secondary] border border-[--border] rounded-xl p-6">
              <div className="mono text-[--accent-warm] mb-3 text-xs">GEMINI FUNCTION 01</div>
              <h3 className="font-semibold mb-2">Country Deep Dive</h3>
              <p className="text-[--text-secondary] text-sm">
                Per-country risk assessment, escalation forecast, intervention priority, 
                and comparison to similar-profile nations. All generated by Gemini.
              </p>
            </div>
            <div className="bg-[--bg-secondary] border border-[--border] rounded-xl p-6">
              <div className="mono text-[--accent-warm] mb-3 text-xs">GEMINI FUNCTION 02</div>
              <h3 className="font-semibold mb-2">Intervention Ranking</h3>
              <p className="text-[--text-secondary] text-sm">
                Gemini ranks where $1M in infrastructure creates the most economic opportunity. 
                Considers cost-effectiveness, political stability, and existing infrastructure.
              </p>
            </div>
            <div className="bg-[--bg-secondary] border border-[--border] rounded-xl p-6">
              <div className="mono text-[--accent-warm] mb-3 text-xs">GEMINI FUNCTION 03</div>
              <h3 className="font-semibold mb-2">Job Forecasting</h3>
              <p className="text-[--text-secondary] text-sm">
                Estimates direct and indirect job creation per intervention. 
                Economic multiplier effects. Pattern-matched against comparable deployments.
              </p>
            </div>
          </div>
        </section>

        {/* How it works — the full loop */}
        <section className="py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How it works</h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📡</div>
              <h3 className="font-semibold mb-2">1. Signal</h3>
              <p className="text-[--text-secondary] text-sm">
                50+ countries. Unemployment, violence, unrest, 
                power, internet, devices, AI access. Updated 4x daily.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="font-semibold mb-2">2. Analyze</h3>
              <p className="text-[--text-secondary] text-sm">
                Gemini scores fuse, access gap, impact, reach. 
                Ranks intervention priority. Forecasts escalation.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔌</div>
              <h3 className="font-semibold mb-2">3. Route</h3>
              <p className="text-[--text-secondary] text-sm">
                Match infrastructure providers with high-impact regions. 
                Providers pay to be matched. Signal stays free.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-semibold mb-2">4. Enable</h3>
              <p className="text-[--text-secondary] text-sm">
                People tap into the agent mesh. They don't train their own AI — 
                they use existing agents to build businesses and access markets.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="font-semibold mb-2">5. Loop</h3>
              <p className="text-[--text-secondary] text-sm">
                Enabled creators feed data back. More signal, more accuracy, 
                more investment. Self-reinforcing.
              </p>
            </div>
          </div>
        </section>

        {/* Model — the data is free */}
        <section id="pricing" className="py-16">
          <h2 className="text-3xl font-bold mb-4 text-center">The data is free.</h2>
          <p className="text-[--text-secondary] text-center max-w-2xl mx-auto mb-10">
            Scoring where people are suffering and then charging to see it is the kind of gatekeeping 
            this project exists to fight. The signal layer is open — always. Revenue comes from the routing.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[--bg-secondary] border border-green-500/30 rounded-xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Always free
              </div>
              <h3 className="font-semibold mb-1">Signal Layer</h3>
              <div className="mono text-[--text-secondary] text-sm mb-4">For everyone — researchers, NGOs, journalists, anyone</div>
              <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-[--text-secondary]">/forever</span></div>
              <ul className="space-y-2 text-sm text-[--text-secondary] mb-8">
                <li>✓ All 50+ country scores</li>
                <li>✓ Fuse/Access/Impact scoring</li>
                <li>✓ Gemini deep-dive analysis</li>
                <li>✓ Weekly AI briefings</li>
                <li>✓ Full API access</li>
                <li>✓ Job creation forecasts</li>
              </ul>
              <a href="#" className="block text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition">
                Access Now
              </a>
            </div>

            <div className="bg-[--bg-secondary] border border-[--accent-warm] rounded-xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[--accent-warm] text-white text-xs font-semibold px-3 py-1 rounded-full">
                Marketplace
              </div>
              <h3 className="font-semibold mb-1">Provider Network</h3>
              <div className="mono text-[--text-secondary] text-sm mb-4">For solar, satellite, device, and infra companies</div>
              <div className="text-4xl font-bold mb-6">10%<span className="text-lg text-[--text-secondary]">/routed contract</span></div>
              <ul className="space-y-2 text-sm text-[--text-secondary] mb-8">
                <li>✓ AI-matched to high-impact regions</li>
                <li>✓ Gemini prioritized leads</li>
                <li>✓ Deployment feasibility scoring</li>
                <li>✓ Impact verification</li>
                <li>✓ Provider reputation system</li>
              </ul>
              <a href="#" className="block text-center bg-[--accent-warm] hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition">
                Join Network
              </a>
            </div>

            <div className="bg-[--bg-secondary] border border-[--border] rounded-xl p-8">
              <h3 className="font-semibold mb-1">Gov & Multilateral</h3>
              <div className="mono text-[--text-secondary] text-sm mb-4">Custom deployments for large-scale programs</div>
              <div className="text-4xl font-bold mb-6">Custom</div>
              <ul className="space-y-2 text-sm text-[--text-secondary] mb-8">
                <li>✓ Private intelligence feeds</li>
                <li>✓ Custom country/region coverage</li>
                <li>✓ Integration with existing systems</li>
                <li>✓ Intervention planning & monitoring</li>
                <li>✓ Dedicated analyst support</li>
              </ul>
              <a href="#" className="block text-center border border-[--border] hover:border-[--accent] text-[--text-secondary] hover:text-white py-3 rounded-lg transition">
                Contact Us
              </a>
            </div>
          </div>
        </section>

        {/* API Preview */}
        <section className="py-16">
          <h2 className="text-3xl font-bold mb-4 text-center">Open API</h2>
          <p className="text-[--text-secondary] text-center mb-8">Free. No auth needed for the signal layer. Just start building.</p>
          <div className="bg-[--bg-secondary] border border-[--border] rounded-xl p-6 mono text-sm max-w-2xl mx-auto overflow-x-auto">
            <pre className="text-[--text-secondary]">{`// No API key needed. The data is free.
const res = await fetch(
  'https://api.groundup.cloud/v1/countries?sort=impact&limit=10'
);

const { countries } = await res.json();

// Each country includes:
// - fuse, accessGap, impact, reach scores
// - pillar breakdown (power, internet, devices, inference)
// - Gemini-generated analysis & forecasts
// - Job creation potential estimates`}</pre>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[--border] py-8 text-center text-sm text-[--text-secondary]">
          <p>
            Built by a human-agent team · Powered by Google Cloud + Gemini ·{' '}
            <a href="https://www.thegroundup.xyz/" className="text-[--accent-warm] hover:underline">v1 Dashboard</a> ·{' '}
            <a href="https://github.com/stellamariesays/groundup-cloud" className="text-[--accent-warm] hover:underline">GitHub</a>
          </p>
          <p className="mt-2 mono text-xs">
            Ground Up Cloud · XPRIZE Build with Gemini · Day 1 of 90
          </p>
        </footer>
      </main>
    </div>
  )
}
