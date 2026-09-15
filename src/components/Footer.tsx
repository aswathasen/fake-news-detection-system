import React from 'react';
import { ShieldAlert, Github, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'check' | 'dashboard' | 'about') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-100 text-sm">Fake News Detection System</span>
            <p className="text-[11px] text-slate-500">AI-Based Detection of Fake & Misleading News</p>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex items-center gap-6 text-xs font-medium">
          <button onClick={() => onNavigate('home')} className="hover:text-slate-200 transition-colors">
            Home
          </button>
          <button onClick={() => onNavigate('check')} className="hover:text-slate-200 transition-colors">
            Check News
          </button>
          <button onClick={() => onNavigate('dashboard')} className="hover:text-slate-200 transition-colors">
            Dashboard
          </button>
          <button onClick={() => onNavigate('about')} className="hover:text-slate-200 transition-colors">
            About & Architecture
          </button>
        </div>

        <div className="text-[11px] text-slate-500 text-center md:text-right">
          <p>AI & Machine Learning Academic Project</p>
          <p className="text-[10px] text-slate-600 mt-0.5">Predictions are advisory and based on algorithmic heuristic analysis.</p>
        </div>
      </div>
    </footer>
  );
};
