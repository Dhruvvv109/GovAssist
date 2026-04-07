// Vercel Serverless Function: GET /api/schemes
// rebuilt: 2026-04-07 13:57
import { schemes } from './_data.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });
  return res.status(200).json({ success: true, data: schemes });
}