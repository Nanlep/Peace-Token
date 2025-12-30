
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Heart, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Activity,
  Coins,
  HandHelping
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="glass p-8 rounded-[2rem] border border-slate-800/50 hover:border-sky-500/30 transition-all group">
    <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400 mb-6 group-hover:scale-110 transition-transform">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0c] selection:bg-sky-500/30 selection:text-sky-200">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500 blur-[120px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-6 lg:px-20 h-24 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 peace-gradient rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Heart className="text-white" size={24} />
          </div>
          <h1 className="font-bold text-2xl tracking-tighter text-white uppercase italic">Peace<span className="text-sky-400">Token</span></h1>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
          <button onClick={() => navigate('/manifesto')} className="hover:text-white transition-colors">Manifesto</button>
          <button onClick={() => navigate('/projects')} className="hover:text-white transition-colors">Impact</button>
          <button onClick={() => navigate('/community')} className="hover:text-white transition-colors">Community</button>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 glass rounded-xl text-sm font-black text-sky-400 hover:bg-sky-500/10 transition-all border border-sky-500/20"
        >
          Enter Sanctuary
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-sky-500/20 animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em] mono">Pulse: Global Harmony Active</span>
          </div>

          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Honoring the <br />
            <span className="text-transparent bg-clip-text peace-gradient">Architects of Peace.</span>
          </h2>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            A collective ecosystem advancing global peace by rewarding change-makers, mobilizing essential support, and amplifying gestures of goodwill through micro-grants.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full md:w-auto px-10 py-5 peace-gradient rounded-[2rem] text-lg font-black text-white shadow-[0_20px_40px_rgba(14,165,233,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Join the Movement <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/projects')}
              className="w-full md:w-auto px-10 py-5 glass rounded-[2rem] text-lg font-black text-slate-300 hover:text-white hover:bg-white/5 transition-all border border-white/10 flex items-center justify-center gap-3"
            >
              Explore Initiatives <Activity size={20} />
            </button>
          </div>
        </div>

        {/* Subtle Visual Tease */}
        <div className="mt-32 max-w-6xl mx-auto glass rounded-[3rem] p-4 border border-white/5 shadow-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="bg-[#0a0a0c] rounded-[2.5rem] overflow-hidden aspect-[16/9] md:aspect-[21/9] flex flex-col items-center justify-center relative group">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_70%)]" />
             <Sparkles className="text-sky-500/20 animate-pulse" size={64} />
             <div className="text-slate-500 text-xs font-mono uppercase tracking-[0.3em] mt-4">Visionary Interface // Active</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard 
          icon={Coins} 
          title="Micro-Grant Engine" 
          desc="Automated distribution of matching funds for verified local peace initiatives and community building projects."
        />
        <FeatureCard 
          icon={ShieldCheck} 
          title="Verifiable Impact" 
          desc="All peace-building activities are anchored to a decentralized ledger with transparent evidence hashes and AI verification."
        />
        <FeatureCard 
          icon={HandHelping} 
          title="Collective Governance" 
          desc="A DAO-driven model where the community stewards determine treasury allocations and protocol evolutionary paths."
        />
      </section>
    </div>
  );
};

// Add default export to resolve import error in App.tsx
export default LandingPage;
