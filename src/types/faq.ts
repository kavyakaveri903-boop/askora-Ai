export type FAQCategory = 'College & Education' | 'Technology' | 'Products & Services';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  variations: string[];
  keywords: string[];
}

export interface MatchResult {
  faq: FAQItem;
  score: number; // Cosine similarity score [0, 1]
  confidence: ConfidenceLevel;
  matchedQuestion: string;
  relatedFaqs: FAQItem[];
  matchedVariation?: string;
  queryTokens?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  matchResult?: MatchResult | null;
  isFallback?: boolean;
  fallbackSuggestions?: FAQItem[];
  feedback?: 'helpful' | 'not_helpful' | null;
}

export interface HistoryRecord {
  id: string;
  userQuestion: string;
  matchedQuestion: string;
  answer: string;
  category: FAQCategory | string;
  confidence: ConfidenceLevel;
  score: number;
  timestamp: number;
}
