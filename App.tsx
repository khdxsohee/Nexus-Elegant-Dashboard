
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './components/Icons';
import { getGeminiResponse } from './services/geminiService';
import { Message, StatItem, Project, TeamMember, SystemLog, CloudNode } from './types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const chartData = [
  { name: '00:00', revenue: 4200, compute: 65 },
  { name: '04:00', revenue: 3800, compute: 72 },
  { name: '08:00', revenue: 5400, compute: 88 },
  { name: '12:00', revenue: 7100, compute: 45 },
  { name: '16:00', revenue: 6200, compute: 92 },
  { name: '20:00', revenue: 8900, compute: 55 },
  { name: '23:59', revenue: 7800, compute: 60 },
];

const projects: Project[] = [
  { id: 'p1', name: 'Nexus Mobile v3', progress: 75, status: 'In Progress', priority: 'High', team: ['https://i.pravatar.cc/150?u=1', 'https://i.pravatar.cc/150?u=2'] },
  { id: 'p2', name: 'Cloud Core Mesh', progress: 100, status: 'Completed', priority: 'Medium', team: ['https://i.pravatar.cc/150?u=3'] },
  { id: 'p3', name: 'AI Reasoning API', progress: 42, status: 'Review', priority: 'High', team: ['https://i.pravatar.cc/150?u=4', 'https://i.pravatar.cc/150?u=5'] },
];

const logs: SystemLog[] = [
  { id: 'l1', type: 'info', message: 'Nexus Core Kernel initialized', timestamp: '10:42:01' },
  { id: 'l2', type: 'success', message: 'EU-West Cluster sync complete', timestamp: '10:43:15' },
  { id: 'l3', type: 'warning', message: 'Node latency spike in US-East', timestamp: '10:45:00' },
  { id: 'l4', type: 'info', message: 'AI Context Window expanded to 2M', timestamp: '10:48:22' },
];

const cloudNodes: CloudNode[] = [
  { region: 'US-East', load: 82, latency: 12, status: 'active' },
  { region: 'EU-West', load: 45, latency: 48, status: 'active' },
  { region: 'AP-South', load: 12, latency: 110, status: 'maintenance' },
];

const stats: StatItem[] = [
  { label: 'Network Throughput', value: '4.2 GB/s', change: '+12%', isPositive: true, icon: 'Zap' },
  { label: 'Active Sessions', value: '18.4K', change: '+2.4K', isPositive: true, icon: 'Users' },
  { label: 'Compute Usage', value: '64.2%', change: '-5.1%', isPositive: true, icon: 'System' },
  { label: 'Encrypted Data', value: '2.4 PB', change: '+142 TB', isPositive: true, icon: 'Security' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Systems are nominal. khdxsohee, how can I assist you with your deployments today?", timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (text?: string) => {
    const content = text || inputValue;
    if (!content.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const response = await getGeminiResponse(content);
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response || "Protocol error. Retrying...", timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30 tracking-tight">
      {/* Sidebar */}
      <aside className="w-20 lg:w-72 bg-[#0f172a]/40 backdrop-blur-3xl border-r border-white/5 flex flex-col transition-all duration-500 z-50">
        <div className="p-8 flex items-center gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Icons.Command className="w-6 h-6 text-white" />
          </div>
          <div className="hidden lg:block">
            <h2 className="text-xl font-black tracking-tighter text-white">NEXUS</h2>
            <p className="text-[10px] text-slate-500 font-bold tracking-[0.3em]">ENGINEERING CORE</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {[
            { id: 'dashboard', icon: Icons.Dashboard, label: 'Mission Control' },
            { id: 'nodes', icon: Icons.System, label: 'Node Clusters' },
            { id: 'projects', icon: Icons.Project, label: 'Workspaces' },
            { id: 'analytics', icon: Icons.Stats, label: 'Deep Telemetry' },
            { id: 'security', icon: Icons.Security, label: 'Threat Vault' },
            { id: 'settings', icon: Icons.Settings, label: 'Kernel Config' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-white/5 text-white border border-white/10 shadow-lg' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]' : 'opacity-70 group-hover:scale-110'}`} />
              <span className="text-sm font-bold hidden lg:block">{item.label}</span>
              {activeTab === item.id && <div className="ml-auto w-1 h-6 rounded-full bg-indigo-500 hidden lg:block" />}
            </button>
          ))}

          {/* Mini Health Monitor in Sidebar */}
          <div className="mt-12 px-4 hidden lg:block">
            <div className="p-5 bg-white/5 border border-white/5 rounded-3xl space-y-4">
               <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                  <span>CPU Load</span>
                  <span className="text-indigo-400">42%</span>
               </div>
               <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[42%] transition-all duration-1000" />
               </div>
               <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                  <span>Mem Pool</span>
                  <span className="text-emerald-400">2.1TB</span>
               </div>
               <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[65%] transition-all duration-1000" />
               </div>
            </div>
          </div>
        </nav>

        <div className="p-6">
          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-2xl border border-white/5">
             <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Icons.Users className="w-5 h-5 text-indigo-400" />
             </div>
             <div className="hidden lg:block overflow-hidden">
                <p className="text-xs font-black text-white truncate">khdxsohee</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Cluster Owner</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

        <header className="h-20 flex items-center justify-between px-10 border-b border-white/5 bg-[#020617]/40 backdrop-blur-3xl z-40">
          <div className="flex items-center bg-white/5 border border-white/10 px-5 py-3 rounded-2xl w-full max-w-xl focus-within:ring-2 ring-indigo-500/30 transition-all group">
            <Icons.Search className="w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 mr-4" />
            <input 
              type="text" 
              placeholder="Search kernel, nodes, or deploy protocols..." 
              className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-600 w-full font-medium"
            />
            <div className="flex items-center gap-1 ml-4 opacity-50">
               <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded font-mono">⌘</span>
               <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded font-mono">K</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Global Health: 100%
               </span>
               <span className="text-[9px] text-slate-500 font-bold mt-1 uppercase">Latency: 24ms • 12 Global Nodes</span>
            </div>
            <button className="relative p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all group">
              <Icons.Notifications className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full ring-4 ring-[#020617]" />
            </button>
            <button className="flex items-center gap-3 pl-8 border-l border-white/10 group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-white leading-none">khdxsohee</p>
                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase">Root User</p>
              </div>
              <img src="https://i.pravatar.cc/150?u=khdxsohee" className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-indigo-500/50 transition-all shadow-2xl" />
            </button>
          </div>
        </header>

        {/* Dashboard Area */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar z-10">
          <div className="max-w-[1600px] mx-auto space-y-10">
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="bg-[#0f172a]/40 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:bg-[#1e293b]/40 transition-all border-b-4 border-b-transparent hover:border-b-indigo-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                      {stat.icon === 'Zap' && <Icons.Zap className="w-6 h-6 text-indigo-400" />}
                      {stat.icon === 'Users' && <Icons.Users className="w-6 h-6 text-emerald-400" />}
                      {stat.icon === 'System' && <Icons.System className="w-6 h-6 text-amber-400" />}
                      {stat.icon === 'Security' && <Icons.Security className="w-6 h-6 text-rose-400" />}
                    </div>
                    <div className="px-3 py-1 bg-indigo-500/10 rounded-full">
                       <span className="text-[10px] font-black text-indigo-400">{stat.change}</span>
                    </div>
                  </div>
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</h4>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-black text-white">{stat.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Center Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              
              {/* Telemetry Chart */}
              <div className="xl:col-span-2 bg-[#0f172a]/40 border border-white/5 p-10 rounded-[3rem] h-[500px] flex flex-col relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><Icons.Stats className="w-64 h-64" /></div>
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tighter">Temporal Performance</h3>
                    <p className="text-sm text-slate-500 font-bold mt-1 uppercase tracking-widest">Global Compute Cluster • Real-time</p>
                  </div>
                  <div className="flex gap-3">
                     <button className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-500/20">Live Sync</button>
                     <button className="px-5 py-2.5 bg-white/5 text-slate-400 text-xs font-black rounded-xl hover:text-white transition-all border border-white/5">Historical</button>
                  </div>
                </div>
                <div className="flex-1 w-full relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#1e293b" opacity={0.2} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 800}} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 800}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', padding: '15px' }}
                        itemStyle={{ color: '#818cf8', fontWeight: 900, fontSize: '12px' }}
                      />
                      <Area type="step" dataKey="revenue" stroke="#6366f1" strokeWidth={6} fillOpacity={1} fill="url(#colorRev)" />
                      <Area type="monotone" dataKey="compute" stroke="#10b981" strokeWidth={3} strokeDasharray="8 8" fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Node Health & Logs */}
              <div className="flex flex-col gap-8">
                <div className="bg-[#0f172a]/40 border border-white/5 p-8 rounded-[3rem] flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                    <Icons.System className="w-5 h-5 text-indigo-400" /> Active Clusters
                  </h3>
                  <div className="space-y-4 flex-1">
                    {cloudNodes.map((node, i) => (
                      <div key={i} className="p-5 bg-white/5 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all group cursor-pointer">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-sm font-black text-white">{node.region}</span>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${
                            node.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>{node.status}</span>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="flex-1 space-y-1.5">
                              <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
                                 <span>Load</span>
                                 <span>{node.load}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-indigo-500" style={{ width: `${node.load}%` }} />
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-xs font-black text-white">{node.latency}ms</p>
                              <p className="text-[9px] text-slate-500 font-bold uppercase">RTT</p>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0f172a]/40 border border-white/5 p-8 rounded-[3rem] h-[220px] flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">System Events</h3>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="space-y-3 overflow-y-auto no-scrollbar flex-1">
                    {logs.map(log => (
                      <div key={log.id} className="flex gap-4 items-start group">
                        <span className="text-[10px] font-mono text-slate-600 font-bold">{log.timestamp}</span>
                        <p className="text-[11px] font-bold text-slate-400 group-hover:text-white transition-colors truncate">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${
                            log.type === 'error' ? 'bg-rose-500' : log.type === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'
                          }`} />
                          {log.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Grid Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               {projects.map(proj => (
                 <div key={proj.id} className="bg-[#0f172a]/40 border border-white/5 p-8 rounded-[3rem] hover:bg-[#1e293b]/40 transition-all group overflow-hidden relative">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl" />
                    <div className="flex justify-between items-start mb-8 relative z-10">
                       <div className="p-4 bg-white/5 rounded-2xl">
                          <Icons.Project className="w-6 h-6 text-indigo-400" />
                       </div>
                       <div className="text-right">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border border-white/10 ${
                            proj.priority === 'High' ? 'text-rose-500 border-rose-500/20' : 'text-slate-500'
                          }`}>{proj.priority} Priority</span>
                          <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-tighter">{proj.status}</p>
                       </div>
                    </div>
                    <h4 className="text-xl font-black text-white mb-6 group-hover:text-indigo-400 transition-colors">{proj.name}</h4>
                    <div className="space-y-3 mb-8">
                       <div className="flex justify-between text-xs font-black text-slate-500 uppercase">
                          <span>Deployment Progress</span>
                          <span className="text-indigo-400 font-mono">{proj.progress}%</span>
                       </div>
                       <div className="h-2.5 bg-slate-900 rounded-full p-0.5 border border-white/5">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.4)]" style={{ width: `${proj.progress}%` }} />
                       </div>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex -space-x-3">
                          {proj.team.map((a, i) => (
                            <img key={i} src={a} className="w-9 h-9 rounded-full border-4 border-[#020617] group-hover:translate-x-1 transition-transform" />
                          ))}
                          <div className="w-9 h-9 rounded-full border-4 border-[#020617] bg-white/5 flex items-center justify-center text-[10px] font-black text-slate-400">+2</div>
                       </div>
                       <button className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"><Icons.External className="w-5 h-5" /></button>
                    </div>
                 </div>
               ))}
            </div>

          </div>
        </div>
      </main>

      {/* Floating AI Panel Toggle */}
      {!chatOpen && (
        <button 
          onClick={() => setChatOpen(true)}
          className="fixed bottom-12 right-12 w-2