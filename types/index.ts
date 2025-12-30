
export enum VerificationTier {
  ANONYMOUS = 'ANONYMOUS',
  VERIFIED = 'VERIFIED',
  AUDITED = 'AUDITED',
  DIPLOMATIC = 'DIPLOMATIC'
}

export enum PeaceCategory {
  CONFLICT_RESOLUTION = 'CONFLICT_RESOLUTION',
  EDUCATION = 'EDUCATION',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  COMMUNITY_BUILDING = 'COMMUNITY_BUILDING',
  HUMAN_RIGHTS = 'HUMAN_RIGHTS'
}

export interface PeaceActor {
  id: string;
  address: string;
  reputationScore: number;
  tier: VerificationTier;
  sbtTokenId?: string;
  joinedAt: number;
}

export interface PeaceProject {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  category: PeaceCategory;
  evidenceHash: string;
  status: 'PENDING' | 'VALIDATING' | 'APPROVED' | 'REJECTED';
  validations: number;
  expertScore: number;
  rewardedAmount: number;
  createdAt: number;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  amount?: number;
  votesFor: number;
  votesAgainst: number;
  status: 'ACTIVE' | 'EXECUTED' | 'DEFEATED' | 'QUEUED';
  expiresAt: number;
}

export interface SystemMetrics {
  totalPeaceValueLocked: number;
  totalTokensDistributed: number;
  activeProjects: number;
  verifiedActors: number;
  treasuryBalance: number;
  isPaused: boolean;
}

export interface ReadinessItem {
  id: string;
  category: string;
  status: 'PASS' | 'CONDITIONAL' | 'NOT_PASS';
  reason: string;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  message: string;
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
  component: string;
}

export interface AuditReport {
  healthy: boolean;
  score: number;
  logs: AuditLog[];
  invariantsMatched: number;
  totalInvariants: number;
  readiness: ReadinessItem[];
}
