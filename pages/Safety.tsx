
import React from 'react';
import { ShieldAlert, ShieldCheck, Lock, EyeOff, AlertTriangle, Users } from 'lucide-react';

const Safety: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-16 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-sky-400" size={32} />
          <h1 className="text-4xl font-black text-white">Safety & Protocol Ethics</h1>
        </div>
        <p className="text-slate-400 text-lg">Ensuring a sanctuary that is as secure as it is compassionate.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="glass p-8 rounded-[2.5rem] border-rose-500/10 space-y-6">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle size={20} />
            <h3 className="font-bold uppercase tracking-widest text-sm">Anti-Fraud Guard</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Our protocol uses a multi-layered verification system to prevent sybil attacks and resource draining.
          </p>
          <ul className="space-y-3">
            {["Biometric Anchoring", "Reputation Decay", "Slashing Penalties"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="glass p-8 rounded-[2.5rem] border-sky-500/10 space-y-6">
          <div className="flex items-center gap-2 text-sky-400">
            <EyeOff size={20} />
            <h3 className="font-bold uppercase tracking-widest text-sm">Privacy Commitment</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            We prioritize the safety of peace actors in sensitive zones. On-chain data is hashed and minimized.
          </p>
          <ul className="space-y-3">
            {["Zero-Knowledge Identity", "Metadata Stripping", "Private Support Channels"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <Lock className="text-slate-500" size={24} />
          Dispute Resolution
        </h3>
        <p className="text-slate-400 leading-relaxed">
          If an initiative is flagged or suspected of violating our core ethics, it enters a "Stewardship Audit" phase. 
          A randomized panel of High-Reputation actors reviews the evidence to ensure fairness and protocol health.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Appeal Process", icon: Users, desc: "Submit counter-evidence" },
            { label: "Time-Lock", icon: ShieldAlert, desc: "Frozen funds during audit" },
            { label: "Finality", icon: ShieldCheck, desc: "DAO-governed resolution" }
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/5 text-center space-y-2">
              <item.icon className="mx-auto text-slate-400" size={20} />
              <div className="text-xs font-bold text-white">{item.label}</div>
              <div className="text-[10px] text-slate-500 uppercase">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Safety;
