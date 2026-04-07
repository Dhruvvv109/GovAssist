// Vercel Serverless Function: GET /api/analytics?lang=hi
// rebuilt: 2026-04-07 14:30
import { schemes } from './_data.js';

const CATEGORIES_EN = ['Health', 'Education', 'Agriculture', 'Housing', 'Women & Child', 'Finance'];
const CATEGORIES_HI = ['\u0938\u094d\u0935\u093e\u0938\u094d\u0925\u094d\u092f', '\u0936\u093f\u0915\u094d\u0937\u093e', '\u0915\u0943\u0937\u093f', '\u0906\u0935\u093e\u0938', '\u092e\u0939\u093f\u0932\u093e \u0914\u0930 \u092c\u093e\u0932', '\u0935\u093f\u0924\u094d\u0924'];

const STATE_HI = {
  'Uttar Pradesh': '\u0909\u0924\u094d\u0924\u0930 \u092a\u094d\u0930\u0926\u0947\u0936',
  'Maharashtra': '\u092e\u0939\u093e\u0930\u093e\u0937\u094d\u091f\u094d\u0930',
  'Bihar': '\u092c\u093f\u0939\u093e\u0930',
  'West Bengal': '\u092a\u0936\u094d\u091a\u093f\u092e \u092c\u0902\u0917\u093e\u0932',
  'Rajasthan': '\u0930\u093e\u091c\u0938\u094d\u0925\u093e\u0928',
  'Madhya Pradesh': '\u092e\u0927\u094d\u092f \u092a\u094d\u0930\u0926\u0947\u0936',
  'Tamil Nadu': '\u0924\u092e\u093f\u0932\u0928\u093e\u0921\u0941',
  'Karnataka': '\u0915\u0930\u094d\u0928\u093e\u091f\u0915',
  'Gujarat': '\u0917\u0941\u091c\u0930\u093e\u0924',
  'Andhra Pradesh': '\u0906\u0902\u0927\u094d\u0930 \u092a\u094d\u0930\u0926\u0947\u0936',
  'Odisha': '\u0913\u0921\u093f\u0936\u093e',
  'Telangana': '\u0924\u0947\u0932\u0902\u0917\u093e\u0928\u093e',
  'Punjab': '\u092a\u0902\u091c\u093e\u092c',
  'Assam': '\u0905\u0938\u092e',
  'Jharkhand': '\u091d\u093e\u0930\u0916\u0902\u0921',
  'Chhattisgarh': '\u091b\u0924\u094d\u0924\u0940\u0938\u0917\u095d',
  'Kerala': '\u0915\u0947\u0930\u0932',
  'Haryana': '\u0939\u0930\u093f\u092f\u093e\u0923\u093e',
  'Delhi': '\u0926\u093f\u0932\u094d\u0932\u0940',
  'Uttarakhand': '\u0909\u0924\u094d\u0924\u0930\u093e\u0916\u0902\u0921',
  'Himachal Pradesh': '\u0939\u093f\u092e\u093e\u091a\u0932 \u092a\u094d\u0930\u0926\u0947\u0936',
  'Tripura': '\u0924\u094d\u0930\u093f\u092a\u0941\u0930\u093e',
  'Manipur': '\u092e\u0923\u093f\u092a\u0941\u0930',
  'Meghalaya': '\u092e\u0947\u0918\u093e\u0932\u092f',
  'Nagaland': '\u0928\u093e\u0917\u093e\u0932\u0948\u0902\u0921',
  'Goa': '\u0917\u094b\u0935\u093e',
  'Arunachal Pradesh': '\u0905\u0930\u0941\u0923\u093e\u091a\u0932 \u092a\u094d\u0930\u0926\u0947\u0936',
  'Sikkim': '\u0938\u093f\u0915\u094d\u0915\u093f\u092e',
  'Mizoram': '\u092e\u093f\u091c\u094b\u0930\u092e',
  'J&K': '\u091c\u092e\u094d\u092e\u0942 \u0914\u0930 \u0915\u0936\u094d\u092e\u0940\u0930',
  'Ladakh': '\u0932\u0926\u094d\u0926\u093e\u0916',
  'Chandigarh': '\u091a\u0902\u0921\u0940\u0917\u095d',
  'Puducherry': '\u092a\u0941\u0921\u0941\u091a\u0947\u0930\u0940',
  'A&N Islands': '\u0905\u0902\u0921\u092e\u093e\u0928 \u0914\u0930 \u0928\u093f\u0915\u094b\u092c\u093e\u0930 \u0926\u094d\u0935\u0940\u092a',
  'Lakshadweep': '\u0932\u0915\u094d\u0937\u0926\u094d\u0935\u0940\u092a',
  'D&NH & DD': '\u0926\u093e\u0926\u0930\u093e \u0928\u0917\u0930 \u0939\u0935\u0947\u0932\u0940 \u0914\u0930 \u0926\u092e\u0928 \u0926\u0940\u0909'
};

const SCHEME_STATS = {
  '1':  { applied: 9400000,  viewed: 21000000 },
  '5':  { applied: 7800000,  viewed: 18500000 },
  '3':  { applied: 5200000,  viewed: 14200000 },
  '2':  { applied: 4100000,  viewed: 11800000 },
  '10': { applied: 3600000,  viewed: 9700000  },
  '9':  { applied: 3200000,  viewed: 8400000  },
  '11': { applied: 2900000,  viewed: 7600000  },
  '7':  { applied: 2600000,  viewed: 6900000  },
  '13': { applied: 2100000,  viewed: 5800000  },
  '17': { applied: 1900000,  viewed: 5200000  },
  '8':  { applied: 1700000,  viewed: 4600000  },
  '16': { applied: 1500000,  viewed: 4100000  },
  '6':  { applied: 1300000,  viewed: 3700000  },
  '14': { applied: 1200000,  viewed: 3300000  },
  '18': { applied: 1100000,  viewed: 3000000  },
  '19': { applied: 980000,   viewed: 2700000  },
  '4':  { applied: 870000,   viewed: 2400000  },
  '20': { applied: 760000,   viewed: 2100000  },
  '21': { applied: 650000,   viewed: 1800000  },
  '15': { applied: 540000,   viewed: 1500000  },
  '22': { applied: 430000,   viewed: 1200000  },
  '12': { applied: 320000,   viewed: 900000   },
  '23': { applied: 210000,   viewed: 600000   },
};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const lang = req.query.lang || 'en';
  const isHi = lang === 'hi';

  // 1. Category breakdown
  const categoryCount = {};
  schemes.forEach(s => {
    const cat = s.category === 'Business' ? 'Finance' : s.category;
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  const byCategory = CATEGORIES_EN.map((name, i) => ({
    name: isHi ? CATEGORIES_HI[i] : name,
    value: categoryCount[name] || 0
  }));

  // 2. Top 5 schemes
  const schemesWithStats = schemes.map(s => ({
    id: s.id,
    name: s.name,
    ...(SCHEME_STATS[s.id] || { applied: 100000, viewed: 300000 }),
  }));
  const topSchemes = [...schemesWithStats]
    .sort((a, b) => b.applied - a.applied)
    .slice(0, 5)
    .map(s => {
      let name = s.name.replace(' (Urban)', '').replace('Pradhan Mantri ', 'PM ').replace('National Scholarship Portal (NSP)', 'NSP Scholarships');
      if (isHi) {
        const hiMap = {
          'PM Kisan Samman Nidhi': '\u092a\u0940\u090f\u092e \u0915\u093f\u0938\u093e\u0928',
          'Ayushman Bharat PM-JAY': '\u0906\u092f\u0941\u0937\u094d\u092e\u093e\u0928 \u092d\u093e\u0930\u0924',
          'PM Mudra Yojana': '\u092a\u0940\u090f\u092e \u092e\u0941\u0926\u094d\u0930\u093e',
          'PM Awas Yojana': '\u092a\u0940\u090f\u092e \u0906\u0935\u093e\u0938',
          'NSP Scholarships': '\u090f\u0928\u090f\u0938\u092a\u0940 \u091b\u093e\u0924\u094d\u0930\u0935\u0943\u0924\u094d\u0924\u093f',
        };
        name = hiMap[name] || name;
      }
      return { name, applied: s.applied, viewed: s.viewed };
    });

  // 3. State coverage
  const stateCoverageData = [
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

  const stateCoverage = stateCoverageData.map(s => ({
    state: isHi ? (STATE_HI[s.state] || s.state) : s.state,
    schemes: s.schemes,
    beneficiaries: s.beneficiaries,
  }));

  // 4. Monthly trend
  const MONTHS_EN = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const MONTHS_HI = ['\u0905\u0915\u094d\u0924\u0942\u092c\u0930', '\u0928\u0935\u0902\u092c\u0930', '\u0926\u093f\u0938\u0902\u092c\u0930', '\u091c\u0928\u0935\u0930\u0940', '\u092b\u0930\u0935\u0930\u0940', '\u092e\u093e\u0930\u094d\u091a'];
  const trendData = [1200000, 1450000, 1100000, 1780000, 2100000, 2450000];
  const trend = MONTHS_EN.map((m, i) => ({
    month: isHi ? MONTHS_HI[i] : m,
    applications: trendData[i],
  }));

  // 5. Summary
  const summary = {
    totalSchemes: schemes.length,
    totalCategories: byCategory.filter(c => c.value > 0).length,
    statesCovered: stateCoverageData.length,
    activeDeadlines: 12,
    totalBeneficiaries: '28.7Cr',
    totalFunding: '\u20b93.2L Cr',
  };

  return res.status(200).json({
    success: true,
    data: { summary, byCategory, topSchemes, stateCoverage, trend },
  });
}