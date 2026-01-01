
import React from 'react';
import { 
  Cloud, 
  Terminal, 
  Activity, 
  RefreshCcw, 
  Zap, 
  ShieldCheck, 
  AlertOctagon, 
  BarChart, 
  HardDrive,
  Cpu,
  Package,
  Key,
  Database
} from 'lucide-react';

const ConfigBlock = ({ title, content }: { title: string, content: string }) => (
  <div className="space-y-2">
    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{title}</div>
    <div className="bg-black/60 p-5 rounded-2xl font-mono text-[11px] text-sky-400 border border-slate-800 leading-relaxed overflow-x-auto shadow-inner">
      {content}
    </div>
  </div>
);

const OpsGuide: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in duration-1000 pb-20">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-sky-500/20 text-sky-400 font-mono text-[10px] uppercase tracking-widest">
          <Cpu size={14} /> SRE Ops v1.0.4-PROD
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter italic">DevOps & <span className="text-emerald-400">Deployment</span></h1>
        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed font-medium">
          The infrastructure manual for 99.99% uptime. This document defines the deployment pipeline and launch playbook.
        </p>
      </header>

      <section className="glass p-10 rounded-[3rem] border-sky-500/10 bg-sky-500/5 space-y-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 italic">
          <Package className="text-sky-400" size={24} />
          24hr Launch Playbook
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Environment Setup</h3>
            <div className="space-y-4">
              <ConfigBlock 
                title="Secret Injection"
                content="export API_KEY='your-gemini-key'\nexport L2_RPC='https://arbitrum-mainnet...'\nexport PINATA_KEY='ipfs-secret'"
              />
              <ConfigBlock 
                title="Ledger Bootstrap"
                content="npm run anchor-contracts --network=L2_PROD\nnpm run seed-identity-registry"
              />
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Launch Sequence</h3>
            <div className="space-y-3 font-medium">
               {[
                 { label: "Verify Oracle Consensus", status: "READY" },
                 { label: "Initialize Treasury Multi-sig", status: "READY" },
                 { label: "Sync IPFS Gateway Nodes", status: "ACTIVE" },
                 { label: "Trigger Global CDN Purge", status: "STANDBY" }
               ].map((step, i) => (
                 <div key={i} className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-300 italic">{step.label}</span>
                    <span className="text-[9px] font-black text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded uppercase">{step.status}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-10 rounded-[3rem] border-white/5 space-y-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 italic">
            <Activity className="text-sky-400" size={24} />
            Telemetry Metrics
          </h2>
          <div className="space-y-4">
            <ConfigBlock 
              title="SRE Threshold: P95 Latency"
              content="critical: > 500ms\nwarning: > 200ms\nwindow: 5m rolling"
            />
            <ConfigBlock 
              title="L2 Sync Drift"
              content="max_drift: 12 blocks\naction: rpc_failover_primary"
            />
          </div>
        </div>

        <div className="glass p-10 rounded-[3rem] border-white/5 space-y-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 italic">
            <Database className="text-emerald-400" size={24} />
            Persistence Protocol
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">All Peace Works are content-addressed via IPFS and pinned to a cluster of 3 global nodes. Recovery occurs via Arweave snapshotting every 24h.</p>
          <div className="p-5 bg-black/60 rounded-2xl border border-slate-800 font-mono text-[10px] text-slate-500">
             [STORAGE_STRATEGY]: Hot -> IPFS Pinata Cluster / Cold -> Arweave Perpetual Hub
          </div>
        </div>
      </section>

      <footer className="text-center py-10">
        <p className="text-slate-600 text-[10px] uppercase font-mono tracking-widest font-black">
          CERTIFIED PRODUCTION ENVIRONMENT // BUILD_HASH: 0x9a8b7c...
        </p>
      </footer>
    </div>
  );
};

export default OpsGuide;
