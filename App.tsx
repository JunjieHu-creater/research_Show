import React from 'react';
import { Share2 } from 'lucide-react';
import { Section, FadeIn, Tag } from './components/ui/Shared';
import { HomophilyDiagnosisDemo } from './components/diagnosis/HomophilyDiagnosis';
import { GuidanceDistillationDemo } from './components/framework/GuidanceDistillation';
import { ResilienceLab } from './components/resilience/ResilienceLab';

export default function App() {
  return (
    <div className="bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-slate-800">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">HG</div>
            <span>Knowledge Distillation Lab</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
            <a href="#diagnosis" className="hover:text-indigo-600 transition-colors">同配性诊断</a>
            <a href="#framework" className="hover:text-indigo-600 transition-colors">HG-KD 框架</a>
            <a href="#simulation" className="hover:text-indigo-600 transition-colors">韧性推演</a>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg">
            <Share2 size={14} /> 导出成果报告
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <Section className="pt-32 pb-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <Tag text="Transportation Research Part C: Emerging Technologies" type="primary" />
            <h1 className="text-4xl md:text-6xl font-extrabold mt-8 mb-6 text-slate-900 tracking-tight leading-tight">
              同配性引导下的<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">路网事故预测与韧性重塑</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
              突破图神经网络的“同配性悖论”。
              <br/>
              基于同配性引导知识蒸馏 (HG-KD) 实现跨城市零样本学习。
            </p>
          </FadeIn>
        </div>
      </Section>

      {/* Diagnosis Section */}
      <Section id="diagnosis" className="bg-slate-50">
        <div className="max-w-6xl mx-auto w-full">
          <FadeIn>
            <div className="mb-12 md:text-center max-w-3xl mx-auto">
              <Tag text="Problem Diagnosis" type="danger" />
              <h2 className="text-3xl font-bold mt-4 mb-4 text-slate-900">事故同配性多尺度诊断</h2>
              <p className="text-slate-500">
                通过下方的<span className="font-bold text-slate-900">“微观信号卷积实验”</span>，
                对比 GNN 在不同同配性环境下的聚合表现。揭示低同配性如何导致事故信号的<span className="text-rose-500 font-bold">灾难性稀释</span>。
              </p>
            </div>
            <HomophilyDiagnosisDemo />
          </FadeIn>
        </div>
      </Section>

      {/* Framework Section */}
      <Section id="framework" className="bg-white">
        <div className="max-w-6xl mx-auto w-full">
          <FadeIn>
            <div className="mb-12 md:text-center max-w-2xl mx-auto">
              <Tag text="The Solution" type="warning" />
              <h2 className="text-3xl font-bold mt-4 mb-4 text-slate-900">HG-KD: 同配性引导蒸馏</h2>
              <p className="text-slate-500">
                知识迁移的核心在于“去噪”。
                通过<span className="font-bold text-indigo-600">同配性引导强度</span>控制器，
                动态过滤异构教师中的异配噪声，仅保留高价值的结构化知识。
              </p>
            </div>
            <div className="h-[400px]">
              <GuidanceDistillationDemo />
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* Resilience Section */}
      <Section id="simulation" className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto w-full">
          <FadeIn>
            <div className="mb-12">
              <Tag text="Impact Assessment" type="success" />
              <h2 className="text-3xl font-bold mt-4 mb-4 text-slate-900">路网韧性动力学推演</h2>
              <p className="text-slate-500 max-w-3xl leading-relaxed">
                基于<span className="font-bold text-slate-900">复杂路网级联失效</span>模型。
                拖动滑块，观察红色的“拥堵波”如何随密度增加而扩散，以及其对系统效率曲线的非线性冲击。
              </p>
            </div>
            <ResilienceLab />
          </FadeIn>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 text-center">
        <p className="text-slate-400 text-sm">© 2025 知识蒸馏研究组 (Knowledge Distillation Research Group).</p>
      </footer>
    </div>
  );
}