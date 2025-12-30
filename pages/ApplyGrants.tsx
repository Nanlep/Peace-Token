
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, CheckCircle, Info, ArrowRight, FileText, Send, Heart, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { blockchain } from '../services/blockchain';
import { PeaceCategory } from '../types';

const ApplyGrants: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: PeaceCategory.COMMUNITY_BUILDING,
    impactPlan: '',
    evidenceType: 'Visual'
  });

  const nextStep = () => {
    // Basic validation for Step 2
    if (step === 2 && (!formData.title || !formData.description)) {
      alert("Please provide a title and narrative for your vision.");
      return;
    }
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate submission to the mock blockchain service
      await blockchain.submitProject({
        creatorId: 'actor_0x123', // Mock logged in user
        title: formData.title,
        description: formData.description,
        category: formData.category,
        evidenceHash: 'pending_grant_verification'
      });
      
      // Artificial delay for effect
      await new Promise(r => setTimeout(r, 2000));
      setIsSuccess(true);
    } catch (err) {
      alert("Submission failed. Protocol congestion or invalid signature.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 peace-gradient rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/20">
          <CheckCircle2 className="text-white" size={48} />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-white">Application Mobilized</h2>
          <p className="text-slate-400 text-lg">
            Your vision has been anchored to the Peace Ledger. Community stewards will now begin the validation phase.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
          <button 
            onClick={() => navigate('/projects')}
            className="px-8 py-4 peace-gradient rounded-2xl text-white font-bold hover:scale-105 transition-all"
          >
            Track in Impact Feed
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 glass rounded-2xl text-slate-300 font-bold hover:bg-white/5 transition-all"
          >
            Return to Sanctuary
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
      <header className="space-y-4">
        <h1 className="text-4xl font-black text-white">Apply for Support</h1>
        <p className="text-slate-400 max-w-2xl text-lg">
          Our sanctuary provides micro-grants and matching funds for verified peace actors working on local or global stability initiatives.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Step Progress Sidebar */}
        <div className="space-y-4">
          {[
            { id: 1, label: "Eligibility", icon: Info },
            { id: 2, label: "Your Vision", icon: Heart },
            { id: 3, label: "Impact Plan", icon: FileText },
            { id: 4, label: "Mobilize", icon: Send }
          ].map((s) => (
            <button 
              key={s.id} 
              disabled={s.id > step && !formData.title} // Prevent skipping ahead without data
              onClick={() => setStep(s.id)}
              className={`w-full p-4 rounded-2xl flex items-center gap-4 border transition-all text-left group ${
                step === s.id 
                  ? 'bg-sky-500/10 border-sky-500/50 text-sky-400 shadow-lg shadow-sky-500/5' 
                  : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'
              }`}
            >
              <s.icon size={20} className={step === s.id ? 'animate-pulse' : ''} />
              <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="lg:col-span-3 glass p-10 rounded-[3rem] border-white/5 space-y-8 relative overflow-hidden min-h-[500px] flex flex-col">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Sparkles size={120} />
          </div>

          <div className="flex-1">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <h3 className="text-2xl font-bold text-white">Initial Eligibility Check</h3>
                <p className="text-slate-400 italic">Before submitting a full proposal, ensure your work aligns with our core principles of harmony.</p>
                <ul className="space-y-4">
                  {[
                    { title: "Verified Identity", desc: "You must hold a 'VERIFIED' tier Identity SBT." },
                    { title: "Non-Violent Mandate", desc: "Initiatives must strictly adhere to peaceful, non-adversarial methods." },
                    { title: "Verifiable Impact", desc: "Every grant requires a clear plan for documenting success on-chain." },
                    { title: "Community Standing", desc: "Applicants with high reputation scores receive priority in matching." }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-sky-500/20 transition-all">
                      <CheckCircle className="text-sky-400 shrink-0" size={20} />
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <h3 className="text-2xl font-bold text-white">Share Your Vision</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">The Essence of Your Project</label>
                    <input 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500/50" 
                      placeholder="A brief, inspiring title..." 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value as PeaceCategory})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500/50 appearance-none"
                    >
                      {Object.values(PeaceCategory).map(cat => (
                        <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">The Narrative of Peace</label>
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      rows={4} 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500/50" 
                      placeholder="Describe the heart of your work..." 
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <h3 className="text-2xl font-bold text-white">Impact Strategy</h3>
                <div className="p-6 rounded-2xl bg-sky-500/5 border border-sky-500/10 flex items-start gap-4 mb-6">
                  <Info className="text-sky-400" size={24} />
                  <p className="text-xs text-slate-400 leading-relaxed italic">The protocol values evidence-based support. Detail how you will provide "Proof of Peace" to the decentralized ledger.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { type: 'Visual', label: 'Visual Evidence', sub: 'Photos, Videos, Media' },
                    { type: 'Social', label: 'Social Proof', sub: 'Testimonials, Consensus' }
                  ].map((btn) => (
                    <button 
                      key={btn.type}
                      onClick={() => setFormData({...formData, evidenceType: btn.type})}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.evidenceType === btn.type ? 'bg-sky-500/10 border-sky-500/30 shadow-lg' : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <h4 className={`text-sm font-bold ${formData.evidenceType === btn.type ? 'text-white' : 'text-slate-400'} mb-2`}>{btn.label}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{btn.sub}</p>
                    </button>
                  ))}
                </div>
                <div className="space-y-2 pt-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Actionable Milestones</label>
                  <textarea 
                    value={formData.impactPlan}
                    onChange={e => setFormData({...formData, impactPlan: e.target.value})}
                    rows={3}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500/50" 
                    placeholder="List 2-3 key milestones..." 
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8 text-center py-8 animate-in fade-in duration-500">
                <div className="w-20 h-20 peace-gradient rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl shadow-sky-500/20">
                  <Send className="text-white" size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Ready for Mobilization</h3>
                  <p className="text-slate-400 max-w-sm mx-auto text-sm">
                    Your proposal for <span className="text-sky-400 font-bold">"{formData.title || 'Your Project'}"</span> is prepared.
                  </p>
                </div>
                
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left max-w-sm mx-auto space-y-3">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Category</span>
                    <span className="text-xs text-slate-300">{formData.category.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Verification Tier</span>
                    <span className="text-xs text-emerald-400 font-bold">L2-VERIFIED</span>
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="px-12 py-4 peace-gradient rounded-full text-white font-bold shadow-xl shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                  {isSubmitting ? 'Transmitting to Ledger...' : 'Submit to Sanctuary'}
                </button>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="pt-8 border-t border-white/5 flex justify-between items-center">
            <button 
              onClick={prevStep}
              className={`text-xs font-black uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2 ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500'}`}
            >
              Back
            </button>
            {step < 4 && (
              <button 
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 peace-gradient rounded-full text-xs font-black text-white uppercase tracking-[0.2em] hover:scale-105 active:scale-95 shadow-lg shadow-sky-500/10 transition-all"
              >
                Continue <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyGrants;
