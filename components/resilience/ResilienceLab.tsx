import React, { useState, useMemo, useCallback } from 'react';
import { 
  Filter, Activity, AlertTriangle, ShieldAlert, Check, 
  Database, BarChart3 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { Card } from '../ui/Shared';

// --- Types ---
interface Node {
  id: string;
  x: number;
  y: number;
  type: 'core' | 'satellite';
}

interface Link {
  s: string;
  t: string;
}

interface ComplexTrafficNetworkProps {
  density: number;
  risk: number;
}

// --- Traffic Network Component ---
const ComplexTrafficNetwork: React.FC<ComplexTrafficNetworkProps> = ({ density, risk }) => {
  const { nodes, links } = useMemo(() => {
    const n: Node[] = [];
    const l: Link[] = [];
    
    // Grid generation centered at 100, 50 (ViewBox: 0 0 200 100)
    const cols = 5;
    const rows = 2;
    const spacingX = 25;
    const spacingY = 30;
    const startX = 50;
    const startY = 35;

    for(let x=0; x<cols; x++) {
      for(let y=0; y<rows; y++) {
        const id = `c-${x}-${y}`;
        const px = startX + x*spacingX;
        const py = startY + y*spacingY;
        n.push({ id, x: px, y: py, type: 'core' });
        
        if (x > 0) l.push({ s: `c-${x-1}-${y}`, t: id });
        if (y > 0) l.push({ s: `c-${x}-${y-1}`, t: id });
      }
    }

    // Satellites
    const satellites = 8;
    const radiusX = 80;
    const radiusY = 45;
    const centerX = 100;
    const centerY = 50;

    for(let i=0; i<satellites; i++) {
      const angle = (i / satellites) * Math.PI * 2;
      const sx = centerX + Math.cos(angle) * radiusX;
      const sy = centerY + Math.sin(angle) * radiusY;
      const id = `s-${i}`;
      n.push({ id, x: sx, y: sy, type: 'satellite' });
      
      const target = (sy < 50) ? 'c-2-0' : 'c-2-1';
      l.push({ s: target, t: id });
    }

    return { nodes: n, links: l };
  }, []);

  const getNodeStatus = useCallback((node: Node) => {
    if (risk < 20) return 'safe'; 
    
    const sourceId = 'c-2-0';
    if (node.id === sourceId) return 'source';

    const sourceX = 100;
    const sourceY = 35;
    
    const dx = node.x - sourceX; 
    const dy = node.y - sourceY;
    const dist = Math.sqrt(dx*dx + dy*dy);

    const spreadRadius = (density / 100) * 120; 
    
    if (dist < spreadRadius) return 'jammed';
    return 'safe';
  }, [density, risk]);

  return (
    <div className="w-full h-full bg-slate-50 relative overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="glow-source">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {links.map((link, i) => {
          const sNode = nodes.find(n => n.id === link.s);
          const tNode = nodes.find(n => n.id === link.t);
          if(!sNode || !tNode) return null;
          const sStatus = getNodeStatus(sNode);
          const tStatus = getNodeStatus(tNode);
          const isAffected = sStatus !== 'safe' || tStatus !== 'safe';
          
          return (
            <line 
              key={i} x1={sNode.x} y1={sNode.y} x2={tNode.x} y2={tNode.y}
              stroke={isAffected ? '#fca5a5' : '#e2e8f0'} 
              strokeWidth={isAffected ? 1.5 : 0.8}
              strokeOpacity={isAffected ? 1 : 0.6}
              style={{ transition: "all 0.3s" }}
            />
          );
        })}
        {nodes.map((node) => {
          const status = getNodeStatus(node);
          let fill = '#10b981'; 
          if (status === 'source') fill = '#e11d48'; 
          if (status === 'jammed') fill = '#f59e0b'; 
          
          return (
            <g key={node.id}>
              {status === 'source' && (
                 <circle cx={node.x} cy={node.y} r={8} fill="#f43f5e" fillOpacity="0.2" className="animate-pulse" />
              )}
              <circle 
                cx={node.x} cy={node.y} r={status === 'source' ? 3 : 2}
                fill={fill}
                stroke="#fff" strokeWidth="0.5"
                filter={status === 'source' ? 'url(#glow-source)' : ''}
                className="transition-all duration-300 ease-out"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// --- Main Lab Component ---
export const ResilienceLab: React.FC = () => {
  const [density, setDensity] = useState(60); 
  const [risk, setRisk] = useState(30); 

  const stats = useMemo(() => {
    const d = density / 100;
    const r = risk / 100;
    const baseLoad = d;
    const riskMultiplier = 1 + (r * 3 * (d > 0.6 ? d : 0.5)); 
    const totalStress = baseLoad * riskMultiplier;
    let efficiency = 1.0 / (1 + Math.pow(totalStress, 4));
    efficiency = Math.max(0.1, Math.min(1.0, efficiency));
    
    const chartData = Array.from({length: 10}, (_, i) => {
      if (i < 3) return { name: `T${i}`, base: 1.0, curr: 1.0 };
      const recoverySpeed = 0.05 * (1 - d); 
      const recoveredVal = efficiency + (i-3) * Math.max(0, recoverySpeed);
      return { 
        name: `T${i}`, 
        base: 1.0, 
        curr: parseFloat(Math.min(1.0, recoveredVal).toFixed(3))
      };
    });
    return { efficiency, chartData };
  }, [density, risk]);

  return (
    <div className="grid lg:grid-cols-12 gap-6 lg:h-[600px]">
      {/* Configuration & Status */}
      <div className="lg:col-span-4 flex flex-col gap-6 h-full">
        <Card className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Filter size={20} className="text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">实验边界条件</h4>
                <div className="text-[10px] text-slate-400 font-mono">Sim-Environment Config</div>
              </div>
            </div>
            
            <div className="space-y-10">
              <div className="relative">
                <div className="flex justify-between text-sm font-semibold text-slate-600 mb-4">
                  <span className="flex items-center gap-2"><Activity size={14} /> 车流密度 (Density)</span>
                  <span className={`px-2 py-1 rounded text-xs font-mono ${density > 80 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                    {density} veh/km
                  </span>
                </div>
                <input 
                  type="range" min="0" max="100" value={density} 
                  onChange={e => setDensity(Number(e.target.value))} 
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-all" 
                />
                <div className="flex justify-between mt-2 text-[10px] font-medium text-slate-400">
                  <span>自由流 (Free)</span>
                  <span>完全堵死 (Gridlock)</span>
                </div>
              </div>

              <div className="relative">
                <div className="flex justify-between text-sm font-semibold text-slate-600 mb-4">
                  <span className="flex items-center gap-2"><AlertTriangle size={14} /> 预测风险 (Risk Prob)</span>
                  <span className={`px-2 py-1 rounded text-xs font-mono ${risk > 50 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                    {risk}%
                  </span>
                </div>
                <input 
                  type="range" min="0" max="100" value={risk} 
                  onChange={e => setRisk(Number(e.target.value))} 
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500 hover:accent-rose-400 transition-all" 
                />
                <div className="flex justify-between mt-2 text-[10px] font-medium text-slate-400">
                  <span>安全 (Safe)</span>
                  <span>高危 (Critical)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
             <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">系统状态 (Status)</span>
               {stats.efficiency < 0.5 ? (
                 <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 animate-pulse">
                   <ShieldAlert size={12} /> 高危警报
                 </span>
               ) : (
                 <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                   <Check size={12} /> 运行平稳
                 </span>
               )}
             </div>
             <div className="flex items-end gap-2">
               <span className={`text-4xl font-mono font-bold tracking-tighter ${stats.efficiency < 0.6 ? 'text-rose-600' : 'text-emerald-600'}`}>
                 {(stats.efficiency * 100).toFixed(1)}
               </span>
               <span className="text-sm font-bold text-slate-400 mb-1">%</span>
               <span className="text-xs text-slate-400 mb-1 ml-auto">路网运行效率 (RNER)</span>
             </div>
          </div>
        </Card>
      </div>

      {/* Visualizations */}
      <div className="lg:col-span-8 flex flex-col gap-6 h-full">
        <Card className="h-[320px] p-0 relative border-slate-200 overflow-hidden group">
          <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10 bg-gradient-to-b from-white/90 to-transparent pointer-events-none">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Database size={16} className="text-indigo-600" />
                级联失效拓扑监控
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Real-time Topology Cascade Monitor</p>
            </div>
            <div className="flex gap-2">
               <span className="px-2 py-1 bg-white/80 backdrop-blur rounded border border-slate-100 text-[10px] font-mono text-slate-500 shadow-sm">
                 网格 + 放射状 (Grid+Radial)
               </span>
            </div>
          </div>
          
          <ComplexTrafficNetwork density={density} risk={risk} />
          
          <div className="absolute bottom-3 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-2 z-10">
            <div className="flex items-center gap-4 text-[10px] text-slate-600">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]" /> 畅通</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_4px_#f59e0b]" /> 拥堵</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_4px_#f43f5e]" /> 事故源</span>
            </div>
          </div>
        </Card>
        
        <Card className="flex-1 p-0 relative border-slate-200 min-h-[220px]">
          <div className="absolute top-4 left-6 z-10">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 size={16} className="text-indigo-600" />
              系统动力学响应曲线
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Efficiency (RNER) over Time</p>
          </div>
          
          <div className="w-full h-full pt-16 pr-6 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorRner" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={stats.efficiency < 0.6 ? "#f43f5e" : "#6366f1"} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={stats.efficiency < 0.6 ? "#f43f5e" : "#6366f1"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:10, fill:'#94a3b8'}} />
                <YAxis domain={[0, 1.1]} axisLine={false} tickLine={false} tick={{fontSize:10, fill:'#94a3b8'}} />
                <Tooltip 
                  contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}
                  itemStyle={{fontSize:'12px', fontWeight:600}}
                />
                <ReferenceLine x="T3" stroke="#94a3b8" strokeDasharray="3 3" label={{value:'冲击时刻', fill:'#94a3b8', fontSize:10, position:'insideTopRight'}} />
                <Area 
                  type="monotone" 
                  dataKey="base" 
                  stroke="#cbd5e1" 
                  strokeWidth={2} 
                  strokeDasharray="4 4" 
                  fill="transparent" 
                  name="基准线"
                />
                <Area 
                  type="monotone" 
                  dataKey="curr" 
                  stroke={stats.efficiency < 0.6 ? "#f43f5e" : "#6366f1"} 
                  strokeWidth={3} 
                  fill="url(#colorRner)" 
                  animationDuration={300}
                  name="当前 RNER"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};