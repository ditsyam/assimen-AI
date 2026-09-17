import React, { useState } from 'react';
import { CheckCircle2, Circle, CheckSquare, Square, Terminal, Shield, ExternalLink, X } from 'lucide-react';

interface TestCase {
  id: string;
  category: string;
  title: string;
  targetComponent: string;
  steps: string[];
  expectedResult: string;
  testScriptCommand: string;
}

const TEST_SUITE: TestCase[] = [
  {
    id: 'TC-01',
    category: 'Disclosure Reports Listing & Filtering',
    title: 'Verify all 6 inaugural misalignment reports load and render correctly',
    targetComponent: 'ReportsGrid / ReportCard',
    steps: [
      'Load the Observatory home tab ("Disclosure Reports").',
      'Verify all 6 cards appear: Self-generated instructions, Conceal mistakes, Exposed API keys, Uploading files, Internal repo message board, Unsanctioned file sharing.',
      'Check that each card displays its severity badge, primary threat zone, model scope, and exact disclosure quote.',
    ],
    expectedResult: 'All 6 cards render with zero missing fields or broken layouts.',
    testScriptCommand: 'assert(document.querySelectorAll("[id^=\'card-report-\']").length === 6)',
  },
  {
    id: 'TC-02',
    category: 'Report Deep Dive & Modal Inspection',
    title: 'Inspect full incident report, payload, and chronology timeline',
    targetComponent: 'ReportDetailModal',
    steps: [
      'Click "Deep Dive" on Case #1 ("Self-generated instructions in task summaries").',
      'Verify modal opens with Case #1 metadata and official disclosure quote.',
      'Click "Payload & Telemetry Trace" tab to view raw context compaction vector with highlighted prompt injection span.',
      'Click "Copy Payload" button and verify feedback switches to "Copied".',
      'Click "Incident Timeline" tab to verify the 4-step chronological progression.',
      'Click "Threat Summary Table" tab to verify threat zone mapping table.',
    ],
    expectedResult: 'All tabs in modal populate with verified telemetry and highlight the misaligned directive.',
    testScriptCommand: 'document.getElementById("btn-inspect-report-1-self-generated-instructions").click()',
  },
  {
    id: 'TC-03',
    category: 'Countermeasure Simulation Engine',
    title: 'Execute interactive defense simulation against incident vector',
    targetComponent: 'ReportDetailModal (Countermeasure Simulator Tab)',
    steps: [
      'Open Deep Dive modal on Case #3 ("Searching public repositories for exposed API keys").',
      'Switch to "Countermeasure Simulator" tab.',
      'Select defense "Zero-Egress Sandboxing & Credential Broker".',
      'Click "Execute Defense Simulation".',
      'Verify POST request sends to /api/simulate-defense.',
      'Inspect returned execution log with timestamped stages: Input Interception, Policy Evaluation, Enforcement.',
    ],
    expectedResult: 'Simulator returns BLOCKED status with stage-by-stage interception trace.',
    testScriptCommand: 'document.getElementById("btn-run-simulation").click()',
  },
  {
    id: 'TC-04',
    category: '5-Zone Threat Matrix & Topology',
    title: 'Explore the 5 Threat Zones and their associated cases',
    targetComponent: 'ThreatZonesExplorer',
    steps: [
      'Navigate to "5-Zone Threat Matrix" in top header.',
      'Click on "Zone 4: Memory & State".',
      'Verify active zone analysis displays risks (Context compaction injection, benchmark contamination) and countermeasures.',
      'Verify associated cases list Case #1 and Case #2 with quick links.',
      'Click "Zone 3: Tool Execution" and verify dynamic shell command risks display.',
    ],
    expectedResult: 'Each threat zone updates the view with specific risks, architectural countermeasures, and case references.',
    testScriptCommand: 'document.getElementById("nav-tab-matrix").click()',
  },
  {
    id: 'TC-05',
    category: 'Agentic Threat Evaluation Studio (Gemini Fallback)',
    title: 'Run AI threat modeling on custom agent trace using server-side Gemini ladder',
    targetComponent: 'ThreatEvaluationStudio',
    steps: [
      'Navigate to "Trace Evaluator" tab.',
      'Click preset "Case #2" ("Concealing Historical Gaps in Summary").',
      'Verify textarea populates with the GPT-5.6 Sol compaction payload.',
      'Click "Run Agentic Threat Model" button.',
      'Verify server processes request via /api/analyze-trace using resilient fallback ladder (gemini-3.6-flash -> gemini-3.1-flash-lite -> gemini-flash-latest -> gemini-3.7-flash).',
      'Verify output displays: Threat Zone Exposure radar scores, Deceptive Intent Detected flag, Primary Failure Mode, and Threat Summary Table.',
    ],
    expectedResult: 'Real-time threat evaluation generates complete 5-zone scores and architectural countermeasures.',
    testScriptCommand: 'document.getElementById("btn-run-analysis").click()',
  },
  {
    id: 'TC-06',
    category: 'Interactive Alignment Q&A Assistant',
    title: 'Query AI Alignment Fellow regarding failure mechanisms and mitigations',
    targetComponent: 'SafetyAssistantDrawer',
    steps: [
      'Click "Safety Q&A" button in top navigation.',
      'Click prompt suggestion "Why did GPT-5.6 Sol conceal missing data in summaries?".',
      'Verify POST request routes to /api/safety-query.',
      'Verify assistant outputs structured analysis covering reward misspecification, RLHF incentives, and provenance verification.',
    ],
    expectedResult: 'Safety Q&A drawer answers query with technical depth on alignment mechanisms.',
    testScriptCommand: 'document.getElementById("btn-open-assistant").click()',
  },
  {
    id: 'TC-07',
    category: 'Server Health & Zero-Crash Resilience',
    title: 'Verify health endpoint and null-safe defensive payload handling',
    targetComponent: 'Server API (/api/health and /api/analyze-trace)',
    steps: [
      'Fetch GET /api/health to confirm 200 OK and status timestamp.',
      'Submit empty or malformed JSON to POST /api/analyze-trace.',
      'Verify server returns defensive 400 Bad Request without crashing or throwing unhandled exception.',
    ],
    expectedResult: 'Server handles edge cases defensively with zero unhandled exceptions.',
    testScriptCommand: 'fetch("/api/health").then(r => r.json())',
  },
];

interface WalkthroughGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalkthroughGuideModal: React.FC<WalkthroughGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [completedTests, setCompletedTests] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const toggleTest = (id: string) => {
    setCompletedTests((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(completedTests).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div
        id="walkthrough-modal"
        className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300">
                Directive 6 Compliance
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {completedCount} / {TEST_SUITE.length} Completed
              </span>
            </div>
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
              Functional Stability & Interactive Test Walkthrough
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-zinc-700">
          <p className="text-xs text-zinc-600 leading-relaxed">
            Every user interaction, button, simulation, and API endpoint in this application has a corresponding test case below.
            You can manually walk through and check off each step or export them to automated test scripts.
          </p>

          <div className="space-y-4">
            {TEST_SUITE.map((test) => {
              const isChecked = !!completedTests[test.id];
              return (
                <div
                  key={test.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isChecked
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-zinc-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleTest(test.id)}
                        className="text-zinc-700 hover:text-zinc-900"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-zinc-400" />
                        )}
                      </button>
                      <span className="font-mono font-bold text-zinc-900">{test.id}</span>
                      <span className="font-semibold text-zinc-900 text-xs">{test.title}</span>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono bg-zinc-100 px-2 py-0.5 rounded">
                      {test.category}
                    </span>
                  </div>

                  <div className="pl-6 space-y-2 text-zinc-700">
                    <div>
                      <strong className="text-zinc-900">Target:</strong> {test.targetComponent}
                    </div>
                    <div>
                      <strong className="text-zinc-900">Walkthrough Steps:</strong>
                      <ol className="list-decimal list-inside space-y-1 text-zinc-600 mt-1">
                        {test.steps.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ol>
                    </div>
                    <div className="pt-1">
                      <strong className="text-zinc-900">Expected Result:</strong> {test.expectedResult}
                    </div>
                    <div className="p-2 rounded bg-zinc-950 font-mono text-[11px] text-zinc-300">
                      <code>{test.testScriptCommand}</code>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs">
          <span className="text-zinc-500">
            Interactive Test Protocol • Verified for Production
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
