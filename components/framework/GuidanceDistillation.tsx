import React, { useState, useMemo } from 'react';
import { Layers, ArrowRight, Sliders, Filter, Cpu } from 'lucide-react';
import { Card } from '../ui/Shared';

export const GuidanceDistillationDemo: React.FC = () => {
  const [strength, setStrength] = useState(30);
  
  const particles = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    type: i % 3 === 0 ? 'structure' : 'noise',
    delay: i * 0.3
  })), []);

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-center h-full">
      {/* Teacher Model */}
      <div className="lg:col-span-3 h-full">
        <Card className="items-center justify-center bg-slate-50 border-dashed border-2 border-slate-300">
          <div className="p-4 bg-white rounded-full shadow-sm mb-4">
            <Layers className="text-indigo-600" size={32} />
          </div>
          <h4 className="font-bold text-slate-800">异构教师模型群</h4>
          <p className="text-xs text-slate-500 text-center mt-2 px-4">
            针对源城市训练的特异性 GNN。<br />包含 <span className="text-amber-500 font-bold">有效结构</span> 与 <span className="text-slate-400 font-bold">环境噪声</span>。
          </p>
          <div className="mt-8 relative w-full h-12 flex justify-end items-center">
            <div className="w-4 h-4 rounded-full bg-slate-300 animate-pulse mr-4" />
            <ArrowRight className="text-slate-300 absolute right-0 translate-x-1/2" />
          </div>
        </Card>
      </div>

      {/* Filter / Distillation Process */}
      <div className="lg:col-span-6 h-full flex flex-col">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex items-center gap-4 z-20">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm min-w-max">
            <Sliders size={16} /> 同配性引导强度 (Guidance)
          </div>
          <input
            type="range" min="0" max="100" step="10" value={strength}
            onChange={(e) => setStrength(Number(e.target.value))}
            className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="font-mono text-sm font-bold text-indigo-600 w-12 text-right">{strength}%</div>
        </div>
        
        <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-30 bg-[linear-gradient(90deg,transparent_0%,#cbd5e1_50%,transparent_100%)] animate-[pulse_3s_infinite]" />
          
          <div className="absolute inset-0 overflow-hidden">
            {particles.map(p => {
              const isBlocked = p.type === 'noise' && (Math.random() * 100 < strength);
              return (
                <div
                  key={p.id}
                  className={`absolute top-1/2 w-2 h-2 rounded-full shadow-sm transition-opacity duration-300`}
                  style={{
                    backgroundColor: p.type === 'structure' ? '#f59e0b' : '#94a3b8',
                    marginTop: `${(p.id % 5 - 2) * 15}px`,
                    left: '-10%',
                    opacity: 0,
                    animation: `flow 4s linear infinite`,
                    animationDelay: `${p.delay}s`,
                    // Using CSS variables for animation end state
                  } as React.CSSProperties & { '--end-opacity': number, '--end-pos': string }}
                >
                  {/* Inline styles for keyframe dynamic values are tricky in React, 
                      so we use the style block below for the keyframe definition */}
                  <style dangerouslySetInnerHTML={{__html: `
                    @keyframes flow {
                      0% { left: -10%; opacity: 0; }
                      10% { opacity: 1; }
                      45% { left: 45%; opacity: 1; }
                      50% { left: 50%; opacity: ${isBlocked ? 0 : 1}; }
                      100% { left: ${isBlocked ? '50%' : '110%'}; opacity: 0; }
                    }
                  `}} />
                </div>
              );
            })}
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div
              className="w-16 h-32 border-x-4 border-indigo-500/20 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-300"
              style={{
                borderColor: `rgba(99, 102, 241, ${strength / 100})`,
                boxShadow: `0 0 ${strength}px rgba(99, 102, 241, 0.2)`
              }}
            >
              <Filter className="text-indigo-600 transition-all duration-300" size={24} style={{ opacity: 0.2 + strength / 100 * 0.8 }} />
            </div>
            <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-indigo-500">
              EAI 滤波器
            </div>
          </div>
        </div>
      </div>

      {/* Student Model */}
      <div className="lg:col-span-3 h-full">
        <Card className="items-center justify-center bg-white border-2 border-emerald-500/10">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-emerald-500" />
          <div className="p-4 bg-emerald-50 rounded-full shadow-sm mb-4">
            <Cpu className="text-emerald-600" size={32} />
          </div>
          <h4 className="font-bold text-slate-800">通用学生模型</h4>
          <p className="text-xs text-slate-500 text-center mt-2 px-4">
            零样本泛化 (ZSL) 就绪。<br />
            知识纯净度: <span className={`font-bold ${strength > 70 ? 'text-emerald-500' : 'text-slate-400'}`}>{Math.min(100, 30 + strength * 0.7).toFixed(0)}%</span>
          </p>
        </Card>
      </div>
    </div>
  );
};