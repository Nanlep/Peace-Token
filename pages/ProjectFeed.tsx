
import React, { useEffect, useState } from 'react';
import { blockchain } from '../services/blockchain';
import { PeaceProject } from '../types';
import { BadgeCheck, Clock, Users, ExternalLink, ThumbsUp, Loader2, Sparkles, ShieldCheck, Database } from 'lucide-react';

// Use React.FC to handle key prop correctly during mapping
const ProjectCard: React.FC<{ project: PeaceProject, onValidate: (id: string) => void | Promise<void> }> = ({ project, onValidate }) => {
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = async () => {
    setIsValidating(true);
    await onValidate(project.id);
    setIsValidating(false);
  };

  return (
    <div className="glass p-6 rounded-3xl border border-slate-800 hover:border-sky-500/50 transition-all group relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] px-3 py-1 rounded-full bg-slate-800 text-slate-400 font-bold uppercase tracking-widest">
          {project.category.replace('_', ' ')}
        </span>
        {project.status === 'APPROVED' ? (
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded border border-emerald-500/20">
            <BadgeCheck size={14} /> VERIFIED
          </div>
        ) : (
          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-2 py-1 rounded border border-amber-500/20">
            <Clock size={14} /> {project.validations}/5 VALIDATIONS
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors tracking-tight">{project.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">{project.description}</p>

      {project.status === 'APPROVED' ? (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/40 p-3 rounded-xl border border-slate-800 shadow-inner">
            <div className="text-[9px] text-slate-500 uppercase font-black mb-1">Impact Score</div>
            <div className="text-lg font-black text-sky-400 italic">{project.expertScore}%</div>
          </div>
          <div className="bg-black/40 p-3 rounded-xl border border-slate-800 shadow-inner">
            <div className="text-[9px] text-slate-500 uppercase font-black mb-1">Reward Claimed</div>
            <div className="text-lg font-black text-emerald-400 italic">{project.rewardedAmount.toLocaleString()} P</div>
          </div>
        </div>
      ) : (
        <button 
          onClick={handleValidate}
          disabled={isValidating}
          className="w-full py-4 mb-6 rounded-2xl bg-sky-500/5 border border-sky-500/20 text-sky-400 font-black text-xs uppercase tracking-widest hover:bg-sky-500/10 transition-all flex items-center justify-center gap-2 group/btn"
        >
          {isValidating ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} className="group-hover/btn:scale-125 transition-transform" />}
          Validate Impact
        </button>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
           <Database size={12} />
           <span className="mono">{project.evidenceHash.substring(0, 15)}...</span>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <ExternalLink size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectFeed: React.FC = () => {
  const [projects, setProjects] = useState<PeaceProject[]>([]);
  const [filter, setFilter] = useState('ALL');

  const fetchProjects = async () => {
    const data = await blockchain.getProjects();
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleValidate = async (id: string) => {
    await blockchain.validateProject(id);
    await fetchProjects();
  };

  const filteredProjects = projects.filter(p => {
    if (filter === 'ALL') return true;
    return p.status === filter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight italic">Impact Feed</h2>
          <p className="text-slate-400 font-medium">Monitoring real-world peace efforts validated on-chain.</p>
        </div>
        <div className="flex gap-2 bg-[#0d0d10] p-1.5 rounded-2xl border border-slate-800 shadow-xl">
          {['ALL', 'APPROVED', 'PENDING'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === f ? 'bg-slate-800 text-sky-400 shadow-lg border border-sky-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {f === 'APPROVED' ? 'Verified' : f}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} onValidate={handleValidate} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-20 text-center glass rounded-[3rem] border-white/5 space-y-4">
           <Sparkles className="mx-auto text-slate-700" size={48} />
           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No matching projects in sanctuary ledger</p>
        </div>
      )}
    </div>
  );
};

export default ProjectFeed;
