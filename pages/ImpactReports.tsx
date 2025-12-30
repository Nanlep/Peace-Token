
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Globe, Users } from 'lucide-react';

const ImpactReports: React.FC = () => {
  const data = [
    { month: 'Jan', impact: 120 },
    { month: 'Feb', impact: 210 },
    { month: 'Mar', impact: 450 },
    { month: 'Apr', impact: 380 },
    { month: 'May', impact: 620 },
    { month: 'Jun', impact: 890 },
  ];

  const distribution = [
    { name: 'Education', value: 35, color: '#0ea5e9' },
    { name: 'Conflict Res', value: 40, color: '#2dd4bf' },
    { name: 'Environment', value: 15, color: '#f59e0b' },
    { name: 'Rights', value: 10, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white">Impact Transparency</h1>
          <p className="text-slate-400 mt-1">Real-time telemetry of global peace initiatives.</p>
        </div>
        <div className="px-4 py-2 glass rounded-xl text-xs font-mono text-sky-400 uppercase tracking-widest border-sky-500/20">
          Last Snapshot: {new Date().toLocaleDateString()}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-10 rounded-[3rem] space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-400" />
              Cumulative Protocol Growth
            </h3>
            <span className="text-emerald-400 text-sm font-bold">+124% Q2</span>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="impactGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="impact" stroke="#0ea5e9" fillOpacity={1} fill="url(#impactGradient)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-10 rounded-[3rem] flex flex-col items-center">
          <h3 className="text-xl font-bold text-white mb-8 self-start">Treasury Distribution</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full space-y-4 mt-4">
            {distribution.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <span className="text-white font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Globe, val: '84', label: 'Countries Reached', sub: 'Expanding rapidly in Africa & SEA' },
          { icon: Users, val: '12.4k', label: 'Lives Impacted', sub: 'Verified through evidence hashes' },
          { icon: BarChart3, val: '$8.2M', label: 'Matching Power', sub: 'Institutional grant pool' }
        ].map((stat, i) => (
          <div key={i} className="glass p-8 rounded-3xl border-white/5">
            <stat.icon className="text-sky-400 mb-4" size={24} />
            <div className="text-3xl font-black text-white mb-1">{stat.val}</div>
            <div className="text-sm font-bold text-slate-300 mb-2">{stat.label}</div>
            <p className="text-xs text-slate-500 leading-relaxed">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpactReports;
