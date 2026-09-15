import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Cpu,
  Search,
  Database,
  FileCheck,
  TrendingUp,
  BrainCircuit,
  ExternalLink
} from 'lucide-react';
import { SAMPLE_NEWS } from '../data/sampleNews';
import { SampleNewsItem } from '../types';

interface HomePageProps {
  onNavigateToCheck: (preset?: SampleNewsItem) => void;
  onNavigateToDashboard: () => void;
  onNavigateToAbout: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToCheck,
  onNavigateToDashboard,
  onNavigateToAbout
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 text-center px-6 sm:px-12 shadow-2xl">
        {/* Subtle background glow effect */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs sm:text-sm font-medium shadow-inner">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI-Based Detection of Fake and Misleading News</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Fake News Detection System
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl font-medium text-slate-300 max-w-2xl mx-auto">
            AI-Based Detection of Fake and Misleading News
          </p>

          {/* Short Description */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Verify news before you believe or share it. Our AI-powered system analyzes news content and provides a quick credibility prediction.
          </p>

          {/* Prominent Check News Call-to-Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-check-news-btn"
              onClick={() => onNavigateToCheck()}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShieldAlert className="w-6 h-6 text-cyan-200" />
              <span>Check News</span>
              <ArrowRight className="w-5 h-5 text-cyan-200" />
            </button>

            <button
              id="hero-view-dashboard-btn"
              onClick={onNavigateToDashboard}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium text-base text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700/80 transition-all"
            >
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>View Analytics Dashboard</span>
            </button>
          </div>

          {/* Quick 3-Tier Classification Visual Indicators */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-emerald-300 text-sm">✅ REAL</div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verified facts, objective tone, attributed quotes & institutional peer sources.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/30 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 mt-0.5">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-rose-300 text-sm">❌ FAKE</div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fabricated claims, heavy sensationalism, fearmongering & zero empirical proof.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-amber-300 text-sm">⚠️ MISLEADING</div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Out-of-context facts, clickbait distortion, exaggeration & selective half-truths.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How the AI System Works */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase">System Pipeline</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How The AI Detection Engine Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Multi-stage natural language processing and machine learning classification pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg">
              01
            </div>
            <h3 className="text-lg font-semibold text-white">Text Preprocessing</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tokenization, stop-word removal, syntactic punctuation analysis, and capitalization ratio calculations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg">
              02
            </div>
            <h3 className="text-lg font-semibold text-white">NLP Feature Extraction</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Detects emotional sensationalism, clickbait formula patterns, subjectivity markers, and sentiment polarity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-lg">
              03
            </div>
            <h3 className="text-lg font-semibold text-white">Source Credibility</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cross-references publication domains against vetted journalistic registries, satire trackers, and TLD reputation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
              04
            </div>
            <h3 className="text-lg font-semibold text-white">Prediction & Reasons</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Outputs the exact classification verdict, confidence percentage, and 3–5 bulleted transparent explanations.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Quick-Test Benchmark Samples */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase">Interactive Demonstration</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Test Curated Sample Articles
            </h2>
            <p className="text-sm text-slate-400">
              Click any sample below to load and run it instantly through the detection engine.
            </p>
          </div>
          <button
            onClick={() => onNavigateToCheck()}
            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
          >
            <span>Open Custom Input</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_NEWS.slice(0, 3).map((sample) => (
            <div
              key={sample.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {sample.category}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      sample.expectedVerdict === 'REAL'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : sample.expectedVerdict === 'FAKE'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    Expected: {sample.expectedVerdict}
                  </span>
                </div>

                <h3 className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2 text-base">
                  {sample.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {sample.content}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
                  Source: {sample.source}
                </span>

                <button
                  id={`sample-load-btn-${sample.id}`}
                  onClick={() => onNavigateToCheck(sample)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-all"
                >
                  <span>Analyze</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* College Project Architecture Highlight Banner */}
      <section className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <BrainCircuit className="w-4 h-4" />
            <span>Academic & Technical Architecture</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Designed for Machine Learning Integration & Scalable Deployment
          </h3>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Includes modular API contracts compatible with Python Flask, MySQL, Scikit-learn pipelines, and Gemini LLM reasoning. Read the technical specifications and architecture overview.
          </p>
        </div>

        <button
          onClick={onNavigateToAbout}
          className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 shrink-0"
        >
          <span>View System Architecture</span>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </button>
      </section>
    </div>
  );
};
