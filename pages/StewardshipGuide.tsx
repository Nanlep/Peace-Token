
import React from 'react';
import { BookOpen, Heart, Shield, Scale, Map, Sparkles } from 'lucide-react';

const StewardshipGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <header className="text-center space-y-6">
        <div className="w-16 h-16 bg-sky-500/10 rounded-2xl mx-auto flex items-center justify-center shadow-xl">
          <Scale className="text-sky-400" size={32} />
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter">Stewardship Guide</h1>
        <p className="text-slate-400 font-medium text-lg">Your manual for building harmony in a decentralized world.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            icon: Heart,
            title: "Empathy-First Ethics",
            desc: "Before every action, consider the human weight. Stewardship is not about metrics; it is about the lived experience of those we support."
          },
          {
            icon: Shield,
            title: "Guardian of the Ledger",
            desc: "As a verified actor, your validation of others is a sacred duty. Protect the integrity of the peace pool with honest, rigorous assessment."
          },
          {
            icon: Map,
            title: "The Path of Support",
            desc: "Focus on sustainable impact. We prioritize initiatives that build long-term local resilience over fleeting gestures."
          },
          {
            icon: BookOpen,
            title: "Verifiable Transparency",
            desc: "Maintain clear records. The strength of our collective matching power depends on the undeniable truth of our shared impact."
          }
        ].map((guide, i) => (
          <div key={i} className="glass p-10 rounded-[3rem] border-white/5 hover:border-sky-500/20 transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-sky-500/5 rounded-xl flex items-center justify-center mb-6">
              <guide.icon className="text-sky-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{guide.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{guide.desc}</p>
          </div>
        ))}
      </div>

      <section className="glass p-12 rounded-[4rem] border-emerald-500/10 bg-emerald-500/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 p-8 opacity-10">
          <Sparkles size={100} className="text-emerald-400" />
        </div>
        <div className="relative z-10 text-center space-y-6">
          <h2 className="text-3xl font-black text-white">The Stewards Oath</h2>
          <p className="text-slate-300 italic max-w-2xl mx-auto text-lg leading-relaxed">
            "I pledge to use the resources of this sanctuary for the advancement of stability, the relief of conflict, and the honoring of human dignity, without bias or malice."
          </p>
          <div className="pt-6">
            <span className="px-6 py-2 rounded-full border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">Signed on Ledger v4.0</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StewardshipGuide;
