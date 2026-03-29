const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── Mock Data ────────────────────────────────────────────────────────────────
const schemes = [
  {
    id: '1',
    name: 'PM Kisan Samman Nidhi',
    category: 'Agriculture',
    description: 'Financial support of ₹6,000/year to small and marginal farmer families across India.',
    eligibility: { maxIncome: 200000, targetGroups: ['Farmer', 'Any'], states: ['All'] },
    details: 'Under PM-KISAN scheme, income support of ₹6000 per year in three equal installments of ₹2000 every four months is provided to all land holding farmer families.',
    checklist: ['Must own cultivable land', 'Indian citizen', 'Annual income below ₹2 Lakhs', 'Not a government employee'],
    documents: ['Aadhaar Card', 'Land Records', 'Bank Passbook', 'Mobile Number'],
    apply_url: 'https://pmkisan.gov.in/'
  },
  {
    id: '2',
    name: 'PM Awas Yojana (Urban)',
    category: 'Housing',
    description: 'Affordable housing for urban poor with interest subsidy up to ₹2.67 lakhs on home loans.',
    eligibility: { maxIncome: 1800000, targetGroups: ['Any'], states: ['All'] },
    details: 'PMAY provides central assistance to urban local bodies and other implementing agencies through states/UTs for providing houses to all eligible families.',
    checklist: ['Indian citizen', 'No pucca house in family', 'Income below ₹18 LPA for MIG-II', 'First-time home buyer'],
    documents: ['Aadhaar Card', 'Income Certificate', 'Property Documents', 'Bank Statement'],
    apply_url: 'https://pmaymis.gov.in/'
  },
  {
    id: '3',
    name: 'Pradhan Mantri Mudra Yojana',
    category: 'Business',
    description: 'Collateral-free loans up to ₹10 lakhs for non-corporate, non-farm small/micro enterprises.',
    eligibility: { maxIncome: 1000000, targetGroups: ['Entrepreneur', 'Any'], states: ['All'] },
    details: 'MUDRA provides micro-finance to non-corporate, non-farm small/micro enterprises. Loans under Shishu (up to ₹50K), Kishor (up to ₹5L), and Tarun (up to ₹10L).',
    checklist: ['Age 18-65', 'Run or start a small business', 'No defaulter on any bank loans', 'Business plan ready'],
    documents: ['Aadhaar & PAN Card', 'Business Plan', 'Proof of Business', 'Bank Statement (6 months)'],
    apply_url: 'https://www.mudra.org.in/'
  },
  {
    id: '4',
    name: 'Beti Bachao Beti Padhao',
    category: 'Education',
    description: 'Sukanya Samriddhi savings scheme with 8.2% interest rate to secure a girl child\'s future.',
    eligibility: { maxIncome: 999999999, targetGroups: ['Any'], states: ['All'] },
    details: 'A small savings scheme to ensure a bright future for girl children. Minimum ₹250/year; maximum ₹1.5 lakh/year. Tax benefits under Section 80C.',
    checklist: ['Girl child below 10 years of age', 'Guardian must be Indian citizen', 'One account per girl child'],
    documents: ['Birth Certificate of Girl Child', 'Aadhaar of Parent/Guardian', 'Address Proof'],
    apply_url: 'https://www.india.gov.in/spotlight/beti-bachao-beti-padhao-yojna'
  },
  {
    id: '5',
    name: 'Ayushman Bharat PM-JAY',
    category: 'Health',
    description: 'Health coverage of ₹5 lakh per family per year for secondary and tertiary hospitalization.',
    eligibility: { maxIncome: 100000, targetGroups: ['Any'], states: ['All'] },
    details: 'PM-JAY provides health insurance of ₹5 lakh per family per year for over 12 crore poor and vulnerable families across India.',
    checklist: ['Socially-economically backward family', 'No daily wage earner earning over ₹10,000/month', 'Not covered by CGHS or state scheme'],
    documents: ['Aadhaar Card', 'Ration Card', 'Income Certificate', 'E-card from Ayushman Portal'],
    apply_url: 'https://pmjay.gov.in/'
  },
  {
    id: '6',
    name: 'PM Scholarship Scheme',
    category: 'Education',
    description: 'Scholarship for wards of Ex-servicemen pursuing professional degrees — up to ₹3,000/month.',
    eligibility: { maxIncome: 600000, targetGroups: ['Student', 'Any'], states: ['All'] },
    details: '₹2,500/month for boys and ₹3,000/month for girls pursuing first professional degrees like BE/BTech/MBBS/BBA. Minimum 60% marks required.',
    checklist: ['Ward of Ex-serviceman/Coast Guard', 'First year of professional degree', 'Minimum 60% in Class 12', 'Family income below ₹6 LPA'],
    documents: ['Aadhaar Card', 'Ex-Serviceman Certificate', 'Marksheet of Class 12', 'Admission Letter'],
    apply_url: 'https://ksb.gov.in/'
  },
  {
    id: '7',
    name: 'PM Ujjwala Yojana',
    category: 'Health',
    description: 'Free LPG connections to women from BPL households to replace polluting chulhas.',
    eligibility: { maxIncome: 100000, targetGroups: ['Any'], states: ['All'] },
    details: 'PMUY provides free LPG connections to adult women from BPL families. The scheme covers connection cost, first refill, and hotplate for eligible households.',
    checklist: ['Adult woman (18+ years)', 'Belong to BPL household', 'No existing LPG connection in household', 'Aadhaar-linked bank account'],
    documents: ['Aadhaar Card', 'BPL Ration Card', 'Bank Passbook', 'Passport-size Photo'],
    apply_url: 'https://pmuy.gov.in/'
  },
  {
    id: '8',
    name: 'Atal Pension Yojana',
    category: 'Business',
    description: 'Guaranteed pension of ₹1,000–₹5,000/month for workers in the unorganised sector after age 60.',
    eligibility: { maxIncome: 999999999, targetGroups: ['Any'], states: ['All'] },
    details: 'APY is a government-backed pension scheme for citizens aged 18-40 in unorganised sector. Monthly contribution ranges from ₹42 to ₹1,454 depending on age & desired pension.',
    checklist: ['Age between 18-40 years', 'Must have savings bank account', 'Not an income-tax payer (for government co-contribution)', 'Not a member of any statutory social security scheme'],
    documents: ['Aadhaar Card', 'Bank Passbook', 'Mobile Number'],
    apply_url: 'https://npscra.nsdl.co.in/scheme-details.php'
  },
  {
    id: '9',
    name: 'PM Jan Dhan Yojana',
    category: 'Business',
    description: 'Zero-balance bank accounts with RuPay debit card and ₹2 lakh accident insurance for all.',
    eligibility: { maxIncome: 999999999, targetGroups: ['Any'], states: ['All'] },
    details: 'PMJDY ensures access to financial services like banking, savings, credit, insurance and pension. Includes ₹10,000 overdraft facility and ₹2 lakh RuPay accident insurance.',
    checklist: ['Indian citizen (any age)', 'No existing bank account in family', 'Valid address proof available'],
    documents: ['Aadhaar Card', 'Voter ID or Passport', 'Address Proof', 'Passport-size Photo'],
    apply_url: 'https://pmjdy.gov.in/'
  },
  {
    id: '10',
    name: 'National Scholarship Portal (NSP)',
    category: 'Education',
    description: 'Central hub for 50+ government scholarships for students from Class 1 to PhD level.',
    eligibility: { maxIncome: 800000, targetGroups: ['Student', 'Any'], states: ['All'] },
    details: 'NSP is a one-stop platform offering pre-matric and post-matric scholarships to SC/ST/OBC/Minority/Differently-abled students. Scholarship amounts range from ₹1,000 to ₹20,000/year.',
    checklist: ['Must be studying in a recognized institution', 'Family income below ₹8 LPA', 'Must belong to eligible category (SC/ST/OBC/Minority)', 'Minimum 50% marks in previous exam'],
    documents: ['Aadhaar Card', 'Income Certificate', 'Caste Certificate', 'Bank Passbook', 'Bonafide Certificate'],
    apply_url: 'https://scholarships.gov.in/'
  },
  {
    id: '11',
    name: 'PM Fasal Bima Yojana',
    category: 'Agriculture',
    description: 'Crop insurance with very low premium (1.5%-5%) so farmers are protected from natural disasters.',
    eligibility: { maxIncome: 999999999, targetGroups: ['Farmer', 'Any'], states: ['All'] },
    details: 'PMFBY provides financial support to farmers suffering crop loss due to unseasonal rains, floods, drought, natural disasters. Premium is just 1.5% for Rabi, 2% for Kharif, and 5% for commercial crops.',
    checklist: ['Must be a farmer (owner or tenant)', 'Sown the notified crop in notified area', 'Apply before the cut-off date for the season'],
    documents: ['Aadhaar Card', 'Land records (Khasra/Khatauni)', 'Sowing Certificate', 'Bank Passbook'],
    apply_url: 'https://pmfby.gov.in/'
  },
  {
    id: '12',
    name: 'Startup India Initiative',
    category: 'Business',
    description: '80% tax rebate, fast IPR filing, and seed funding access for registered startups.',
    eligibility: { maxIncome: 999999999, targetGroups: ['Entrepreneur', 'Any'], states: ['All'] },
    details: 'Startup India provides tax exemption for 3 years, simplified compliance, faster exit for startups, and a ₹10,000 crore Fund of Funds. Register on the portal to get all benefits.',
    checklist: ['Business incorporated as Pvt Ltd or LLP', 'Less than 10 years since incorporation', 'Annual turnover below ₹100 crore', 'Working towards innovation/scalable business model'],
    documents: ['Incorporation Certificate', 'PAN Card', 'Director/Partner Aadhaar', 'Business Pitch Deck', 'Website or Product Link'],
    apply_url: 'https://www.startupindia.gov.in/'
  },
  {
    id: '13',
    name: 'PM Kaushal Vikas Yojana',
    category: 'Education',
    description: 'Free skill training and ₹8,000 reward on certification in 300+ trades for Indian youth.',
    eligibility: { maxIncome: 999999999, targetGroups: ['Student', 'Unemployed', 'Any'], states: ['All'] },
    details: 'PMKVY offers short-term skill training in industries like electronics, construction, retail, IT. Certified candidates receive ₹8,000 and benefit from government-backed job placement support.',
    checklist: ['Indian citizen aged 15-45 years', 'School/college dropout or looking for better job', 'No existing skill certificate in same domain'],
    documents: ['Aadhaar Card', 'Educational Certificates', 'Bank Passbook', 'Passport-size Photo'],
    apply_url: 'https://www.pmkvyofficial.org/'
  },
  {
    id: '14',
    name: 'E-Shram Card Scheme',
    category: 'Business',
    description: 'National database for unorganised workers with ₹2 lakh accident insurance and welfare benefits.',
    eligibility: { maxIncome: 999999999, targetGroups: ['Any'], states: ['All'] },
    details: 'E-Shram card registers workers in the unorganised sector (construction, domestic work, street vendors, etc.) and provides ₹2 lakh accident insurance under PMSBY, plus priority access to future welfare schemes.',
    checklist: ['Age 16-59 years', 'Working in unorganised sector', 'Not a member of EPFO/ESIC', 'Not an income tax payer'],
    documents: ['Aadhaar Card', 'Bank Account linked to Aadhaar', 'Mobile Number (linked to Aadhaar)'],
    apply_url: 'https://eshram.gov.in/'
  },
  {
    id: '15',
    name: 'PM SVANidhi (Street Vendor Loan)',
    category: 'Business',
    description: 'Working capital loans starting at ₹10,000 for street vendors affected by COVID-19.',
    eligibility: { maxIncome: 500000, targetGroups: ['Entrepreneur', 'Self-employed', 'Any'], states: ['All'] },
    details: 'PM SVANidhi provides collateral-free working capital loans of ₹10,000 (initial), ₹20,000 (second), and ₹50,000 (third term) to street vendors. Timely repayment earns 7% interest subsidy.',
    checklist: ['Must be a street vendor', 'Survey identified or possess vending certificate/letter of recommendation from ULB', 'Working prior to March 24, 2020'],
    documents: ['Aadhaar Card', 'Vendor Certificate or ULB Letter', 'Bank Passbook', 'Passport-size Photo'],
    apply_url: 'https://pmsvanidhi.mohua.gov.in/'
  },
  {
    id: '16',
    name: 'Jal Jeevan Mission',
    category: 'Housing',
    description: 'Tap water connection to every rural household in India by 2024 under Har Ghar Jal.',
    eligibility: { maxIncome: 999999999, targetGroups: ['Any'], states: ['All'] },
    details: 'JJM aims to provide functional household tap connections (FHTC) of 55 litres per person per day to every rural household. Apply through your Gram Panchayat or local ULB.',
    checklist: ['Must be a rural household', 'No existing piped water connection', 'Indian citizen', 'Register through Gram Panchayat'],
    documents: ['Aadhaar Card', 'Address Proof', 'Ration Card'],
    apply_url: 'https://jaljeevanmission.gov.in/'
  },
  {
    id: '17',
    name: 'Pradhan Mantri Suraksha Bima Yojana',
    category: 'Health',
    description: 'Accidental death & disability insurance of ₹2 lakh for just ₹20/year premium.',
    eligibility: { maxIncome: 999999999, targetGroups: ['Any'], states: ['All'] },
    details: 'PMSBY offers ₹2 lakh for accidental death or total disability and ₹1 lakh for partial disability at a yearly premium of only ₹20. Auto-deducted from bank account every year.',
    checklist: ['Age 18-70 years', 'Active savings bank account', 'Consent for auto-debit of ₹20/year'],
    documents: ['Aadhaar Card', 'Bank Passbook', 'Mobile Number'],
    apply_url: 'https://jansuraksha.gov.in/'
  },
  {
    id: '18',
    name: 'PM Matru Vandana Yojana',
    category: 'Health',
    description: 'Cash benefit of ₹5,000 in instalments for pregnant & lactating mothers for their first child.',
    eligibility: { maxIncome: 999999999, targetGroups: ['Any'], states: ['All'] },
    details: 'PMMVY provides maternity benefit of ₹5,000 in three installments: ₹1,000 on early registration of pregnancy, ₹2,000 on minimum one ANC check-up, and ₹2,000 after child birth registration.',
    checklist: ['Pregnant or lactating woman', 'First child only (for general category)', 'Age 19 years or above', 'Register at the nearest AWC/health facility'],
    documents: ['Aadhaar Card', 'MCP Card', 'Bank Passbook', 'Mobile Number'],
    apply_url: 'https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana'
  }
];

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET all schemes
app.get('/api/schemes', (req, res) => {
  res.json({ success: true, data: schemes });
});

// GET deadlines
app.get('/api/deadlines', (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const data = schemes
    .filter(s => s.deadline)
    .map(s => {
      const dl = new Date(s.deadline);
      const daysLeft = Math.ceil((dl - today) / (1000 * 60 * 60 * 24));
      return { id: s.id, name: s.name, category: s.category, deadline: s.deadline, daysLeft, apply_url: s.apply_url };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);
  res.json({ success: true, data });
});

// GET analytics data
app.get('/api/analytics', (req, res) => {
  const CATEGORIES = ['Health', 'Education', 'Agriculture', 'Housing', 'Women & Child', 'Finance'];
  const categoryCount = {};
  schemes.forEach(s => {
    const cat = ['Women & Child', 'Finance'].includes(s.category) ? s.category
      : s.category === 'Business' ? 'Finance' : s.category;
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
    totalFunding: '₹3.2L Cr',
  };

  res.json({ success: true, data: { summary, byCategory, topSchemes, stateCoverage, trend } });
});

// POST check eligibility (filter by user profile)
app.post('/api/checkEligibility', (req, res) => {
  const { age, income, state, category, occupation } = req.body;
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

  res.json({ success: true, data: eligible, count: eligible.length });
});

// ─── Helper: is the message related to government schemes? ────────────────────
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

// POST chatbot (OpenAI integration, scheme-only)
app.post('/api/ai/chatbot', async (req, res) => {
  const { message, history } = req.body;

  // ── Off-topic guard ──────────────────────────────────────────────────────────
  if (!isSchemeRelated(message)) {
    return res.json({ success: true, reply: OFF_TOPIC_REPLY });
  }

  // ── Mock Mode (no OpenAI key) ────────────────────────────────────────────────
  if (!process.env.OPENAI_API_KEY) {
    const lowerMsg = message.toLowerCase();
    let reply = 'I can help you with Indian government schemes! Ask me about eligibility criteria, required documents, or how to apply for schemes like PM Kisan, Ayushman Bharat, MUDRA Loan, PM Awas Yojana, and many more.';

    if (lowerMsg.includes('document') || lowerMsg.includes('certificate')) {
      reply = 'Most government schemes require: Aadhaar Card, Income Certificate, Address Proof (Ration Card/Utility Bill), and a Bank Passbook. Specific schemes may also need Land Records, Caste Certificate, or Bonafide Certificate from your institution.';
    } else if (lowerMsg.includes('kisan') || lowerMsg.includes('farmer') || lowerMsg.includes('agriculture')) {
      reply = 'PM Kisan Samman Nidhi gives ₹6,000/year to farmer families in 3 installments of ₹2,000 each. To apply, visit pmkisan.gov.in → New Farmer Registration → enter Aadhaar. You also need land records and a bank passbook. PM Fasal Bima Yojana is another scheme for crop loss protection.';
    } else if (lowerMsg.includes('mudra') || lowerMsg.includes('business') || lowerMsg.includes('loan') || lowerMsg.includes('startup')) {
      reply = 'MUDRA Yojana offers collateral-free loans: Shishu (up to ₹50K), Kishor (up to ₹5L), Tarun (up to ₹10L). Visit any bank/NBFC and request a MUDRA form. For tech startups, Startup India gives 3-year tax exemption — register at startupindia.gov.in.';
    } else if (lowerMsg.includes('health') || lowerMsg.includes('ayushman') || lowerMsg.includes('hospital')) {
      reply = 'Ayushman Bharat PM-JAY gives ₹5 lakh/year health cover to BPL families. Check eligibility at pmjay.gov.in using your Aadhaar. PM Ujjwala Yojana provides free LPG connections to BPL women. PMSBY gives ₹2 lakh accident insurance for just ₹20/year.';
    } else if (lowerMsg.includes('housing') || lowerMsg.includes('house') || lowerMsg.includes('home') || lowerMsg.includes('awas')) {
      reply = 'PM Awas Yojana (Urban) gives interest subsidy up to ₹2.67 lakhs on home loans for first-time buyers. Apply at pmaymis.gov.in. Jal Jeevan Mission provides free tap water connections to rural households — apply through your Gram Panchayat.';
    } else if (lowerMsg.includes('scholarship') || lowerMsg.includes('student') || lowerMsg.includes('education') || lowerMsg.includes('study')) {
      reply = 'For students, check the National Scholarship Portal (scholarships.gov.in) — 50+ scholarships for SC/ST/OBC/Minority students. PM Kaushal Vikas Yojana gives free skill training with ₹8,000 reward. PM Scholarship Scheme gives ₹3,000/month to children of ex-servicemen.';
    } else if (lowerMsg.includes('pension') || lowerMsg.includes('atal') || lowerMsg.includes('retire')) {
      reply = 'Atal Pension Yojana guarantees ₹1,000–₹5,000/month pension after age 60 for workers in the unorganised sector. Enrol at any bank between ages 18-40. Monthly contributions range from ₹42 to ₹1,454 depending on your desired pension amount.';
    } else if (lowerMsg.includes('eligib') || lowerMsg.includes('qualify') || lowerMsg.includes('check')) {
      reply = 'To check your eligibility for government schemes, use our Profile Setup feature — enter your age, income, state, category, and occupation. Our system will match you with all relevant central and state government schemes automatically!';
    }

    return res.json({ success: true, reply });
  }

  // ── OpenAI Mode ──────────────────────────────────────────────────────────────
  try {
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const messages = [
      {
        role: 'system',
        content: `You are GovAssist AI, an expert assistant EXCLUSIVELY for Indian government schemes, subsidies, and welfare programs.

STRICT RULES:
1. ONLY answer questions about Indian government schemes, eligibility, documents, application processes, and benefits.
2. If a user asks about ANYTHING else (sports, politics, entertainment, coding, general knowledge, etc.), politely refuse and redirect them to scheme-related topics.
3. Keep answers under 120 words — concise and to the point.
4. Use simple, clear language suitable for common citizens.
5. Always mention the official portal URL when describing a scheme.
6. If asked about eligibility, ask for age, income, state, and occupation to give personalized results.

Topics you CAN help with: PM Kisan, MUDRA, Ayushman Bharat, PM Awas Yojana, Startup India, PM Ujjwala, NSP Scholarships, Atal Pension, Jan Dhan, E-Shram, PM Fasal Bima, PMKVY, SVANidhi, Jal Jeevan Mission, PMSBY, PM Matru Vandana, and all other Indian government welfare schemes.`
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

    const reply = completion.choices[0].message.content;
    res.json({ success: true, reply });
  } catch (err) {
    console.error('OpenAI error:', err.message);
    res.status(500).json({ success: false, error: 'AI service error. Please try again.' });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ GovAssist API running on http://localhost:${PORT}`));
