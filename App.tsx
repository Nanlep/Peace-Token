
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  BarChart3, 
  Users, 
  FileCheck, 
  PlusSquare, 
  Activity, 
  Menu,
  X,
  Lock,
  Heart,
  BookOpen,
  Scale,
  ShieldAlert,
  HelpCircle,
  FileCode
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Governance from './pages/Governance';
import Identity from './pages/Identity';
import SubmitWork from './pages/SubmitWork';
import ProjectFeed from './pages/ProjectFeed';
import AuditView from './pages/AuditView';
import LandingPage from './pages/LandingPage';
import Manifesto from './pages/Manifesto';
import ImpactReports from './pages/ImpactReports';
import Community from './pages/Community';
import ApplyGrants from './pages/ApplyGrants';
import StewardshipGuide from './pages/StewardshipGuide';
import Safety from './pages/Safety';
import UsageGuide from './pages/UsageGuide';
import TechnicalSpecs from './pages/TechnicalSpecs';

const SidebarLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
      ${isActive 
        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]' 
        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}
    `}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const PlatformLayout = ({ children, hideSidebar = false }: { children: React.ReactNode, hideSidebar?: boolean }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (hideSidebar) return <div className="bg-[#0a0a0c] min-h-screen">{children}</div>;

  return (
    <div className="flex min-h-screen bg-[#0a0a0c]">
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>

      <aside className={`
        fixed lg:sticky top-0 left-0 z-40 w-64 h-screen transition-transform 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 bg-[#0d0d10] border-r border-slate-800/50 flex flex-col
      `}>
        <div className="p-6">
          <NavLink to="/" className="flex items-center gap-3 mb-8 px-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 peace-gradient rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Heart className="text-white" size={24} />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-white uppercase italic">Peace<span className="text-sky-400">Token</span></h1>
          </NavLink>

          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Platform</div>
            <SidebarLink to="/dashboard" icon={BarChart3} label="Dashboard" />
            <SidebarLink to="/projects" icon={Activity} label="Impact Feed" />
            <SidebarLink to="/submit" icon={PlusSquare} label="Submit Work" />
            
            <div className="pt-6">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Governance</div>
              <SidebarLink to="/governance" icon={Users} label="DAO & Proposals" />
              <SidebarLink to="/identity" icon={Lock} label="Identity (SBT)" />
            </div>

            <div className="pt-6">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Knowledge</div>
              <SidebarLink to="/usage" icon={HelpCircle} label="Usage Guide" />
              <SidebarLink to="/manifesto" icon={BookOpen} label="Manifesto" />
              <SidebarLink to="/reports" icon={FileCheck} label="Impact Reports" />
              <SidebarLink to="/guide" icon={Scale} label="Stewardship" />
            </div>

            <div className="pt-6">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">System</div>
              <SidebarLink to="/specs" icon={FileCode} label="Technical Specs" />
              <SidebarLink to="/audit" icon={ShieldCheck} label="Audits & SRE" />
              <SidebarLink to="/safety" icon={ShieldAlert} label="Safety & Ethics" />
            </div>
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="sticky top-0 z-30 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-slate-800/50 h-16 flex items-center justify-between px-6 lg:px-10">
           <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-slate-500">Node Cluster:</span>
              <span className="text-sky-400">US-EAST-ALPHA</span>
              <div className="w-px h-4 bg-slate-800" />
              <span className="text-slate-500">Status:</span>
              <span className="text-emerald-400">Operational</span>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <Users size={18} />
              </div>
           </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<PlatformLayout><Dashboard /></PlatformLayout>} />
        <Route path="/projects" element={<PlatformLayout><ProjectFeed /></PlatformLayout>} />
        <Route path="/submit" element={<PlatformLayout><SubmitWork /></PlatformLayout>} />
        <Route path="/governance" element={<PlatformLayout><Governance /></PlatformLayout>} />
        <Route path="/identity" element={<PlatformLayout><Identity /></PlatformLayout>} />
        <Route path="/audit" element={<PlatformLayout><AuditView /></PlatformLayout>} />
        <Route path="/specs" element={<PlatformLayout><TechnicalSpecs /></PlatformLayout>} />
        <Route path="/usage" element={<PlatformLayout><UsageGuide /></PlatformLayout>} />
        <Route path="/manifesto" element={<PlatformLayout><Manifesto /></PlatformLayout>} />
        <Route path="/reports" element={<PlatformLayout><ImpactReports /></PlatformLayout>} />
        <Route path="/community" element={<PlatformLayout><Community /></PlatformLayout>} />
        <Route path="/grants" element={<PlatformLayout><ApplyGrants /></PlatformLayout>} />
        <Route path="/guide" element={<PlatformLayout><StewardshipGuide /></PlatformLayout>} />
        <Route path="/safety" element={<PlatformLayout><Safety /></PlatformLayout>} />
      </Routes>
    </HashRouter>
  );
};

export default App;
