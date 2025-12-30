
import React, { useEffect, useState } from 'react';
import { blockchain } from '../services/blockchain';
import { PeaceProject } from '../types';
import { BadgeCheck, Clock, Users, ExternalLink, ThumbsUp } from 'lucide-react';

const ProjectCard = ({ project }: { project: PeaceProject }) => (
  <div className="glass p-6 rounded-3xl border border-slate-800 hover:border-sky-500/50 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <span className="text-[10px] px-3 py-1 rounded-full bg-slate-800 text-slate-400 font-bold uppercase tracking-widest">
        {project.category.replace('_', ' ')}
      </span>
      {project.status === 'APPROVED' ? (
        <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded">
          <BadgeCheck size={14} /> VERIFIED
        </div>
      ) : (
        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-2 py-1 rounded">
          <Clock size={14} /> PENDING
        </div>
      )}
    </div>
    
    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">{project.title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">{project.description}</p>

    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-[#0a0a0c] p-3 rounded-xl border border-slate-800">
        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Impact Score</div>
        <div className="text-lg font-bold text-sky-400">{project.expertScore || '—'}</div>
      </div>
      <div className="bg-[#0a0a0c] p-3 rounded-xl border border-slate-800">
        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Reward Payout</div>
        <div className="text-lg font-bold text-emerald-400">{project.rewardedAmount.toLocaleString()} P</div>
      </div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
      <div className="flex -space-x-2">
        {[1,2,3].map(i => (
          <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#0a0a0c] flex items-center justify-center text-[10px] font-bold">
            U{i}
          </div>
        ))}
        <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-[#0a0a0c] flex items-center justify-center text-[10px] font-bold">
          +{project.validations}
        </div>
      </div>
      <div className="flex gap-2">
        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <ThumbsUp size={18} />
        </button>
        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <ExternalLink size={18} />
        </button>
      </div>
    </div>
  </div>
);

const ProjectFeed: React.FC = () => {
  const [projects, setProjects] = useState<PeaceProject[]>([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    blockchain.getProjects().then(setProjects);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-2">Impact Feed</h2>
          <p className="text-slate-400">Monitoring real-world peace efforts validated on-chain.</p>
        </div>
        <div className="flex gap-2 bg-[#0d0d10] p-1 rounded-xl border border-slate-800">
          {['ALL', 'VERIFIED', 'PENDING'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filter === f ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectFeed;
