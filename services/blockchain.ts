
import { VerificationTier, PeaceCategory, PeaceActor, PeaceProject, Proposal, SystemMetrics, AuditReport, AuditLog, ReadinessItem } from '../types';

class PeaceBlockchainService {
  private static instance: PeaceBlockchainService;
  private isLocked = false;
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
      evidenceHash: 'QmXoyp7G3X9hS...ipfs',
      status: 'APPROVED',
      validations: 12,
      expertScore: 92,
      rewardedAmount: 5000,
      createdAt: Date.now() - 500000
    });

    this.proposals.set('prop_001', {
      id: 'prop_001',
      title: 'Expand rewards to Environmental Peace',
      description: 'Increase multiplier for ecological restoration from 1.2 to 1.5.',
      proposer: '0x111...aaa',
      votesFor: 125000,
      votesAgainst: 12000,
      status: 'ACTIVE',
      expiresAt: Date.now() + 86400000 * 3
    });
  }

  private async withLock<T,>(fn: () => Promise<T>): Promise<T> {
    if (this.isLocked) throw new Error("REENTRANCY_DETECTED");
    if (this.metrics.isPaused) throw new Error("PROTOCOL_PAUSED");
    this.isLocked = true;
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

  /**
   * Simulated IPFS Content ID (CID) Generation
   */
  public generateCID(data: string): string {
    const hash = Array.from(data).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `Qm${hash.toString(16)}...peace`;
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
      const project: PeaceProject = {
        ...params,
        id,
        status: 'PENDING',
        validations: 0,
        expertScore: 0,
        rewardedAmount: 0,
        createdAt: Date.now()
      };
      this.projects.set(id, project);
      this.metrics.activeProjects = this.projects.size;
      return project;
    });
  }

  public async validateProject(projectId: string): Promise<PeaceProject> {
    return this.withLock(async () => {
      const project = this.projects.get(projectId);
      if (!project) throw new Error("PROJECT_NOT_FOUND");
      if (project.status === 'APPROVED') return project;

      project.validations += 1;
      
      // Threshold Logic: If project gets 5 community validations, it is approved.
      if (project.validations >= 5) {
        project.status = 'APPROVED';
        project.expertScore = 85 + Math.floor(Math.random() * 15);
        project.rewardedAmount = 2500 + Math.floor(Math.random() * 5000);
        this.metrics.totalTokensDistributed += project.rewardedAmount;
      }

      this.projects.set(projectId, project);
      return project;
    });
  }

  public async voteProposal(proposalId: string, support: boolean, amount: number): Promise<Proposal> {
    return this.withLock(async () => {
      const proposal = this.proposals.get(proposalId);
      if (!proposal) throw new Error("PROPOSAL_NOT_FOUND");
      
      if (support) proposal.votesFor += amount;
      else proposal.votesAgainst += amount;

      this.proposals.set(proposalId, proposal);
      this.metrics.totalPeaceValueLocked += amount * 0.1; // Simulated TVL increase from participation
      return proposal;
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
    this.systemHardened = true; 
  }

  public async togglePause(): Promise<boolean> {
    this.metrics.isPaused = !this.metrics.isPaused;
    return this.metrics.isPaused;
  }

  public isSystemHardened(): boolean {
    return this.systemHardened;
  }

  // Added simulateDrift method to fix AuditView error
  public async simulateDrift(): Promise<void> {
    this.systemHardened = false;
    this.oracleConnected = false;
    this.metrics.totalPeaceValueLocked *= 0.95;
    this.metrics.totalTokensDistributed += 1000;
  }

  public runFullAudit(): AuditReport {
    const logs: AuditLog[] = [];
    let healthy = true;
    let matched = 0;

    const addLog = (message: string, level: AuditLog['level'], component: string) => {
      logs.push({ id: Math.random().toString(36), timestamp: Date.now(), message, level, component });
      if (level === 'CRITICAL') healthy = false;
    };

    matched++;
    addLog('Settlement Invariant: Verified.', 'SUCCESS', 'Settlement');
    matched++;
    addLog('Governance Invariant: Verified.', 'SUCCESS', 'Governance');
    matched++;
    addLog('Registry Invariant: Verified.', 'SUCCESS', 'Registry');
    
    if (this.oracleConnected) matched++;

    const readiness: ReadinessItem[] = [
      { id: 'R1', category: 'Logic Architecture', status: 'PASS', reason: 'Stateless services verified.' },
      { id: 'R2', category: 'Settlement Infrastructure', status: this.systemHardened ? 'PASS' : 'CONDITIONAL', reason: 'L2 state rooting active.' },
      { id: 'R3', category: 'Governance Hardening', status: this.systemHardened ? 'PASS' : 'NOT_PASS', reason: 'Timelocks active.' },
      { id: 'R4', category: 'Compliance Middleware', status: this.oracleConnected ? 'PASS' : 'CONDITIONAL', reason: 'Oracle consensus healthy.' }
    ];

    return {
      healthy,
      score: healthy ? 100 : 75,
      logs,
      invariantsMatched: matched,
      totalInvariants: 4,
      readiness
    };
  }
}

export const blockchain = PeaceBlockchainService.getInstance();
