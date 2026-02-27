"use client";

import React from 'react';

const ToolSidebar = () => {
  const [smoothing, setSmoothing] = React.useState(45);
  const [blur, setBlur] = React.useState(12);

  return (
    <aside className="w-64 glass flex flex-col p-6 gap-8 overflow-y-auto shrink-0 border-r border-white/5">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black font-display tracking-tightest leading-none">SATIRO<span className="text-accent-cyan">.AI</span></h1>
        <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
            <span className="text-[8px] font-black uppercase text-[#444] tracking-[0.2em]">Kwai Strategic Suite</span>
        </div>
      </div>

      <nav className="flex flex-col gap-8">
        {/* Uploads Section */}
        <section className="flex flex-col gap-3">
          <h3 className="text-[10px] font-bold text-[#444] uppercase tracking-widest pl-1">Arquivos</h3>
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 transition-all group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-sm">🎬</span>
              <span className="text-xs font-bold text-[#888] group-hover:text-white transition-colors">Vídeo Principal</span>
            </button>
            <button className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 transition-all group">
              <span className="text-sm">🎙️</span>
              <span className="text-xs font-bold text-[#888] group-hover:text-white transition-colors">Voz / Áudio</span>
            </button>
            <button className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 transition-all group">
              <span className="text-sm">🎵</span>
              <span className="text-xs font-bold text-[#888] group-hover:text-white transition-colors">Música BG</span>
            </button>
          </div>
        </section>

        {/* AI Background Section */}
        <section className="flex flex-col gap-3">
           <div className="flex items-center justify-between pl-1">
             <h3 className="text-[10px] font-bold text-[#444] uppercase tracking-widest">IA Remover</h3>
             <span className="w-4 h-4 rounded-full bg-accent-cyan/20 border border-accent-cyan/40 text-[8px] flex items-center justify-center text-accent-cyan cursor-pointer">?</span>
           </div>
           <div className="grid grid-cols-2 gap-2">
              <button className="p-3 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 flex flex-col items-center gap-1 group">
                 <span className="text-xs">✂️</span>
                 <span className="text-[8px] font-bold text-accent-cyan uppercase">Recorte</span>
              </button>
              <button className="p-3 rounded-xl bg-white/2 border border-white/5 hover:border-white/20 flex flex-col items-center gap-1 group">
                 <span className="text-xs">🎥</span>
                 <span className="text-[8px] font-bold text-[#444] group-hover:text-[#888] uppercase">Animado</span>
              </button>
           </div>

           <div className="flex flex-col gap-4 mt-2 px-1">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <span className="text-[8px] font-bold text-[#444] uppercase">Suavização</span>
                    <span className="text-[8px] text-accent-cyan font-mono">{smoothing}%</span>
                </div>
                <input
                    type="range" min="0" max="100" value={smoothing}
                    onChange={(e) => setSmoothing(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-accent-cyan"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <span className="text-[8px] font-bold text-[#444] uppercase">Desfoque</span>
                    <span className="text-[8px] text-accent-cyan font-mono">{blur}%</span>
                </div>
                <input
                    type="range" min="0" max="100" value={blur}
                    onChange={(e) => setBlur(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-accent-cyan"
                />
              </div>
           </div>
        </section>
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-4">
          <div className="premium-card p-4 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
              <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest mb-1">PRO TIP</p>
              <p className="text-[10px] text-[#666] leading-relaxed">Vídeos com legenda amarela na primeira frase aumentam o CTR em 22%.</p>
          </div>
      </div>
    </aside>
  );
};

export default ToolSidebar;
