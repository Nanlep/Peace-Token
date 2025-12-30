
import React, { useEffect, useState } from 'react';
import { blockchain } from '../services/blockchain';
import { Proposal } from '../types';
import { Vote, Timer, Scale, ChevronRight, X, Loader2, Send } from 'lucide-react';

const ProposalRow = ({ proposal }: { proposal: Proposal }) => {
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPct = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;

  return (
    <div className="glass p-6 rounded-2xl hover:bg-slate-800/40 transition-all cursor-pointer group">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-[10px] font-bold px-2 py-1 rounded ${proposal.status === 'ACTIVE' ? 'bg-sky-500/10 text-sky-400' : 'bg-slate-700 text-slate-400'}`}>
              {proposal.status}
            </span>
            <span className="text-xs text-slate-500 mono">ID: {proposal.id}</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-sky-400 transition-colors">{proposal.title}</h3>
          <p className="text-sm text-slate-400 line-clamp-1">{proposal.description}</p>
        </div>

        <div className="w-full lg:w-64 space-y-2">
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-emerald-400 uppercase tracking-tighter">For</span>
            <span className="text-rose-400 uppercase tracking-tighter">Against</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full flex overflow-hidden shadow-inner">
            <div className="h-full bg-emerald-500 transition-all duration-700 shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: `${forPct}%` }} />
            <div className="h-full bg-rose-500 transition-all duration-700 shadow-[0_0_10px_rgba(244,63,94,0.3)]" style={{ width: `${100 - forPct}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mono">
            <span>{proposal.votesFor.toLocaleString()} P</span>
            <span>{proposal.votesAgainst.toLocaleString()} P</span>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:pl-6 lg:border-l border-slate-800">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Ends In</div>
            <div className="text-sm font-bold text-white flex items-center gap-1">
              <Timer size={14} /> 6d 22h
            </div>
          </div>
          <ChevronRight className="text-slate-600 group-hover:text-white transition-colors" />
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

  const loadProposals = () => {
    blockchain.getProposals().then(setProposals);
  };

  useEffect(() => {
    loadProposals();
  }, []);

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
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Protocol <span className="text-sky-400">Governance</span></h2>
          <p className="text-slate-400 font-medium">Decentralized decision making for the Peace-Token treasury.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 peace-gradient rounded-xl text-white font-bold shadow-lg shadow-sky-500/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <Vote size={20} /> New Proposal
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl flex items-center gap-4 border border-white/5">
          <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400"><Scale size={24} /></div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Quorum Rate</div>
            <div className="text-xl font-bold text-white tracking-tighter">42.5%</div>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4 border border-white/5">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><Vote size={24} /></div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Voters</div>
            <div className="text-xl font-bold text-white tracking-tighter">12.4k</div>
          </div>
        </div>
        <div className="lg:col-span-2 glass p-6 rounded-2xl flex items-center justify-between border border-white/5">
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase mb-1 tracking-widest">Current Voting Cycle</div>
            <div className="text-lg font-bold text-white tracking-tight">Epoch #42 - Verification Tuning</div>
          </div>
          <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-sky-500 animate-pulse" style={{ width: '65%' }} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2 px-2">
          Active Proposals <span className="text-sm font-normal text-slate-500 mono">({proposals.length})</span>
        </h3>
        <div className="space-y-3">
          {proposals.map(p => (
            <ProposalRow key={p.id} proposal={p} />
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass max-w-lg w-full p-8 rounded-[2.5rem] border-white/10 space-y-6 relative shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-2xl font-black text-white">Initiate Proposal</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Proposal Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500/50" 
                  placeholder="e.g. Allocation for Gaza Recovery" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rationale & Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500/50" 
                  placeholder="Detail the impact of this proposal..." 
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 peace-gradient rounded-2xl text-white font-bold shadow-xl shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                {isSubmitting ? 'Anchoring Proposal...' : 'Submit to DAO'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Governance;
