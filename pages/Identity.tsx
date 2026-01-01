
import React, { useState, useRef, useEffect } from 'react';
// Added ArrowRight to imports to fix the error on line 277
import { Shield, Award, Fingerprint, Zap, Lock, Info, Camera, Loader2, Check, ShieldCheck, Activity, Terminal, Wallet, Coins, ArrowUpRight, ArrowDownUp, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';
import { blockchain } from '../services/blockchain';
import { PeaceActor, SystemMetrics } from '../types';

const Identity: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [actor, setActor] = useState<PeaceActor | null>(null);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [swapAmount, setSwapAmount] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const actorId = 'actor_0x71C7656EC7ab88b098defB751B7401B5f6d8976F';

  const refreshData = async () => {
    const aData = await blockchain.getActor('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
    const mData = await blockchain.getMetrics();
    if (aData) setActor(aData);
    if (mData) setMetrics(mData);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleClaim = async () => {
    if (!actor || actor.balance <= 0) return;
    setIsClaiming(true);
    try {
      addLog("Initiating Reward Claim via SBT-L2 Tunnel...");
      await new Promise(r => setTimeout(r, 2000));
      const amount = await blockchain.claimRewards(actorId);
      addLog(`Success: Claimed ${amount} PEACE to wallet.`);
      await refreshData();
    } catch (e) {
      addLog("ERROR: Withdrawal failed. Protocol check required.");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleSwap = async () => {
    const amt = parseFloat(swapAmount);
    if (!actor || isNaN(amt) || amt <= 0 || amt > actor.walletBalance) return;
    
    setIsSwapping(true);
    try {
      addLog(`Initiating Swap: ${amt} PEACE -> USDC...`);
      await new Promise(r => setTimeout(r, 1500));
      const usdcOut = await blockchain.swapPeaceForStable(actorId, amt);
      addLog(`Success: Received $${usdcOut.toFixed(2)} USDC.`);
      setSwapAmount('');
      await refreshData();
    } catch (e) {
      addLog("ERROR: Swap execution failed. Liquidity breach?");
    } finally {
      setIsSwapping(false);
    }
  };

  const startVerification = async () => {
    setIsVerifying(true);
    setLogs([]);
    addLog("Initializing Biometric Scan...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      await new Promise(r => setTimeout(r, 1000));
      setProgress(33);
      addLog("Liveness Phase 1: Analyzing Micro-expressions...");
      await new Promise(r => setTimeout(r, 1500));
      setProgress(66);
      addLog("Liveness Phase 2: Verifying SSL-Anchored Session...");
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

  const estimatedUSDC = swapAmount ? blockchain.calculateSwapOutput(parseFloat(swapAmount)) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-top-4 duration-700 pb-20">
      <header className="text-center space-y-4">
        <div className="w-20 h-20 peace-gradient rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-sky-500/40 relative group">
          <Fingerprint className="text-white group-hover:scale-110 transition-transform" size={40} />
          <div className="absolute -inset-2 bg-sky-500/20 blur-xl rounded-full animate-pulse" />
        </div>
        <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">Vault & Identity</h2>
        <p className="text-slate-400 max-w-lg mx-auto font-medium">Manage your Reputation SBT and realize the value of your peace building efforts.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Identity & Rewards */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-1 rounded-[3rem] bg-gradient-to-b from-slate-800 to-transparent shadow-2xl">
            <div className="bg-[#0a0a0c] rounded-[2.8rem] p-8 border border-white/5">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="w-64 h-96 rounded-[2.5rem] peace-gradient p-1 shrink-0 shadow-[0_0_80px_rgba(14,165,233,0.2)] group relative overflow-hidden">
                  <div className="w-full h-full bg-[#0d0d10] rounded-[2.3rem] relative z-10 flex flex-col items-center justify-center p-8">
                    <div className="absolute top-6 left-6 text-[8px] font-black font-mono text-sky-500/50 uppercase tracking-widest">PROTOCOL_SBT_V4</div>
                    <div className="absolute bottom-6 right-6 text-[8px] font-black font-mono text-sky-500/50 uppercase tracking-widest">NODAL_ANCHOR</div>
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
                    <div className="w-32 h-32 rounded-full border border-sky-500/20 flex items-center justify-center mb-8 relative">
                      <div className={`absolute inset-0 rounded-full ${hasVerified ? 'bg-emerald-500/10' : 'bg-sky-500/5'} animate-pulse`} />
                      {hasVerified ? (
                        <ShieldCheck className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" size={56} />
                      ) : (
                        <Award className="text-sky-400 drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]" size={56} />
                      )}
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sovereignty Level</div>
                      <div className={`text-2xl font-black italic tracking-tighter ${hasVerified ? 'text-emerald-400' : 'text-white'}`}>
                        {hasVerified ? 'AUDITED' : actor?.tier || 'VERIFIED'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-8 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass p-6 rounded-2xl bg-white/5 border-white/5 space-y-2 relative overflow-hidden">
                       <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          <Activity size={14} className="text-emerald-400" /> Pending Rewards
                       </div>
                       <div className="flex items-end justify-between">
                         <div className="text-3xl font-black text-white italic tracking-tighter">{actor?.balance.toLocaleString()} <span className="text-xs font-bold tracking-normal text-sky-400">PEACE</span></div>
                         <button 
                            onClick={handleClaim}
                            disabled={isClaiming || !actor || actor.balance <= 0}
                            className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                          >
                            {isClaiming ? <RefreshCw size={12} className="animate-spin" /> : <ArrowUpRight size={12} />}
                            Claim
                          </button>
                       </div>
                    </div>
                    <div className="glass p-6 rounded-2xl bg-white/5 border-white/5 space-y-2">
                       <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          <Zap size={14} className="text-amber-400" /> Reputation
                       </div>
                       <div className="text-3xl font-black text-white italic tracking-tighter">{actor?.reputationScore} <span className="text-xs text-amber-400 uppercase font-bold tracking-normal">PTS</span></div>
                    </div>
                  </div>

                  <div className="glass p-5 rounded-2xl border-white/5 bg-white/5 space-y-4 shadow-inner">
                    <div className="flex items-center gap-2 text-[10px] font-black text-sky-400 uppercase tracking-widest">
                       <Terminal size={14} /> Security Broadcast
                    </div>
                    <div className="space-y-1.5 h-20 overflow-hidden font-mono text-[9px] text-slate-500">
                       {logs.length === 0 ? <div className="italic opacity-50">Monitoring network heartbeat...</div> : logs.map((log, i) => <div key={i} className="animate-in slide-in-from-left-2">{log}</div>)}
                    </div>
                  </div>

                  {!hasVerified ? (
                    <button 
                      onClick={startVerification}
                      disabled={isVerifying}
                      className="w-full py-4 peace-gradient rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-sky-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
                    >
                      {isVerifying ? <RefreshCw className="animate-spin" size={16} /> : <Camera size={16} />}
                      {isVerifying ? 'Scanning Biometrics...' : 'Upgrade Identity Tier'}
                    </button>
                  ) : (
                    <div className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                       <ShieldCheck size={16} /> Identity Anchored & Verified
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Swap Interface */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-[3rem] border-white/10 bg-gradient-to-br from-slate-900 to-transparent shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Coins size={120} />
            </div>
            
            <header className="mb-8 flex justify-between items-center">
               <h3 className="text-xl font-bold text-white flex items-center gap-2">
                 <RefreshCw size={20} className="text-sky-400" />
                 Treasury Swap
               </h3>
               <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-slate-500 uppercase">Live Price</span>
                  <span className="text-xs font-mono font-black text-emerald-400">$ {metrics?.peacePrice.toFixed(4)}</span>
               </div>
            </header>

            <div className="space-y-4">
              <div className="glass p-5 rounded-2xl bg-black/40 border-white/5 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>From (Wallet)</span>
                  <span className="text-white">Bal: {actor?.walletBalance.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-4">
                  <input 
                    type="number"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    className="flex-1 bg-transparent text-2xl font-black text-white focus:outline-none placeholder-slate-800"
                    placeholder="0.00"
                  />
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 font-black text-xs">
                    PEACE
                  </div>
                </div>
              </div>

              <div className="flex justify-center -my-2 relative z-10">
                 <div className="p-2 bg-slate-800 rounded-full border border-slate-700 text-slate-400 shadow-xl">
                    <ArrowDownUp size={16} />
                 </div>
              </div>

              <div className="glass p-5 rounded-2xl bg-black/40 border-white/5 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>To (Liquid Cash)</span>
                  <span className="text-white">Bal: ${actor?.stableBalance.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 text-2xl font-black text-slate-300">
                    {estimatedUSDC.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xs">
                    USDC
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                 <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase">
                    <span>Slippage Tolerance</span>
                    <span className="text-amber-400">0.5%</span>
                 </div>
                 <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase">
                    <span>Network Fee (L2)</span>
                    <span className="text-white font-mono">$0.002</span>
                 </div>
              </div>

              <button 
                onClick={handleSwap}
                disabled={isSwapping || !swapAmount || parseFloat(swapAmount) > (actor?.walletBalance || 0)}
                className="w-full py-4 peace-gradient rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:grayscale disabled:opacity-50"
              >
                {isSwapping ? <RefreshCw className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                {isSwapping ? 'Executing Swap...' : 'Real-time Cash Out'}
              </button>
            </div>
            
            <div className="mt-6 flex items-center gap-2 text-rose-400 bg-rose-400/5 p-3 rounded-xl border border-rose-400/10">
               <AlertCircle size={14} className="shrink-0" />
               <span className="text-[9px] font-bold leading-tight">Liquidity is maintained by the community DAO treasury to ensure instant settlements.</span>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border-white/5 flex items-center justify-between">
             <div className="space-y-1">
                <div className="text-[9px] font-black text-slate-500 uppercase">Pool Depth</div>
                <div className="text-lg font-black text-white italic">$ {metrics?.liquidityDepth.toLocaleString()}</div>
             </div>
             <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500">
                <Shield size={20} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Identity;
