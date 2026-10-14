export type Language = 'ar' | 'en';
export type NavTab = 'home' | 'analyzer' | 'generator' | 'diff' | 'assistant' | 'glossary' | 'library';

export interface LegalArticle {
  id: string;
  lawCode: 'civil' | 'commercial' | 'labor' | 'lease';
  lawNameAr: string;
  lawNameEn: string;
  articleNumber: string;
  category: 'contracts_obligations' | 'leases_property' | 'penalties_damages' | 'commerce_banking' | 'labor_employment';
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
  cassationRulingAr?: string;
  cassationRulingEn?: string;
  contractDraftingTipAr: string;
  contractDraftingTipEn: string;
  sampleContractClauseAr?: string;
  sampleContractClauseEn?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  age: number;
  avatarUrl: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'analysis' | 'draft' | 'comparison';
  title: string;
  contractType: string;
  date: string;
  riskScore?: number;
  previewSnippet: string;
  data?: any;
}

export interface RiskSubScore {
  name: string;
  score: number; // 0 - 100
  weight: number;
  status: 'safe' | 'moderate' | 'critical';
  details: string;
}

export interface LegalLoophole {
  id: string;
  clauseTitle: string;
  originalText?: string;
  riskLevel: 'high' | 'medium' | 'low';
  legalGround: string; // e.g., المادة 147 من القانون المدني
  cassationPrecedent?: string; // أحكام محكمة النقض
  impactAnalysis: string;
  customaryPractice?: string; // العرف التجاري والقانوني
  suggestedRevision: string;
}

export interface ContractAnalysisResult {
  id: string;
  contractTitle: string;
  contractType: string;
  classificationDetails: string;
  governingLaw: string;
  overallRiskScore: number; // 0 - 100 (higher = riskier / lower safety)
  safetyScore: number; // 100 - overallRiskScore
  subScores: RiskSubScore[];
  summary: string;
  strengths: string[];
  weaknesses: string[];
  loopholes: LegalLoophole[];
  customaryLawNotes: string[];
  actionableStrategy: string[];
  analyzedAt: string;
  rawText: string;
  remediatedText?: string;
}

export interface ContractGenerationInput {
  contractType: 'residential_lease' | 'commercial_lease' | 'employment' | 'nda' | 'sale_apartment' | 'services_tech' | 'supply';
  partyOneName: string;
  partyOneId: string;
  partyOneAddress: string;
  partyTwoName: string;
  partyTwoId: string;
  partyTwoAddress: string;
  durationMonths: number;
  startDate: string;
  amountEGP: number;
  paymentCadence: 'monthly' | 'milestones' | 'lump_sum' | 'quarterly';
  governingCity: string;
  includeExplicitBreachClause: boolean; // الشرط الفاسخ الصريح
  includePenalClause: boolean; // الشرط الجزائي
  penalAmountEGP: number;
  disputeResolution: 'egyptian_courts' | 'crcica_arbitration';
  customClauses: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  legalCitations?: string[];
  proactiveSuggestions?: string[];
}

export interface LegalGlossaryTerm {
  termAr: string;
  termEn: string;
  definitionAr: string;
  definitionEn: string;
  legalReference: string;
  practicalTipAr: string;
  practicalTipEn: string;
}
