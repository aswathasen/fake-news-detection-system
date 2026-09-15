export type VerdictType = 'REAL' | 'FAKE' | 'MISLEADING';

export interface AnalysisAspect {
  score: number; // 0 - 100
  label: string;
  details: string;
}

export interface AnalysisBreakdown {
  languageContent: {
    score: number;
    label: string;
    details: string;
  };
  suspiciousPatterns: {
    score: number;
    label: string;
    flagsDetected: string[];
    details?: string;
  };
  sourceCredibility: {
    score: number;
    rating: 'High' | 'Moderate' | 'Low' | 'Unverified';
    domainReputation: string;
    label?: string;
    details?: string;
  };
  emotionalSensationalWording: {
    score: number;
    label: string;
    triggerWords: string[];
    details?: string;
  };
  supportingEvidence: {
    score: number;
    label: string;
    assessment: string;
    details?: string;
  };
}

export interface ExtractedFeatures {
  wordCount: number;
  characterCount: number;
  capsRatio: number;
  exclamationCount: number;
  questionCount: number;
  sentimentPolarity: number; // -1.0 to 1.0
  clickbaitScore: number; // 0 to 100
  namedEntities: string[];
}

export interface AnalysisResult {
  id: string;
  headlineOrContent: string;
  source?: string;
  verdict: VerdictType;
  confidenceScore: number; // 0 to 100
  reasons: string[]; // 3-5 simple reasons
  analysis: AnalysisBreakdown;
  features: ExtractedFeatures;
  timestamp: string;
  aiEngine: string;
  modelConfidenceDistribution?: {
    real: number;
    fake: number;
    misleading: number;
  };
}

export interface DashboardStats {
  totalChecked: number;
  realCount: number;
  fakeCount: number;
  misleadingCount: number;
  avgConfidence: number;
  recentItems: AnalysisResult[];
}

export interface SampleNewsItem {
  id: string;
  title: string;
  category: string;
  expectedVerdict: VerdictType;
  source: string;
  content: string;
  hint: string;
}
