import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { CheckNewsPage } from './components/CheckNewsPage';
import { DashboardPage } from './components/DashboardPage';
import { AboutPage } from './components/AboutPage';
import { Footer } from './components/Footer';
import { SampleNewsItem, AnalysisResult } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'check' | 'dashboard' | 'about'>('home');
  const [selectedPreset, setSelectedPreset] = useState<SampleNewsItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleNavigateToCheckWithPreset = (preset?: SampleNewsItem) => {
    if (preset) {
      setSelectedPreset(preset);
    } else {
      setSelectedPreset(null);
    }
    setActiveTab('check');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalysisCompleted = (res: AnalysisResult) => {
    showToast(`Analysis complete: News classified as ${res.verdict} (${res.confidenceScore}% confidence)`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500/40 text-slate-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'home' && (
          <HomePage
            onNavigateToCheck={handleNavigateToCheckWithPreset}
            onNavigateToDashboard={() => {
              setActiveTab('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToAbout={() => {
              setActiveTab('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'check' && (
          <CheckNewsPage
            initialSample={selectedPreset}
            onAnalysisCompleted={handleAnalysisCompleted}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            onNavigateToCheck={() => {
              setSelectedPreset(null);
              setActiveTab('check');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
    </div>
  );
}
