"use client";

import React from 'react';

const SettingsPanel = () => {
  return (
    <aside className="w-80 glass flex flex-col p-6 gap-8 overflow-y-auto shrink-0 border-l border-white/5">
      {/* CTA Configuration */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between pl-1">
          <h3 className="text-[10px] font-bold text-[#444] uppercase tracking-widest font-display">Configurar CTA</h3>
          <span className="text-[8px] text-accent-cyan cursor-pointer hover:underline">Edit</span>
        </div>

        <div className="flex flex-col gap-2">
            <button className="flex items-center justify-between p-4 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 group">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_var(--accent-cyan)]" />
                    <span className="text-xs font-bold text-white">Segue para mais</span>
                </div>
                <span className="text-xs">✓</span>
            </button>
            <button className="flex items-center justify-between p-4 rounded-xl bg-white/2 border border-white/5 hover:border-white/20 transition-all group">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#222] group-hover:bg-[#444] transition-colors" />
                    <span className="text-xs font-bold text-[#444] group-hover:text-[#888]">Comenta aqui</span>
                </div>
            </button>
            <button className="flex items-center justify-between p-4 rounded-xl bg-white/2 border border-white/5 hover:border-white/20 transition-all group">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#222] group-hover:bg-[#444] transition-colors" />
                    <span className="text-xs font-bold text-[#444] group-hover:text-[#888]">Link na bio</span>
                </div>
            </button>
        </div>

        <div className="flex flex-col gap-2 mt-2">
            <span className="text-[8px] font-bold text-[#444] uppercase pl-1">Texto Personalizado</span>
            <textarea
                className="w-full h-24 bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-[#888] focus:border-accent-cyan/30 focus:outline-none transition-all resize-none"
                placeholder="Insira sua frase aqui..."
            />
        </div>
      </section>

      {/* Export Section */}
      <section className="mt-auto flex flex-col gap-4">
         <h3 className="text-[10px] font-bold text-[#444] uppercase tracking-widest pl-1">Exportar para Kwai</h3>
         <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs opacity-50">📐</span>
                    <span className="text-[10px] font-bold text-[#888]">1080x1920</span>
                </div>
                <span className="text-[10px] text-accent-cyan">✓</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs opacity-50">⚡</span>
                    <span className="text-[10px] font-bold text-[#888]">Bitrate Otimizado</span>
                </div>
                <span className="text-[10px] text-accent-cyan">✓</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs opacity-50">🛡️</span>
                    <span className="text-[10px] font-bold text-[#888]">Codec H.264</span>
                </div>
                <span className="text-[10px] text-accent-cyan">✓</span>
            </div>
         </div>

         <button className="w-full bg-gradient-to-r from-accent-orange to-[#ea580c] text-white py-5 rounded-xl text-sm font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(234,88,12,0.3)] hover:scale-[1.02] transition-all">
            RENDERIZAR
         </button>
      </section>
    </aside>
  );
};

export default SettingsPanel;
