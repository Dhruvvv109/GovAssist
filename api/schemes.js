// Vercel Serverless Function: GET /api/schemes?lang=hi
import { schemes } from './_data.js';
import { hiSchemes } from './_translations.js';

function translate(scheme, lang) {
  if (lang !== 'hi') return scheme;
  const t = hiSchemes[scheme.id];
  if (!t) return scheme;
  return { ...scheme, name: t.name, description: t.description, details: t.details, checklist: t.checklist, documents: t.documents };
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });
  const lang = req.query.lang || 'en';
  return res.status(200).json({ success: true, data: schemes.map(s => translate(s, lang)) });
}