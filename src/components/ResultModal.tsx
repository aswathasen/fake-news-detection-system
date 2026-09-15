import React from 'react';
import { X, CheckCircle2, XCircle, AlertTriangle, Globe, Calendar, Layers, HelpCircle } from 'lucide-react';
import { AnalysisResult, VerdictType } from '../types';

interface ResultModalProps {
  item: AnalysisResult | null;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const getVerdictStyle = (v: VerdictType) => {
    switch (v) {
      case 'REAL':
        return {
          icon: CheckCircle2,
          text: 'REAL',
          color: 'text-emerald-400',
          bg: 'bg-emerald-950/50',
          border: 'border-emerald-800'
        };
      case 'FAKE':
        return {
          icon: XCircle,
          text: 'FAKE',
          color: 'text-rose-400',
          bg: 'bg-rose-950/50',
          border: 'border-rose-800'
        };
      case 'MISLEADING':
        return {
          icon: AlertTriangle,
          text: 'MISLEADING',
          color: 'text-amber-400',
          bg: 'bg-amber-950/50',
          border: 'border-amber-800'
        };
    }
  };

  const style = getVerdictStyle(item.verdict);
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${style.bg} border ${style.border} ${style.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Historical Analysis Record
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-bold ${style.color}`}>{item.verdict}</span>
                <span className="text-sm font-semibold text-slate-300">({item.confidenceScore}% Confidence)</span>
              </div>
            </div>
          </div>

          <button
            id="modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Metadata */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Analyzed Text:</span>
            <p className="text-sm text-slate-200 leading-relaxed italic">
              "{item.headlineOrContent}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="truncate">Source: {item.source || 'None specified'}</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>{new Date(item.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Why this result? */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>Why this result?</span>
          </div>
          <div className="space-y-2">
            {item.reasons.map((r, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown preview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Audit Parameters</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block">Linguistic Objectivity</span>
              <span className="text-slate-200 font-semibold">{item.analysis.languageContent.score}%</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block">Suspicion Index</span>
              <span className="text-amber-300 font-semibold">{item.analysis.suspiciousPatterns.score}%</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block">Sensationalism</span>
              <span className="text-rose-300 font-semibold">{item.analysis.emotionalSensationalWording.score}%</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block">Supporting Evidence</span>
              <span className="text-cyan-300 font-semibold">{item.analysis.supportingEvidence.score}%</span>
            </div>
          </div>
        </div>

        {/* Footer close */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
