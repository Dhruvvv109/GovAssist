// Vercel Serverless Function: POST /api/chatbot
// Handles AI chatbot — scheme-only guard + bilingual mock + optional OpenAI

const SCHEME_KEYWORDS = [
  'scheme', 'yojana', 'subsidy', 'benefit', 'eligib', 'apply', 'application',
  'document', 'certificate', 'aadhaar', 'income', 'farmer', 'student', 'loan',
  'pension', 'insurance', 'health', 'housing', 'education', 'scholarship',
  'kisan', 'mudra', 'pmjay', 'ayushman', 'ujjwala', 'pmay', 'swanidhi',
  'matru', 'startup', 'kaushal', 'vikas', 'fasal', 'bima', 'jeevan', 'jan dhan',
  'e-shram', 'atal', 'vandana', 'suraksha', 'grant', 'fund', 'government',
  'sarkari', 'central', 'state', 'ministry', 'portal', 'register', 'status',
  'check', 'how to', 'what is', 'who can', 'age', 'category', 'obc', 'sc', 'st',
  'bpl', 'ration card', 'land record', 'bank', 'passbook', 'help', 'guide',
  // Hindi keywords
  'योजना', 'सब्सिडी', 'पात्र', 'आवेदन', 'दस्तावेज़', 'आय', 'किसान', 'छात्र', 'लोन',
  'पेंशन', 'स्वास्थ्य', 'आवास', 'शिक्षा', 'छात्रवृत्ति', 'व्यवसाय', 'सरकार',
];

function isSchemeRelated(message) {
  const lower = message.toLowerCase();
  return SCHEME_KEYWORDS.some(kw => lower.includes(kw));
}

function getOffTopicReply(lang) {
  return lang === 'hi'
    ? 'मैं GovAssist AI हूं, जो केवल भारतीय सरकारी योजनाओं के लिए बना है। मैं अन्य विषयों पर उत्तर नहीं दे सकता। कृपया PM किसान, आयुष्मान भारत, MUDRA लोन जैसी योजनाओं के बारे में पूछें!'
    : 'I am GovAssist AI, designed exclusively to help with Indian government schemes. I cannot answer other topics. Please ask about eligibility, documents, or how to apply for schemes like PM Kisan, Ayushman Bharat, MUDRA Loan, and more!';
}

function getMockReply(message, lang = 'en') {
  const lower = message.toLowerCase();
  const hi = lang === 'hi';

  if (lower.includes('document') || lower.includes('certificate') || lower.includes('dastave') || lower.includes('दस्तावेज़')) {
    return hi
      ? 'अधिकांश सरकारी योजनाओं के लिए आवश्यक: आधार कार्ड, आय प्रमाण पत्र, पते का प्रमाण (राशन कार्ड/बिजली बिल), और बैंक पासबुक। कुछ योजनाओं के लिए भूमि अभिलेख, जाति प्रमाण पत्र भी चाहिए।'
      : 'Most government schemes require: Aadhaar Card, Income Certificate, Address Proof (Ration Card/Utility Bill), and a Bank Passbook. Specific schemes may also need Land Records, Caste Certificate, or Bonafide Certificate.';
  }
  if (lower.includes('kisan') || lower.includes('farmer') || lower.includes('agriculture') || lower.includes('किसान')) {
    return hi
      ? 'PM किसान सम्मान निधि किसान परिवारों को ₹6,000/वर्ष तीन किस्तों में देती है। pmkisan.gov.in पर जाएं → नया किसान पंजीकरण → आधार दर्ज करें। PM फसल बीमा योजना भी फसल नुकसान से बचाती है।'
      : 'PM Kisan Samman Nidhi gives Rs.6,000/year to farmer families in 3 installments. Apply at pmkisan.gov.in → New Farmer Registration. PM Fasal Bima Yojana also protects farmers from crop loss.';
  }
  if (lower.includes('mudra') || lower.includes('business') || lower.includes('loan') || lower.includes('startup') || lower.includes('व्यवसाय') || lower.includes('लोन')) {
    return hi
      ? 'MUDRA योजना बिना गारंटी लोन देती है: शिशु (₹50K तक), किशोर (₹5L तक), तरुण (₹10L तक)। किसी भी बैंक में आवेदन करें। Startup India 3 साल की कर छूट प्रदान करती है — startupindia.gov.in पर रजिस्टर करें।'
      : 'MUDRA Yojana offers collateral-free loans: Shishu (up to Rs.50K), Kishor (up to Rs.5L), Tarun (up to Rs.10L). Apply at any bank or NBFC. Startup India gives 3-year tax exemption at startupindia.gov.in.';
  }
  if (lower.includes('health') || lower.includes('ayushman') || lower.includes('hospital') || lower.includes('स्वास्थ्य') || lower.includes('आयुष्मान')) {
    return hi
      ? 'आयुष्मान भारत PM-JAY BPL परिवारों को ₹5 लाख/वर्ष स्वास्थ्य बीमा देती है। pmjay.gov.in पर पात्रता जांचें। PMSBY मात्र ₹20/वर्ष में ₹2 लाख दुर्घटना बीमा देती है।'
      : 'Ayushman Bharat PM-JAY gives Rs.5 lakh/year health cover to BPL families. Check eligibility at pmjay.gov.in. PMSBY gives Rs.2 lakh accident insurance for just Rs.20/year.';
  }
  if (lower.includes('housing') || lower.includes('house') || lower.includes('home') || lower.includes('awas') || lower.includes('आवास') || lower.includes('घर')) {
    return hi
      ? 'PM आवास योजना (शहरी) पहली बार घर खरीदने वालों को ₹2.67 लाख तक की ब्याज सब्सिडी देती है। pmaymis.gov.in पर आवेदन करें। जल जीवन मिशन ग्रामीण घरों को मुफ्त नल जल देती है।'
      : 'PM Awas Yojana (Urban) gives interest subsidy up to Rs.2.67 lakhs for first-time home buyers. Apply at pmaymis.gov.in. Jal Jeevan Mission provides free tap water to rural households.';
  }
  if (lower.includes('scholarship') || lower.includes('student') || lower.includes('education') || lower.includes('study') || lower.includes('छात्रवृत्ति') || lower.includes('शिक्षा')) {
    return hi
      ? 'छात्रों के लिए National Scholarship Portal (scholarships.gov.in) पर 50+ छात्रवृत्तियां हैं। PM कौशल विकास योजना ले मुफ्त प्रशिक्षण के साथ ₹8,000 पुरस्कार मिलता है।'
      : 'For students, visit the National Scholarship Portal (scholarships.gov.in) for 50+ scholarships. PM Kaushal Vikas Yojana gives free skill training with Rs.8,000 reward.';
  }
  if (lower.includes('pension') || lower.includes('atal') || lower.includes('retire') || lower.includes('पेंशन')) {
    return hi
      ? 'अटल पेंशन योजना 18-40 वर्ष के असंगठित क्षेत्र के कर्मचारियों को 60 वर्ष बाद ₹1,000-₹5,000/माह पेंशन की गारंटी देती है। किसी भी बैंक में नामांकन कराएं।'
      : 'Atal Pension Yojana guarantees Rs.1,000 to Rs.5,000/month pension after age 60 for unorganised sector workers ages 18-40. Enrol at any bank.';
  }
  if (lower.includes('eligib') || lower.includes('qualify') || lower.includes('check') || lower.includes('पात्र') || lower.includes('योग्य')) {
    return hi
      ? 'पात्रता जांचने के लिए प्रोफ़ाइल सेटअप सुविधा का उपयोग करें! अपनी उम्र, आय, राज्य, श्रेणी और व्यवसाय दर्ज करें और हम आपके लिए सभी योजनाएं खोज देंगे।'
      : 'To check your eligibility, use our Profile Setup feature! Enter your age, income, state, category, and occupation. Our system will match you with all relevant government schemes automatically.';
  }
  return hi
    ? 'नमस्ते! मैं भारतीय सरकारी योजनाओं के बारे में मदद कर सकता हूं। PM किसान, आयुष्मान भारत, MUDRA लोन, PM आवास योजना के बारे में पूछें!'
    : 'I can help you with Indian government schemes! Ask me about eligibility, required documents, or how to apply for PM Kisan, Ayushman Bharat, MUDRA Loan, PM Awas Yojana, and more.';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { message, history, lang = 'en' } = req.body;

  // Off-topic guard
  if (!isSchemeRelated(message)) {
    return res.status(200).json({ success: true, reply: getOffTopicReply(lang) });
  }

  // If no OpenAI key configured, use smart mock responses
  if (!process.env.OPENAI_API_KEY) {
    return res.status(200).json({ success: true, reply: getMockReply(message, lang) });
  }

  // OpenAI integration with language-aware system prompt
  try {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const langInstruction = lang === 'hi'
      ? 'IMPORTANT: The user has selected Hindi. You MUST respond entirely in Hindi (हिंदी में जवाब दें).'
      : 'Respond in English.';

    const messages = [
      {
        role: 'system',
        content: `You are GovAssist AI, an expert assistant EXCLUSIVELY for Indian government schemes.
STRICT RULES:
1. ONLY answer questions about Indian government schemes, eligibility, documents, and application processes.
2. If asked about ANYTHING else, politely refuse and redirect to scheme topics.
3. Keep answers under 120 words. Use simple language suitable for common citizens.
4. Mention official portal URLs when describing schemes.
5. ${langInstruction}

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
    return res.status(200).json({ success: true, reply: getMockReply(message, lang) });
  }
}
