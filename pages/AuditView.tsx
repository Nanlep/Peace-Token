
import React, { useState, useEffect } from 'react';
import { blockchain } from '../services/blockchain';
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
  Search,
  BadgeAlert,
  ClipboardList,
  FileSearch
} from 'lucide-react';

// Use React.FC for correct prop handling
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

const DeploymentChecklist = () => {
  const checks = [
    { label: "Smart Contract Multi-sig Setup", status: "COMPLETE" },
    { label: "Audit v2.0 Sign-off (External)", status: "COMPLETE" },
    { label: "L2 RPC Redundancy (3 Nodes)", status: "IN_PROGRESS" },
    { label: "Emergency Veto Multi-sig (5/7)", status: "COMPLETE" },
    { label: "IPFS Gateway Sharding", status: "PENDING" },
    { label: "Gemini API Key Hardening", status: "COMPLETE" }
  ];

  return (
    <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-3">
        <ClipboardList className="text-sky-400" size={24} />
        Deployment Checks
      </h3>
      <div className="space-y-3">
        {checks.map((check, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-300 font-medium">{check.label}</span>
            <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
              check.status === 'COMPLETE' ? 'bg-emerald-500/20 text-emerald-400' : 
              check.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-500'
            }`}>
              {check.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AuditView: React.FC = () => {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [showVerdict, setShowVerdict] = useState(false);
  const [certifying, setCertifying] = useState(false);

  const runAudit = async () => {
    setIsAuditing(true);
    await new Promise(r => setTimeout(r, 1500));
    const newReport = await blockchain.runFullAudit();
    const newMetrics = await blockchain.getMetrics();
    setReport(newReport);
    setMetrics(newMetrics);
    setIsAuditing(false);
  };

  const handleCertify = async () => {
    setCertifying(true);
    await new Promise(r => setTimeout(r, 2000));
    setCertifying(false);
    setShowVerdict(true);
  };

  const runFixOps = async () => {
    setIsFixing(true);
    await new Promise(r => setTimeout(r, 2000));
    await blockchain.reconcileState();
    await runAudit();
    setIsFixing(false);
  };

  const injectChaos = async () => {
    await blockchain.simulateDrift();
    await runAudit();
  };

  const toggleProtocol = async () => {
    setIsPausing(true);
    await blockchain.togglePause();
    const newMetrics = await blockchain.getMetrics();
    setMetrics(newMetrics);
    setIsPausing(false);
  };

  useEffect(() => {
    runAudit();
  }, []);

  if (!metrics) return null;

  const getVerdict = () => {
    if (!report) return { text: 'PENDING', color: 'text-slate-500', class: '2' };
    const passCount = report.readiness.filter(r => r.status === 'PASS').length;
    const notPassCount = report.readiness.filter(r => r.status === 'NOT_PASS').length;

    if (passCount === report.readiness.length && report.healthy) return { text: 'ABSOLUTE PASS', color: 'text-emerald-400', class: '1' };
    if (notPassCount >= 1 || !report.healthy) return { text: 'CRITICAL FAILURE', color: 'text-rose-500', class: '3' };
    return { text: 'CONDITIONAL PASS', color: 'text-amber-400', class: '2' };
  };

  const verdict = getVerdict();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-sky-500 animate-pulse shadow-[0_0_10px_#0ea5e9]" />
            <span className="text-[11px] font-black text-sky-500 uppercase tracking-widest mono">Security Domain: Principal Architect</span>
          </div>
          <h2 className="text-4xl font-black text-white flex items-center gap-4 tracking-tight">
            Protocol Health Check
          </h2>
          <p className="text-slate-400 max-w-2xl text-lg font-medium leading-relaxed">
            Real-time invariant checking, property-based verification, and mission-critical state reconciliation.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleCertify}
            disabled={certifying || isAuditing}
            className="flex items-center gap-3 px-6 py-3 peace-gradient rounded-2xl text-sm font-black text-white shadow-[0_10px_20px_rgba(14,165,233,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {certifying ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
            Certify Production
          </button>
          <button 
            onClick={runAudit}
            disabled={isAuditing}
            className="flex items-center gap-3 px-6 py-3 glass rounded-2xl text-sm font-black text-sky-400 hover:bg-sky-500/10 border border-sky-500/20 transition-all disabled:opacity-50"
          >
            <FileSearch size={20} className={isAuditing ? 'animate-pulse' : ''} />
            Full Property Scan
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {report?.readiness.map((item) => (
          <ReadinessHUD key={item.id} item={item} />
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-white/5">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Shield size={220} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${report?.healthy ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'} border border-current/20 shadow-inner`}>
              {report?.healthy ? <ShieldCheck size={40} /> : <BadgeAlert size={40} />}
            </div>
            <div className="text-center md:text-left">
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Current Integrity Posture</div>
              <div className="text-4xl font-black text-white tracking-tighter">
                {report?.healthy ? 'Operational Baseline' : 'Drift & Corruption Detected'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-slate-800/50">
            <div className="space-y-1">
              <div className="text-[11px] text-slate-500 font-black uppercase tracking-widest">Health Score</div>
              <div className={`text-3xl font-black ${report?.score === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>{report?.score}%</div>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] text-slate-500 font-black uppercase tracking-widest">Invariants</div>
              <div className="text-3xl font-black text-white">{report?.invariantsMatched}/{report?.totalInvariants}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] text-slate-500 font-black uppercase tracking-widest">L2 TPS</div>
              <div className="text-3xl font-black text-sky-400">9.4k</div>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] text-slate-500 font-black uppercase tracking-widest">Uptime</div>
              <div className="text-3xl font-black text-emerald-400 tracking-tighter">99.99%</div>
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal size={20} className="text-sky-400" />
              Runtime Audit Logs
            </h3>
            <div className="space-y-3 font-mono text-[11px] max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {report?.logs.map((log) => (
                <div key={log.id} className="flex gap-4 p-3 rounded-lg bg-black/40 border border-slate-800/50 animate-in slide-in-from-left-2 shadow-inner">
                  <span className="text-slate-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span className={`font-black uppercase ${log.level === 'CRITICAL' ? 'text-rose-500' : log.level === 'WARNING' ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {log.level}
                  </span>
                  <span className="text-slate-500 shrink-0 font-bold">{log.component}:</span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-10 rounded-[2.5rem] space-y-8 border border-white/5 shadow-xl">
            <h3 className="text-xl font-bold text-white tracking-tight">Maintenance Hub</h3>
            <div className="space-y-4">
              <button 
                onClick={runFixOps}
                disabled={isFixing || report?.healthy}
                className="w-full flex items-center justify-between p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500/10 transition-all group disabled:opacity-50 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <Wrench className="text-emerald-400" size={24} />
                  <div className="text-left">
                    <div className="font-bold text-white">Reconcile State</div>
                    <div className="text-[10px] text-slate-500 uppercase font-black">Repair Invariants</div>
                  </div>
                </div>
                {isFixing ? <Loader2 size={20} className="animate-spin text-emerald-400" /> : <ChevronRight size={20} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />}
              </button>

              <button 
                onClick={toggleProtocol}
                disabled={isPausing}
                className="w-full flex items-center justify-between p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 hover:bg-rose-500/10 transition-all group disabled:opacity-50 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <Power className="text-rose-400" size={24} />
                  <div className="text-left">
                    <div className="font-bold text-white">{metrics.isPaused ? 'Resume Protocol' : 'Emergency Stop'}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-black">Circuit Breaker</div>
                  </div>
                </div>
                {isPausing ? <Loader2 size={20} className="animate-spin text-rose-400" /> : <ChevronRight size={20} className="text-slate-600 group-hover:text-rose-400 transition-colors" />}
              </button>

              <button 
                onClick={injectChaos}
                className="w-full flex items-center justify-between p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 hover:bg-amber-500/10 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <Skull className="text-amber-400" size={24} />
                  <div className="text-left">
                    <div className="font-bold text-white">Inject Chaos</div>
                    <div className="text-[10px] text-slate-500 uppercase font-black">Drift Simulation</div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-600 group-hover:text-amber-400 transition-colors" />
              </button>
            </div>
          </div>

          <DeploymentChecklist />
          
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-sky-400">
               <ShieldAlert size={18} />
               <span className="text-xs font-black uppercase tracking-widest">Security Advisory</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Automated reconciliation uses a multi-sig oracle threshold. Verify at least 3/5 security nodes are synchronized before repairing critical settlement state.
            </p>
          </div>
        </div>
      </div>

      {showVerdict && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass max-w-lg w-full p-10 rounded-[3rem] border-white/10 text-center space-y-8 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${verdict.class === '1' ? 'bg-emerald-500/20 text-emerald-400' : verdict.class === '2' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'} shadow-2xl`}>
               {verdict.class === '1' ? <ShieldCheck size={48} /> : verdict.class === '2' ? <AlertTriangle size={48} /> : <XCircle size={48} />}
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-black text-white tracking-tighter">{verdict.text}</h3>
              <p className="text-slate-400 text-lg">Protocol Live Production Readiness Report</p>
            </div>
            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 text-left text-xs text-slate-400 space-y-3 font-mono">
               <div className="flex justify-between"><span>Audit Score:</span> <span className={verdict.color}>{report?.score}%</span></div>
               <div className="flex justify-between"><span>Invariants:</span> <span className="text-white">{report?.invariantsMatched}/{report?.totalInvariants}</span></div>
               <div className="flex justify-between"><span>Status:</span> <span className="text-sky-400">CERTIFIED-V2</span></div>
            </div>
            <button 
              onClick={() => setShowVerdict(false)}
              className="w-full py-4 peace-gradient rounded-2xl font-black text-white text-lg shadow-xl shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Confirm & Finalize
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditView;
