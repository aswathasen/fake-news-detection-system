import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Share2,
  Sparkles,
  ArrowRight,
  Globe,
  FileText,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  Flame,
  Search,
  BookOpen,
  Cpu,
  Layers
} from 'lucide-react';
import { AnalysisResult, SampleNewsItem, VerdictType } from '../types';
import { SAMPLE_NEWS } from '../data/sampleNews';

interface CheckNewsPageProps {
  initialSample?: SampleNewsItem | null;
  onAnalysisCompleted?: (result: AnalysisResult) => void;
}

export const CheckNewsPage: React.FC<CheckNewsPageProps> = ({
  initialSample,
  onAnalysisCompleted
}) => {
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // If passed an initial sample, populate it
  useEffect(() => {
    if (initialSample) {
      setContent(initialSample.content);
      setSource(initialSample.source);
      setResult(null);
      setError(null);
    }
  }, [initialSample]);

  const pipelineSteps = [
    'Cleaning & tokenizing input text...',
    'Extracting NLP linguistic features & syntactic ratios...',
    'Scanning for sensationalism, emotional triggers & clickbait formulas...',
    'Cross-referencing publisher domain credibility registry...',
    'Executing ML classification & synthesizing explanation...'
  ];

  const handleAnalyze = async () => {
    if (!content || content.trim().length < 8) {
      setError('Please enter at least 8 characters of news headline or article content to analyze.');
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);
    setProcessingStep(0);

    // Step animation interval
    const stepInterval = setInterval(() => {
      setProcessingStep((prev) => (prev < pipelineSteps.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          source: source.trim() || undefined
        })
      });

      const data = await response.json();

      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze news content.');
      }

      setResult(data.result);
      if (onAnalysisCompleted) {
        onAnalysisCompleted(data.result);
      }

      // Smooth scroll to result
      setTimeout(() => {
        const resEl = document.getElementById('analysis-result-card');
        if (resEl) {
          resEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err?.message || 'Failed to connect to the AI detection backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setContent('');
    setSource('');
    setResult(null);
    setError(null);
  };

  const handleSelectSample = (sample: SampleNewsItem) => {
    setContent(sample.content);
    setSource(sample.source);
    setResult(null);
    setError(null);
  };

  const handleShareResult = () => {
    if (!result) return;
    const report = `[Fake News Detection System Report]
Verdict: ${result.verdict}
Confidence Score: ${result.confidenceScore}%
Source: ${result.source || 'Not provided'}
Timestamp: ${new Date(result.timestamp).toLocaleString()}

Why this result?
${result.reasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Linguistic Analysis: ${result.analysis.languageContent.label}
Suspicious Patterns: ${result.analysis.suspiciousPatterns.label}
Source Credibility: ${result.analysis.sourceCredibility.rating} (${result.analysis.sourceCredibility.score}%)
Emotional Sensationalism: ${result.analysis.emotionalSensationalWording.label}

Analyzed by Fake News Detection System AI.`;

    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const getVerdictBadge = (verdict: VerdictType) => {
    switch (verdict) {
      case 'REAL':
        return {
          title: 'REAL',
          icon: CheckCircle2,
          bgColor: 'bg-emerald-950/40',
          borderColor: 'border-emerald-700/60',
          textColor: 'text-emerald-300',
          accentColor: 'text-emerald-400',
          indicatorBg: 'bg-emerald-500',
          symbol: '✅',
          desc: 'Content exhibits characteristics consistent with genuine, factual, and verified news reporting.'
        };
      case 'FAKE':
        return {
          title: 'FAKE',
          icon: XCircle,
          bgColor: 'bg-rose-950/40',
          borderColor: 'border-rose-700/60',
          textColor: 'text-rose-300',
          accentColor: 'text-rose-400',
          indicatorBg: 'bg-rose-500',
          symbol: '❌',
          desc: 'Content shows high likelihood of fabrication, deceptive manipulation, or total lack of substantiation.'
        };
      case 'MISLEADING':
        return {
          title: 'MISLEADING',
          icon: AlertTriangle,
          bgColor: 'bg-amber-950/40',
          borderColor: 'border-amber-700/60',
          textColor: 'text-amber-300',
          accentColor: 'text-amber-400',
          indicatorBg: 'bg-amber-500',
          symbol: '⚠️',
          desc: 'Content mixes grains of truth with exaggerated assertions, clickbait distortion, or out-of-context claims.'
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-cyan-400 text-xs font-semibold border border-slate-700">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>AI News Detection Interface</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Verify News Credibility
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Paste any headline, social media post, or news article below to receive an instant AI classification and credibility breakdown.
        </p>
      </div>

      {/* Preset Sample News Buttons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold uppercase tracking-wider text-slate-400">Quick Test Samples:</span>
          <span>Click to populate form</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_NEWS.map((sample) => (
            <button
              key={sample.id}
              id={`preset-btn-${sample.id}`}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1.5"
            >
              <span>
                {sample.expectedVerdict === 'REAL' ? '✅' : sample.expectedVerdict === 'FAKE' ? '❌' : '⚠️'}
              </span>
              <span className="font-medium">{sample.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Detection Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold">Verification Alert:</span>
              <p className="text-rose-200/90">{error}</p>
            </div>
          </div>
        )}

        {/* 1. News Content Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="news-content-input" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>News Headline or Article Content</span>
              <span className="text-rose-400">*</span>
            </label>
            <span className="text-xs text-slate-500">
              {content.length} characters ({content.trim().split(/\s+/).filter(Boolean).length} words)
            </span>
          </div>

          <div className="relative">
            <textarea
              id="news-content-input"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your news headline or article here…"
              disabled={loading}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl p-4 text-slate-100 placeholder-slate-500 text-sm sm:text-base leading-relaxed resize-y transition-all focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* 2. Optional Source / Website Field */}
        <div className="space-y-2">
          <label htmlFor="news-source-input" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Enter News Source / Website</span>
            <span className="text-xs text-slate-500 font-normal">(Optional, e.g. bbc.com, reuters.com, social media)</span>
          </label>
          <input
            id="news-source-input"
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. bbc.com, reuters.com, unknown-whatsapp-forward.org"
            disabled={loading}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm transition-all focus:outline-none disabled:opacity-50"
          />
        </div>

        {/* 3. Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            id="analyze-news-btn"
            type="button"
            onClick={handleAnalyze}
            disabled={loading || content.trim().length === 0}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-base text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing News with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-cyan-200" />
                <span>Analyze News</span>
              </>
            )}
          </button>

          {content.length > 0 && !loading && (
            <button
              id="clear-input-btn"
              type="button"
              onClick={handleClear}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* AI Processing Animation & Pipeline Steps */}
        {loading && (
          <div className="p-6 rounded-2xl bg-slate-950 border border-indigo-900/50 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 animate-spin text-cyan-400" />
                AI Inference Pipeline in Progress
              </span>
              <span>Step {processingStep + 1} of {pipelineSteps.length}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${((processingStep + 1) / pipelineSteps.length) * 100}%` }}
              />
            </div>

            <div className="space-y-2 pt-1">
              {pipelineSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 text-xs transition-colors duration-200 ${
                    idx === processingStep
                      ? 'text-cyan-300 font-semibold'
                      : idx < processingStep
                      ? 'text-emerald-400/80'
                      : 'text-slate-600'
                  }`}
                >
                  <span className="w-4 h-4 flex items-center justify-center shrink-0">
                    {idx < processingStep ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : idx === processingStep ? (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    )}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RESULT SECTION / RESULT PAGE */}
      {result && (
        <div
          id="analysis-result-card"
          className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500"
        >
          {(() => {
            const badge = getVerdictBadge(result.verdict);
            const BadgeIcon = badge.icon;

            return (
              <div className={`p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 ${badge.borderColor} shadow-2xl space-y-8`}>
                {/* Top Verdict Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl ${badge.bgColor} border ${badge.borderColor} flex items-center justify-center ${badge.accentColor} shrink-0 shadow-lg`}>
                      <BadgeIcon className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        News Verdict Prediction
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{badge.symbol}</span>
                        <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${badge.textColor}`}>
                          {badge.title}
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 max-w-md">
                        {badge.desc}
                      </p>
                    </div>
                  </div>

                  {/* Confidence Score Display */}
                  <div className="w-full md:w-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between md:flex-col md:items-center md:justify-center md:min-w-[170px] space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Confidence Score
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white">
                        {result.confidenceScore}
                      </span>
                      <span className="text-lg font-bold text-indigo-400">%</span>
                    </div>

                    {/* Mini visual confidence bar */}
                    <div className="w-full max-w-[120px] h-2 bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full ${badge.indicatorBg} transition-all duration-500`}
                        style={{ width: `${result.confidenceScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* "Why this result?" - 3 to 5 simple reasons */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-lg">
                    <HelpCircle className="w-5 h-5 text-indigo-400" />
                    <h3>Why this result?</h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Transparent key explanations synthesized from natural language feature analysis:
                  </p>

                  <div className="grid grid-cols-1 gap-2.5 pt-1">
                    {result.reasons.map((reason, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3"
                      >
                        <span className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-sm text-slate-200 leading-relaxed">
                          {reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Analysis Breakdown Grid */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-lg">
                      <Layers className="w-5 h-5 text-cyan-400" />
                      <h3>Detailed Analysis</h3>
                    </div>
                    <span className="text-xs text-slate-400">5-factor multi-dimensional audit</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. Language & Content Analysis */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300">1. Language / Content Analysis</span>
                        <span className="font-bold text-indigo-400">{result.analysis.languageContent.score}/100</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500"
                          style={{ width: `${result.analysis.languageContent.score}%` }}
                        />
                      </div>
                      <div className="text-xs font-semibold text-cyan-300 pt-1">
                        {result.analysis.languageContent.label}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {result.analysis.languageContent.details}
                      </p>
                    </div>

                    {/* 2. Suspicious / Misleading Patterns */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300">2. Suspicious or Misleading Patterns</span>
                        <span className="font-bold text-amber-400">
                          {result.analysis.suspiciousPatterns.score}% Suspicion
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500"
                          style={{ width: `${result.analysis.suspiciousPatterns.score}%` }}
                        />
                      </div>
                      <div className="text-xs font-semibold text-amber-300 pt-1">
                        {result.analysis.suspiciousPatterns.label}
                      </div>
                      <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                        {result.analysis.suspiciousPatterns.flagsDetected.slice(0, 2).map((flag, i) => (
                          <li key={i} className="truncate">{flag}</li>
                        ))}
                      </ul>
                    </div>

                    {/* 3. Source Credibility */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300">3. Source Credibility</span>
                        <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          result.analysis.sourceCredibility.rating === 'High'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : result.analysis.sourceCredibility.rating === 'Low'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {result.analysis.sourceCredibility.rating} ({result.analysis.sourceCredibility.score}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${result.analysis.sourceCredibility.score}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-300 font-medium pt-1">
                        Source: <span className="text-cyan-300">{result.source || 'Unspecified'}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {result.analysis.sourceCredibility.domainReputation}
                      </p>
                    </div>

                    {/* 4. Emotional or Sensational Wording */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300">4. Emotional / Sensational Wording</span>
                        <span className="font-bold text-rose-400">
                          {result.analysis.emotionalSensationalWording.score}% Sensationalism
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-500"
                          style={{ width: `${result.analysis.emotionalSensationalWording.score}%` }}
                        />
                      </div>
                      <div className="text-xs font-semibold text-rose-300 pt-1">
                        {result.analysis.emotionalSensationalWording.label}
                      </div>
                      <div className="text-xs text-slate-400">
                        Trigger Words: {result.analysis.emotionalSensationalWording.triggerWords.join(', ')}
                      </div>
                    </div>

                    {/* 5. Supporting Evidence Availability (Full width) */}
                    <div className="md:col-span-2 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300">5. Supporting Evidence Availability</span>
                        <span className="font-bold text-cyan-400">{result.analysis.supportingEvidence.score}/100</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500"
                          style={{ width: `${result.analysis.supportingEvidence.score}%` }}
                        />
                      </div>
                      <div className="text-xs font-semibold text-cyan-300 pt-1">
                        {result.analysis.supportingEvidence.label}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {result.analysis.supportingEvidence.assessment}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Check Another News, Clear, Share Result */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <button
                      id="check-another-news-btn"
                      type="button"
                      onClick={() => {
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Check Another News</span>
                    </button>

                    <button
                      id="clear-result-btn"
                      type="button"
                      onClick={handleClear}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Clear</span>
                    </button>
                  </div>

                  {/* Share Result Button */}
                  <button
                    id="share-result-btn"
                    type="button"
                    onClick={handleShareResult}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 text-sm font-medium transition-all flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300 font-semibold">Report Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-cyan-400" />
                        <span>Share Result</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
