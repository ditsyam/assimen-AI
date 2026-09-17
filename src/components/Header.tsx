import React from 'react';
import { ShieldAlert, BookOpen, Layers, Terminal, CheckCircle2, Cpu, HelpCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'reports' | 'matrix' | 'simulator' | 'walkthrough';
  setActiveTab: (tab: 'reports' | 'matrix' | 'simulator' | 'walkthrough') => void;
  onOpenAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenAssistant }) => {
  return (
    <header className="border-b border-zinc-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          {/* Brand Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-amber-400 flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
                  AI Misalignment Disclosure Observatory
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                  6 Cases Published
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Frontier model misalignment reports & agentic threat modeling framework
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            <button
              id="nav-tab-reports"
              onClick={() => setActiveTab('reports')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'reports'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Disclosure Reports</span>
            </button>

            <button
              id="nav-tab-matrix"
              onClick={() => setActiveTab('matrix')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'matrix'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>5-Zone Threat Matrix</span>
            </button>

            <button
              id="nav-tab-simulator"
              onClick={() => setActiveTab('simulator')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'simulator'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Trace Evaluator</span>
            </button>

            <button
              id="nav-tab-walkthrough"
              onClick={() => setActiveTab('walkthrough')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'walkthrough'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Test Walkthrough</span>
            </button>

            <div className="h-4 w-px bg-zinc-200 mx-1 hidden sm:block" />

            <button
              id="btn-open-assistant"
              onClick={onOpenAssistant}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Safety Q&A</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
