
import React from 'react';
import { BookOpen, Heart, Sparkles, Anchor } from 'lucide-react';

const Manifesto: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <header className="text-center space-y-6">
        <div className="w-16 h-16 peace-gradient rounded-full mx-auto flex items-center justify-center shadow-xl shadow-sky-500/20">
          <BookOpen className="text-white" size={32} />
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">The Manifesto</h1>
        <p className="text-sky-400 font-mono text-sm uppercase tracking-[0.5em]">Vision // Value // Victory</p>
      </header>

      <div className="space-y-12 text-lg md:text-xl text-slate-300 leading-relaxed font-light italic text-center px-6">
        <p className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          "We believe that peace is not a gift to be waited for, but a structure to be built. 
          It is a dynamic equilibrium maintained by the collective will of those who dare to act."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            icon: Heart,
            title: "Incentivized Harmony",
            desc: "For too long, the machinery of conflict has been more profitable than the architecture of peace. We rebalance the scales by rewarding de-escalation, education, and bridge-building."
          },
          {
            icon: Anchor,
            title: "Verifiable Truth",
            desc: "In an era of noise, we anchor impact in verifiable evidence. Using decentralized consensus and advanced auditing, we ensure that every token distributed represents a genuine step toward stability."
          },
          {
            icon: Sparkles,
            title: "The Micro-Gesture",
            desc: "Giant leaps start with microscopic shifts. By facilitating micro-supports and matching grants, we empower the individual actor to influence global outcomes from their local sanctuary."
          },
          {
            icon: BookOpen,
            title: "Open Stewardship",
            desc: "The protocol belongs to no one and supports everyone. Our DAO ensures that governance is transparent, inclusive, and protected against the capture of few."
          }
        ].map((point, i) => (
          <div key={i} className="glass p-10 rounded-[3rem] border-white/5 hover:border-sky-500/20 transition-all">
            <point.icon className="text-sky-400 mb-6" size={32} />
            <h3 className="text-2xl font-bold text-white mb-4">{point.title}</h3>
            <p className="text-slate-400 text-base leading-relaxed">{point.desc}</p>
          </div>
        ))}
      </div>

      <section className="glass p-12 rounded-[4rem] text-center border-sky-500/10 bg-sky-500/5">
        <h2 className="text-3xl font-black text-white mb-6">Join the Architects.</h2>
        <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
          The Peace-Token Platform is more than a tool; it is a commitment. By participating, you are voting for a world where support is mobilized as fast as crisis occurs.
        </p>
        <div className="h-px w-32 bg-sky-500/30 mx-auto" />
      </section>
    </div>
  );
};

export default Manifesto;
