// Vercel Serverless Function: GET /api/schemes
// Returns all 18 Indian government schemes

const schemes = [
  {
    id: '1',
    name: 'PM Kisan Samman Nidhi',
    category: 'Agriculture',
    description: 'Financial support of \u20b96,000/year to small and marginal farmer families across India.',
    eligibility: { maxIncome: 200000, targetGroups: ['Farmer', 'Any'], states: ['All'] },
    details: 'Under PM-KISAN scheme, income support of \u20b96000 per year in three equal installments of \u20b92000 every four months is provided to all land holding farmer families.',
    checklist: ['Must own cultivable land', 'Indian citizen', 'Annual income below \u20b92 Lakhs', 'Not a government employee'],
    documents: ['Aadhaar Card', 'Land Records', 'Bank Passbook', 'Mobile Number'],
    apply_url: 'https://pmkisan.gov.in/'
  },
  {
    id: '2',
    name: 'PM Awas Yojana (Urban)',
    category: 'Housing',
    description: 'Affordable housing for urban poor with interest subsidy up to \u20b92.67 lakhs on home loans.',
    eligibility: { maxIncome: 1800000, targetGroups: ['Any'], states: ['All'] },
    details: 'PMAY provides central assistance to urban local bodies for providing houses to all eligible families.',
    checklist: ['Indian citizen', 'No pucca house in family', 'Income below \u20b918 LPA for MIG-II', 'First-time home buyer'],
    documents: ['Aadhaar Card', 'Income Certificate', 'Property Documents', 'Bank Statement'],
    apply_url: 'https://pmaymis.gov.in/'
  },
  {
    id: '3',
    name: 'Pradhan Mantri Mudra Yojana',
    category: 'Business',
    description: 'Collateral-free loans up to \u20b910 lakhs for non-corporate, non-farm small/micro enterprises.',
    eligibility: { maxIncome: 1000000, targetGroups: ['Entrepreneur', 'Any'], states: ['All'] },
    details: 'MUDRA provides micro-finance under Shishu (up to \u20b950K), Kishor (up to \u20b95L), and Tarun (up to \u20b910L).',
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
    details: 'A small savings scheme for girl children. Minimum \u20b9250/year; maximum \u20b91.5 lakh/year. Tax benefits under Section 80C.',
    checklist: ['Girl child below 10 years of age', 'Guardian must be Indian citizen', 'One account per girl child'],
    documents: ['Birth Certificate of Girl Child', 'Aadhaar of Parent/Guardian', 'Address Proof'],
    apply_url: 'https://www.india.gov.in/spotlight/beti-bachao-beti-padhao-yojna'
  },
  {
    id: '5',
    name: 'Ayushman Bharat PM-JAY',
    category: 'Health',
    description: 'Health coverage of \u20b95 lakh per family per year for secondary and tertiary hospitalization.',
    eligibility: { maxIncome: 100000, targetGroups: ['Any'], states: ['All'] },
    details: 'PM-JAY provides health insurance of \u20b95 lakh per family per year for over 12 crore poor and vulnerable families.',
    checklist: ['Socially-economically backward family', 'No daily wage earner earning over \u20b910,000/month', 'Not covered by CGHS or state scheme'],
    documents: ['Aadhaar Card', 'Ration Card', 'Income Certificate', 'E-card from Ayushman Portal'],
    apply_url: 'https://pmjay.gov.in/'
  },
  {
    id: '6',
    name: 'PM Scholarship Scheme',
    category: 'Education',
    description: 'Scholarship for wards of Ex-servicemen pursuing professional degrees - up to \u20b93,000/month.',
    eligibility: { maxIncome: 600000, targetGroups: ['Student', 'Any'], states: ['All'] },
    details: '\u20b92,500/month for boys and \u20b93,000/month for girls pursuing first professional degrees. Minimum 60% marks required.',
    checklist: ['Ward of Ex-serviceman/Coast Guard', 'First year of professional degree', 'Minimum 60% in Class 12', 'Family income below \u20b96 LPA'],
    documents: ['Aadhaar Card', 'Ex-Serviceman Certificate', 'Marksheet of Class 12', 'Admission Letter'],
    apply_url: 'https://ksb.gov.in/'
  },
  {
    id: '7',
    name: 'PM Ujjwala Yojana',
    category: 'Health',
    description: 'Free LPG connections to women from BPL households to replace polluting chulhas.',
    eligibility: { maxIncome: 100000, targetGroups: ['Any'], states: ['All'] },
    details: 'PMUY provides free LPG connections to adult women from BPL families, covering connection cost, first refill, and hotplate.',
    checklist: ['Adult woman (18+ years)', 'Belong to BPL household', 'No existing LPG connection in household', 'Aadhaar-linked bank account'],
    documents: ['Aadhaar Card', 'BPL Ration Card', 'Bank Passbook', 'Passport-size Photo'],
    apply_url: 'https://pmuy.gov.in/'
  },
  {
    id: '8',
    name: 'Atal Pension Yojana',
    category: 'Business',
    description: 'Guaranteed pension of \u20b91,000-\u20b95,000/month for workers in the unorganised sector after age 60.',
    eligibility: { maxIncome: 999999999, targetGroups: ['Any'], states: ['All'] },
    details: 'APY is a government-backed pension scheme for citizens aged 18-40. Monthly contribution ranges from \u20b942 to \u20b91,454.',
    checklist: ['Age between 18-40 years', 'Must have savings bank account', 'Not an income-tax payer', 'Not a member of any statutory social security scheme'],
    documents: ['Aadhaar Card', 'Bank Passbook', 'Mobile Number'],
    apply_url: 'https://npscra.nsdl.co.in/scheme-details.php'
  },
  {
    id: '9',
    name: 'PM Jan Dhan Yojana',
    category: 'Business',
    description: 'Zero-balance bank accounts with RuPay debit card and \u20b92 lakh accident insurance for all.',
    eligibility: { maxIncome: 999999999, targetGroups: ['Any'], states: ['All'] },
    details: 'PMJDY ensures access to banking, savings, credit, insurance and pension. Includes \u20b910,000 overdraft and \u20b92 lakh RuPay accident insurance.',
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
    details: 'NSP offers pre-matric and post-matric scholarships to SC/ST/OBC/Minority students. Amounts range from \u20b91,000 to \u20b920,000/year.',
    checklist: ['Must be studying in a recognized institution', 'Family income below \u20b98 LPA', 'Must belong to eligible category (SC/ST/OBC/Minority)', 'Minimum 50% marks in previous exam'],
    documents: ['Aadhaar Card', 'Income Certificate', 'Caste Certificate', 'Bank Passbook', 'Bonafide Certificate'],
    apply_url: 'https://scholarships.gov.in/'
  },
  {
    id: '11',
    name: 'PM Fasal Bima Yojana',
    category: 'Agriculture',
    description: 'Crop insurance with very low premium (1.5%-5%) protecting farmers from natural disasters.',
    eligibility: { maxIncome: 999999999, targetGroups: ['Farmer', 'Any'], states: ['All'] },
    details: 'PMFBY provides financial support to farmers for crop loss due to natural disasters. Premium: 1.5% Rabi, 2% Kharif, 5% commercial crops.',
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
    details: 'Startup India provides 3-year tax exemption, simplified compliance, and access to \u20b910,000 crore Fund of Funds.',
    checklist: ['Business incorporated as Pvt Ltd or LLP', 'Less than 10 years since incorporation', 'Annual turnover below \u20b9100 crore', 'Working towards innovation/scalable business model'],
    documents: ['Incorporation Certificate', 'PAN Card', 'Director/Partner Aadhaar', 'Business Pitch Deck'],
    apply_url: 'https://www.startupindia.gov.in/'
  },
  {
    id: '13',
    name: 'PM Kaushal Vikas Yojana',
    category: 'Education',
    description: 'Free skill training and \u20b98,000 reward on certification in 300+ trades for Indian youth.',
    eligibility: { maxIncome: 999999999, targetGroups: ['Student', 'Unemployed', 'Any'], states: ['All'] },
    details: 'PMKVY offers short-term skill training in electronics, construction, retail, IT. Certified candidates receive \u20b98,000 and job placement support.',
    checklist: ['Indian citizen aged 15-45 years', 'School/college dropout or looking for better job', 'No existing skill certificate in same domain'],
    documents: ['Aadhaar Card', 'Educational Certificates', 'Bank Passbook', 'Passport-size Photo'],
    apply_url: 'https://www.pmkvyofficial.org/'
  },
  {
    id: '14',
    name: 'E-Shram Card Scheme',
    category: 'Business',
    description: 'National database for unorganised workers with \u20b92 lakh accident insurance and welfare benefits.',
    eligibility: { maxIncome: 999999999, targetGroups: ['Any'], states: ['All'] },
    details: 'E-Shram registers workers in the unorganised sector and provides \u20b92 lakh accident insurance under PMSBY plus priority access to welfare schemes.',
    checklist: ['Age 16-59 years', 'Working in unorganised sector', 'Not a member of EPFO/ESIC', 'Not an income tax payer'],
    documents: ['Aadhaar Card', 'Bank Account linked to Aadhaar', 'Mobile Number (linked to Aadhaar)'],
    apply_url: 'https://eshram.gov.in/'
  },
  {
    id: '15',
    name: 'PM SVANidhi (Street Vendor Loan)',
    category: 'Business',
    description: 'Working capital loans starting at \u20b910,000 for street vendors affected by COVID-19.',
    eligibility: { maxIncome: 500000, targetGroups: ['Entrepreneur', 'Self-employed', 'Any'], states: ['All'] },
    details: 'PM SVANidhi provides collateral-free loans of \u20b910,000 (1st), \u20b920,000 (2nd), and \u20b950,000 (3rd). Timely repayment earns 7% interest subsidy.',
    checklist: ['Must be a street vendor', 'Possess vending certificate/letter of recommendation from ULB', 'Working prior to March 24, 2020'],
    documents: ['Aadhaar Card', 'Vendor Certificate or ULB Letter', 'Bank Passbook', 'Passport-size Photo'],
    apply_url: 'https://pmsvanidhi.mohua.gov.in/'
  },
  {
    id: '16',
    name: 'Jal Jeevan Mission',
    category: 'Housing',
    description: 'Tap water connection to every rural household in India under Har Ghar Jal.',
    eligibility: { maxIncome: 999999999, targetGroups: ['Any'], states: ['All'] },
    details: 'JJM provides functional household tap connections of 55 litres per person per day to every rural household. Apply through your Gram Panchayat.',
    checklist: ['Must be a rural household', 'No existing piped water connection', 'Indian citizen', 'Register through Gram Panchayat'],
    documents: ['Aadhaar Card', 'Address Proof', 'Ration Card'],
    apply_url: 'https://jaljeevanmission.gov.in/'
  },
  {
    id: '17',
    name: 'Pradhan Mantri Suraksha Bima Yojana',
    category: 'Health',
    description: 'Accidental death & disability insurance of \u20b92 lakh for just \u20b920/year premium.',
    eligibility: { maxIncome: 999999999, targetGroups: ['Any'], states: ['All'] },
    details: 'PMSBY offers \u20b92 lakh for accidental death or total disability and \u20b91 lakh for partial disability at a yearly premium of only \u20b920.',
    checklist: ['Age 18-70 years', 'Active savings bank account', 'Consent for auto-debit of \u20b920/year'],
    documents: ['Aadhaar Card', 'Bank Passbook', 'Mobile Number'],
    apply_url: 'https://jansuraksha.gov.in/'
  },
  {
    id: '18',
    name: 'PM Matru Vandana Yojana',
    category: 'Health',
    description: 'Cash benefit of \u20b95,000 in instalments for pregnant & lactating mothers for their first child.',
    eligibility: { maxIncome: 999999999, targetGroups: ['Any'], states: ['All'] },
    details: 'PMMVY provides \u20b95,000 in three installments: \u20b91,000 on pregnancy registration, \u20b92,000 on ANC check-up, and \u20b92,000 after child birth registration.',
    checklist: ['Pregnant or lactating woman', 'First child only (for general category)', 'Age 19 years or above', 'Register at the nearest AWC/health facility'],
    documents: ['Aadhaar Card', 'MCP Card', 'Bank Passbook', 'Mobile Number'],
    apply_url: 'https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana'
  }
];

module.exports = { schemes };
