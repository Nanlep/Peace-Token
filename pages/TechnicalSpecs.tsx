
import React from 'react';
import { Shield, Server, Coins, Scale, FileCode, Workflow, Zap, Lock, Info } from 'lucide-react';

const TechnicalSpecs: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in duration-1000 pb-20">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-sky-500/20 text-sky-400 font-mono text-[10px] uppercase tracking-widest">
          <Server size={14} /> System Architecture v4.2.0-STABLE
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter">Mission-Critical <span className="text-sky-400">Specs</span></h1>
        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
          The formal blueprint for the Peace-Token ecosystem. This document defines the trust boundaries, security postures, and execution logic.
        </p>
      </header>

      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Workflow className="text-sky-400" size={24} />
          High-Level Architecture
        </h2>
        <div className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-sky-400 text-sm uppercase">Layer 1: Frontend</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                React-based stateless interface. Client-side ZK-proof generation for privacy-preserving identity validation.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-emerald-400 text-sm uppercase">Layer 2: Logic (L2)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                EVM-Compatible Rollup (Arbitrum/Optimism). Hosts Reward Engine, SBT Registry, and Treasury multisig.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-rose-400 text-sm uppercase">Layer 3: Off-chain</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                IPFS for content persistence. AI Oracles (Gemini) for veracity screening and sybil detection.
              </p>
            </div>
          </div>
          <div className="bg-black/40 p-6 rounded-2xl border border-slate-800 font-mono text-[10px] text-slate-500">
            [TRUST_BOUNDARY]: Browser -> L2 Contract (via RPC with Gasless Meta-Tx) -> IPFS Evidence Pinning
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileCode className="text-amber-400" size={24} />
            Smart Contract Registry
          </h2>
          <div className="space-y-4">
            {[
              { name: "PEACE_TOKEN", type: "ERC-20 (Fixed Supply)", role: "Governance & Rewards" },
              { name: "IDENTITY_SBT", type: "ERC-5192", role: "Non-transferable Reputation" },
              { name: "REWARD_ENGINE", type: "Proxy Logic", role: "Deterministic Payouts" },
              { name: "TREASURY_VAULT", type: "Gnosis Safe Fork", role: "Asset Management" },
              { name: "GOV_TIMELOCK", type: "48h Delay", role: "Proposal Execution" }
            ].map((c, i) => (
              <div key={i} className="flex justify-between items-center p-4 glass rounded-xl border-white/5">
                <div>
                  <div className="text-sm font-bold text-white">{c.name}</div>
                  <div className="text-[10px] text-slate-500 uppercase">{c.type}</div>
                </div>
                <div className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-1 rounded">{c.role}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="text-rose-400" size={24} />
            Security Threat Model (STRIDE)
          </h2>
          <div className="glass p-8 rounded-[2rem] space-y-4">
            {[
              { t: "Spoofing", m: "SBT Biometric Anchoring" },
              { t: "Tampering", m: "Merkle Root State Invariants" },
              { t: "Repudiation", m: "On-chain Audit Logs" },
              { t: "Information Disclosure", m: "Hashed IPFS Metadata" },
              { t: "Denial of Service", m: "Exponential Fee Ramping" },
              { t: "Elevation of Privilege", m: "RBAC with Timelock Veto" }
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <div className="flex-1 text-[11px] font-bold text-slate-300 uppercase">{s.t}</div>
                <div className="text-[11px] text-slate-500 italic">Mitigation: {s.m}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Coins className="text-emerald-400" size={24} />
          Tokenomics Execution Logic
        </h2>
        <div className="glass p-10 rounded-[3rem] bg-emerald-500/5 border-emerald-500/10 space-y-6">
          <p className="text-sm text-slate-400 leading-relaxed italic">
            "We incentivize the preservation of stability through a deterministic reward loop that balances individual merit with collective verification."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Emission Formula</h4>
              <div className="bg-black/60 p-4 rounded-xl font-mono text-[11px] text-emerald-400 leading-loose border border-emerald-500/20">
                Reward = (Base[Category] * Performance[Score]) <br />
                * Mult[Tier] + Bonus[Reputation] <br /><br />
                - Slashing[Penalty] = (Stake * 0.2) + Rep_Reset
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Supply Dynamics</h4>
              <ul className="space-y-2">
                <li className="flex justify-between text-xs"><span className="text-slate-500">Total Supply:</span> <span className="text-white font-bold">100M PEACE</span></li>
                <li className="flex justify-between text-xs"><span className="text-slate-500">Annual Decay:</span> <span className="text-white font-bold">2.5% Burn</span></li>
                <li className="flex justify-between text-xs"><span className="text-slate-500">DAO Treasury:</span> <span className="text-white font-bold">40% Locked</span></li>
                <li className="flex justify-between text-xs"><span className="text-slate-500">Staking APY:</span> <span className="text-white font-bold">Variable (Protocol-driven)</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400"><Scale size={24} /></div>
          <h2 className="text-2xl font-black text-white">Compliance & Sovereignty</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-xs text-slate-400 leading-relaxed">
          <div className="space-y-4">
            <h4 className="font-bold text-white uppercase tracking-widest">GDPR / NDPR Alignment</h4>
            <p>
              Users retain full ownership of their PII (Personally Identifiable Information). On-chain records only store anonymized reputation scores and proof hashes. The "Right to be Forgotten" is implemented via SBT incineration on-chain and IPFS garbage collection.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-white uppercase tracking-widest">Legal Finality</h4>
            <p>
              Dispute resolution follows the "Code as Law" principle but provides a DAO-governed appeal layer for edge cases that require human ethical intervention. All treasury payouts are subject to automated AML/KYC screening via integration oracles.
            </p>
          </div>
        </div>
      </section>

      <footer className="text-center py-10">
        <p className="text-slate-600 text-[10px] uppercase font-mono tracking-widest">
          Authored by Principal Systems Architect // Last Audit: Feb 2025
        </p>
      </footer>
    </div>
  );
};

export default TechnicalSpecs;
