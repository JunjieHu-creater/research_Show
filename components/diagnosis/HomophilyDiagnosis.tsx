import React, { useState } from 'react';
import { Microscope, PlayCircle, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { Card, Tag } from '../ui/Shared';

interface TopologyNodeProps {
  type: 'flow' | 'accident';
  label: string;
  description: string;
  step: number;
}

const TopologyNode: React.FC<TopologyNodeProps> = ({ type, label, description, step }) => {
  const isHomophilic = type === 'flow';
  const centerColor = 'bg-rose-500';
  const neighborColor = isHomophilic ? 'bg-rose-400' : 'bg-emerald-400';
  const finalColor = isHomophilic ? '#f43f5e' : '#cbd5e1';
  const finalOpacity = isHomophilic ? 1 : 0.5;

  return (
    <div className="relative flex flex-col w-full h-80 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden group shadow-inner">
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <Tag text={label} type={isHomophilic ? 'success' : 'danger'} />
        <div className="text-[10px] text-slate-400 font-mono bg-white/80 px-2 py-1 rounded border border-slate-100">
          EAI: {isHomophilic ? '0.85 (高)' : '0.15 (低)'}
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#64748b_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Connection Lines */}
        {[0, 120, 240].map((deg, i) => (
          <div 
            key={i} 
            className="absolute w-32 h-0.5 bg-slate-300 origin-left left-1/2 top-1/2" 
            style={{ transform: `rotate(${deg}deg) translate(0, -50%)` }} 
          />
        ))}

        {/* Neighbor Nodes */}
        {[0, 120, 240].map((deg, i) => (
          <div
            key={i}
            className={`absolute w-12 h-12 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-white z-10 transition-all duration-[2000ms] ease-in-out ${neighborColor}`}
            style={{
              transform: step === 1
                ? `rotate(${deg}deg) translate(20px) rotate(-${deg}deg) scale(0.5) opacity(0.5)`
                : `rotate(${deg}deg) translate(90px) rotate(-${deg}deg) scale(1) opacity(1)`
            }}
          >
            {isHomophilic ? '拥堵' : '畅通'}
          </div>
        ))}

        {/* Aggregation Effect */}
        {step === 1 && [0, 120, 240].map((deg, i) => (
          <div key={i}
            className={`absolute w-3 h-3 rounded-full z-20 animate-ping ${neighborColor}`}
            style={{ top: '50%', left: '50%', transform: `rotate(${deg}deg) translate(40px)` }}
          />
        ))}

        {/* Center Node */}
        <div
          className={`relative w-24 h-24 rounded-full border-4 border-white shadow-xl flex flex-col items-center justify-center z-30 transition-all duration-1000 ${centerColor}`}
          style={{
            backgroundColor: step === 2 ? finalColor : undefined,
            opacity: step === 2 ? finalOpacity : 1,
            transform: step === 1 ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          <span className="text-xs font-bold text-white drop-shadow-md text-center px-1">
            {step === 2
              ? (isHomophilic ? '信号保持' : '信号丢失')
              : (isHomophilic ? '常态拥堵' : '突发事故')
            }
          </span>
          {step === 2 && (
            <div className={`absolute -bottom-8 px-2 py-1 rounded text-[10px] font-bold text-white whitespace-nowrap ${isHomophilic ? 'bg-emerald-500' : 'bg-rose-500'}`}>
              {isHomophilic ? '预测准确' : '预测失效'}
            </div>
          )}
        </div>
      </div>
      <div className="p-4 bg-white border-t border-slate-100">
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong className="text-slate-800">机制解析：</strong> {description}
        </p>
      </div>
    </div>
  );
};

export const HomophilyDiagnosisDemo: React.FC = () => {
  const [isAggregating, setIsAggregating] = useState(false);
  const [step, setStep] = useState(0);

  const runSimulation = () => {
    if (isAggregating) return;
    setIsAggregating(true);
    setStep(1);
    setTimeout(() => {
      setStep(2);
      setIsAggregating(false);
    }, 2000);
  };

  const reset = () => {
    setStep(0);
    setIsAggregating(false);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 h-full">
      <div className="lg:col-span-4 flex flex-col justify-center space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Microscope className="text-indigo-600" />
            微观信号卷积实验
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            为什么 GNN 在事故预测中会失效？<br />
            本实验模拟了图卷积层（Graph Conv）在不同同配性环境下的<strong>信息聚合过程</strong>。
          </p>
        </div>
        <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4">
          <div className="flex items-center justify-between text-sm font-bold text-slate-700">
            <span>实验控制器</span>
            <span className={`text-xs px-2 py-1 rounded ${step === 0 ? 'bg-slate-200' : step === 1 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {step === 0 ? '就绪' : step === 1 ? '聚合中...' : '已完成'}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={runSimulation}
              disabled={isAggregating || step === 2}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:shadow-none"
            >
              <PlayCircle size={18} /> 执行图卷积
            </button>
            <button
              onClick={reset}
              disabled={step === 0}
              className="px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-all disabled:opacity-50"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-2">
          <div className="flex gap-2">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            <span><strong>同配环境：</strong> 邻居与中心状态一致，聚合增强了特征信号。</span>
          </div>
          <div className="flex gap-2">
            <XCircle size={14} className="text-rose-500 shrink-0" />
            <span><strong>异配环境：</strong> 邻居的大量“安全”信号稀释了中心的“事故”信号，导致模型漏报（性能陷阱）。</span>
          </div>
        </div>
      </div>
      <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
        <TopologyNode
          type="flow"
          label="场景 A: 交通流 (同配)"
          description="邻居节点同样处于拥堵状态。聚合后，中心的拥堵信号被强化，GNN 能够准确捕捉模式。"
          step={step}
        />
        <TopologyNode
          type="accident"
          label="场景 B: 突发事故 (异配)"
          description="事故是孤立的。邻居节点处于畅通状态。聚合后，事故信号被平均化，特征消失。"
          step={step}
        />
      </div>
    </div>
  );
};