
import React, { useEffect, useState } from 'react';
import { blockchain } from '../services/blockchain';
import { Proposal } from '../types';
import { Vote, Timer, Scale, ChevronRight, X, Loader2, Send, ThumbsUp, ThumbsDown } from 'lucide-react';

// Use React.FC to handle mapping props and key correctly
const ProposalRow: React.FC<{ proposal: Proposal, onVote: (id: string, support: boolean) => void | Promise<void> }> = ({ proposal, onVote }) => {
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPct = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (support: boolean) => {
    setIsVoting(true);
    await onVote(proposal.id, support);
    setIsVoting(false);
  };

  return (
    <div className="glass p-6 rounded-2xl hover:bg-slate-800/40 transition-all group border-white/5 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${proposal.status === 'ACTIVE' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-slate-700 text-slate-400'}`}>
              {proposal.status}
            </span>
            <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest mono">State ID: {proposal.id}</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors tracking-tight">{proposal.title}</h3>
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed font-medium">{proposal.description}</p>
        </div>

        <div className="w-full lg:w-72 space-y-3">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
            <span className="text-emerald-400">Support</span>
            <span className="text-rose-400">Reject</span>
          </div>
          <div className="h-2.5 w-full bg-slate-800 rounded-full flex overflow-hidden shadow-inner border border-white/5">
            <div className="h-full bg-emerald-500 transition-all duration-700 shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: `${forPct}%` }} />
            <div className="h-full bg-rose-500 transition-all duration-700 shadow-[0_0_10px_rgba(244,63,94,0.3)]" style={{ width: `${100 - forPct}%` }} />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => handleVote(true)}
              disabled={isVoting}
              className="flex-1 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
               {isVoting ? <Loader2 size={12} className="animate-spin" /> : <ThumbsUp size={12} />} For
            </button>
            <button 
              onClick={() => handleVote(false)}
              disabled={isVoting}
              className="flex-1 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
               {isVoting ? <Loader2 size={12} className="animate-spin" /> : <ThumbsDown size={12} />} Against
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 lg:pl-6 lg:border-l border-slate-800">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Expiration</div>
            <div className="text-sm font-black text-white flex items-center gap-1.5 mono">
              <Timer size={14} className="text-sky-400" /> 6D:22H
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Governance: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  const loadProposals = async () => {
    const data = await blockchain.getProposals();
    setProposals(data);
  };

  useEffect(() => {
    loadProposals();
  }, []);

  const handleVote = async (id: string, support: boolean) => {
    // Vote with 5000 PEACE power (simulated based on reputation/tier)
    await blockchain.voteProposal(id, support, 5000);
    await loadProposals();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await blockchain.createProposal({
      ...formData,
      proposer: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
    });
    setIsSubmitting(false);
    setShowModal(false);
    setFormData({ title: '', description: '' });
    loadProposals();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight italic">DAO Governance</h2>
          <p className="text-slate-400 font-medium">Decentralized decision making for the Peace-Token treasury.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 peace-gradient rounded-xl text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-sky-500/30 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
        >
          <Vote size={18} /> New Proposal
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl flex items-center gap-4 border border-white/5 shadow-xl">
          <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400"><Scale size={24} /></div>
          <div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Active Quorum</div>
            <div className="text-2xl font-black text-white italic tracking-tighter">42.5%</div>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4 border border-white/5 shadow-xl">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><Vote size={24} /></div>
          <div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Voter Density</div>
            <div className="text-2xl font-black text-white italic tracking-tighter">12.4k</div>
          </div>
        </div>
        <div className="lg:col-span-2 glass p-6 rounded-2xl flex items-center justify-between border border-white/5 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-[10px] text-slate-500 font-black uppercase mb-1 tracking-widest">Election Cycle</div>
            <div className="text-lg font-black text-white italic tracking-tight">Epoch #42 - Verification Tuning</div>
          </div>
          <div className="h-2 w-32 bg-slate-900 rounded-full overflow-hidden shadow-inner border border-white/5 relative z-10">
            <div className="h-full bg-sky-500 animate-pulse shadow-[0_0_10px_rgba(14,165,233,0.5)]" style={{ width: '65%' }} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2 px-2 uppercase tracking-tighter">
          Active Ballot <span className="text-xs font-black text-slate-500 mono">[{proposals.length}]</span>
        </h3>
        <div className="space-y-4">
          {proposals.map(p => (
            <ProposalRow key={p.id} proposal={p} onVote={handleVote} />
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass max-w-lg w-full p-8 rounded-[3rem] border-white/10 space-y-6 relative shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 p-2 text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-3xl font-black text-white tracking-tighter italic">Initiate Proposal</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ballot Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black/40 border border-slate-800 rounded-2xl px-5 py-3.5 text-white font-medium focus:outline-none focus:border-sky-500/50" 
                  placeholder="e.g. Allocation for West Bank Recovery" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Rationale Narrative</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full bg-black/40 border border-slate-800 rounded-2xl px-5 py-3.5 text-white text-sm font-medium focus:outline-none focus:border-sky-500/50 leading-relaxed" 
                  placeholder="Detail the strategic impact of this initiative..." 
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 peace-gradient rounded-[2rem] text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                {isSubmitting ? 'Anchoring...' : 'Submit to DAO'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Governance;
