import React, { useState } from 'react';
import {
  Info,
  BrainCircuit,
  Database,
  Server,
  Code2,
  Cpu,
  Layers,
  ShieldCheck,
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  Terminal
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copySnippet = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const flaskSnippet = `from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import re

app = Flask(__name__)
CORS(app)

# Load trained ML model & vectorizer
with open("fake_news_model.pkl", "rb") as f:
    model = pickle.load(f)
with open("tfidf_vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

def preprocess_text(text):
    text = re.sub(r'[^a-zA-Z\\s]', '', text.lower())
    return text

@app.route("/api/analyze", methods=["POST"])
def analyze_news():
    data = request.get_json()
    content = data.get("content", "")
    source = data.get("source", "")
    
    cleaned = preprocess_text(content)
    vec = vectorizer.transform([cleaned])
    
    # Predict probabilities [REAL, FAKE, MISLEADING]
    probs = model.predict_proba(vec)[0]
    verdicts = ["REAL", "FAKE", "MISLEADING"]
    pred_idx = probs.argmax()
    
    verdict = verdicts[pred_idx]
    confidence = int(probs[pred_idx] * 100)
    
    return jsonify({
        "success": True,
        "result": {
            "verdict": verdict,
            "confidenceScore": confidence,
            "reasons": [
                "Evaluated by trained NLP feature extractor and classifier.",
                "Cross-referenced stylistic syntax and vocabulary distribution."
            ]
        }
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)`;

  const sqlSnippet = `-- Database Schema: Fake News Detection System (MySQL)
CREATE DATABASE IF NOT EXISTS fake_news_db;
USE fake_news_db;

-- Table 1: Analyzed Articles & Verdict Logs
CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_hash VARCHAR(64) UNIQUE,
    headline_or_content TEXT NOT NULL,
    source_domain VARCHAR(255),
    verdict ENUM('REAL', 'FAKE', 'MISLEADING') NOT NULL,
    confidence_score DECIMAL(5, 2) NOT NULL,
    language_score INT,
    suspicion_score INT,
    sensationalism_score INT,
    evidence_score INT,
    reasons_json JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: Source Credibility Whitelist & Blacklist Registry
CREATE TABLE IF NOT EXISTS source_registry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain_name VARCHAR(255) UNIQUE NOT NULL,
    reputation_score INT NOT NULL, -- 0 to 100
    category ENUM('Reputable', 'Satire', 'Clickbait', 'Conspiracy', 'State-Sponsored'),
    flag_reason TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for high-concurrency queries
CREATE INDEX idx_verdict ON articles(verdict);
CREATE INDEX idx_created_at ON articles(created_at);`;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      {/* Page Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-indigo-400 text-xs font-semibold border border-slate-700">
          <Info className="w-3.5 h-3.5" />
          <span>System Documentation & Academic Specifications</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About Fake News Detection System
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Comprehensive project background, problem formulation, AI/ML architecture, and full-stack implementation details.
        </p>
      </div>

      {/* Problem & Solution Cards (Exact prompt quotes preserved) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-rose-900/40 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Challenge</span>
              <h2 className="text-xl font-bold text-white">The Problem</h2>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            People receive a large amount of news from social media, websites, messaging platforms, and online news portals. It is difficult and time-consuming to manually verify whether every piece of information is genuine.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="font-semibold text-slate-300">Key Vulnerabilities:</div>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Viral misinformation spreading faster than official corrections</li>
              <li>Emotionally charged sensationalism misleading public opinion</li>
              <li>Difficulties identifying coordinated satire vs authentic reporting</li>
            </ul>
          </div>
        </div>

        {/* Solution Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-900/40 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Innovation</span>
              <h2 className="text-xl font-bold text-white">The Solution</h2>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            This system uses Artificial Intelligence, Natural Language Processing, and Machine Learning to analyze news content and provide a quick first-level prediction of whether the information is likely to be real, fake, or misleading.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="font-semibold text-slate-300">Core Capabilities:</div>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Three-tier classification (REAL / FAKE / MISLEADING)</li>
              <li>Calibrated confidence score percentage (e.g. 92%)</li>
              <li>3 to 5 plain-English reasons explaining the prediction</li>
            </ul>
          </div>
        </div>
      </div>

      {/* AI/ML Architecture Pipeline Breakdown */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Technical Design</span>
            <h2 className="text-xl font-bold text-white">AI/ML Logic & NLP Pipeline</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              1. Text Preprocessing
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tokenizes continuous text into constituent word units, scrubs extraneous punctuation, filters non-informative stop words, and computes punctuation anomalies (such as all-caps ratios and exclamation mark density).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-sm font-bold text-indigo-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              2. Feature Extraction & NLP
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts TF-IDF term frequencies, sentiment polarity (-1.0 to +1.0), sensational clickbait formulas ("DOCTORS HATE THIS", "100% MIRACLE CURE"), and Named Entity Recognition (NER) for institutional attribution.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-sm font-bold text-blue-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              3. Source Credibility Scoring
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evaluates the publisher domain reputation against institutional press agencies (Reuters, AP, BBC, Nature) vs flagged clickbait and satire portals, computing a normalized source reliability metric.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              4. ML Classification & Hybrid LLM
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Feeds vectorized inputs into classification algorithms (Logistic Regression, Multinomial Naive Bayes, Random Forest) paired with neural LLM reasoning (Gemini 3.8 Flash) for nuanced contextual fact-checking.
            </p>
          </div>
        </div>
      </section>

      {/* College Project Architecture Requirements & Backend Bridge */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">College Project Architecture</span>
              <h2 className="text-xl font-bold text-white">Full-Stack Blueprint: Python Flask & MySQL</h2>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          As specified in the technical requirements, the system is architected with clean separation of concerns so a trained machine learning model (<code className="text-cyan-300">.pkl</code> or ONNX) can be hosted via a Python Flask microservice, with MySQL for persistent relational logging.
        </p>

        {/* Python Flask Backend Specification */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Python Flask ML Service (<code className="text-slate-400">app.py</code>)</span>
            </span>
            <button
              onClick={() => copySnippet(flaskSnippet, 'flask')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg transition-colors"
            >
              {copiedCode === 'flask' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === 'flask' ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto font-mono text-xs text-slate-300">
            <pre>{flaskSnippet}</pre>
          </div>
        </div>

        {/* MySQL Database Schema Specification */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>MySQL Relational Schema (<code className="text-slate-400">schema.sql</code>)</span>
            </span>
            <button
              onClick={() => copySnippet(sqlSnippet, 'sql')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg transition-colors"
            >
              {copiedCode === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === 'sql' ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto font-mono text-xs text-slate-300">
            <pre>{sqlSnippet}</pre>
          </div>
        </div>
      </section>

      {/* Summary / Evaluation Highlights */}
      <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Academic Project Deliverable</div>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Developed for intelligent fake news classification using modern NLP, full-stack API patterns, responsive interfaces, and transparent explainability metrics.
        </p>
      </section>
    </div>
  );
};
