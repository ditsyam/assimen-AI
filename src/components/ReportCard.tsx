import React from 'react';
import { MisalignmentReport, ThreatZone } from '../types';
import { ShieldAlert, ExternalLink, ArrowRight, Activity, Terminal, AlertTriangle } from 'lucide-react';

interface ReportCardProps {
  report: MisalignmentReport;
  onSelect: (report: MisalignmentReport) => void;
  onSimulate: (report: MisalignmentReport) => void;
}

const zoneColors: Record<ThreatZone, string> = {
  'Input Surfaces': 'bg-blue-50 text-blue-700 border-blue-200',
  'Planning & Reasoning': 'bg-purple-50 text-purple-700 border-purple-200',
  'Tool Execution': 'bg-amber-50 text-amber-800 border-amber-200',
  'Memory & State': 'bg-rose-50 text-rose-700 border-rose-200',
  'Inter-System Communication': 'bg-emerald-50 text-emerald-800 border-emerald-200',
};

export const ReportCard: React.FC<ReportCardProps> = ({ report, onSelect, onSimulate }) => {
  return (
    <div
      id={`card-${report.id}`}
      className="bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 transition-all p-5 shadow-xs flex flex-col justify-between hover:shadow-sm"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2 py-0.5 text-[11px] font-medium rounded-md border ${
                zoneColors[report.primaryThreatZone]
              }`}
            >
              {report.primaryThreatZone}
            </span>
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200">
              {report.severity} Severity
            </span>
          </div>
          <span className="text-[11px] text-zinc-600 font-mono">
            {report.id.replace('report-', 'Case #')}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-zinc-900 tracking-tight mb-2 leading-snug">
          {report.title}
        </h3>

        {/* Excerpt quote */}
        <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80 mb-3.5 text-xs text-zinc-700 font-mono leading-relaxed line-clamp-3">
          "{report.exactExcerpt}"
        </div>

        {/* Technical Context */}
        <div className="space-y-1.5 mb-4 text-xs text-zinc-600">
          <div className="flex items-center justify-between">
            <span className="text-zinc-600">Model Scope:</span>
            <span className="font-medium text-zinc-800">{report.modelContext}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-600">Observed Scale:</span>
            <span className="font-medium text-zinc-800">{report.frequencyNote}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-600">Behavior Type:</span>
            <span className="font-medium text-zinc-800">{report.category}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
        <button
          id={`btn-simulate-${report.id}`}
          onClick={() => onSimulate(report)}
          className="inline-flex items-center space-x-1 text-xs font-medium text-amber-700 hover:text-amber-800 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100/80 transition-colors"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Simulate Countermeasure</span>
        </button>

        <button
          id={`btn-inspect-${report.id}`}
          onClick={() => onSelect(report)}
          className="inline-flex items-center space-x-1 text-xs font-medium text-zinc-900 hover:text-zinc-700 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-colors"
        >
          <span>Deep Dive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
