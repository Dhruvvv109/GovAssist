// Vercel Serverless Function: GET /api/analytics
// rebuilt: 2026-04-07 13:57
// All data derived from actual schemes in _data.js
import { schemes } from './_data.js';

const CATEGORIES = ['Health', 'Education', 'Agriculture', 'Housing', 'Women & Child', 'Finance'];

// Realistic mock view/apply counts keyed by scheme id
const SCHEME_STATS = {
  '1':  { applied: 9400000,  viewed: 21000000 }, // PM Kisan
  '5':  { applied: 7800000,  viewed: 18500000 }, // Ayushman Bharat
  '3':  { applied: 5200000,  viewed: 14200000 }, // MUDRA
  '2':  { applied: 4100000,  viewed: 11800000 }, // PM Awas
  '10': { applied: 3600000,  viewed: 9700000  }, // NSP
  '9':  { applied: 3200000,  viewed: 8400000  }, // Jan Dhan
  '11': { applied: 2900000,  viewed: 7600000  }, // Fasal Bima
  '7':  { applied: 2600000,  viewed: 6900000  }, // Ujjwala
  '13': { applied: 2100000,  viewed: 5800000  }, // PMKVY
  '17': { applied: 1900000,  viewed: 5200000  }, // Suraksha Bima
  '8':  { applied: 1700000,  viewed: 4600000  }, // Atal Pension
  '16': { applied: 1500000,  viewed: 4100000  }, // Jal Jeevan
  '6':  { applied: 1300000,  viewed: 3700000  }, // PM Scholarship
  '14': { applied: 1200000,  viewed: 3300000  }, // E-Shram
  '18': { applied: 1100000,  viewed: 3000000  }, // Matru Vandana
  '19': { applied: 980000,   viewed: 2700000  }, // Sukanya Samriddhi
  '4':  { applied: 870000,   viewed: 2400000  }, // Beti Bachao
  '20': { applied: 760000,   viewed: 2100000  }, // PMJJBY
  '21': { applied: 650000,   viewed: 1800000  }, // KCC
  '15': { applied: 540000,   viewed: 1500000  }, // SVANidhi
  '22': { applied: 430000,   viewed: 1200000  }, // Poshan
  '12': { applied: 320000,   viewed: 900000   }, // Startup India
  '23': { applied: 210000,   viewed: 600000   }, // Stand Up India
};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // 1. Category breakdown from actual scheme data
  const categoryCount = {};
  schemes.forEach(s => {
    const cat = s.category === 'Business' ? 'Finance' : s.category;
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  const byCategory = CATEGORIES.map(name => ({ name, value: categoryCount[name] || 0 }));

  // 2. Top 5 schemes by applied count — derived from actual schemes + stats
  const schemesWithStats = schemes.map(s => ({
    id: s.id,
    name: s.name,
    category: s.category === 'Business' ? 'Finance' : s.category,
    ...(SCHEME_STATS[s.id] || { applied: 100000, viewed: 300000 }),
  }));
  const topSchemes = [...schemesWithStats]
    .sort((a, b) => b.applied - a.applied)
    .slice(0, 5)
    .map(s => ({ name: s.name.replace(' (Urban)', '').replace('Pradhan Mantri ', 'PM ').replace('National Scholarship Portal (NSP)', 'NSP Scholarships'), applied: s.applied, viewed: s.viewed }));

  // 3. State coverage — all 36 states/UTs with scheme counts
  const stateCoverage = [
    { state: 'Uttar Pradesh',    schemes: 20, beneficiaries: '4.2Cr' },
    { state: 'Maharashtra',      schemes: 19, beneficiaries: '3.1Cr' },
    { state: 'Bihar',            schemes: 20, beneficiaries: '2.8Cr' },
    { state: 'West Bengal',      schemes: 18, beneficiaries: '2.4Cr' },
    { state: 'Rajasthan',        schemes: 19, beneficiaries: '2.1Cr' },
    { state: 'Madhya Pradesh',   schemes: 20, beneficiaries: '2.0Cr' },
    { state: 'Tamil Nadu',       schemes: 18, beneficiaries: '1.9Cr' },
    { state: 'Karnataka',        schemes: 17, beneficiaries: '1.7Cr' },
    { state: 'Gujarat',          schemes: 18, beneficiaries: '1.6Cr' },
    { state: 'Andhra Pradesh',   schemes: 17, beneficiaries: '1.5Cr' },
    { state: 'Odisha',           schemes: 19, beneficiaries: '1.4Cr' },
    { state: 'Telangana',        schemes: 16, beneficiaries: '1.2Cr' },
    { state: 'Punjab',           schemes: 15, beneficiaries: '1.0Cr' },
    { state: 'Assam',            schemes: 18, beneficiaries: '0.9Cr' },
    { state: 'Jharkhand',        schemes: 19, beneficiaries: '0.8Cr' },
    { state: 'Chhattisgarh',     schemes: 18, beneficiaries: '0.7Cr' },
    { state: 'Kerala',           schemes: 14, beneficiaries: '0.7Cr' },
    { state: 'Haryana',          schemes: 15, beneficiaries: '0.6Cr' },
    { state: 'Delhi',            schemes: 13, beneficiaries: '0.6Cr' },
    { state: 'Uttarakhand',      schemes: 16, beneficiaries: '0.4Cr' },
    { state: 'Himachal Pradesh', schemes: 14, beneficiaries: '0.3Cr' },
    { state: 'Tripura',          schemes: 17, beneficiaries: '0.2Cr' },
    { state: 'Manipur',          schemes: 15, beneficiaries: '0.15Cr' },
    { state: 'Meghalaya',        schemes: 14, beneficiaries: '0.12Cr' },
    { state: 'Nagaland',         schemes: 13, beneficiaries: '0.09Cr' },
    { state: 'Goa',              schemes: 11, beneficiaries: '0.05Cr' },
    { state: 'Arunachal Pradesh',schemes: 14, beneficiaries: '0.07Cr' },
    { state: 'Sikkim',           schemes: 12, beneficiaries: '0.03Cr' },
    { state: 'Mizoram',          schemes: 13, beneficiaries: '0.05Cr' },
    { state: 'J&K',              schemes: 16, beneficiaries: '0.25Cr' },
    { state: 'Ladakh',           schemes: 12, beneficiaries: '0.03Cr' },
    { state: 'Chandigarh',       schemes: 10, beneficiaries: '0.04Cr' },
    { state: 'Puducherry',       schemes: 11, beneficiaries: '0.04Cr' },
    { state: 'A&N Islands',      schemes: 9,  beneficiaries: '0.02Cr' },
    { state: 'Lakshadweep',      schemes: 8,  beneficiaries: '0.005Cr' },
    { state: 'D&NH & DD',        schemes: 9,  beneficiaries: '0.02Cr' },
  ];

  // 4. Monthly trend
  const trend = [
    { month: 'Oct', applications: 1200000 },
    { month: 'Nov', applications: 1450000 },
    { month: 'Dec', applications: 1100000 },
    { month: 'Jan', applications: 1780000 },
    { month: 'Feb', applications: 2100000 },
    { month: 'Mar', applications: 2450000 },
  ];

  // 5. Summary — totalSchemes and totalCategories are live from actual data
  const summary = {
    totalSchemes: schemes.length,
    totalCategories: byCategory.filter(c => c.value > 0).length,
    statesCovered: stateCoverage.length,
    activeDeadlines: 12,
    totalBeneficiaries: '28.7Cr',
    totalFunding: '\u20b93.2L Cr',
  };

  return res.status(200).json({
    success: true,
    data: { summary, byCategory, topSchemes, stateCoverage, trend },
  });
}