/**
 * Ground Up — Country risk data model
 * 
 * Each country has 7 dimensions, 3 composite scores, and a ranking.
 * Data sourced from World Bank, ILOSTAT, Freedom House, ITU, GSMA.
 */

const COUNTRIES = [
  { id: 'DJI', name: 'Djibouti', rank: 1, fuse: 100, accessGap: 58, impact: 76, reach: 17,
    pillars: { power: 65, internet: 65, devices: 74, inference: 16 },
    unemployment: 80, violence: 12, unrest: 8, freedom: 17 },
  { id: 'ZAF', name: 'South Africa', rank: 2, fuse: 100, accessGap: 18, impact: 42, reach: 83,
    pillars: { power: 88, internet: 78, devices: 89, inference: 20 },
    unemployment: 63, violence: 25, unrest: 12, freedom: 83 },
  { id: 'SWZ', name: 'Eswatini', rank: 3, fuse: 79, accessGap: 35, impact: 53, reach: 8,
    pillars: { power: 86, internet: 63, devices: 82, inference: 16 },
    unemployment: 58, violence: 8, unrest: 13, freedom: 8 },
  { id: 'VCT', name: 'St. Vincent and the Grenadines', rank: 4, fuse: 100, accessGap: 27, impact: 52, reach: 100,
    pillars: { power: 100, internet: 76, devices: 88, inference: 19 },
    unemployment: 42, violence: 4, unrest: 2, freedom: 100 },
  { id: 'LBY', name: 'Libya', rank: 5, fuse: 100, accessGap: 20, impact: 45, reach: 8,
    pillars: { power: 73, internet: 82, devices: 90, inference: 21 },
    unemployment: 49, violence: 30, unrest: 21, freedom: 8 },
  { id: 'COG', name: 'Congo, Rep.', rank: 6, fuse: 100, accessGap: 71, impact: 84, reach: 18,
    pillars: { power: 51, internet: 47, devices: 59, inference: 12 },
    unemployment: 42, violence: 35, unrest: 23, freedom: 18 },
  { id: 'BWA', name: 'Botswana', rank: 7, fuse: 78, accessGap: 33, impact: 51, reach: 83,
    pillars: { power: 76, internet: 57, devices: 91, inference: 14 },
    unemployment: 46, violence: 12, unrest: 20, freedom: 83 },
  { id: 'TUN', name: 'Tunisia', rank: 8, fuse: 65, accessGap: 24, impact: 40, reach: 63,
    pillars: { power: 100, internet: 77, devices: 91, inference: 19 },
    unemployment: 40, violence: 10, unrest: 15, freedom: 63 },
  { id: 'JOR', name: 'Jordan', rank: 9, fuse: 66, accessGap: 24, impact: 40, reach: 33,
    pillars: { power: 100, internet: 96, devices: 86, inference: 24 },
    unemployment: 38, violence: 8, unrest: 20, freedom: 33 },
  { id: 'NAM', name: 'Namibia', rank: 10, fuse: 78, accessGap: 52, impact: 64, reach: 75,
    pillars: { power: 57, internet: 65, devices: 82, inference: 16 },
    unemployment: 43, violence: 10, unrest: 25, freedom: 75 },
];

/**
 * Calculate scores from raw dimensions
 */
function calculateScores(country) {
  const fuse = Math.min(100, Math.round(
    (country.unemployment * 0.5 + country.violence * 0.3 + country.unrest * 0.2) * 1.2
  ));
  const accessGap = Math.round(
    (100 - country.pillars.power + 100 - country.pillars.internet +
     100 - country.pillars.devices + 100 - country.pillars.inference) / 4
  );
  const impact = Math.round(Math.sqrt(fuse * accessGap));
  return { fuse, accessGap, impact, reach: country.freedom };
}

/**
 * Get all countries with scores
 */
export function getAllCountries() {
  return COUNTRIES.map(c => ({
    ...c,
    scores: calculateScores(c),
  })).sort((a, b) => b.scores.impact - a.scores.impact);
}

/**
 * Get a single country
 */
export function getCountry(id) {
  return COUNTRIES.find(c => c.id === id);
}

/**
 * Get top N countries by impact score
 */
export function getTopCountries(n = 10) {
  return getAllCountries().slice(0, n);
}

/**
 * Get global stats
 */
export function getGlobalStats() {
  const countries = getAllCountries();
  return {
    totalCountries: countries.length,
    avgFuse: Math.round(countries.reduce((s, c) => s + c.scores.fuse, 0) / countries.length),
    avgAccessGap: Math.round(countries.reduce((s, c) => s + c.scores.accessGap, 0) / countries.length),
    avgImpact: Math.round(countries.reduce((s, c) => s + c.scores.impact, 0) / countries.length),
    criticalCount: countries.filter(c => c.scores.impact > 60).length,
  };
}

export default COUNTRIES;
