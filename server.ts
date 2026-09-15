import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { analyzeWithGemini, runHeuristicMLPipeline } from './src/server/nlpClassifier';
import { SAMPLE_NEWS } from './src/data/sampleNews';
import { AnalysisResult, DashboardStats } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory analysis store pre-seeded with realistic baseline records
const analysisHistory: AnalysisResult[] = [];

function seedInitialData() {
  const seedItems = [
    {
      content: 'NASA James Webb Telescope Confirms Distant Exoplanet Atmosphere Contains Water Vapor and Carbon Monoxide spectral lines.',
      source: 'nasa.gov / Nature Astronomy',
      verdict: 'REAL' as const,
      confidence: 96
    },
    {
      content: 'SECRET MIRACLE ROOT CURES ALL CANCER CELLS IN 48 HOURS! DOCTORS ARE TERRIFIED AND BIG PHARMA WANTS IT BANNED!',
      source: 'miracle-cure-secrets.xyz',
      verdict: 'FAKE' as const,
      confidence: 94
    },
    {
      content: 'Global Coffee Beans to Go Completely Extinct by Next Month Following European Union Environmental Tariff Regulations.',
      source: 'viral-trending-buzz.net',
      verdict: 'MISLEADING' as const,
      confidence: 88
    },
    {
      content: 'WHO declares eradication milestone for wild poliovirus in southeastern humanitarian region.',
      source: 'who.int',
      verdict: 'REAL' as const,
      confidence: 95
    },
    {
      content: 'SHOCKING LEAK: Ancient Pyramid Discovered Under Antarctica With Alien Power Generators Still Running!',
      source: 'extraterrestrial-unveiled.org',
      verdict: 'FAKE' as const,
      confidence: 97
    },
    {
      content: 'New Tax Law Will Automatically Seize 40% of Everyone\'s Checking Account on Friday Morning.',
      source: 'financial-panic-alerts.com',
      verdict: 'FAKE' as const,
      confidence: 93
    },
    {
      content: 'Drinking Lemon Water Every Morning Completely Immunizes You Against All Seasonal Respiratory Viruses, Study Claims.',
      source: 'holistic-wellness-tipz.info',
      verdict: 'MISLEADING' as const,
      confidence: 84
    },
    {
      content: 'European Central Bank raises key policy rate by 25 basis points in continued inflation response.',
      source: 'reuters.com',
      verdict: 'REAL' as const,
      confidence: 97
    },
    {
      content: 'Smartphone screen blue light permanently turns human eyeballs gray, ophthalmology rumors assert.',
      source: 'daily-tech-rumors.co',
      verdict: 'FAKE' as const,
      confidence: 91
    },
    {
      content: 'Electric vehicle battery fires take longer to extinguish than standard petrol fires, requiring specialized fire brigade foam.',
      source: 'apnews.com',
      verdict: 'REAL' as const,
      confidence: 92
    },
    {
      content: 'Local council announces 3-week road resurfacing project along Main Street starting Monday.',
      source: 'city-herald.co.uk',
      verdict: 'REAL' as const,
      confidence: 93
    },
    {
      content: 'Billionaire Tech Titan Unveils Device That Can Read Your Private Thoughts from 500 Meters Away.',
      source: 'conspiracy-underground.net',
      verdict: 'MISLEADING' as const,
      confidence: 86
    }
  ];

  for (let i = 0; i < seedItems.length; i++) {
    const item = seedItems[i];
    const res = runHeuristicMLPipeline(item.content, item.source);
    res.id = `seed_${i + 1}`;
    // Stagger timestamps across past 48 hours
    const pastDate = new Date(Date.now() - (seedItems.length - i) * 3600 * 1000 * 3.5);
    res.timestamp = pastDate.toISOString();
    analysisHistory.unshift(res);
  }
}

seedInitialData();

// Compute aggregate statistics
function calculateStats(): DashboardStats {
  const totalChecked = analysisHistory.length;
  if (totalChecked === 0) {
    return {
      totalChecked: 0,
      realCount: 0,
      fakeCount: 0,
      misleadingCount: 0,
      avgConfidence: 0,
      recentItems: []
    };
  }

  let realCount = 0;
  let fakeCount = 0;
  let misleadingCount = 0;
  let totalConfidence = 0;

  for (const item of analysisHistory) {
    if (item.verdict === 'REAL') realCount++;
    else if (item.verdict === 'FAKE') fakeCount++;
    else if (item.verdict === 'MISLEADING') misleadingCount++;
    totalConfidence += item.confidenceScore;
  }

  return {
    totalChecked,
    realCount,
    fakeCount,
    misleadingCount,
    avgConfidence: Math.round(totalConfidence / totalChecked),
    recentItems: analysisHistory.slice(0, 15)
  };
}

// ======================== API ROUTES ========================

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Fake News Detection System API',
    modelEngine: process.env.GEMINI_API_KEY ? 'Gemini 3.8 Flash' : 'Hybrid NLP Heuristic Engine',
    time: new Date().toISOString()
  });
});

// 2. Submit news content for AI & NLP Analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { content, source } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: 'News headline or article content is required.' });
    }

    if (content.trim().length < 8) {
      return res.status(400).json({ error: 'Please enter at least 8 characters of news headline or article content.' });
    }

    // Process through AI & NLP pipeline
    const result = await analyzeWithGemini(content.trim(), source?.trim());

    // Record in memory store
    analysisHistory.unshift(result);
    // Keep max 100 history items
    if (analysisHistory.length > 100) {
      analysisHistory.pop();
    }

    return res.json({
      success: true,
      result
    });
  } catch (err: any) {
    console.error('Error analyzing news content:', err);
    return res.status(500).json({
      error: 'An unexpected error occurred during news analysis. Please try again.',
      details: err?.message
    });
  }
});

// 3. Get Dashboard statistics
app.get('/api/stats', (req, res) => {
  res.json(calculateStats());
});

// 4. Get full history
app.get('/api/history', (req, res) => {
  res.json({
    items: analysisHistory
  });
});

// 5. Clear or reset history
app.post('/api/history/clear', (req, res) => {
  analysisHistory.length = 0;
  seedInitialData();
  res.json({
    success: true,
    message: 'History reset to standard benchmark dataset',
    stats: calculateStats()
  });
});

// 6. Get sample news articles
app.get('/api/samples', (req, res) => {
  res.json({
    samples: SAMPLE_NEWS
  });
});

// 7. Architectural info / College project technical overview
app.get('/api/model-info', (req, res) => {
  res.json({
    system: 'Fake News Detection System (NLP & ML Architecture)',
    pipelineStages: [
      {
        stage: 1,
        name: 'Text Preprocessing',
        techniques: ['Regex Cleaning', 'Tokenization', 'Stop-word Filtering', 'Punctuation & Case Ratio Analysis']
      },
      {
        stage: 2,
        name: 'Feature Extraction',
        techniques: ['TF-IDF Vectorization', 'Sentiment Polarity & Subjectivity Index', 'Clickbait Syntax Detection', 'Named Entity Recognition (NER)']
      },
      {
        stage: 3,
        name: 'Source Credibility Scoring',
        techniques: ['Domain Whitelist / Blacklist Cross-referencing', 'Reputation Indexing', 'TLD Risk Assessment']
      },
      {
        stage: 4,
        name: 'Classification & Inference',
        techniques: ['Supervised ML (Logistic Regression / Random Forest / Naive Bayes)', 'Neural LLM Verification (Gemini 3.8 Flash)']
      },
      {
        stage: 5,
        name: 'Explainability & Confidence Synthesis',
        techniques: ['Rule Attribution', 'Confidence Score Probability Scaling', 'Linguistic Flag Highlighting']
      }
    ],
    backendBridge: {
      targetFramework: 'Python Flask / FastAPI',
      database: 'MySQL 8.0 / Cloud SQL',
      mlLibraries: ['scikit-learn', 'nltk', 'transformers', 'pandas', 'numpy']
    }
  });
});

// ======================== SERVER INITIALIZATION ========================

async function startServer() {
  // Vite middleware in dev; static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fake News Detection System server running on http://localhost:${PORT}`);
  });
}

startServer();
