
import React from 'react';
import { Users, MessageSquare, Heart, Sparkles, ChevronRight } from 'lucide-react';

const Community: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-sky-500/10 rounded-2xl mx-auto flex items-center justify-center">
          <Users className="text-sky-400" size={32} />
        </div>
        <h1 className="text-4xl font-black text-white">The Peace Sanctuary</h1>
        <p className="text-slate-400 italic">"Alone we are whispers, together we are the architecture of calm."</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border-sky-500/10 bg-sky-500/5">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles size={20} className="text-sky-400" />
              Community Values
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Radical Transparency", desc: "No secrets in the pursuit of stability. Every action is auditable." },
                { title: "Empathetic Logic", desc: "We use code to empower compassion, not replace it." },
                { title: "Global Stewardship", desc: "Taking responsibility for the collective digital peace." },
                { title: "Resilient Optimism", desc: "Believing that peace is inevitable with the right tools." }
              ].map((v, i) => (
                <div key={i} className="space-y-2">
                  <h4 className="text-sky-400 font-bold text-sm">{v.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white px-2">Active Discussion Epochs</h3>
            {[
              { title: "Governance Tuning: Q3 Matching Ratios", replies: 124, last: "2h ago", author: "0xAlpha" },
              { title: "Expanding Verification to Satellite Proofs", replies: 89, last: "5h ago", author: "0xSRE" },
              { title: "Ethics Board: Disputing Proj_0x921", replies: 240, last: "12h ago", author: "Steward_32" }
            ].map((topic, i) => (
              <div key={i} className="glass p-5 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                    <MessageSquare size={16} className="text-slate-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm group-hover:text-sky-400 transition-colors">{topic.title}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Initiated by {topic.author} // {topic.last}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <div className="text-xs font-bold text-white">{topic.replies}</div>
                    <div className="text-[10px] text-slate-500 uppercase">Voices</div>
                  </div>
                  <ChevronRight size={18} className="text-slate-700" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border-white/5">
            <h3 className="text-lg font-bold text-white mb-6">Network Pulse</h3>
            <div className="space-y-6">
              {[
                { label: "Active Contributors", val: "1,245", icon: Users, color: "text-sky-400" },
                { label: "Total Proposals", val: "420", icon: Sparkles, color: "text-amber-400" },
                { label: "Goodwill Gestures", val: "15.2k", icon: Heart, color: "text-rose-400" }
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-white/5 ${p.color}`}><p.icon size={18} /></div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{p.label}</div>
                    <div className="text-xl font-black text-white italic">{p.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full py-4 peace-gradient rounded-2xl text-white font-bold shadow-xl shadow-sky-500/20 hover:scale-[1.02] transition-all">
            Join the Discord Sanctuary
          </button>
        </div>
      </div>
    </div>
  );
};

export default Community;
