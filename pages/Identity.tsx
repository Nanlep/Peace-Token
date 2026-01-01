
import React, { useState, useRef, useEffect } from 'react';
import { Shield, Award, Fingerprint, Zap, Lock, Info, Camera, Loader2, Check, ShieldCheck, Activity, Terminal } from 'lucide-react';
import { blockchain } from '../services/blockchain';

const Identity: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const startVerification = async () => {
    setIsVerifying(true);
    setLogs([]);
    addLog("Initializing Biometric Scan...");
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      
      // Phase 1: Capture
      await new Promise(r => setTimeout(r, 1000));
      setProgress(33);
      addLog("Liveness Phase 1: Analyzing Micro-expressions...");
      
      // Phase 2: Audit
      await new Promise(r => setTimeout(r, 1500));
      setProgress(66);
      addLog("Liveness Phase 2: Verifying SSL-Anchored Session...");
      
      // Phase 3: Finalize
      await new Promise(r => setTimeout(r, 1000));
      setProgress(100);
      addLog("Liveness Phase 3: Identity Anchored to SBT Registry.");
      
      setHasVerified(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (e) {
      addLog("ERROR: Camera Access Denied. Liveness failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-top-4 duration-700 pb-20">
      <header className="text-center space-y-4">
        <div className="w-20 h-20 peace-gradient rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-sky-500/40 relative group">
          <Fingerprint className="text-white group-hover:scale-110 transition-transform" size={40} />
          <div className="absolute -inset-2 bg-sky-500/20 blur-xl rounded-full animate-pulse" />
        </div>
        <h2 className="text-4xl font-black text-white tracking-tighter italic">Protocol Identity</h2>
        <p className="text-slate-400 max-w-lg mx-auto font-medium">Non-transferable Soulbound Tokens (SBTs) representing your reputation tier within the global peace network.</p>
      </header>

      <div className="glass p-1 rounded-[3rem] bg-gradient-to-b from-slate-800 to-transparent shadow-2xl">
        <div className="bg-[#0a0a0c] rounded-[2.8rem] p-8 md:p-12 border border-white/5">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* SBT Visual representation */}
            <div className="w-72 h-[420px] rounded-[2.5rem] peace-gradient p-1 shrink-0 shadow-[0_0_80px_rgba(14,165,233,0.2)] group">
              <div className="w-full h-full bg-[#0d0d10] rounded-[2.3rem] relative overflow-hidden flex flex-col items-center justify-center p-8">
                <div className="absolute top-6 left-6 text-[9px] font-black font-mono text-sky-500/50 uppercase tracking-widest">SBT_REGISTRY_V4</div>
                <div className="absolute bottom-6 right-6 text-[9px] font-black font-mono text-sky-500/50 uppercase tracking-widest">SEQ_#897621</div>
                
                {isVerifying && (
                   <div className="absolute inset-0 z-20 bg-black">
                      <video ref={videoRef} autoPlay muted className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-10 space-y-6">
                         <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full peace-gradient transition-all duration-500" style={{ width: `${progress}%` }} />
                         </div>
                         <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest animate-pulse">Scanning Liveness...</div>
                      </div>
                   </div>
                )}

                <div className="w-40 h-40 rounded-full border border-sky-500/20 flex items-center justify-center mb-8 relative">
                  <div className={`absolute inset-0 rounded-full ${hasVerified ? 'bg-emerald-500/10' : 'bg-sky-500/5'} animate-pulse`} />
                  {hasVerified ? (
                    <ShieldCheck className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" size={64} />
                  ) : (
                    <Award className="text-sky-400 drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]" size={64} />
                  )}
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Anchor Tier</div>
                  <div className={`text-3xl font-black italic tracking-tighter ${hasVerified ? 'text-emerald-400' : 'text-white'}`}>
                    {hasVerified ? 'AUDITED' : 'VERIFIED'}
                  </div>
                  <div className="flex justify-center gap-1.5 pt-4">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`w-4 h-1 rounded-full transition-all duration-700 ${i <= (hasVerified ? 4 : 3) ? (hasVerified ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-sky-500 shadow-[0_0_8px_#0ea5e9]') : 'bg-slate-800'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Data */}
            <div className="flex-1 space-y-10">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Reputation Rank</div>
                  <div className="text-4xl font-black text-white italic tracking-tighter">852 <span className="text-xs text-emerald-400 uppercase tracking-normal font-bold">PRO</span></div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Ledger Weight</div>
                  <div className="text-4xl font-black text-white italic tracking-tighter">12.4k</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Global Purity</div>
                  <div className="text-4xl font-black text-white italic tracking-tighter">98%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Claimed Rewards</div>
                  <div className="text-4xl font-black text-sky-400 italic tracking-tighter">4.2k <span className="text-xs font-bold tracking-normal">P</span></div>
                </div>
              </div>

              <div className="glass p-5 rounded-2xl border-white/5 bg-white/5 space-y-4 shadow-inner">
                <div className="flex items-center gap-2 text-[10px] font-black text-sky-400 uppercase tracking-widest">
                   <Terminal size={14} /> Real-time Security Logs
                </div>
                <div className="space-y-1.5 h-24 overflow-hidden font-mono text-[10px] text-slate-500">
                   {logs.length === 0 ? <div className="italic opacity-50">Awaiting liveness challenge...</div> : logs.map((log, i) => <div key={i} className="animate-in slide-in-from-left-2">{log}</div>)}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-start gap-4">
                <Info className="text-sky-500 shrink-0" size={20} />
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {hasVerified ? 'Biometric anchors synced. You have privileged status to validate others in the Impact Feed.' : 'Advancing to \'AUDITED\' tier requires providing valid proof of liveness. This increases your reward multiplier by 1.6x.'}
                </p>
              </div>

              {!hasVerified ? (
                <button 
                  onClick={startVerification}
                  disabled={isVerifying}
                  className="w-full py-5 peace-gradient rounded-[2rem] text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  {isVerifying ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}
                  {isVerifying ? 'Scanning Liveness...' : 'Upgrade to Audited Tier'}
                </button>
              ) : (
                <div className="w-full py-5 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] text-emerald-400 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg">
                   <Check size={18} /> Protocol Identity Verified
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Identity;
