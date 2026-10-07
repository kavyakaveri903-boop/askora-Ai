/**
 * NLP Engine for Askora AI
 *
 * Implements:
 * 1. Text Preprocessing (lowercasing, normalization, punctuation removal)
 * 2. Tokenization & Stemming (morphological suffix reduction)
 * 3. Stop-word removal with domain-intent preservation
 * 4. N-gram generation (unigrams + bigrams)
 * 5. TF-IDF (Term Frequency - Inverse Document Frequency) Vectorization
 * 6. Cosine Similarity Calculation
 * 7. Best FAQ Retrieval with Confidence Thresholding
 * 8. Related Questions Recommender
 */

import { FAQItem, MatchResult, ConfidenceLevel, FAQCategory } from '../types/faq';
import { FAQ_DATASET } from '../data/faqDataset';

// Common English stop words that do not carry distinctive topical semantic weight
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
  'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could', 'couldn\'t',
  'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here',
  'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it',
  'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my',
  'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other',
  'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t',
  'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some',
  'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re',
  'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
  'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were',
  'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which',
  'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would',
  'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours',
  'yourself', 'yourselves', 'please', 'tell', 'want', 'know', 'like'
]);

// Synonyms map to bridge common natural language variations to unified root terms
const SYNONYM_MAP: Record<string, string> = {
  'forgot': 'reset',
  'forgotten': 'reset',
  'remember': 'reset',
  'lost': 'recover',
  'lose': 'recover',
  'enroll': 'register',
  'enrolling': 'register',
  'enrollment': 'register',
  'signup': 'register',
  'application': 'register',
  'apply': 'register',
  'fee': 'tuition',
  'fees': 'tuition',
  'pay': 'tuition',
  'payment': 'tuition',
  'marks': 'gpa',
  'grade': 'gpa',
  'grades': 'gpa',
  'cgpa': 'gpa',
  'hostel': 'housing',
  'dorm': 'housing',
  'dormitory': 'housing',
  'accommodation': 'housing',
  'exam': 'examination',
  'exams': 'examination',
  'finals': 'examination',
  'test': 'examination',
  'support': 'contact',
  'helpdesk': 'contact',
  'assistance': 'contact',
  'customer': 'contact',
  'agent': 'contact',
  'cancel': 'subscription',
  'unsubscribe': 'subscription',
  'money': 'refund',
  'reimbursement': 'refund',
  'specs': 'requirements',
  'prerequisites': 'requirements',
  'criteria': 'requirements',
  'badge': 'id card',
  'wireless': 'wifi',
  'internet': 'wifi'
};

/**
 * Step 1 & 2 & 3: Normalizes text by lowercasing, stripping special punctuation,
 * and collapsing repeated spaces.
 */
export function preprocessText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[’']/g, '') // remove apostrophes cleanly (e.g. can't -> cant)
    .replace(/[^a-z0-9\s-]/g, ' ') // replace punctuation with whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Lightweight stemming rule-set to normalize common English word endings.
 */
function stemWord(word: string): string {
  if (word.length <= 3) return word;

  let stem = word;
  if (stem.endsWith('ing') && stem.length > 5) stem = stem.slice(0, -3);
  else if (stem.endsWith('ed') && stem.length > 4) stem = stem.slice(0, -2);
  else if (stem.endsWith('ies') && stem.length > 4) stem = stem.slice(0, -3) + 'y';
  else if (stem.endsWith('es') && stem.length > 4) stem = stem.slice(0, -2);
  else if (stem.endsWith('s') && !stem.endsWith('ss') && stem.length > 3) stem = stem.slice(0, -1);
  else if (stem.endsWith('ment') && stem.length > 6) stem = stem.slice(0, -4);
  else if (stem.endsWith('tion') && stem.length > 6) stem = stem.slice(0, -4);
  else if (stem.endsWith('able') && stem.length > 6) stem = stem.slice(0, -4);

  return stem;
}

/**
 * Step 4 & 5: Tokenization, stop-word removal, synonym mapping, and stemming.
 * Also extracts useful bigrams for phrase matching (e.g. 'reset password', 'two factor').
 */
export function tokenize(text: string): string[] {
  const cleaned = preprocessText(text);
  if (!cleaned) return [];

  const rawTokens = cleaned.split(/\s+/).filter(Boolean);
  const meaningfulTokens: string[] = [];

  for (const token of rawTokens) {
    if (!STOP_WORDS.has(token) && token.length > 1) {
      const canonical = SYNONYM_MAP[token] || token;
      const stemmed = stemWord(canonical);
      meaningfulTokens.push(stemmed);
    }
  }

  // Generate bigrams to capture composite concepts like "reset password", "two factor"
  const bigrams: string[] = [];
  for (let i = 0; i < meaningfulTokens.length - 1; i++) {
    bigrams.push(`${meaningfulTokens[i]}_${meaningfulTokens[i + 1]}`);
  }

  return [...meaningfulTokens, ...bigrams];
}

/**
 * Represents a document's TF-IDF vector as a sparse dictionary (term -> weight).
 */
export type TFIDFVector = Map<string, number>;

/**
 * TF-IDF Index for an FAQ collection
 */
export class FAQIndex {
  private faqs: FAQItem[];
  private idf: Map<string, number> = new Map();
  private docVectors: Map<string, { vector: TFIDFVector; norm: number; faq: FAQItem }> = new Map();
  // Variations index to match directly against human phrasing variations
  private variationVectors: Array<{
    variationText: string;
    faqId: string;
    vector: TFIDFVector;
    norm: number;
    faq: FAQItem;
  }> = [];

  constructor(faqs: FAQItem[]) {
    this.faqs = faqs;
    this.buildIndex();
  }

  /**
   * Build the TF-IDF representation across all FAQs.
   */
  private buildIndex(): void {
    const totalDocs = this.faqs.length;
    const documentTermSets: Array<{ faq: FAQItem; terms: Set<string>; tokens: string[] }> = [];

    // Step 1: Collect document frequency (DF) for each term across all FAQs
    const dfMap = new Map<string, number>();

    for (const faq of this.faqs) {
      // Document text merges: Question (x3 weight), variations (x2.5 weight), keywords (x2 weight), and answer (x1)
      const docTokens: string[] = [];

      // Primary question tokens
      const questionTokens = tokenize(faq.question);
      for (let i = 0; i < 3; i++) docTokens.push(...questionTokens);

      // Variations tokens
      for (const variation of faq.variations) {
        const varTokens = tokenize(variation);
        for (let i = 0; i < 2; i++) docTokens.push(...varTokens);
      }

      // Keywords tokens
      for (const kw of faq.keywords) {
        docTokens.push(...tokenize(kw));
      }

      // Answer tokens
      docTokens.push(...tokenize(faq.answer));

      const uniqueTerms = new Set(docTokens);
      uniqueTerms.forEach(term => {
        dfMap.set(term, (dfMap.get(term) || 0) + 1);
      });

      documentTermSets.push({ faq, terms: uniqueTerms, tokens: docTokens });
    }

    // Step 2: Calculate IDF for each term: log(1 + (N / (1 + df))) + 1
    dfMap.forEach((df, term) => {
      const idfValue = Math.log(1 + (totalDocs / (1 + df))) + 1;
      this.idf.set(term, idfValue);
    });

    // Step 3: Compute TF-IDF vectors for documents
    for (const doc of documentTermSets) {
      const vector = this.createTFIDFVector(doc.tokens);
      const norm = this.calculateVectorNorm(vector);
      this.docVectors.set(doc.faq.id, { vector, norm, faq: doc.faq });
    }

    // Step 4: Index each individual question variation for fine-grained semantic match
    for (const faq of this.faqs) {
      const phrases = [faq.question, ...faq.variations];
      for (const phrase of phrases) {
        const varTokens = tokenize(phrase);
        const vector = this.createTFIDFVector(varTokens);
        const norm = this.calculateVectorNorm(vector);
        this.variationVectors.push({
          variationText: phrase,
          faqId: faq.id,
          vector,
          norm,
          faq
        });
      }
    }
  }

  /**
   * Transforms a token list into a TF-IDF weighted vector.
   */
  public createTFIDFVector(tokens: string[]): TFIDFVector {
    const vector = new Map<string, number>();
    if (tokens.length === 0) return vector;

    // Term Frequency (TF): count(t) / total_tokens
    const termCounts = new Map<string, number>();
    for (const token of tokens) {
      termCounts.set(token, (termCounts.get(token) || 0) + 1);
    }

    termCounts.forEach((count, term) => {
      const tf = count / tokens.length;
      const idfValue = this.idf.get(term) || Math.log(1 + this.faqs.length) + 1;
      vector.set(term, tf * idfValue);
    });

    return vector;
  }

  /**
   * Euclidean norm (L2 norm) of a vector: sqrt(sum(v_i^2))
   */
  private calculateVectorNorm(vector: TFIDFVector): number {
    let sumSquares = 0;
    vector.forEach(val => {
      sumSquares += val * val;
    });
    return Math.sqrt(sumSquares);
  }

  /**
   * Step 7: Cosine Similarity between two vectors:
   * cos(u, v) = (u . v) / (||u|| * ||v||)
   */
  public calculateSimilarity(
    vecA: TFIDFVector,
    normA: number,
    vecB: TFIDFVector,
    normB: number
  ): number {
    if (normA === 0 || normB === 0) return 0;

    let dotProduct = 0;
    // Iterate over smaller vector for performance
    const [smaller, larger] = vecA.size <= vecB.size ? [vecA, vecB] : [vecB, vecA];

    smaller.forEach((valA, term) => {
      const valB = larger.get(term);
      if (valB !== undefined) {
        dotProduct += valA * valB;
      }
    });

    const similarity = dotProduct / (normA * normB);
    return Math.min(1.0, Math.max(0.0, similarity));
  }

  /**
   * Step 8, 9, 10: Finds the best matching FAQ for a user query.
   *
   * @param query The raw user question
   * @param category Optional category filter ('All Topics' or specific category)
   * @returns MatchResult including confidence, similarity score, and related questions
   */
  public findBestMatch(
    query: string,
    category?: FAQCategory | 'All Topics' | null
  ): MatchResult {
    const queryTokens = tokenize(query);
    const queryVector = this.createTFIDFVector(queryTokens);
    const queryNorm = this.calculateVectorNorm(queryVector);

    // Filter FAQs if category is explicitly selected
    const allowedFaqs = !category || category === 'All Topics'
      ? this.faqs
      : this.faqs.filter(f => f.category === category);

    const allowedIds = new Set(allowedFaqs.map(f => f.id));

    if (queryTokens.length === 0 || queryNorm === 0) {
      // Empty or stop-words-only query
      const defaultFaq = allowedFaqs[0] || this.faqs[0];
      return {
        faq: defaultFaq,
        score: 0,
        confidence: 'LOW',
        matchedQuestion: defaultFaq.question,
        relatedFaqs: this.getRelatedQuestions(defaultFaq.id, allowedFaqs),
        queryTokens: []
      };
    }

    // Step A: Compare against document vectors
    const scoredFaqs: Array<{
      faq: FAQItem;
      score: number;
      matchedVariation: string;
    }> = [];

    // Check individual phrase variations first (gives peak score when user types a known variation)
    const variationScores = new Map<string, { score: number; phrase: string }>();

    for (const varEntry of this.variationVectors) {
      if (!allowedIds.has(varEntry.faqId)) continue;

      const sim = this.calculateSimilarity(
        queryVector,
        queryNorm,
        varEntry.vector,
        varEntry.norm
      );

      const existing = variationScores.get(varEntry.faqId);
      if (!existing || sim > existing.score) {
        variationScores.set(varEntry.faqId, { score: sim, phrase: varEntry.variationText });
      }
    }

    // Blend document score & variation score
    for (const faq of allowedFaqs) {
      const docEntry = this.docVectors.get(faq.id);
      let docScore = 0;
      if (docEntry) {
        docScore = this.calculateSimilarity(queryVector, queryNorm, docEntry.vector, docEntry.norm);
      }

      const varInfo = variationScores.get(faq.id);
      const varScore = varInfo ? varInfo.score : 0;

      // Combined score: heavily weighted towards best specific phrase match with doc support
      const finalScore = Math.max(varScore, (docScore * 0.4) + (varScore * 0.6));
      const bestPhrase = varInfo && varInfo.score > docScore ? varInfo.phrase : faq.question;

      scoredFaqs.push({
        faq,
        score: finalScore,
        matchedVariation: bestPhrase
      });
    }

    // Sort by descending similarity score
    scoredFaqs.sort((a, b) => b.score - a.score);

    const bestCandidate = scoredFaqs[0];

    // Determine confidence level
    // HIGH: score >= 0.40
    // MEDIUM: 0.20 <= score < 0.40
    // LOW: score < 0.20
    let confidence: ConfidenceLevel = 'LOW';
    if (bestCandidate && bestCandidate.score >= 0.40) {
      confidence = 'HIGH';
    } else if (bestCandidate && bestCandidate.score >= 0.20) {
      confidence = 'MEDIUM';
    } else {
      confidence = 'LOW';
    }

    const matchedFaq = bestCandidate ? bestCandidate.faq : (allowedFaqs[0] || this.faqs[0]);
    const matchedScore = bestCandidate ? bestCandidate.score : 0;
    const matchedVariation = bestCandidate ? bestCandidate.matchedVariation : matchedFaq.question;

    // Related questions: take 2-3 other top ranked FAQs from scored candidates,
    // or from same category if score is low
    const relatedFaqs = this.getRelatedQuestions(matchedFaq.id, allowedFaqs, scoredFaqs);

    return {
      faq: matchedFaq,
      score: matchedScore,
      confidence,
      matchedQuestion: matchedFaq.question,
      matchedVariation,
      relatedFaqs,
      queryTokens
    };
  }

  /**
   * Retrieves 2-3 related FAQ questions to display to the user.
   */
  public getRelatedQuestions(
    excludeId: string,
    faqPool: FAQItem[],
    rankedCandidates?: Array<{ faq: FAQItem; score: number }>
  ): FAQItem[] {
    const results: FAQItem[] = [];

    // If we have scored candidates from the search, take candidates ranked #2 and #3
    if (rankedCandidates && rankedCandidates.length > 1) {
      for (const item of rankedCandidates) {
        if (item.faq.id !== excludeId && item.score > 0.05) {
          results.push(item.faq);
          if (results.length >= 3) break;
        }
      }
    }

    // If not enough from ranked list, backfill from same category
    if (results.length < 3) {
      const targetCategory = (faqPool.find(f => f.id === excludeId) || faqPool[0])?.category;
      for (const item of faqPool) {
        if (item.id !== excludeId && !results.some(r => r.id === item.id)) {
          if (item.category === targetCategory) {
            results.push(item);
            if (results.length >= 3) break;
          }
        }
      }
    }

    // Fallback: any other questions from pool
    if (results.length < 3) {
      for (const item of faqPool) {
        if (item.id !== excludeId && !results.some(r => r.id === item.id)) {
          results.push(item);
          if (results.length >= 3) break;
        }
      }
    }

    return results.slice(0, 3);
  }

  /**
   * Returns fallback recommendations when confidence is LOW.
   */
  public getFallbackSuggestions(category?: FAQCategory | 'All Topics' | null): FAQItem[] {
    const pool = !category || category === 'All Topics'
      ? this.faqs
      : this.faqs.filter(f => f.category === category);

    // Pick 3 popular starting questions from the category
    return pool.slice(0, 3);
  }
}

// Export singleton instance initialized with the complete dataset
export const defaultFAQIndex = new FAQIndex(FAQ_DATASET);

/**
 * Top-level helper function to find best match easily
 */
export function findBestMatch(
  query: string,
  category?: FAQCategory | 'All Topics' | null
): MatchResult {
  return defaultFAQIndex.findBestMatch(query, category);
}

/**
 * Top-level helper function to retrieve related questions
 */
export function getRelatedQuestions(
  excludeId: string,
  category?: FAQCategory | 'All Topics' | null
): FAQItem[] {
  const pool = !category || category === 'All Topics'
    ? FAQ_DATASET
    : FAQ_DATASET.filter(f => f.category === category);
  return defaultFAQIndex.getRelatedQuestions(excludeId, pool);
}

/**
 * Top-level helper function for fallback suggestions
 */
export function getFallbackSuggestions(
  category?: FAQCategory | 'All Topics' | null
): FAQItem[] {
  return defaultFAQIndex.getFallbackSuggestions(category);
}
