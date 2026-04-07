// Vercel Serverless Function: POST /api/checkEligibility
import { schemes } from './_data.js';
import { hiSchemes } from './_translations.js';

function translate(scheme, lang) {
  if (lang !== 'hi') return scheme;
  const t = hiSchemes[scheme.id];
  if (!t) return scheme;
  return {
    ...scheme,
    name: t.name || scheme.name,
    description: t.description || scheme.description,
    details: t.details || scheme.details,
    checklist: t.checklist || scheme.checklist,
    documents: t.documents || scheme.documents,
  };
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  const { income, state, occupation, lang } = req.body;
  const incomeNum = parseInt(income, 10) || 0;
  const eligible = schemes.filter(scheme => {
    const incomeOk = incomeNum <= scheme.eligibility.maxIncome;
    const groupOk = scheme.eligibility.targetGroups.includes('Any') || scheme.eligibility.targetGroups.includes(occupation);
    const stateOk = scheme.eligibility.states.includes('All') || scheme.eligibility.states.includes(state);
    return incomeOk && groupOk && stateOk;
  });
  return res.status(200).json({ success: true, data: eligible.map(s => translate(s, lang || 'en')), count: eligible.length });
}