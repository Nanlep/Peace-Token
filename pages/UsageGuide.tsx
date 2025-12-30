
import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  HelpCircle, 
  Coins, 
  BookOpen, 
  Search, 
  Vote, 
  Lock, 
  Zap,
  Globe,
  HandHelping
} from 'lucide-react';

const RoleSection = ({ icon: Icon, title, color, children }: { icon: any, title: string, color: string, children: React.ReactNode }) => (
  <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
      <Icon size={120} />
    </div>
    <div className="flex items-center gap-4 relative z-10">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-10`}>
        <Icon className={color} size={28} />
      </div>
      <h3 className="text-2xl font-black text-white">{title}</h3>
    </div>
    <div className="space-y-4 relative z-10">
      {children}
    </div>
  </div>
);

const Step = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-sky-400">
      {number}
    </div>
    <div>
      <h4 className="font-bold text-white text-sm mb-1">{title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const UsageGuide: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      <header className="text-center space-y-6">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border-sky-500/20 text-sky-400 font-mono text-[10px] uppercase tracking-[0.3em]">
          <HelpCircle size={14} /> Knowledge Hub // Usage v1.0
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter">Mastering the Sanctuary</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          The Peace-Token Platform is a multi-dimensional ecosystem. This guide outlines how different participants can contribute to and benefit from global harmony.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RoleSection icon={HandHelping} title="For Peace Actors" color="text-sky-400">
          <p className="text-sm text-slate-400 italic">"The architects of calm who execute real-world impact."</p>
          <div className="space-y-6 pt-4">
            <Step 
              number="01" 
              title="Secure Your Identity" 
              desc="Head to the Identity section and mint your Soulbound Token (SBT). Higher verification tiers unlock larger rewards." 
            />
            <Step 
              number="02" 
              title="Publish Your Work" 
              desc="Use the 'Submit Work' form to log your peace-building efforts. Include a narrative and verifiable evidence hashes (IPFS/Arweave)." 
            />
            <Step 
              number="03" 
              title="Pass AI Pre-Audit" 
              desc="Our protocol uses Gemini to screen submissions for veracity before they enter the public impact feed." 
            />
            <Step 
              number="04" 
              title="Earn PEACE Tokens" 
              desc="Once validated by community stewards, rewards are automatically calculated and distributed to your anchored wallet." 
            />
          </div>
        </RoleSection>

        <RoleSection icon={ShieldCheck} title="For Community Stewards" color="text-emerald-400">
          <p className="text-sm text-slate-400 italic">"The guardians of integrity who validate and govern."</p>
          <div className="space-y-6 pt-4">
            <Step 
              number="01" 
              title="Monitor the Impact Feed" 
              desc="Review incoming projects in the feed. Look for inconsistencies between the narrative and the evidence provided." 
            />
            <Step 
              number="02" 
              title="Cast Validations" 
              desc="Use your reputation score to validate authentic works. Validations influence the final reward distribution of a project." 
            />
            <Step 
              number="03" 
              title="Drive Governance" 
              desc="Vote on treasury proposals and protocol adjustments. Your voting power is weighted by your reputation and tier." 
            />
            <Step 
              number="04" 
              title="Initiate State Repair" 
              desc="In the Audit section, high-tier stewards can trigger invariant checks to ensure the ledger remains synchronized." 
            />
          </div>
        </RoleSection>

        <RoleSection icon={Globe} title="For Donors & Donors" color="text-amber-400">
          <p className="text-sm text-slate-400 italic">"Mobilizers providing the fuel for global micro-grants."</p>
          <div className="space-y-6 pt-4">
            <Step 
              number="01" 
              title="Audit the Treasury" 
              desc="Check the Dashboard and Impact Reports for real-time transparency of how funds are being allocated." 
            />
            <Step 
              number="02" 
              title="Contribute to Pools" 
              desc="Fund specific categories (e.g., Conflict Resolution) to increase matching multipliers for actors in those fields." 
            />
            <Step 
              number="03" 
              title="Verify Outcomes" 
              desc="Every dollar spent is mapped to a verified impact hash. Use the feed to see the actual lives changed by your support." 
            />
          </div>
        </RoleSection>

        <RoleSection icon={Zap} title="System Operations" color="text-rose-400">
          <p className="text-sm text-slate-400 italic">"Security-minded users maintaining the protocol's health."</p>
          <div className="space-y-6 pt-4">
            <Step 
              number="01" 
              title="Detect Drift" 
              desc="Run property scans in the AuditView to identify any mismatch between L1 anchors and the L2 ledger state." 
            />
            <Step 
              number="02" 
              title="Report Exploits" 
              desc="Initiate 'Simulate Drift' in non-production environments to test protocol resilience under chaos." 
            />
            <Step 
              number="03" 
              title="Emergency Actions" 
              desc="In cases of extreme volatility, stewards can trigger the circuit breaker to pause token emissions temporarily." 
            />
          </div>
        </RoleSection>
      </div>

      <section className="glass p-12 rounded-[4rem] bg-sky-500/5 border-sky-500/10 text-center space-y-8">
        <h2 className="text-3xl font-black text-white">Protocol Core Loops</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-4">
              <Coins size={24} />
            </div>
            <h4 className="font-bold text-white">Reward Engine</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rewards are calculated based on (ImpactScore × TierMultiplier) + (ReputationBonus × CommunityWeight).
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Vote size={24} />
            </div>
            <h4 className="font-bold text-white">Governance Flow</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Proposals require a 15% quorum. High-tier SBT holders can veto malicious treasury drains.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} />
            </div>
            <h4 className="font-bold text-white">Security Model</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero-trust architecture. All external state changes must pass through reentrancy guards and nonce-checks.
            </p>
          </div>
        </div>
      </section>

      <footer className="text-center">
        <p className="text-slate-500 text-sm italic">
          Need further assistance? Our community stewards are active in the Discord Sanctuary 24/7.
        </p>
      </footer>
    </div>
  );
};

export default UsageGuide;
