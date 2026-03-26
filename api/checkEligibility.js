// Vercel Serverless Function: POST /api/checkEligibility
const { schemes } = require('./_data');

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { income, state, occupation } = req.body;
  const incomeNum = parseInt(income, 10) || 0;

  const eligible = schemes.filter(scheme => {
    const incomeOk = incomeNum <= scheme.eligibility.maxIncome;
    const groupOk =
      scheme.eligibility.targetGroups.includes('Any') ||
      scheme.eligibility.targetGroups.includes(occupation);
    const stateOk =
      scheme.eligibility.states.includes('All') ||
      scheme.eligibility.states.includes(state);
    return incomeOk && groupOk && stateOk;
  });

  return res.status(200).json({ success: true, data: eligible, count: eligible.length });
};
