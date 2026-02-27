"use client";

import React, { useEffect, useState } from 'react';

const TopMetricsBar = () => {
  const [stats, setStats] = useState({ totalVideos: 0, retention: "0%", queueSize: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.success) {
          setStats({
            totalVideos: data.totalVideos,
            retention: data.retention,
            queueSize: data.queueSize
          });
        }
      } catch (e) {
        console.error("Failed to fetch stats", e);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-16 glass flex items-center justify-between px-6 gap-8 shrink-0 border-b border-white/5">
      <div className="flex items-center gap-8">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider">Videos Hoje</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-display">{stats.totalVideos}</span>
            <span className="text-[8px] text-accent-cyan font-bold">REAL</span>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-white/5" />

        <div className="flex flex-col">
          <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider">Retenção Média</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-display text-accent-cyan">{stats.retention}</span>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-white/5" />

        <div className="flex flex-col">
          <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider">Em Fila</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-display">{stats.queueSize}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="glass px-4 py-2 text-xs font-bold hover:bg-white/5 transition-all flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
          IA STUDIO
        </button>
        <button className="glass px-4 py-2 text-xs font-bold hover:bg-white/5 transition-all text-[#64748b] hover:text-white">Lote</button>
        <button className="bg-accent-cyan text-black px-6 py-2 rounded-lg text-xs font-black shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-105 transition-all">
          + NOVO VÍDEO
        </button>
      </div>

      <style jsx>{`
        .text-accent-cyan { color: var(--accent-cyan); }
      `}</style>
    </div>
  );
};

export default TopMetricsBar;
