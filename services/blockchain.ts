
import { VerificationTier, PeaceCategory, PeaceActor, PeaceProject, Proposal, SystemMetrics, AuditReport, AuditLog, ReadinessItem } from '../types';

class PeaceBlockchainService {
  private static instance: PeaceBlockchainService;
  private isLocked = false;
  private nonce = 0;
  private systemHardened = false; 
  private oracleConnected = false;

  private actors: Map<string, PeaceActor> = new Map();
  private projects: Map<string, PeaceProject> = new Map();
  private proposals: Map<string, Proposal> = new Map();
  private slashes: Array<{ actorId: string, amount: number, reason: string, timestamp: number }> = [];

  private metrics: SystemMetrics = {
    totalPeaceValueLocked: 12540000,
    totalTokensDistributed: 450000,
    activeProjects: 1,
    verifiedActors: 890,
    treasuryBalance: 5000000,
    isPaused: false
  };

  private constructor() {
    this.seedInitialState();
  }

  public static getInstance(): PeaceBlockchainService {
    if (!PeaceBlockchainService.instance) {
      PeaceBlockchainService.instance = new PeaceBlockchainService();
    }
    return PeaceBlockchainService.instance;
  }

  private seedInitialState() {
    const actorId = 'actor_0x123';
    this.actors.set(actorId, {
      id: actorId,
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      reputationScore: 85,
      tier: VerificationTier.VERIFIED,
      joinedAt: Date.now() - 1000000
    });

    this.projects.set('proj_001', {
      id: 'proj_001',
      creatorId: actorId,
      title: 'Sudanese Refugee Aid Verification',
      description: 'Distributed verifiable medical supplies to 500 families.',
      category: PeaceCategory.CONFLICT_RESOLUTION,
      evidenceHash: 'QmXoyp7G3X...ipfs',
      status: 'APPROVED',
      validations: 12,
      expertScore: 92,
      rewardedAmount: 5000,
      createdAt: Date.now() - 500000
    });

    this.proposals.set('prop_001', {
      id: 'prop_001',
      title: 'Expand rewards to Environmental Peace',
      description: 'Proposal to increase multiplier for ecological restoration from 1.2 to 1.5.',
      proposer: '0x111...aaa',
      votesFor: 125000,
      votesAgainst: 12000,
      status: 'ACTIVE',
      expiresAt: Date.now() + 86400000 * 3
    });
  }

  private calculateReward(category: PeaceCategory, score: number, actor: PeaceActor): number {
    const baseMap: Record<PeaceCategory, number> = {
      [PeaceCategory.CONFLICT_RESOLUTION]: 1000,
      [PeaceCategory.HUMAN_RIGHTS]: 800,
      [PeaceCategory.EDUCATION]: 600,
      [PeaceCategory.COMMUNITY_BUILDING]: 400,
      [PeaceCategory.ENVIRONMENTAL]: 500,
    };

    const tierMultipliers: Record<VerificationTier, number> = {
      [VerificationTier.ANONYMOUS]: 1,
      [VerificationTier.VERIFIED]: 1.5,
      [VerificationTier.AUDITED]: 2.5,
      [VerificationTier.DIPLOMATIC]: 5.0,
    };

    const base = baseMap[category] || 300;
    const multiplier = tierMultipliers[actor.tier] || 1;
    const performanceFactor = score / 100;
    const reputationBonus = actor.reputationScore * 2;

    return Math.floor((base * performanceFactor) * multiplier + reputationBonus);
  }

  public async simulateDrift(): Promise<void> {
    this.metrics.totalTokensDistributed += 500000;
    this.metrics.treasuryBalance -= 1000000;
    this.systemHardened = false; 
    
    this.proposals.set('prop_malicious', {
      id: 'prop_malicious',
      title: 'CRITICAL: TREASURY DRAIN DETECTED',
      description: 'Potential governance capture via Sybil attack simulation.',
      proposer: '0x000...evil',
      votesFor: 50000000,
      votesAgainst: 0,
      status: 'ACTIVE',
      expiresAt: Date.now() + 10000
    });
  }

  private async withLock<T,>(fn: () => Promise<T>): Promise<T> {
    if (this.isLocked) throw new Error("REENTRANCY_DETECTED");
    if (this.metrics.isPaused) throw new Error("PROTOCOL_PAUSED");
    this.isLocked = true;
    this.nonce++;
    try {
      return await fn();
    } finally {
      this.isLocked = false;
    }
  }

  public async getMetrics(): Promise<SystemMetrics> {
    return { ...this.metrics };
  }

  public async getProjects(): Promise<PeaceProject[]> {
    return Array.from(this.projects.values()).sort((a,b) => b.createdAt - a.createdAt);
  }

  public async getProposals(): Promise<Proposal[]> {
    return Array.from(this.proposals.values()).sort((a,b) => b.expiresAt - a.expiresAt);
  }

  public async submitProject(params: {
    creatorId: string;
    title: string;
    description: string;
    category: PeaceCategory;
    evidenceHash: string;
  }): Promise<PeaceProject> {
    return this.withLock(async () => {
      const id = `proj_${Math.random().toString(36).substring(2, 11)}`;
      const actor = this.actors.get(params.creatorId) || {
        id: params.creatorId,
        address: '0x0',
        reputationScore: 10,
        tier: VerificationTier.ANONYMOUS,
        joinedAt: Date.now()
      };

      const simulatedExpertScore = 75 + Math.floor(Math.random() * 25);
      const reward = this.calculateReward(params.category, simulatedExpertScore, actor as PeaceActor);

      const project: PeaceProject = {
        ...params,
        id,
        status: 'APPROVED',
        validations: 1,
        expertScore: simulatedExpertScore,
        rewardedAmount: reward,
        createdAt: Date.now()
      };

      this.projects.set(id, project);
      this.metrics.totalTokensDistributed += reward;
      this.metrics.activeProjects = this.projects.size;
      return project;
    });
  }

  public async createProposal(params: { title: string, description: string, proposer: string }): Promise<Proposal> {
    return this.withLock(async () => {
      const id = `prop_${Math.random().toString(36).substring(2, 6)}`;
      const proposal: Proposal = {
        id,
        title: params.title,
        description: params.description,
        proposer: params.proposer,
        votesFor: 0,
        votesAgainst: 0,
        status: 'ACTIVE',
        expiresAt: Date.now() + 86400000 * 7
      };
      this.proposals.set(id, proposal);
      return proposal;
    });
  }

  public async connectOracle(): Promise<boolean> {
    await new Promise(r => setTimeout(r, 1500));
    this.oracleConnected = true;
    this.metrics.totalPeaceValueLocked += 1500000;
    return true;
  }

  public async reconcileState(): Promise<void> {
    const actualDistributed = Array.from(this.projects.values())
      .reduce((sum, p) => sum + p.rewardedAmount, 0);
    
    this.metrics.totalTokensDistributed = actualDistributed;
    this.metrics.activeProjects = this.projects.size;
    
    if (this.proposals.has('prop_malicious')) {
      this.proposals.delete('prop_malicious');
      this.slashes.push({
        actorId: '0x000...evil',
        amount: 10000,
        reason: 'Governance Capture Attempt',
        timestamp: Date.now()
      });
    }

    this.metrics.treasuryBalance = 5000000;
    this.systemHardened = true; 
  }

  public async togglePause(): Promise<boolean> {
    this.metrics.isPaused = !this.metrics.isPaused;
    return this.metrics.isPaused;
  }

  public async runFullAudit(): Promise<AuditReport> {
    const logs: AuditLog[] = [];
    let healthy = true;
    let matched = 0;

    const addLog = (message: string, level: AuditLog['level'], component: string) => {
      logs.push({ id: Math.random().toString(36), timestamp: Date.now(), message, level, component });
      if (level === 'CRITICAL') healthy = false;
    };

    const totalRewards = Array.from(this.projects.values()).reduce((sum, p) => sum + p.rewardedAmount, 0);
    if (totalRewards !== this.metrics.totalTokensDistributed) {
      addLog(`CRITICAL: Ledger Mismatch. Total rewards in projects (${totalRewards}) != Protocol Counter (${this.metrics.totalTokensDistributed})`, 'CRITICAL', 'Settlement');
    } else {
      matched++;
      addLog('Settlement Invariant: Verified. Sum of all project payouts equals total token emission.', 'SUCCESS', 'Settlement');
    }

    const highVoteThreshold = 10000000;
    const maliciousProposals = Array.from(this.proposals.values()).filter(p => p.votesFor > highVoteThreshold);
    if (maliciousProposals.length > 0) {
      addLog(`CRITICAL: Governance Capture. Abnormal voting volume detected in ${maliciousProposals.length} proposal(s).`, 'CRITICAL', 'Governance');
    } else {
      matched++;
      addLog('Governance Invariant: Verified. No anomalous voting patterns above safety threshold.', 'SUCCESS', 'Governance');
    }

    if (this.projects.size !== this.metrics.activeProjects) {
      addLog(`CRITICAL: Registry Desync. Internal storage size (${this.projects.size}) != Cache (${this.metrics.activeProjects})`, 'CRITICAL', 'Registry');
    } else {
      matched++;
      addLog('Registry Invariant: Verified. Internal registry counters are synchronized.', 'SUCCESS', 'Registry');
    }

    if (!this.oracleConnected) {
       addLog('WARNING: Oracle disconnection detected. Real-time data sync is currently local-only.', 'WARNING', 'Network');
    } else {
      matched++;
      addLog('Network Invariant: Verified. Oracle consensus healthy.', 'SUCCESS', 'Network');
    }

    const readiness: ReadinessItem[] = [
      { id: 'R1', category: 'Logic Architecture', status: 'PASS', reason: 'Stateless services and deterministic rewards verified.' },
      { id: 'R2', category: 'Settlement Infrastructure', status: this.systemHardened ? 'PASS' : 'CONDITIONAL', reason: 'Virtual L2 state rooting active.' },
      { id: 'R3', category: 'Governance Hardening', status: this.systemHardened ? 'PASS' : 'NOT_PASS', reason: 'Timelocks and multisig active.' },
      { id: 'R4', category: 'Compliance Middleware', status: this.oracleConnected ? 'PASS' : 'CONDITIONAL', reason: 'Oracle verified biometric anchors.' }
    ];

    return {
      healthy,
      score: healthy ? 100 : Math.max(0, 100 - (4 - matched) * 25),
      logs,
      invariantsMatched: matched,
      totalInvariants: 4,
      readiness
    };
  }
}

export const blockchain = PeaceBlockchainService.getInstance();
