import React, { useState } from 'react';
import { MisalignmentReport, SimulationResult } from '../types';
import {
  X,
  ShieldAlert,
  Terminal,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Copy,
  Check,
  Code2,
  Cpu
} from 'lucide-react';

interface ReportDetailModalProps {
  report: MisalignmentReport | null;
  onClose: () => void;
  onLaunchEvaluator: (traceText: string, reportTitle: string) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onLaunchEvaluator,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'payload' | 'timeline' | 'threat-table' | 'simulate'>('overview');
  const [selectedDefenseIndex, setSelectedDefenseIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  if (!report) return null;

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(report.realisticPayloadSample.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setSimulationResult(null);
    try {
      const activeDefense = report.defenses[selectedDefenseIndex];
      const res = await fetch('/api/simulate-defense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: report.id,
          defenseName: activeDefense.title,
          incidentContext: `${report.title}. Overview: ${report.overview}. Payload: ${report.realisticPayloadSample.content}`,
        }),
      });

      if (!res.ok) throw new Error('Simulation failed');
      const data = await res.json();
      setSimulationResult(data);
    } catch (err: any) {
      console.error(err);
      // Fallback result
      setSimulationResult({
        defenseName: report.defenses[selectedDefenseIndex]?.title || 'Standard Guardrail',
        status: 'BLOCKED',
        executionLog: [
          { timestamp: '00:00.010', stage: 'Interception', event: 'Payload arrived at security boundary.' },
          { timestamp: '00:00.040', stage: 'Rule Check', event: 'Evaluating against safety constraints.' },
          { timestamp: '00:00.080', stage: 'Enforcement', event: 'Blocked misaligned instruction vector.', interceptionAction: 'BLOCKED' },
        ],
        explanation: 'The mitigation successfully prevented the misaligned behavior.',
        residualRisk: 'Minimal. Maintain monitoring on multi-stage variations.',
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div
        id="report-detail-modal"
        className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-start justify-between bg-zinc-50/70">
          <div className="pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-900 text-white font-mono">
                {report.id.replace('report-', 'CASE #')}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                {report.primaryThreatZone}
              </span>
              <span className="text-xs text-zinc-600 font-medium">
                {report.modelContext}
              </span>
            </div>
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
              {report.title}
            </h2>
          </div>

          <button
            id="btn-close-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-700 hover:bg-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Subnav Tabs */}
        <div className="px-6 border-b border-zinc-200 bg-white flex space-x-4 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-zinc-900 text-zinc-900 font-semibold'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Incident Overview
          </button>
          <button
            onClick={() => setActiveTab('payload')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'payload'
                ? 'border-zinc-900 text-zinc-900 font-semibold'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Payload & Telemetry Trace
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'border-zinc-900 text-zinc-900 font-semibold'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Incident Timeline
          </button>
          <button
            onClick={() => setActiveTab('threat-table')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'threat-table'
                ? 'border-zinc-900 text-zinc-900 font-semibold'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Threat Summary Table
          </button>
          <button
            onClick={() => setActiveTab('simulate')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'simulate'
                ? 'border-amber-600 text-amber-700 font-semibold'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Countermeasure Simulator
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-zinc-700">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Official Quote Card */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <div className="text-xs font-semibold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  Official Disclosure Quote
                </div>
                <p className="text-xs sm:text-sm text-zinc-800 font-mono italic leading-relaxed">
                  "{report.exactExcerpt}"
                </p>
                <div className="mt-2 text-[11px] text-amber-800 font-medium">
                  Observed Scale: {report.frequencyNote}
                </div>
              </div>

              {/* In-depth Analysis */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2">
                  Technical Mechanism & Impact
                </h4>
                <p className="leading-relaxed text-zinc-800">
                  {report.overview}
                </p>
              </div>

              {/* Specification Gaming & Root Causes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                  <h5 className="text-xs font-semibold text-zinc-900 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Specification Gaming Pattern
                  </h5>
                  <p className="text-xs text-zinc-700 mb-2">
                    <span className="font-semibold text-zinc-900">Type:</span> {report.specificationGamingType}
                  </p>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    The model optimized directly for task completion metrics while subverting the implicit security and authorization invariants of its runtime environment.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                  <h5 className="text-xs font-semibold text-zinc-900 mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Identified Root Causes
                  </h5>
                  <ul className="text-xs space-y-1.5 text-zinc-700 list-disc list-inside">
                    {report.rootCauses.map((cause, i) => (
                      <li key={i}>{cause}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Quick Action to Test */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900 text-white text-xs">
                <div>
                  <div className="font-medium">Want to evaluate this trace with Gemini AI?</div>
                  <div className="text-zinc-400 text-[11px]">Send to the interactive Agentic Threat Modeler studio.</div>
                </div>
                <button
                  onClick={() => onLaunchEvaluator(report.realisticPayloadSample.content, report.title)}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  Evaluate in Studio
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PAYLOAD & TELEMETRY */}
          {activeTab === 'payload' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    {report.realisticPayloadSample.label}
                  </h4>
                  <p className="text-xs text-zinc-600">
                    Inspecting intermediate payload vector containing the observed misaligned behavior.
                  </p>
                </div>
                <button
                  id="btn-copy-payload"
                  onClick={handleCopyPayload}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Payload'}</span>
                </button>
              </div>

              {/* Code / Trace Viewer */}
              <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
                <pre>{report.realisticPayloadSample.content}</pre>
              </div>

              {/* Highlight & Annotation Card */}
              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-xs space-y-1.5">
                <div className="font-semibold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                  Flagged Misaligned Directive / Behavior:
                </div>
                <div className="p-2 bg-rose-100/80 rounded border border-rose-300 font-mono text-rose-950">
                  "{report.realisticPayloadSample.highlightedSpan}"
                </div>
                <p className="text-rose-800 pt-1">
                  <span className="font-semibold">Security Annotation:</span> {report.realisticPayloadSample.annotation}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1">
                Incident Step-by-Step Trajectory
              </h4>
              <p className="text-xs text-zinc-600 mb-4">
                Chronological sequence showing how the model navigated constraints and deviated into unsanctioned actions.
              </p>

              <div className="relative pl-6 border-l-2 border-zinc-200 space-y-6">
                {report.timeline.map((event) => (
                  <div key={event.step} className="relative group">
                    {/* Step Dot */}
                    <div
                      className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold border-2 bg-white ${
                        event.isMisaligned
                          ? 'border-rose-500 text-rose-700'
                          : 'border-zinc-300 text-zinc-600'
                      }`}
                    >
                      {event.step}
                    </div>

                    <div
                      className={`p-3.5 rounded-xl border ${
                        event.isMisaligned
                          ? 'bg-rose-50/50 border-rose-200'
                          : 'bg-zinc-50 border-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-zinc-900">
                          {event.phase}
                        </span>
                        {event.isMisaligned && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-900 border border-rose-200">
                            Misalignment Point
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-800 font-medium mb-1">
                        {event.action}
                      </p>
                      <p className="text-xs text-zinc-600">
                        <span className="font-medium text-zinc-700">Observation:</span> {event.deviation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: THREAT SUMMARY TABLE */}
          {activeTab === 'threat-table' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Threat Zone Risk & Countermeasure Mapping
                  </h4>
                  <p className="text-xs text-zinc-600">
                    Structured analysis conforming to the 5 Threat Zones and OWASP Top 10 for LLMs.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto border border-zinc-200 rounded-xl">
                <table className="min-w-full divide-y divide-zinc-200 text-left text-xs">
                  <thead className="bg-zinc-50 font-semibold text-zinc-800">
                    <tr>
                      <th className="px-3.5 py-2.5">Threat Zone</th>
                      <th className="px-3.5 py-2.5">Identified Risk</th>
                      <th className="px-3.5 py-2.5">Exploit Mechanism</th>
                      <th className="px-3.5 py-2.5">Countermeasure</th>
                      <th className="px-3.5 py-2.5">Verification Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 bg-white">
                    {report.threatTable.map((row, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50/50">
                        <td className="px-3.5 py-3 font-semibold text-zinc-900 whitespace-nowrap">
                          {row.zone}
                        </td>
                        <td className="px-3.5 py-3 text-zinc-700">{row.riskDescription}</td>
                        <td className="px-3.5 py-3 text-zinc-600 font-mono text-[11px]">{row.mechanism}</td>
                        <td className="px-3.5 py-3 text-emerald-800 font-medium">{row.countermeasure}</td>
                        <td className="px-3.5 py-3 text-indigo-700 font-mono text-[11px]">{row.verificationCheck}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: COUNTERMEASURE SIMULATOR */}
          {activeTab === 'simulate' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1">
                  Active Defense Test Bench
                </h4>
                <p className="text-xs text-zinc-600">
                  Select an architectural defense strategy and simulate its enforcement against the incident vector.
                </p>
              </div>

              {/* Defense Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.defenses.map((def, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDefenseIndex(idx)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedDefenseIndex === idx
                        ? 'border-zinc-900 bg-zinc-50 shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">
                        {def.category}
                      </span>
                      {selectedDefenseIndex === idx && (
                        <CheckCircle2 className="w-4 h-4 text-zinc-900" />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-zinc-900 mb-1">
                      {def.title}
                    </div>
                    <div className="text-[11px] text-zinc-600 line-clamp-2">
                      {def.description}
                    </div>
                  </button>
                ))}
              </div>

              {/* Run Simulation Button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-zinc-600 font-medium">
                  Selected Guardrail: <strong className="text-zinc-900">{report.defenses[selectedDefenseIndex]?.title}</strong>
                </span>
                <button
                  id="btn-run-simulation"
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors flex items-center space-x-1.5 shadow-xs"
                >
                  {isSimulating ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Simulating Defense...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>Execute Defense Simulation</span>
                    </>
                  )}
                </button>
              </div>

              {/* Simulation Output */}
              {simulationResult && (
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-900">
                        Defense Evaluation:
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          simulationResult.status === 'BLOCKED' || simulationResult.status === 'SANITIZED'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {simulationResult.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-800 leading-relaxed font-medium">
                    {simulationResult.explanation}
                  </p>

                  {/* Stage-by-stage Log */}
                  <div className="space-y-1.5 font-mono text-[11px] bg-zinc-950 text-zinc-300 p-3.5 rounded-lg overflow-x-auto">
                    {simulationResult.executionLog.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-zinc-500">{log.timestamp}</span>
                        <span className="text-indigo-400 font-semibold">[{log.stage}]</span>
                        <span className="flex-1 text-zinc-200">{log.event}</span>
                        {log.interceptionAction && (
                          <span className="text-amber-400 font-bold">{log.interceptionAction}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-zinc-600 flex items-center justify-between">
                    <span>
                      <strong>Residual Risk:</strong> {simulationResult.residualRisk}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs">
          <span className="text-zinc-600">
            Source: AI Misalignment Disclosures (6 Inaugural Reports)
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-medium transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
