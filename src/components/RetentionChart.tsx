"use client";

import React, { useEffect, useState } from 'react';

const RetentionChart = ({ isProcessing = false }) => {
  const [data, setData] = useState({ hook: 0, dropoff: 0 });

  useEffect(() => {
    if (isProcessing) {
        const interval = setInterval(() => {
            setData({
                hook: Math.floor(Math.random() * 15 + 15),
                dropoff: Math.floor(Math.random() * 20 + 40)
            });
        }, 2000);
        return () => clearInterval(interval);
    }
  }, [isProcessing]);

  return (
    <div className="flex flex-col gap-3 p-4 glass bg-black/20 rounded-2xl border border-white/5 h-full min-h-[160px]">
      <div className="flex items-center justify-between">
         <h3 className="text-[10px] font-bold text-[#444] uppercase tracking-widest font-display">
            {isProcessing ? "Análise em Tempo Real" : "Métricas de Retenção"}
         </h3>
         <span className={`text-[8px] ${isProcessing ? 'text-accent-cyan animate-pulse' : 'text-[#222]'}`}>
            ● {isProcessing ? 'LIVE' : 'IDLE'}
         </span>
      </div>

      {!isProcessing ? (
        <div className="flex-1 flex items-center justify-center opacity-20 flex-col gap-2">
            <span className="text-xl">📊</span>
            <span className="text-[8px] font-bold uppercase tracking-widest">Aguardando vídeo...</span>
        </div>
      ) : (
        <>
            <div className="flex-1 min-h-[80px] relative animate-in fade-in duration-500">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M 0 35 Q 20 15 40 25 Q 60 35 80 15 Q 100 10 100 10 V 40 H 0 Z"
                        fill="url(#gradient)"
                    />
                    <path
                        d="M 0 35 Q 20 15 40 25 Q 60 35 80 15 Q 100 10 100 10"
                        fill="none"
                        stroke="var(--accent-cyan)"
                        strokeWidth="1"
                    />
                </svg>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <div className="flex flex-col">
                    <span className="text-[8px] uppercase text-[#444]">Hook Est.</span>
                    <span className="text-xs font-bold text-accent-cyan">{data.hook}%</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-[8px] uppercase text-[#444]">Drop-off</span>
                    <span className="text-xs font-bold text-orange-500">{data.dropoff}%</span>
                </div>
            </div>
        </>
      )}

      <style jsx>{`
        .text-accent-cyan { color: var(--accent-cyan); }
      `}</style>
    </div>
  );
};

export default RetentionChart;
