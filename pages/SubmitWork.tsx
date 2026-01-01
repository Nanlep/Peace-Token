
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PeaceCategory } from '../types';
import { blockchain } from '../services/blockchain';
import { validatePeaceWork, ValidationResult } from '../services/ai';
import { ShieldAlert, CheckCircle2, Loader2, Sparkles, Send, Database, Cloud } from 'lucide-react';

const SubmitWork: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [pinning, setPinning] = useState(false);
  const [aiResult, setAiResult] = useState<ValidationResult | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: PeaceCategory.COMMUNITY_BUILDING,
    evidenceLink: ''
  });

  const handleAiAudit = async () => {
    if (!formData.title || !formData.description) return;
    setValidating(true);
    try {
      const result = await validatePeaceWork(formData.title, formData.description);
      setAiResult(result);
      
      // Auto-generate IPFS CID if not present
      if (!formData.evidenceLink) {
        setPinning(true);
        await new Promise(r => setTimeout(r, 1500));
        const cid = blockchain.generateCID(formData.description);
        setFormData(prev => ({ ...prev, evidenceLink: `ipfs://${cid}` }));
        setPinning(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await blockchain.submitProject({
        creatorId: 'actor_0x123',
        title: formData.title,
        description: formData.description,
        category: formData.category,
        evidenceHash: formData.evidenceLink || 'ipfs://QmDefaultHash'
      });
      navigate('/projects');
    } catch (err) {
      alert("Submission failed. Protocol error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-right-10 duration-500 pb-20">
      <header>
        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Publish Peace Work</h2>
        <p className="text-slate-400">Submit your contribution to the protocol for decentralized verification and rewards.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass p-8 rounded-3xl space-y-6 border-white/5 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Project Title</label>
              <input 
                required
                className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                placeholder="e.g. Community Mediation Program"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Impact Category</label>
              <select 
                className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 appearance-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as PeaceCategory})}
              >
                {Object.values(PeaceCategory).map(cat => (
                  <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Impact Narrative (Proof of Peace)</label>
            <textarea 
              required
              rows={5}
              className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all text-sm leading-relaxed"
              placeholder="Describe the specific peace-building outcomes achieved..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Evidence CID (IPFS Hash)</label>
            <div className="relative">
              <input 
                className="w-full bg-black/40 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white font-mono text-xs focus:outline-none"
                placeholder="ipfs://..."
                value={formData.evidenceLink}
                readOnly
              />
              <Database className="absolute left-3 top-3.5 text-slate-500" size={16} />
              {pinning && <div className="absolute right-4 top-3.5 flex items-center gap-2 text-[10px] text-sky-400 font-bold animate-pulse"><Cloud size={12} /> Pinning...</div>}
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border-sky-500/20 bg-sky-500/5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="text-sky-400" size={24} />
              <div>
                <h3 className="font-bold text-white">Gemini Pre-Audit</h3>
                <p className="text-xs text-slate-400">Veracity screening and content pinning.</p>
              </div>
            </div>
            <button 
              type="button"
              disabled={validating || pinning || !formData.title || !formData.description}
              onClick={handleAiAudit}
              className="px-5 py-2.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 text-xs font-black rounded-xl transition-all disabled:opacity-50 uppercase tracking-widest"
            >
              {validating ? <Loader2 className="animate-spin" size={16} /> : 'Scan & Pin'}
            </button>
          </div>

          {aiResult && (
            <div className="mt-4 p-4 rounded-xl bg-black/50 border border-slate-800 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-slate-500 uppercase">Veracity Coefficient</span>
                <span className={`text-lg font-black italic ${aiResult.score > 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {aiResult.score}%
                </span>
              </div>
              <p className="text-xs text-slate-400 italic mb-4">"{aiResult.justification}"</p>
            </div>
          )}
        </div>

        <button 
          type="submit"
          disabled={loading || !formData.evidenceLink || (aiResult && !aiResult.isAuthentic)}
          className="w-full py-4 peace-gradient rounded-2xl text-lg font-black text-white shadow-xl shadow-sky-500/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Deploy to Global Sanctuary</>}
        </button>
      </form>
    </div>
  );
};

export default SubmitWork;
