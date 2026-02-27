"use client";

import { useState } from "react";

interface InitialAnalysisProps {
  onPlanGenerated: (plan: string) => void;
}

export const InitialAnalysis = ({ onPlanGenerated }: InitialAnalysisProps) => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("30");

  const goals = [
    { id: "venda", label: "Venda Direta", icon: "💰" },
    { id: "entretenimento", label: "Entretenimento / Viral", icon: "🚀" },
    { id: "vlog", label: "Vlog Pessoal", icon: "🤳" },
  ];

  const handleFinish = () => {
    const plan = `Objetivo: ${goal}, Duração: ${duration}s. Foco em retenção nos primeiros 3s com legenda dinâmica.`;
    onPlanGenerated(plan);
  };

  return (
    <div className="flex flex-col gap-6">
      {step === 1 && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-bold">Qual o objetivo do vídeo?</h3>
          <div className="grid grid-cols-1 gap-3">
            {goals.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  setGoal(g.id);
                  setStep(2);
                }}
                className={`premium-card p-4 flex items-center gap-4 text-left transition-all ${
                  goal === g.id ? "border-accent bg-accent/5" : ""
                }`}
              >
                <span className="text-2xl">{g.icon}</span>
                <div>
                  <div className="font-bold">{g.label}</div>
                  <div className="text-xs text-[#666]">Otimizado para algoritmos Kwai</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-bold">Duração Ideal (Kwai)</h3>
          <div className="flex flex-col gap-6">
            <label className="flex flex-col gap-2">
              <span className="sr-only">Duração do vídeo em segundos</span>
              <input
                type="range"
                min="10"
                max="60"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full h-3 accent-accent cursor-pointer"
              />
            </label>
            <div className="flex justify-between text-xs font-bold text-[#888]">
              <span>10s</span>
              <span className="text-accent text-lg">{duration}s</span>
              <span>60s</span>
            </div>
            <p className="text-xs text-[#666] bg-white/5 p-3 rounded-md">
              💡 <b>Dica Satiro:</b> Vídeos entre 25-45s têm as maiores taxas de conclusão no Kwai.
            </p>
            <div className="flex gap-3">
               <button onClick={() => setStep(1)} className="flex-1 bg-white/5 p-3 rounded-lg text-sm font-bold">Voltar</button>
               <button onClick={handleFinish} className="flex-1 bg-accent p-3 rounded-lg text-sm font-bold glow-on-hover">Gerar Roteiro AI</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
