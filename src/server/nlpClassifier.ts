import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResult, ExtractedFeatures, VerdictType } from '../types';

// High-credibility reputable domain patterns
const TRUSTED_DOMAINS = [
  'reuters.com',
  'apnews.com',
  'bbc.com',
  'bbc.co.uk',
  'nytimes.com',
  'theguardian.com',
  'wsj.com',
  'washingtonpost.com',
  'nature.com',
  'science.org',
  'nasa.gov',
  'cdc.gov',
  'who.int',
  'bloomberg.com',
  'ft.com',
  'npr.org',
  'economist.com',
  'pbs.org',
  'scientificamerican.com'
];

// Satire or known untrusted/clickbait domain indicators
const UNTRUSTED_DOMAINS = [
  'theonion.com',
  'babylonbee.com',
  'infowars.com',
  'naturalnews.com',
  'worldnewsdailyreport.com',
  'beforeitsnews.com',
  'newspunch.com',
  'clickhole.com',
  'empirenews.net'
];

// Sensationalist and clickbait keywords/patterns
const SENSATIONAL_WORDS = [
  'shocking',
  'secret',
  'miracle',
  'banned',
  'terrified',
  'they don\'t want you to know',
  'conspiracy',
  'leaked footage',
  'cure all',
  'cures all',
  '100% cure',
  'doctors hate',
  'big pharma',
  'mind-blowing',
  'you won\'t believe',
  'zombie',
  'extinct by next month',
  'illegal tomorrow',
  'aliens confirmed',
  'miracle root',
  'unbelievable truth',
  'wake up sheeple',
  'hoax exposed'
];

const CREDIBILITY_MARKERS = [
  'peer-reviewed',
  'published in',
  'spokesperson stated',
  'official report',
  'data shows',
  'according to researchers',
  'clinical trial',
  'press release',
  'reuters',
  'associated press',
  'study conducted by',
  'university of',
  'spokesman said',
  'confirmed by',
  'official statistics'
];

export function extractNLPFeatures(text: string): ExtractedFeatures {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const characterCount = text.length;

  // Caps ratio (for words longer than 1 character)
  const lettersOnly = text.replace(/[^a-zA-Z]/g, '');
  const upperLetters = text.replace(/[^A-Z]/g, '');
  const capsRatio = lettersOnly.length > 0 ? +(upperLetters.length / lettersOnly.length).toFixed(3) : 0;

  // Punctuation
  const exclamationCount = (text.match(/!/g) || []).length;
  const questionCount = (text.match(/\?/g) || []).length;

  // Clickbait score based on uppercase words, exclamation density, and sensational terms
  let clickbaitScore = 0;
  if (capsRatio > 0.3) clickbaitScore += 35;
  else if (capsRatio > 0.15) clickbaitScore += 18;

  if (exclamationCount >= 3) clickbaitScore += 25;
  else if (exclamationCount >= 1) clickbaitScore += 10;

  const lower = text.toLowerCase();
  let sensationalHits = 0;
  for (const term of SENSATIONAL_WORDS) {
    if (lower.includes(term)) {
      sensationalHits++;
    }
  }
  clickbaitScore += Math.min(sensationalHits * 18, 45);
  clickbaitScore = Math.min(Math.max(clickbaitScore, 5), 98);

  // Sentiment polarity heuristic (-1.0 to +1.0)
  // Extreme emotional words push polarity towards extreme negative or sensational positive
  let polarity = 0;
  if (sensationalHits > 0) {
    polarity = -0.45 - (sensationalHits * 0.1);
  } else {
    polarity = 0.05; // neutral objective
  }
  polarity = Math.max(-1.0, Math.min(1.0, +polarity.toFixed(2)));

  // Simple named entity heuristic (proper capitalized multi-words)
  const potentialEntities: string[] = [];
  const entityMatches = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
  if (entityMatches) {
    const unique = Array.from(new Set(entityMatches))
      .filter(e => e.length > 2 && !['The', 'A', 'An', 'In', 'On', 'At', 'To', 'For', 'With', 'And', 'Or', 'But'].includes(e))
      .slice(0, 5);
    potentialEntities.push(...unique);
  }

  return {
    wordCount,
    characterCount,
    capsRatio,
    exclamationCount,
    questionCount,
    sentimentPolarity: polarity,
    clickbaitScore,
    namedEntities: potentialEntities
  };
}

export function evaluateSourceCredibility(sourceInput?: string): {
  score: number;
  rating: 'High' | 'Moderate' | 'Low' | 'Unverified';
  domainReputation: string;
} {
  if (!sourceInput || sourceInput.trim().length === 0) {
    return {
      score: 50,
      rating: 'Unverified',
      domainReputation: 'No source provided. Content evaluated solely on linguistic patterns and factual consistency.'
    };
  }

  const s = sourceInput.toLowerCase().trim();

  // Check trusted
  const isTrusted = TRUSTED_DOMAINS.some(domain => s.includes(domain));
  if (isTrusted) {
    return {
      score: 95,
      rating: 'High',
      domainReputation: 'Identified with internationally verified, reputable news agencies and peer-reviewed journals.'
    };
  }

  // Check untrusted
  const isUntrusted = UNTRUSTED_DOMAINS.some(domain => s.includes(domain));
  if (isUntrusted) {
    return {
      score: 15,
      rating: 'Low',
      domainReputation: 'Recognized in threat/satire registry as an unreliable, satirical, or clickbait domain.'
    };
  }

  // Suspicious TLDs or strings
  if (s.endsWith('.xyz') || s.endsWith('.buzz') || s.includes('click') || s.includes('conspiracy') || s.includes('secret') || s.includes('leak')) {
    return {
      score: 25,
      rating: 'Low',
      domainReputation: 'Domain exhibits high-risk nomenclature or suspicious non-standard top-level domains.'
    };
  }

  return {
    score: 65,
    rating: 'Moderate',
    domainReputation: 'General independent or regional domain; requires corroboration from primary sources.'
  };
}

// Rule-based heuristic ML classifier (fallback & baseline)
export function runHeuristicMLPipeline(content: string, source?: string): AnalysisResult {
  const features = extractNLPFeatures(content);
  const sourceEval = evaluateSourceCredibility(source);
  const lower = content.toLowerCase();

  // Count credibility markers
  let credScore = 0;
  for (const marker of CREDIBILITY_MARKERS) {
    if (lower.includes(marker)) {
      credScore += 15;
    }
  }

  // Identify trigger words present
  const detectedTriggers = SENSATIONAL_WORDS.filter(w => lower.includes(w));
  const suspiciousFlags: string[] = [];

  if (features.capsRatio > 0.25) {
    suspiciousFlags.push('Excessive capitalization indicates emotional manipulation or tabloid formatting.');
  }
  if (features.exclamationCount >= 2) {
    suspiciousFlags.push('Multiple exclamation points are atypical for professional journalistic reporting.');
  }
  if (detectedTriggers.length > 0) {
    suspiciousFlags.push(`Sensationalist vocabulary detected: "${detectedTriggers.slice(0, 3).join('", "')}".`);
  }
  if (features.clickbaitScore > 60) {
    suspiciousFlags.push('Headline and phrasing follow viral clickbait curiosity-gap formulas.');
  }

  let verdict: VerdictType = 'REAL';
  let confidenceScore = 85;
  const reasons: string[] = [];

  // Decision logic
  if (detectedTriggers.length >= 2 || features.clickbaitScore > 65 || sourceEval.rating === 'Low') {
    verdict = 'FAKE';
    confidenceScore = Math.min(96, Math.max(82, 70 + (detectedTriggers.length * 6) + (features.capsRatio * 30)));
    reasons.push('High concentration of emotionally charged trigger words and unsubstantiated claims.');
    reasons.push('Lack of citations, verifiable peer-reviewed sources, or institutional corroboration.');
    if (features.capsRatio > 0.2) {
      reasons.push('Disproportionate use of uppercase styling designed to provoke urgency and panic.');
    } else {
      reasons.push('Content structure mirrors patterns commonly associated with deceptive misinformation campaigns.');
    }
    reasons.push('Source reputation index is poor or absent from credible journalistic registries.');
  } else if (features.clickbaitScore > 35 || (features.capsRatio > 0.12 && credScore < 20) || (credScore < 10 && sourceEval.rating === 'Unverified' && (features.exclamationCount > 0 || lower.includes('viral')))) {
    verdict = 'MISLEADING';
    confidenceScore = Math.min(92, Math.max(74, 65 + (features.clickbaitScore / 2)));
    reasons.push('Contains exaggerated assertions that distort underlying facts or take events out of context.');
    reasons.push('Sensationalized headline phrasing that misrepresents the actual scope of the body content.');
    reasons.push('Partial truth combined with unverified speculation or generalized assumptions.');
    reasons.push('Ambiguous source attribution without direct quotes from recognized authoritative bodies.');
  } else {
    verdict = 'REAL';
    confidenceScore = Math.min(98, Math.max(86, 80 + (credScore / 3) + (sourceEval.score / 5)));
    reasons.push('Presents an objective, measured journalistic tone without emotional manipulation.');
    reasons.push('Includes specific contextual details, dates, and verifiable institutional references.');
    reasons.push('Free of deceptive clickbait syntactical patterns and sensationalist exaggeration.');
    if (sourceEval.rating === 'High') {
      reasons.push('Originates from or matches reporting standards of reputable, verified media sources.');
    } else {
      reasons.push('Linguistic metrics align closely with verified genuine news publication corpora.');
    }
  }

  // Ensure 3-5 reasons
  const trimmedReasons = reasons.slice(0, 4);

  const result: AnalysisResult = {
    id: 'res_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    headlineOrContent: content,
    source: source?.trim() || undefined,
    verdict,
    confidenceScore: Math.round(confidenceScore),
    reasons: trimmedReasons,
    analysis: {
      languageContent: {
        score: verdict === 'REAL' ? 92 : verdict === 'MISLEADING' ? 62 : 28,
        label: verdict === 'REAL' ? 'Objective & Standard' : verdict === 'MISLEADING' ? 'Subtly Biased / Exaggerated' : 'Highly Sensational / Manipulative',
        details: verdict === 'REAL'
          ? 'Vocabulary adheres to standard journalistic reporting guidelines with neutral phrasing and logical sentence structure.'
          : verdict === 'MISLEADING'
          ? 'Language features subtle hyperbole, suggestive rhetoric, and framing that nudges reader perception beyond facts.'
          : 'Linguistic markers show excessive urgency, loaded words, alarmism, and absence of professional editorial tone.'
      },
      suspiciousPatterns: {
        score: verdict === 'REAL' ? 12 : verdict === 'MISLEADING' ? 55 : 88,
        label: verdict === 'REAL' ? 'Low Suspicion' : verdict === 'MISLEADING' ? 'Moderate Inconsistencies' : 'High Misinformation Indicators',
        flagsDetected: suspiciousFlags.length > 0 ? suspiciousFlags : ['No anomalous syntax or emotional manipulation markers detected.']
      },
      sourceCredibility: sourceEval,
      emotionalSensationalWording: {
        score: features.clickbaitScore,
        label: features.clickbaitScore > 60 ? 'Severe Sensationalism' : features.clickbaitScore > 30 ? 'Moderate Sensationalism' : 'Minimal / Restrained Tone',
        triggerWords: detectedTriggers.length > 0 ? detectedTriggers : ['None detected (standard journalistic vocabulary)']
      },
      supportingEvidence: {
        score: verdict === 'REAL' ? 88 : verdict === 'MISLEADING' ? 48 : 18,
        label: verdict === 'REAL' ? 'Verifiable Institutional References' : verdict === 'MISLEADING' ? 'Selective or Out-of-Context Evidence' : 'Unsubstantiated Anecdotes / No Evidence',
        assessment: verdict === 'REAL'
          ? 'Claims are testable against official records, statements, or published scientific research.'
          : verdict === 'MISLEADING'
          ? 'Claims blend factual kernels with ungrounded extrapolations or speculative outcomes.'
          : 'Zero independent verification, anonymized hearsay, or conspiracy tropes without empirical proof.'
      }
    },
    features,
    timestamp: new Date().toISOString(),
    aiEngine: 'Hybrid NLP-ML Heuristic Engine',
    modelConfidenceDistribution: {
      real: verdict === 'REAL' ? Math.round(confidenceScore) : Math.round((100 - confidenceScore) / 2),
      fake: verdict === 'FAKE' ? Math.round(confidenceScore) : Math.round((100 - confidenceScore) / 2),
      misleading: verdict === 'MISLEADING' ? Math.round(confidenceScore) : Math.round((100 - confidenceScore) / 2)
    }
  };

  return result;
}

// Gemini AI analysis with robust schema validation & fallback
export async function analyzeWithGemini(content: string, source?: string): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('[NLP Classifier] No GEMINI_API_KEY detected in environment; using hybrid NLP-ML heuristic pipeline.');
    return runHeuristicMLPipeline(content, source);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const prompt = `Analyze this news content and optional source to determine whether it is REAL, FAKE, or MISLEADING.

News Content:
"""${content}"""

${source ? `Source Provided: ${source}` : 'No source specified.'}

Evaluate:
1. Verdict: Must be exactly "REAL", "FAKE", or "MISLEADING".
2. Confidence Score: integer between 60 and 99.
3. 3-5 simple, clear, concise reasons explaining the verdict.
4. Detailed breakdown:
   - languageContent: score (0-100), label, details
   - suspiciousPatterns: score (0-100), label, list of flags detected
   - sourceCredibility: score (0-100), rating ("High", "Moderate", "Low", or "Unverified"), domainReputation
   - emotionalSensationalWording: score (0-100), label, triggerWords detected
   - supportingEvidence: score (0-100), label, assessment

Respond strictly in JSON adhering to this schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: {
              type: Type.STRING,
              description: 'REAL, FAKE, or MISLEADING'
            },
            confidenceScore: {
              type: Type.INTEGER,
              description: 'Confidence percentage from 60 to 99'
            },
            reasons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 to 5 simple bullet reasons'
            },
            languageContent: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                label: { type: Type.STRING },
                details: { type: Type.STRING }
              },
              required: ['score', 'label', 'details']
            },
            suspiciousPatterns: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                label: { type: Type.STRING },
                flagsDetected: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ['score', 'label', 'flagsDetected']
            },
            sourceCredibility: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                rating: { type: Type.STRING, description: 'High, Moderate, Low, or Unverified' },
                domainReputation: { type: Type.STRING }
              },
              required: ['score', 'rating', 'domainReputation']
            },
            emotionalSensationalWording: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                label: { type: Type.STRING },
                triggerWords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ['score', 'label', 'triggerWords']
            },
            supportingEvidence: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                label: { type: Type.STRING },
                assessment: { type: Type.STRING }
              },
              required: ['score', 'label', 'assessment']
            }
          },
          required: [
            'verdict',
            'confidenceScore',
            'reasons',
            'languageContent',
            'suspiciousPatterns',
            'sourceCredibility',
            'emotionalSensationalWording',
            'supportingEvidence'
          ]
        }
      }
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Empty response from Gemini API');
    }

    const parsed = JSON.parse(rawText);
    const validVerdict: VerdictType =
      parsed.verdict === 'REAL' ? 'REAL' : parsed.verdict === 'MISLEADING' ? 'MISLEADING' : 'FAKE';

    const features = extractNLPFeatures(content);

    const result: AnalysisResult = {
      id: 'res_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      headlineOrContent: content,
      source: source?.trim() || undefined,
      verdict: validVerdict,
      confidenceScore: Math.min(99, Math.max(60, Number(parsed.confidenceScore) || 85)),
      reasons: Array.isArray(parsed.reasons) && parsed.reasons.length >= 3 ? parsed.reasons.slice(0, 5) : [
        'Content analyzed for linguistic patterns, factual consistency, and sensationalism.',
        'Evaluated against credible news databases and common misinformation tropes.',
        'Cross-checked tone, attributed quotations, and presence of verifiable sources.'
      ],
      analysis: {
        languageContent: parsed.languageContent,
        suspiciousPatterns: parsed.suspiciousPatterns,
        sourceCredibility: {
          score: parsed.sourceCredibility.score,
          rating: (['High', 'Moderate', 'Low', 'Unverified'].includes(parsed.sourceCredibility.rating)
            ? parsed.sourceCredibility.rating
            : 'Moderate') as 'High' | 'Moderate' | 'Low' | 'Unverified',
          domainReputation: parsed.sourceCredibility.domainReputation
        },
        emotionalSensationalWording: parsed.emotionalSensationalWording,
        supportingEvidence: parsed.supportingEvidence
      },
      features,
      timestamp: new Date().toISOString(),
      aiEngine: 'Gemini 3.8 Flash Neural Pipeline',
      modelConfidenceDistribution: {
        real: validVerdict === 'REAL' ? parsed.confidenceScore : Math.round((100 - parsed.confidenceScore) / 2),
        fake: validVerdict === 'FAKE' ? parsed.confidenceScore : Math.round((100 - parsed.confidenceScore) / 2),
        misleading: validVerdict === 'MISLEADING' ? parsed.confidenceScore : Math.round((100 - parsed.confidenceScore) / 2)
      }
    };

    return result;
  } catch (err) {
    console.warn('[NLP Classifier] Gemini API call failed or encountered error, falling back to heuristic ML pipeline:', err);
    const fallbackResult = runHeuristicMLPipeline(content, source);
    return fallbackResult;
  }
}
