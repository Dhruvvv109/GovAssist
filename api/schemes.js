// Vercel Serverless Function: GET /api/schemes
const { schemes } = require('./_data');

module.exports = function handler(req, res) {
  // Allow CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  return res.status(200).json({ success: true, data: schemes });
};
