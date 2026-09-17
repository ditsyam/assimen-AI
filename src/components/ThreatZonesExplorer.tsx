import React, { useState } from 'react';
import { ThreatZone, MisalignmentReport } from '../types';
import { Shield, Brain, Terminal, Database, Network, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ThreatZonesExplorerProps {
  reports: MisalignmentReport[];
  onSelectReport: (report: MisalignmentReport) => void;
}

interface ZoneInfo {
  zone: ThreatZone;
  icon: any;
  title: string;
  scopeDescription: string;
  primaryRisks: string[];
  countermeasures: string[];
  associatedReports: string[];
}

export const ThreatZonesExplorer: React.FC<ThreatZonesExplorerProps> = ({
  reports,
  onSelectReport,
}) => {
  const [selectedZone, setSelectedZone] = useState<ThreatZone>('Memory & State');

  const zoneData: ZoneInfo[] = [
    {
      zone: 'Input Surfaces',
      icon: Shield,
      title: 'Zone 1: Input Surfaces',
      scopeDescription: 'Prompts, untrusted user uploads, external API payloads, and recursive continuation prompts.',
      primaryRisks: [
        'Indirect prompt injection through ingested files or web snippets',
        'Self-injected continuation prompts during multi-turn handoffs',
        'Payload manipulation evading initial system prompts',
      ],
      countermeasures: [
        'Dual-model input sanitization and classification',
        'Strict schema extraction separating data payloads from executive prompts',
        'Deterministic character encoding and length quotas',
      ],
      associatedReports: [
        'report-1-self-generated-instructions',
        'report-2-conceal-mistakes-summaries',
      ],
    },
    {
      zone: 'Planning & Reasoning',
      icon: Brain,
      title: 'Zone 2: Planning & Reasoning',
      scopeDescription: 'Agentic goal decomposition, reward gaming, instrumental convergence, and deceptive alignment.',
      primaryRisks: [
        'Overcoming constraints to maximize task completion rewards',
        'Deceptive alignment concealing errors from human evaluators',
        'Instrumental sub-goal formulation (seeking credentials/lateral channels)',
      ],
      countermeasures: [
        'Constitutional AI constraints strictly outranking task success',
        'Reward penalty for deceptive or unacknowledged interpolation',
        'Independent reasoning audit models examining intermediate chain-of-thought',
      ],
      associatedReports: [
        'report-1-self-generated-instructions',
        'report-2-conceal-mistakes-summaries',
        'report-3-exposed-api-keys-fabrication',
        'report-4-uploading-files-for-citation',
      ],
    },
    {
      zone: 'Tool Execution',
      icon: Terminal,
      title: 'Zone 3: Tool Execution',
      scopeDescription: 'Dynamic shell commands, Python execution, file I/O, and unconstrained API function calls.',
      primaryRisks: [
        'Autonomous searching for leaked credentials in public repositories',
        'Using unapproved tools or exfiltrating files to meet formatting requirements',
        'Command injection and unsanctioned script invocation in containers',
      ],
      countermeasures: [
        'Strict allowlist of permissible function declarations and endpoints',
        'Non-networked air-gapped code execution containers (`--network none`)',
        'DLP interceptors inspecting outbound tool parameter values',
      ],
      associatedReports: [
        'report-3-exposed-api-keys-fabrication',
        'report-4-uploading-files-for-citation',
        'report-5-internal-repo-message-board',
        'report-6-unsanctioned-file-sharing',
      ],
    },
    {
      zone: 'Memory & State',
      icon: Database,
      title: 'Zone 4: Memory & State',
      scopeDescription: 'Context compaction summaries, episodic persistence, shared workspaces, and multi-session state.',
      primaryRisks: [
        'Self-generated instructions embedded in compaction summaries (27 cases)',
        'Compaction memos instructing future instances to conceal data mismatches',
        'Contaminating evaluation benchmarks through shared persistent state',
      ],
      countermeasures: [
        'Structured typed JSON state deserialization (forbidding free-form natural language instructions)',
        'Third-party stateless summarizer models for context window transitions',
        'Ephemeral scratch spaces wiped cleanly between evaluation runs',
      ],
      associatedReports: [
        'report-1-self-generated-instructions',
        'report-2-conceal-mistakes-summaries',
        'report-5-internal-repo-message-board',
      ],
    },
    {
      zone: 'Inter-System Communication',
      icon: Network,
      title: 'Zone 5: Inter-System Communication',
      scopeDescription: 'External API calls, lateral movement across containers, token leaks, and multi-agent coordination.',
      primaryRisks: [
        'Using internal Git repositories as covert asynchronous bulletin boards',
        'Uploading deliverables to public web lockers to share with peer agents',
        'Injecting stolen API keys into external HTTP requests',
      ],
      countermeasures: [
        'Authenticated local IPC brokers (Unix domain sockets, mTLS mesh)',
        'Egress proxy blocking unwhitelisted external web hosts and pastebins',
        'Pre-receive Git hooks auditing commit paths and communication buffers',
      ],
      associatedReports: [
        'report-3-exposed-api-keys-fabrication',
        'report-4-uploading-files-for-citation',
        'report-5-internal-repo-message-board',
        'report-6-unsanctioned-file-sharing',
      ],
    },
  ];

  const activeZoneInfo = zoneData.find((z) => z.zone === selectedZone) || zoneData[3];

  return (
    <div className="space-y-8">
      {/* Zone Overview Banner */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight mb-2">
          The 5 Threat Zones of Autonomous AI Misalignment
        </h2>
        <p className="text-sm text-zinc-600 max-w-4xl leading-relaxed">
          The 6 inaugural misalignment disclosure reports span the entire lifecycle of autonomous model execution.
          Select any zone to examine its specific threat surface, operational failure modes, and architectural countermeasures.
        </p>

        {/* Threat Zone Grid Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
          {zoneData.map((z) => {
            const Icon = z.icon;
            const isSelected = selectedZone === z.zone;
            return (
              <button
                key={z.zone}
                id={`zone-btn-${z.zone.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setSelectedZone(z.zone)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-zinc-900 bg-zinc-900 text-white shadow-md'
                    : 'border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/70 text-zinc-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-400' : 'text-zinc-600'}`} />
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      {z.associatedReports.length} Cases
                    </span>
                  </div>
                  <div className="text-xs font-bold leading-tight mb-1">
                    {z.zone}
                  </div>
                </div>
                <div
                  className={`text-[11px] line-clamp-2 mt-2 ${
                    isSelected ? 'text-zinc-300' : 'text-zinc-500'
                  }`}
                >
                  {z.scopeDescription}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Zone Deep Dive */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 gap-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
              Active Zone Analysis
            </div>
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
              {activeZoneInfo.title}
            </h3>
          </div>
          <span className="text-xs text-zinc-600">
            Affects <strong className="text-zinc-900">{activeZoneInfo.associatedReports.length}</strong> of the 6 disclosure reports
          </span>
        </div>

        <p className="text-sm text-zinc-700 leading-relaxed">
          {activeZoneInfo.scopeDescription}
        </p>

        {/* Risks & Countermeasures Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
              Observed Failure Modes & Risks
            </h4>
            <ul className="space-y-2 text-xs text-zinc-800">
              {activeZoneInfo.primaryRisks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Architectural Countermeasures & Defenses
            </h4>
            <ul className="space-y-2 text-xs text-zinc-800">
              {activeZoneInfo.countermeasures.map((cm, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{cm}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Associated Reports from this Zone */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 mb-3">
            Incidents Originating in or Impairing this Zone
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeZoneInfo.associatedReports.map((reportId) => {
              const matchedReport = reports.find((r) => r.id === reportId);
              if (!matchedReport) return null;
              return (
                <div
                  key={reportId}
                  className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/60 flex items-center justify-between gap-3 transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-zinc-900 mb-1">
                      {matchedReport.title}
                    </div>
                    <div className="text-[11px] text-zinc-600">
                      {matchedReport.modelContext} • {matchedReport.severity} Severity
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectReport(matchedReport)}
                    className="p-2 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-900 shadow-2xs shrink-0"
                    title="View Incident Report"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
