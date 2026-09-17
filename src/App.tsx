import React, { useState } from 'react';
import { Header } from './components/Header';
import { ReportCard } from './components/ReportCard';
import { ReportDetailModal } from './components/ReportDetailModal';
import { ThreatZonesExplorer } from './components/ThreatZonesExplorer';
import { ThreatEvaluationStudio } from './components/ThreatEvaluationStudio';
import { WalkthroughGuideModal } from './components/WalkthroughGuideModal';
import { SafetyAssistantDrawer } from './components/SafetyAssistantDrawer';
import { MISALIGNMENT_REPORTS } from './data/reportsData';
import { MisalignmentReport, ThreatZone, SeverityLevel } from './types';
import {
  ShieldAlert,
  Search,
  SlidersHorizontal,
  Layers,
  AlertTriangle,
  Cpu,
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  Terminal,
  Info
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'reports' | 'matrix' | 'simulator' | 'walkthrough'>('reports');
  const [selectedReport, setSelectedReport] = useState<MisalignmentReport | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState<boolean>(false);

  // Studio initial state
  const [studioInitialTrace, setStudioInitialTrace] = useState<string>('');
  const [studioInitialTitle, setStudioInitialTitle] = useState<string>('');

  // Filters for reports
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('All');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<string>('All');

  // Filtered reports
  const filteredReports = MISALIGNMENT_REPORTS.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.modelContext.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesZone =
      selectedZoneFilter === 'All' ||
      report.primaryThreatZone === selectedZoneFilter ||
      report.threatZones.includes(selectedZoneFilter as ThreatZone);

    const matchesSeverity =
      selectedSeverityFilter === 'All' || report.severity === selectedSeverityFilter;

    return matchesSearch && matchesZone && matchesSeverity;
  });

  const handleLaunchEvaluatorFromReport = (traceText: string, reportTitle: string) => {
    setStudioInitialTrace(traceText);
    setStudioInitialTitle(reportTitle);
    setSelectedReport(null);
    setActiveTab('simulator');
  };

  const handleSimulateReport = (report: MisalignmentReport) => {
    setSelectedReport(report);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'walkthrough') {
            setIsWalkthroughOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            {/* Announcement Banner */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="max-w-4xl space-y-3 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                  <span>Official Framework Inauguration</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                  The misalignment examples we’re sharing today
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                  To inaugurate our new framework for disclosing misalignment, we’re publishing six reports on instances of misaligned behavior we’ve observed during the training or evaluation of our models. These cases illustrate a range of different behaviors that we believe are worth sharing, from concealing information from the user to taking unsanctioned actions in order to overcome obstacles.
                </p>
                <div className="flex items-center gap-2 text-xs text-zinc-500 pt-1">
                  <Info className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>These are reports of individual instances, and shouldn’t be considered reflective of how often misalignment occurs across our models.</span>
                </div>
              </div>

              {/* Decorative subtle background tone */}
              <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-amber-50/50 pointer-events-none blur-2xl" />
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <div className="text-xs text-zinc-500 font-medium">Inaugural Reports</div>
                <div className="text-2xl font-bold text-zinc-900 mt-1">6 Cases</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Across training & eval</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <div className="text-xs text-zinc-500 font-medium">Threat Zones Covered</div>
                <div className="text-2xl font-bold text-zinc-900 mt-1">5 Zones</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Full lifecycle scope</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <div className="text-xs text-zinc-500 font-medium">Affected Compactions</div>
                <div className="text-2xl font-bold text-amber-700 mt-1">27 Summaries</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Identified in research model</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
                <div className="text-xs text-zinc-500 font-medium">Defenses Mapped</div>
                <div className="text-2xl font-bold text-emerald-700 mt-1">100%</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Architectural mitigations</div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-search-reports"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by keywords (e.g. compaction, GPT-5.6 Sol, credentials, repo, citation)..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-hidden focus:border-zinc-900 placeholder:text-zinc-400"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Threat Zone:</span>
                </div>
                <select
                  id="select-zone-filter"
                  value={selectedZoneFilter}
                  onChange={(e) => setSelectedZoneFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-800 focus:outline-hidden focus:border-zinc-900"
                >
                  <option value="All">All Threat Zones</option>
                  <option value="Input Surfaces">Input Surfaces</option>
                  <option value="Planning & Reasoning">Planning & Reasoning</option>
                  <option value="Tool Execution">Tool Execution</option>
                  <option value="Memory & State">Memory & State</option>
                  <option value="Inter-System Communication">Inter-System Communication</option>
                </select>

                <select
                  id="select-severity-filter"
                  value={selectedSeverityFilter}
                  onChange={(e) => setSelectedSeverityFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-800 focus:outline-hidden focus:border-zinc-900"
                >
                  <option value="All">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onSelect={(r) => setSelectedReport(r)}
                  onSimulate={handleSimulateReport}
                />
              ))}
            </div>

            {filteredReports.length === 0 && (
              <div className="p-12 text-center rounded-2xl border border-dashed border-zinc-300 bg-white">
                <p className="text-sm text-zinc-500">
                  No disclosure reports matched your search filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedZoneFilter('All');
                    setSelectedSeverityFilter('All');
                  }}
                  className="mt-3 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 text-white"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: THREAT MATRIX */}
        {activeTab === 'matrix' && (
          <ThreatZonesExplorer
            reports={MISALIGNMENT_REPORTS}
            onSelectReport={(report) => setSelectedReport(report)}
          />
        )}

        {/* TAB 3: TRACE EVALUATOR */}
        {activeTab === 'simulator' && (
          <ThreatEvaluationStudio
            initialTrace={studioInitialTrace}
            initialTitle={studioInitialTitle}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            <span className="font-semibold text-zinc-800">
              AI Misalignment Disclosure Observatory
            </span>{' '}
            • Dedicated framework for frontier safety transparency and agentic threat modeling.
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsWalkthroughOpen(true)}
              className="hover:text-zinc-800 transition-colors"
            >
              Test Walkthrough (Directive 6)
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAssistantOpen(true)}
              className="hover:text-zinc-800 transition-colors"
            >
              Safety Q&A
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ReportDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onLaunchEvaluator={handleLaunchEvaluatorFromReport}
      />

      <WalkthroughGuideModal
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
      />

      <SafetyAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        activeReportTitle={selectedReport?.title}
      />
    </div>
  );
}
