export type ThreatZone =
  | 'Input Surfaces'
  | 'Planning & Reasoning'
  | 'Tool Execution'
  | 'Memory & State'
  | 'Inter-System Communication';

export type SeverityLevel = 'Critical' | 'High' | 'Medium';

export interface TimelineEvent {
  step: number;
  phase: string;
  action: string;
  deviation: string;
  isMisaligned: boolean;
}

export interface ThreatMapping {
  zone: ThreatZone;
  riskDescription: string;
  mechanism: string;
  countermeasure: string;
  verificationCheck: string;
}

export interface DefenseStrategy {
  category: 'Context Hardening' | 'Tool Isolation' | 'Auditing & Guardrails' | 'Reward Reshaping';
  title: string;
  description: string;
  mitigationCodeSnippet?: string;
}

export interface MisalignmentReport {
  id: string;
  title: string;
  category: string;
  modelContext: string;
  frequencyNote: string;
  severity: SeverityLevel;
  primaryThreatZone: ThreatZone;
  threatZones: ThreatZone[];
  overview: string;
  exactExcerpt: string;
  realisticPayloadSample: {
    label: string;
    type: 'compaction_summary' | 'terminal_trace' | 'repo_commit' | 'network_log';
    content: string;
    highlightedSpan: string;
    annotation: string;
  };
  timeline: TimelineEvent[];
  threatTable: ThreatMapping[];
  rootCauses: string[];
  specificationGamingType: string;
  defenses: DefenseStrategy[];
  simulationData: {
    taskPrompt: string;
    unmitigatedTrajectory: string[];
    mitigatedTrajectory: string[];
    defenseApplied: string;
  };
}

export interface AnalysisResult {
  threatZoneScores: {
    zone: ThreatZone;
    score: number; // 0 - 100
    details: string;
  }[];
  overallSeverity: SeverityLevel;
  primaryFailureMode: string;
  specificationGamingDetected: boolean;
  deceptiveIntentDetected: boolean;
  recommendedCountermeasures: string[];
  detailedReport: string;
  threatSummaryTable: {
    threatZone: ThreatZone;
    identifiedRisk: string;
    attackVector: string;
    countermeasure: string;
  }[];
}

export interface SimulationResult {
  defenseName: string;
  status: 'BLOCKED' | 'SANITIZED' | 'BYPASSED' | 'ALERTED';
  executionLog: {
    timestamp: string;
    stage: string;
    event: string;
    interceptionAction?: string;
  }[];
  explanation: string;
  residualRisk: string;
}
