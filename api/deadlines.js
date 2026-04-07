// Vercel Serverless Function: GET /api/deadlines
// rebuilt: 2026-04-07 13:57
import { schemes } from './_data.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlines = schemes
    .filter(s => s.deadline)
    .map(s => {
      const dl = new Date(s.deadline);
      const daysLeft = Math.ceil((dl - today) / (1000 * 60 * 60 * 24));
      return {
        id: s.id,
        name: s.name,
        category: s.category,
        deadline: s.deadline,
        daysLeft,
        apply_url: s.apply_url,
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return res.status(200).json({ success: true, data: deadlines });
}
