
import React, { useState, useEffect } from 'react';
import { blockchain, ProductionManifest } from '../services/blockchain';
import { AuditReport, SystemMetrics, ReadinessItem } from '../types';
import { 
  ShieldAlert, 
  Terminal, 
  ShieldCheck, 
  Power,
  ChevronRight,
  Wrench,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Skull,
  Shield,
  BadgeAlert,
  ClipboardList,
  FileSearch,
  Zap,
  Lock,
  Eye,
  Settings,
  Dna,
  Server,
  Cpu,
  ArrowRight
} from 'lucide-react';

const ReadinessHUD: React.FC<{ item: ReadinessItem }> = ({ item }) => {
  const styles = {
    PASS: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2 },
    CONDITIONAL: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle },
    NOT_PASS: { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: XCircle },
  };
  const { color, bg, border, icon: Icon } = styles[item.status];

  return (
    <div className={`p-5 rounded-2xl ${bg} ${border} border flex items-start gap-4 transition-all hover:scale-[1.02] shadow-xl group`}>
      <Icon className={`${color} shrink-0 group-hover:scale-110 transition-transform`} size={24} />
      <div className="space-y-1">
        <div className="flex items-center gap-2">
           <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${color} bg-black/50 border border-current/20`}>{item.status}</span>
           <h4 className="font-bold text-white text-sm">{item.category}</h4>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">{item.reason}</p>
      </div>
    </div>
  );
};

const ControlButton: React.FC<{ 
  onClick: () => void, 
  disabled: boolean, 
  hasPermission: boolean, 
  icon: any, 
  label: string, 
  subLabel: string, 
  color: string, 
  isLoading?: boolean 
}> = ({ onClick, disabled, hasPermission, icon: Icon, label, subLabel, color, isLoading }) => {
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400',
    rose: 'bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10 text-rose-400',
    amber: 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10 text-amber-400'
  };

  if (!hasPermission) {
    return (
      <div className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 opacity-60 cursor-not-allowed group">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-500">
            <Lock size={20} />
          </div>
          <div className="text-left">
            <div className="font-bold text-slate-500 italic">{label}</div>
            <div className="text-[10px] text-slate-600 uppercase font-black">Requires AUDITED Tier</div>
          </div>
        </div>
        <Lock size={16} className="text-slate-700" />
      </div>
    );
  }

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all group disabled:opacity-50 shadow-sm ${colorMap[color]}`}
    >
      <div className="flex items-center gap-4">
        <Icon size={24} />
        <div className="text-left">
          <div className="font-bold text-white italic">{label}</div>
          <div className="text-[10px] uppercase font-black opacity-60">{subLabel}</div>
        </div>
      </div>
      {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ChevronRight size={20} className="opacity-40 group-hover:opacity-100 transition-opacity" />}
    </button>
  );
};

const AuditView: React.FC = () => {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [manifest, setManifest] = useState<ProductionManifest | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [showVerdict, setShowVerdict] = useState(false);
  const [certifying, setCertifying] = useState(false);

  const runAudit = async () => {
    setIsAuditing(true);
    const address = blockchain.getConnectedAccount();
    const canManage = await blockchain.checkPermission(address);
    setHasPermission(canManage);
    
    await new Promise(r => setTimeout(r, 1200));
    const newReport = await blockchain.runFullAudit();
    const newMetrics = await blockchain.getMetrics();
    const newManifest = await blockchain.getProductionManifest();
    setReport(newReport);
    setMetrics(newMetrics);
    setManifest(newManifest);
    setIsAuditing(false);
  };

  const handleCertify = async () => {
    setCertifying(true);
    await runAudit();
    await new Promise(r => setTimeout(r, 1500));
    setCertifying(false);
    setShowVerdict(true);
  };

  const runFixOps = async () => {
    setIsFixing(true);
    try {
      await blockchain.reconcileState();
      await runAudit();
    } catch (e) {
      alert("Unauthorized Access Attempt Blocked.");
    } finally {
      setIsFixing(false);
    }
  };

  const injectChaos = async () => {
    try {
      await blockchain.simulateDrift();
      await runAudit();
    } catch (e) {
      alert("Simulator Access Restricted.");
    }
  };

  const toggleProtocol = async () => {
    setIsPausing(true);
    try {
      await blockchain.togglePause();
      await runAudit();
    } catch (e) {
      alert("Protocol Circuit Breaker Restricted.");
    } finally {
      setIsPausing(false);
    }
  };

  useEffect(() => {
    runAudit();
  }, []);

  if (!metrics || !report || !manifest) return null;

  const getVerdict = () => {
    const score = report.score;
    if (score >= 100) return { text: 'ABSOLUTE PASS', color: 'text-emerald-400', class: '1', desc: 'All mission-critical invariants verified. Infrastructure fully sharded. Deployment AUTHORIZED.' };
    if (score >= 70) return { text: 'CONDITIONAL PASS', color: 'text-amber-400', class: '2', desc: 'Minor system drift or pending synchronization. Production allowed with monitoring.' };
    return { text: 'NOT PASS', color: 'text-rose-500', class: '3', desc: 'Critical integrity breach or single-node storage detected. Production BLOCKED.' };
  };

  const verdict = getVerdict();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`flex h-2 w-2 rounded-full ${hasPermission ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-sky-500 shadow-[0_0_10px_#0ea5e9]'} animate-pulse`} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mono">
              {hasPermission ? 'Mode: SRE Command Control' : 'Mode: Public Transparency Ledger'}
            </span>
          </div>
          <h2 className="text-4xl font-black text-white flex items-center gap-4 tracking-tight uppercase italic">
            Mission Control
          </h2>
          <p className="text-slate-400 max-w-2xl text-lg font-medium">
            Protocol readiness monitoring and sovereign state reconciliation.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleCertify}
            disabled={certifying || isAuditing}
            className="flex items-center gap-3 px-8 py-3 peace-gradient rounded-2xl text-sm font-black text-white shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 group"
          >
            {certifying ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} className="group-hover:scale-125 transition-transform" />}
            Production Sign-off
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {report.readiness.map((item) => (
          <ReadinessHUD key={item.id} item={item} />
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-10 rounded-[2.5rem] relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Shield size={220} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${report.healthy && report.score >= 100 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'} border border-current/20`}>
              {report.healthy && report.score >= 100 ? <ShieldCheck size={40} /> : <BadgeAlert size={40} />}
            </div>
            <div>
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">System Integrity Score</div>
              <div className={`text-5xl font-black ${report.score >= 100 ? 'text-emerald-400' : report.score >= 70 ? 'text-amber-400' : 'text-rose-500'} tracking-tighter`}>
                {report.score.toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-slate-800/50">
            {[
              { label: 'Invariants', val: `${report.invariantsMatched}/${report.totalInvariants}` },
              { label: 'Oracle Sync', val: report.logs.some(l => l.component === 'Consensus' && l.level === 'SUCCESS') ? 'HEALTHY' : 'DOWN', color: report.logs.some(l => l.component === 'Consensus' && l.level === 'SUCCESS') ? 'text-emerald-400' : 'text-rose-500' },
              { label: 'L2 Throughput', val: '9.4k TPS', color: 'text-sky-400' },
              { label: 'Network', val: metrics.isPaused ? 'HALTED' : 'ACTIVE', color: metrics.isPaused ? 'text-rose-500' : 'text-emerald-400' }
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-[11px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</div>
                <div className={`text-2xl font-black ${stat.color || 'text-white'}`}>{stat.val}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal size={20} className="text-sky-400" />
              Production Runtime Logs
            </h3>
            <div className="space-y-3 font-mono text-[11px] max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {report.logs.map((log) => (
                <div key={log.id} className="flex gap-4 p-3 rounded-lg bg-black/40 border border-slate-800/50 shadow-inner">
                  <span className="text-slate-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span className={`font-black uppercase ${log.level === 'CRITICAL' ? 'text-rose-500' : log.level === 'WARNING' ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {log.level}
                  </span>
                  <span className="text-slate-300 flex-1">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-10 rounded-[2.5rem] space-y-8 border border-white/5">
            <header className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">SRE Command Center</h3>
              <Settings size={18} className="text-slate-600" />
            </header>
            
            <div className="space-y-4">
              <ControlButton 
                label="Execute State Repair"
                subLabel="Manual State Sync"
                icon={Wrench}
                color="emerald"
                hasPermission={hasPermission}
                disabled={isFixing || (report.healthy && report.score >= 100)}
                isLoading={isFixing}
                onClick={runFixOps}
              />

              <ControlButton 
                label={metrics.isPaused ? 'Resume Protocol' : 'Kill Switch'}
                subLabel="Protocol Availability"
                icon={Power}
                color="rose"
                hasPermission={hasPermission}
                disabled={isPausing}
                isLoading={isPausing}
                onClick={toggleProtocol}
              />

              <ControlButton 
                label="Inject Stress"
                subLabel="Chaos Engineering"
                icon={Skull}
                color="amber"
                hasPermission={hasPermission}
                disabled={false}
                onClick={injectChaos}
              />
            </div>
          </div>
          
          <div className="glass p-8 rounded-[2rem] border-white/5 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Server size={60} />
            </div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ClipboardList className="text-slate-500" size={20} />
              Deployment Manifest
            </h3>
            <div className="space-y-4 font-mono">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">VERSION</span>
                <span className="text-sky-400">{manifest.version}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">BUILD_HASH</span>
                <span className="text-slate-300">{manifest.hash}</span>
              </div>
              <div className="h-px bg-slate-800" />
              <div className="space-y-2">
                {manifest.checks.map((check, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">{check.label}</span>
                    <div className="flex items-center gap-2">
                       <span className="text-slate-400 italic text-[9px]">{check.value}</span>
                       <span className={`font-black ${check.status === 'READY' ? 'text-emerald-400' : 'text-rose-500'}`}>{check.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showVerdict && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="glass max-w-2xl w-full p-12 rounded-[4rem] border-white/10 relative overflow-hidden shadow-[0_0_200px_rgba(14,165,233,0.2)]">
            <div className="absolute top-0 left-0 p-12 opacity-[0.03] pointer-events-none">
              <Dna size={400} />
            </div>
            
            <div className="text-center space-y-8 relative z-10">
              <div className={`w-28 h-28 rounded-full mx-auto flex items-center justify-center ${verdict.class === '1' ? 'bg-emerald-500/20 text-emerald-400' : verdict.class === '2' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'} border border-current/20 shadow-2xl animate-bounce`}>
                 {verdict.class === '1' ? <ShieldCheck size={56} /> : verdict.class === '2' ? <AlertTriangle size={56} /> : <XCircle size={56} />}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">SRE Production Clearance</span>
                </div>
                <h3 className={`text-6xl font-black ${verdict.color} tracking-tighter italic uppercase`}>{verdict.text}</h3>
                <p className="text-slate-300 text-lg font-medium max-w-md mx-auto leading-relaxed">{verdict.desc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-mono">
                 <div className="p-6 rounded-3xl bg-black/50 border border-white/5 space-y-2">
                    <div className="text-[9px] text-slate-600 uppercase font-black tracking-widest flex items-center gap-2">
                       <Cpu size={12} /> Compute Layer
                    </div>
                    <div className="text-sm text-slate-300">Stateless services synced. Latency &lt; 20ms.</div>
                 </div>
                 <div className="p-6 rounded-3xl bg-black/50 border border-white/5 space-y-2">
                    <div className="text-[9px] text-slate-600 uppercase font-black tracking-widest flex items-center gap-2">
                       <Server size={12} /> Persistence Layer
                    </div>
                    <div className="text-sm text-slate-300">IPFS Shards: Cluster_01 Active. CID verification LIVE.</div>
                 </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowVerdict(false)}
                  className="flex-1 py-5 bg-slate-800 hover:bg-slate-700 rounded-[2rem] font-black text-slate-300 text-lg transition-all uppercase tracking-widest"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    alert("PRODUCTION_LAUNCH_AUTHORIZED: System state frozen for deployment.");
                    setShowVerdict(false);
                  }}
                  className="flex-[2] py-5 peace-gradient rounded-[2rem] font-black text-white text-xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  Execute Launch <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditView;
