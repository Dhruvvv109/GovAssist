// Vercel Serverless Function: GET /api/analytics
import { schemes } from './_data.js';

const CATEGORIES = ['Health', 'Education', 'Agriculture', 'Housing', 'Women & Child', 'Finance'];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const categoryCount = {};
  schemes.forEach(s => {
    const cat = s.category === 'Business' ? 'Finance' : s.category;
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  const byCategory = CATEGORIES.map(name => ({ name, value: categoryCount[name] || 0 }));

  const topSchemes = [
    { name: 'PM Kisan',        applied: 9400000, viewed: 21000000 },
    { name: 'Ayushman Bharat', applied: 7800000, viewed: 18500000 },
    { name: 'MUDRA Yojana',    applied: 5200000, viewed: 14200000 },
    { name: 'PM Awas Yojana',  applied: 4100000, viewed: 11800000 },
    { name: 'NSP Scholarship', applied: 3600000, viewed: 9700000  },
  ];

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

  const trend = [
    { month: 'Oct', applications: 1200000 },
    { month: 'Nov', applications: 1450000 },
    { month: 'Dec', applications: 1100000 },
    { month: 'Jan', applications: 1780000 },
    { month: 'Feb', applications: 2100000 },
    { month: 'Mar', applications: 2450000 },
  ];

  const summary = {
    totalSchemes: schemes.length,
    totalCategories: CATEGORIES.length,
    statesCovered: 36,
    activeDeadlines: 12,
    totalBeneficiaries: '28.7Cr',
    totalFunding: '\u20b93.2L Cr',
  };

  return res.status(200).json({
    success: true,
    data: { summary, byCategory, topSchemes, stateCoverage, trend },
  });
}