// Vercel Serverless Function: POST /api/chatbot
// Handles AI chatbot with scheme-only restriction

const SCHEME_KEYWORDS = [
  'scheme', 'yojana', 'subsidy', 'benefit', 'eligib', 'apply', 'application',
  'document', 'certificate', 'aadhaar', 'income', 'farmer', 'student', 'loan',
  'pension', 'insurance', 'health', 'housing', 'education', 'scholarship',
  'kisan', 'mudra', 'pmjay', 'ayushman', 'ujjwala', 'pmay', 'swanidhi',
  'matru', 'startup', 'kaushal', 'vikas', 'fasal', 'bima', 'jeevan', 'jan dhan',
  'e-shram', 'atal', 'vandana', 'suraksha', 'grant', 'fund', 'government',
  'sarkari', 'central', 'state', 'ministry', 'portal', 'register', 'status',
  'check', 'how to', 'what is', 'who can', 'age', 'category', 'obc', 'sc', 'st',
  'bpl', 'ration card', 'land record', 'bank', 'passbook', 'help', 'guide'
];

function isSchemeRelated(message) {
  const lower = message.toLowerCase();
  return SCHEME_KEYWORDS.some(kw => lower.includes(kw));
}

const OFF_TOPIC_REPLY =
  'I am GovAssist AI, designed exclusively to help with Indian government schemes and benefits. ' +
  'I cannot answer questions on other topics. Please ask me about eligibility, documents, or ' +
  'application steps for schemes like PM Kisan, Ayushman Bharat, MUDRA Loan, and more!';

function getMockReply(message) {
  const lower = message.toLowerCase();
  if (lower.includes('document') || lower.includes('certificate')) {
    return 'Most government schemes require: Aadhaar Card, Income Certificate, Address Proof (Ration Card/Utility Bill), and a Bank Passbook. Specific schemes may also need Land Records, Caste Certificate, or Bonafide Certificate.';
  }
  if (lower.includes('kisan') || lower.includes('farmer') || lower.includes('agriculture')) {
    return 'PM Kisan Samman Nidhi gives Rs.6,000/year to farmer families in 3 installments of Rs.2,000 each. Apply at pmkisan.gov.in. PM Fasal Bima Yojana also protects farmers from crop loss.';
  }
  if (lower.includes('mudra') || lower.includes('business') || lower.includes('loan') || lower.includes('startup')) {
    return 'MUDRA Yojana offers collateral-free loans: Shishu (up to Rs.50K), Kishor (up to Rs.5L), Tarun (up to Rs.10L). Apply at any bank or NBFC. Startup India gives 3-year tax exemption at startupindia.gov.in.';
  }
  if (lower.includes('health') || lower.includes('ayushman') || lower.includes('hospital')) {
    return 'Ayushman Bharat PM-JAY gives Rs.5 lakh/year health cover to BPL families. Check eligibility at pmjay.gov.in. PMSBY gives Rs.2 lakh accident insurance for just Rs.20/year.';
  }
  if (lower.includes('housing') || lower.includes('house') || lower.includes('home') || lower.includes('awas')) {
    return 'PM Awas Yojana (Urban) gives interest subsidy up to Rs.2.67 lakhs on home loans for first-time buyers. Apply at pmaymis.gov.in. Jal Jeevan Mission provides free tap water to rural households.';
  }
  if (lower.includes('scholarship') || lower.includes('student') || lower.includes('education') || lower.includes('study')) {
    return 'For students, visit the National Scholarship Portal (scholarships.gov.in) for 50+ scholarships. PM Kaushal Vikas Yojana gives free skill training with Rs.8,000 reward. PM Scholarship Scheme gives Rs.3,000/month to children of ex-servicemen.';
  }
  if (lower.includes('pension') || lower.includes('atal') || lower.includes('retire')) {
    return 'Atal Pension Yojana guarantees Rs.1,000 to Rs.5,000/month pension after age 60 for unorganised sector workers. Enrol at any bank if you are aged 18-40.';
  }
  if (lower.includes('eligib') || lower.includes('qualify') || lower.includes('check')) {
    return 'To check your eligibility, use our Profile Setup feature! Enter your age, income, state, category, and occupation. Our system will match you with all relevant government schemes automatically.';
  }
  return 'I can help you with Indian government schemes! Ask me about eligibility criteria, required documents, or how to apply for schemes like PM Kisan, Ayushman Bharat, MUDRA Loan, PM Awas Yojana, and many more.';
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { message, history } = req.body;

  // Off-topic guard
  if (!isSchemeRelated(message)) {
    return res.status(200).json({ success: true, reply: OFF_TOPIC_REPLY });
  }

  // If no OpenAI key, use smart mock responses
  if (!process.env.OPENAI_API_KEY) {
    return res.status(200).json({ success: true, reply: getMockReply(message) });
  }

  // OpenAI integration
  try {
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const messages = [
      {
        role: 'system',
        content: `You are GovAssist AI, an expert assistant EXCLUSIVELY for Indian government schemes.

STRICT RULES:
1. ONLY answer questions about Indian government schemes, eligibility, documents, and application processes.
2. If asked about ANYTHING else, politely refuse and redirect to scheme topics.
3. Keep answers under 120 words.
4. Use simple language for common citizens.
5. Mention official portal URLs when describing schemes.

Schemes you know: PM Kisan, MUDRA, Ayushman Bharat, PM Awas Yojana, Startup India, PM Ujjwala, NSP Scholarships, Atal Pension, Jan Dhan, E-Shram, PM Fasal Bima, PMKVY, SVANidhi, Jal Jeevan Mission, PMSBY, PM Matru Vandana.`
      },
      ...(history || []),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 180,
      temperature: 0.4,
    });

    return res.status(200).json({ success: true, reply: completion.choices[0].message.content });
  } catch (err) {
    console.error('OpenAI error:', err.message);
    // Fallback to mock on error
    return res.status(200).json({ success: true, reply: getMockReply(message) });
  }
};
