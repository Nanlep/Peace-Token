
import { VerificationTier, PeaceCategory, PeaceActor, PeaceProject, Proposal, SystemMetrics, AuditReport, AuditLog, ReadinessItem } from '../types';

export interface ProductionManifest {
  version: string;
  environment: 'PRODUCTION' | 'STAGING';
  hash: string;
  timestamp: number;
  verdict: 'ABSOLUTE_PASS' | 'CONDITIONAL_PASS' | 'NOT_PASS';
  tierLabel: string;
  checks: {
    label: string;
    status: 'READY' | 'FAIL' | 'WARN';
    value: string;
  }[];
}

class PeaceBlockchainService {
  private static instance: PeaceBlockchainService;
  private isLocked = false;
  private systemHardened = true; 
  private oracleConnected = true;
  private storageSharded = true; 
  private currentAccount: string | null = null;

  private peaceReserve = 1000000;
  private usdcReserve = 250000;
  private k = this.peaceReserve * this.usdcReserve;

  private actors: Map<string, PeaceActor> = new Map();
  private projects: Map<string, PeaceProject> = new Map();
  private proposals: Map<string, Proposal> = new Map();

  private metrics: SystemMetrics = {
    totalPeaceValueLocked: 12540000,
    totalTokensDistributed: 450000,
    activeProjects: 1,
    verifiedActors: 890,
    treasuryBalance: 5000000,
    isPaused: false,
    peacePrice: 0.25,
    liquidityDepth: 250000
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
    const actorId = 'actor_0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
    this.actors.set(actorId, {
      id: actorId,
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      reputationScore: 98,
      tier: VerificationTier.AUDITED,
      joinedAt: Date.now() - 2000000,
      balance: 15000,
      walletBalance: 2500,
      stableBalance: 1200.50
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
  }

  public async getProductionManifest(): Promise<ProductionManifest> {
    const audit = this.runFullAudit();
    let verdict: 'ABSOLUTE_PASS' | 'CONDITIONAL_PASS' | 'NOT_PASS' = 'NOT_PASS';
    let tierLabel = '3. NOT PASS';
    
    if (audit.score >= 100) {
      verdict = 'ABSOLUTE_PASS';
      tierLabel = '1. ABSOLUTE PASS';
    } else if (audit.score >= 75) {
      verdict = 'CONDITIONAL_PASS';
      tierLabel = '2. CONDITIONAL PASS';
    }

    return {
      version: '4.2.2-STABLE-PROD',
      environment: 'PRODUCTION',
      hash: `SH-0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
      timestamp: Date.now(),
      verdict,
      tierLabel,
      checks: [
        { label: 'RBAC Security Policy', status: this.systemHardened ? 'READY' : 'FAIL', value: 'SRE Tiers Enforced' },
        { label: 'IPFS Shard Resilience', status: this.storageSharded ? 'READY' : 'WARN', value: this.storageSharded ? '3-Node Redundancy' : 'Degraded (Single Node)' },
        { label: 'Gemini AI Pre-Audit', status: 'READY', value: 'Model 3-Flash-Preview' },
        { label: 'Treasury Stability', status: this.metrics.liquidityDepth > 100000 ? 'READY' : 'WARN', value: `$${(this.metrics.liquidityDepth / 1000).toFixed(1)}k Depth` },
        { label: 'Oracle Consensus', status: this.oracleConnected ? 'READY' : 'FAIL', value: this.oracleConnected ? 'Healthy' : 'Disconnected' }
      ]
    };
  }

  public async checkPermission(address: string | null): Promise<boolean> {
    if (!address) return false;
    const actor = await this.getActor(address);
    return actor?.tier === VerificationTier.AUDITED || actor?.tier === VerificationTier.DIPLOMATIC;
  }

  public getMarketPrice(): number {
    return this.usdcReserve / this.peaceReserve;
  }

  public calculateSwapOutput(amountIn: number): number {
    const fee = amountIn * 0.003;
    const amountWithFee = amountIn - fee;
    const newPeaceReserve = this.peaceReserve + amountWithFee;
    const newUsdcReserve = this.k / newPeaceReserve;
    return this.usdcReserve - newUsdcReserve;
  }

  public async swapPeaceForStable(actorId: string, peaceAmount: number): Promise<number> {
    return this.withLock(async () => {
      const actor = this.actors.get(actorId);
      if (!actor) throw new Error("ACTOR_NOT_FOUND");
      if (actor.walletBalance < peaceAmount) throw new Error("INSUFFICIENT_PEACE_BALANCE");
      const usdcOut = this.calculateSwapOutput(peaceAmount);
      this.peaceReserve += peaceAmount;
      this.usdcReserve -= usdcOut;
      this.metrics.peacePrice = this.getMarketPrice();
      this.metrics.liquidityDepth = this.usdcReserve;
      actor.walletBalance -= peaceAmount;
      actor.stableBalance += usdcOut;
      this.actors.set(actorId, actor);
      return usdcOut;
    });
  }

  public async connect(): Promise<string> {
    await new Promise(r => setTimeout(r, 1200));
    this.currentAccount = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
    return this.currentAccount;
  }

  public disconnect(): void {
    this.currentAccount = null;
  }

  public getConnectedAccount(): string | null {
    return this.currentAccount;
  }

  public async getMetrics(): Promise<SystemMetrics> {
    return { ...this.metrics };
  }

  public async getActor(address: string): Promise<PeaceActor | undefined> {
    return this.actors.get(`actor_${address.toLowerCase().startsWith('0x') ? address : '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'}`);
  }

  public async claimRewards(actorId: string): Promise<number> {
    return this.withLock(async () => {
      const actor = this.actors.get(actorId);
      if (!actor) throw new Error("ACTOR_NOT_FOUND");
      if (actor.balance <= 0) throw new Error("ZERO_BALANCE");
      const amount = actor.balance;
      actor.balance = 0;
      actor.walletBalance += amount;
      this.actors.set(actorId, actor);
      this.metrics.totalTokensDistributed += amount;
      this.metrics.treasuryBalance -= amount;
      return amount;
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

  public async getProjects(): Promise<PeaceProject[]> {
    return Array.from(this.projects.values()).sort((a,b) => b.createdAt - a.createdAt);
  }

  public async getProposals(): Promise<Proposal[]> {
    return Array.from(this.proposals.values()).sort((a,b) => b.expiresAt - a.expiresAt);
  }

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
      if (project.validations >= 5) {
        project.status = 'APPROVED';
        project.expertScore = 85 + Math.floor(Math.random() * 15);
        project.rewardedAmount = 2500 + Math.floor(Math.random() * 5000);
        const creator = this.actors.get(project.creatorId);
        if (creator) {
          creator.balance += project.rewardedAmount;
          creator.reputationScore += 10;
          this.actors.set(project.creatorId, creator);
        }
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
      this.metrics.totalPeaceValueLocked += amount * 0.1;
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
    if (!await this.checkPermission(this.currentAccount)) throw new Error("UNAUTHORIZED_ACCESS");
    this.metrics.activeProjects = this.projects.size;
    this.systemHardened = true; 
    this.oracleConnected = true;
    this.storageSharded = true;
    this.metrics.isPaused = false;
  }

  public async togglePause(): Promise<boolean> {
    if (!await this.checkPermission(this.currentAccount)) throw new Error("UNAUTHORIZED_ACCESS");
    this.metrics.isPaused = !this.metrics.isPaused;
    return this.metrics.isPaused;
  }

  public async simulateDrift(): Promise<void> {
    if (!await this.checkPermission(this.currentAccount)) throw new Error("UNAUTHORIZED_ACCESS");
    this.systemHardened = false;
    this.oracleConnected = false;
    this.storageSharded = false;
    this.metrics.totalPeaceValueLocked *= 0.85;
  }

  public runFullAudit(): AuditReport {
    const logs: AuditLog[] = [];
    let healthy = true;
    let matched = 0;
    const addLog = (message: string, level: AuditLog['level'], component: string) => {
      logs.push({ id: Math.random().toString(36), timestamp: Date.now(), message, level, component });
      if (level === 'CRITICAL') healthy = false;
    };

    if (this.systemHardened) { matched++; addLog('Ledger State: Consistent.', 'SUCCESS', 'Settlement'); }
    else { addLog('Ledger State: Drift detected.', 'CRITICAL', 'Settlement'); }

    if (!this.metrics.isPaused) { matched++; addLog('Protocol Status: Active.', 'SUCCESS', 'Availability'); }
    else { addLog('Protocol Status: PAUSED.', 'WARNING', 'Availability'); }

    if (this.oracleConnected) { matched++; addLog('Oracle Sync: Healthy.', 'SUCCESS', 'Consensus'); }
    else { addLog('Oracle Sync: DISCONNECTED.', 'CRITICAL', 'Consensus'); }

    if (this.storageSharded) { matched++; addLog('IPFS Sharding: Redundant.', 'SUCCESS', 'Storage'); }
    else { addLog('IPFS Sharding: Degraded (Single Node).', 'WARNING', 'Storage'); }

    const readiness: ReadinessItem[] = [
      { id: 'R1', category: 'Logic Architecture', status: this.systemHardened ? 'PASS' : 'NOT_PASS', reason: 'Stateless services verified.' },
      { id: 'R2', category: 'Settlement Infrastructure', status: this.systemHardened ? 'PASS' : 'CONDITIONAL', reason: 'L2 state rooting active.' },
      { id: 'R3', category: 'Storage Resilience', status: this.storageSharded ? 'PASS' : 'CONDITIONAL', reason: 'Multi-gateway sharding active.' },
      { id: 'R4', category: 'Compliance Middleware', status: this.oracleConnected ? 'PASS' : 'CONDITIONAL', reason: 'Oracle consensus healthy.' }
    ];

    let score = (matched / 4) * 100;
    if (this.metrics.isPaused) score *= 0.8;
    
    return { healthy, score, logs, invariantsMatched: matched, totalInvariants: 4, readiness };
  }
}

export const blockchain = PeaceBlockchainService.getInstance();
