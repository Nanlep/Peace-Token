
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { blockchain } from '../services/blockchain';
import { SystemMetrics } from '../types';
import { TrendingUp, Award, Shield, Globe, Loader2, CheckCircle2, FileText, Coins, ArrowUpRight } from 'lucide-react';

const StatCard = ({ label, value, trend, icon: Icon, color }: any) => (
  <div className="glass p-6 rounded-2xl relative overflow-hidden group">
    <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
      <Icon size={120} />
    </div>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg bg-opacity-10 ${color.replace('text', 'bg')}`}>
        <Icon className={color} size={20} />
      </div>
      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-400/10 px-2 py-1 rounded">
        <TrendingUp size={12} /> {trend}%
      </span>
    </div>
    <h3 className="text-slate-400 text-sm font-medium mb-1">{label}</h3>
    <div className="text-2xl font-bold tracking-tight text-white">{value}</div>
  </div>
);

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const fetchMetrics = () => {
    blockchain.getMetrics().then(setMetrics);
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleConnectOracle = async () => {
    setIsConnecting(true);
    await blockchain.connectOracle();
    setIsConnecting(false);
    setIsConnected(true);
    fetchMetrics();
    setTimeout(() => setIsConnected(false), 3000);
  };

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise(r => setTimeout(r, 2000));
    const blob = new Blob(["Peace-Token Protocol Report\nTimestamp: " + new Date().toISOString()], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `peace-report-${Date.now()}.txt`;
    a.click();
    setIsExporting(false);
  };

  if (!metrics) return null;

  const data = [
    { name: 'Mon', value: 0.22 },
    { name: 'Tue', value: 0.24 },
    { name: 'Wed', value: 0.23 },
    { name: 'Thu', value: 0.25 },
    { name: 'Fri', value: 0.28 },
    { name: 'Sat', value: 0.27 },
    { name: 'Sun', value: metrics.peacePrice },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">Protocol <span className="text-sky-400">Intelligence</span></h2>
          <p className="text-slate-400 font-medium">Global peace value distribution and real-time market telemetry.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 glass rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
            {isExporting ? 'Generating...' : 'Export Report'}
          </button>
          <button 
            onClick={handleConnectOracle}
            disabled={isConnecting}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-lg transition-all flex items-center gap-2 ${isConnected ? 'bg-emerald-500' : 'peace-gradient hover:scale-105 active:scale-95'}`}
          >
            {isConnecting ? <Loader2 size={16} className="animate-spin" /> : isConnected ? <CheckCircle2 size={16} /> : <Globe size={16} />}
            {isConnecting ? 'Syncing...' : isConnected ? 'Oracle Live' : 'Connect Oracle'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Market Price (USD)" 
          value={`$${metrics.peacePrice.toFixed(4)}`} 
          trend="4.2" 
          icon={Coins} 
          color="text-emerald-400" 
        />
        <StatCard 
          label="LP Pool Depth" 
          value={`$${(metrics.liquidityDepth / 1000).toFixed(1)}k`} 
          trend="8.1" 
          icon={Shield} 
          color="text-sky-400" 
        />
        <StatCard 
          label="Verified Actors" 
          value={metrics.verifiedActors} 
          trend="5.2" 
          icon={Award} 
          color="text-indigo-400" 
        />
        <StatCard 
          label="Peace Value Locked" 
          value={`$${(metrics.totalPeaceValueLocked / 1000000).toFixed(2)}M`} 
          trend="2.9" 
          icon={TrendingUp} 
          color="text-rose-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">PEACE/USDC Price (L2 Index)</h3>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
               LIVE FEED
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val.toFixed(2)}`} domain={['dataMin - 0.05', 'dataMax + 0.05']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#2dd4bf' }}
                />
                <Area type="monotone" dataKey="value" stroke="#2dd4bf" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl flex flex-col">
          <h3 className="text-lg font-bold mb-6">Treasury Allocation</h3>
          <div className="flex-1 space-y-6">
            {[
              { label: 'Conflict Resolution', value: 45, color: 'bg-sky-500' },
              { label: 'Education Systems', value: 25, color: 'bg-emerald-500' },
              { label: 'Human Rights Fund', value: 20, color: 'bg-rose-500' },
              { label: 'Env Restoration', value: 10, color: 'bg-amber-500' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white font-semibold">{item.value}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(14,165,233,0.1)]`} 
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleExport} className="mt-8 w-full py-3 glass rounded-xl text-sm font-bold text-slate-300 hover:text-white transition-colors border border-white/5 flex items-center justify-center gap-2">
            Audit Smart Contracts <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
