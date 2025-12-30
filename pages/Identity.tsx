
import React, { useState, useRef } from 'react';
import { Shield, Award, Fingerprint, Zap, Lock, Info, Camera, Loader2, Check } from 'lucide-react';

const Identity: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startVerification = async () => {
    setIsVerifying(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      
      // Simulate biometric processing
      await new Promise(r => setTimeout(r, 3000));
      
      setHasVerified(true);
      // Stop the camera
      stream.getTracks().forEach(track => track.stop());
    } catch (e) {
      alert("Camera access denied. Biometric verification required for AUDITED tier.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
      <header className="text-center space-y-4">
        <div className="w-20 h-20 peace-gradient rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-sky-500/40">
          <Fingerprint className="text-white" size={40} />
        </div>
        <h2 className="text-4xl font-black text-white tracking-tight">Protocol Identity</h2>
        <p className="text-slate-400 max-w-lg mx-auto">Non-transferable Soulbound Tokens (SBTs) representing your reputation and verification tier within the global peace network.</p>
      </header>

      <div className="glass p-1 rounded-[2.5rem] bg-gradient-to-b from-slate-800 to-transparent">
        <div className="bg-[#0a0a0c] rounded-[2.2rem] p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {/* SBT Visual representation */}
            <div className="w-64 h-80 rounded-[2rem] peace-gradient p-1 shrink-0 shadow-[0_0_50px_rgba(14,165,233,0.3)]">
              <div className="w-full h-full bg-[#0d0d10] rounded-[1.8rem] relative overflow-hidden flex flex-col items-center justify-center p-6">
                <div className="absolute top-4 left-4 text-[10px] font-mono text-sky-500/50">PEACE_SBT_V2</div>
                <div className="absolute bottom-4 right-4 text-[10px] font-mono text-sky-500/50">#897621</div>
                
                {isVerifying ? (
                   <div className="absolute inset-0 z-10 bg-black">
                      <video ref={videoRef} autoPlay muted className="w-full h-full object-cover opacity-50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-48 h-48 border-2 border-sky-400 rounded-full border-dashed animate-spin" />
                      </div>
                   </div>
                ) : null}

                <div className="w-32 h-32 rounded-full border border-sky-500/20 flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 rounded-full bg-sky-500/5 animate-pulse" />
                  {hasVerified ? <Shield className="text-emerald-400" size={48} /> : <Award className="text-sky-400" size={48} />}
                </div>
                
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Tier Level</div>
                  <div className={`text-2xl font-black italic tracking-tighter ${hasVerified ? 'text-emerald-400' : 'text-white'}`}>
                    {hasVerified ? 'AUDITED' : 'VERIFIED'}
                  </div>
                  <div className="mt-4 flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`w-3 h-1 rounded-full ${i <= (hasVerified ? 4 : 3) ? (hasVerified ? 'bg-emerald-500' : 'bg-sky-500') : 'bg-slate-800'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Data */}
            <div className="flex-1 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Reputation Score</div>
                  <div className="text-3xl font-bold text-white">852 <span className="text-sm text-emerald-400">+12</span></div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Proposals Voted</div>
                  <div className="text-3xl font-bold text-white">24</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Global Rank</div>
                  <div className="text-3xl font-bold text-white">Top 2%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Total Yield</div>
                  <div className="text-3xl font-bold text-white">4.2k <span className="text-xs text-sky-400">P</span></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-start gap-4">
                <Info className="text-sky-400 shrink-0" size={20} />
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your identity is anchored to <span className="mono text-slate-200">0x71C...8976F</span>. 
                  {hasVerified ? ' Biometric anchors synced with protocol L2.' : ' Advancing to \'AUDITED\' tier requires providing valid proof of government-grade ID or biometric validation.'}
                </p>
              </div>

              {!hasVerified ? (
                <button 
                  onClick={startVerification}
                  disabled={isVerifying}
                  className="w-full py-4 glass rounded-2xl text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
                >
                  {isVerifying ? <Loader2 className="animate-spin" /> : <Camera size={18} className="group-hover:scale-110 transition-transform" />}
                  {isVerifying ? 'Running Biometric Scan...' : 'Start Camera Verification'}
                </button>
              ) : (
                <div className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 font-bold flex items-center justify-center gap-2">
                   <Check size={18} /> Tier Upgrade Complete
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Shield, title: 'Anti-Sybil', desc: 'SBTs prevent identity duplication and governance manipulation.' },
          { icon: Zap, title: 'Instant Rewards', desc: 'Higher tiers enjoy reduced cooldowns on reward claims.' },
          { icon: Award, title: 'Authority', desc: 'Expert status allows you to validate other actors works.' },
        ].map((item, i) => (
          <div key={i} className="glass p-6 rounded-2xl">
            <item.icon className="text-sky-400 mb-4" size={24} />
            <h4 className="font-bold text-white mb-2">{item.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Identity;
