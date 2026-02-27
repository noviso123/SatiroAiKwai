"use client";

import React from 'react';

const formatTime = (frames: number, fps: number) => {
  const seconds = Math.floor(frames / fps);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const EditorTimeline = ({ durationInFrames = 0, fps = 30, isProcessing = false }) => {
  const currentTime = formatTime(0, fps); // placeholder for current playhead
  const totalTime = formatTime(durationInFrames, fps);

  return (
    <div className="h-64 glass flex flex-col p-6 gap-4 shrink-0 overflow-hidden border-t border-white/5">
      <div className="flex items-center justify-between shrink-0">
         <div className="flex items-center gap-4">
             <span className="text-xs font-black text-[#555] uppercase tracking-widest">Painel de Edição</span>
             <div className="flex gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-accent-cyan animate-pulse' : 'bg-green-500'}`} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#222]" />
             </div>
         </div>
         <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-[#444]">{currentTime} / {durationInFrames > 0 ? totalTime : "--:--"}</span>
            <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/5 transition-all text-xs">✂️</button>
                <button className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/5 transition-all text-xs">🔍</button>
            </div>
         </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
        {/* Track: Video */}
        <div className="flex gap-4 items-center">
            <span className="w-16 text-[8px] font-bold text-[#444] uppercase tracking-wider">Vídeo</span>
            <div className="flex-1 h-12 bg-black/40 rounded-lg relative border border-white/5 flex gap-1 p-1 overflow-hidden">
                {durationInFrames > 0 ? (
                    <div className="h-full w-full bg-accent-cyan/5 border border-accent-cyan/10 rounded-md flex items-center px-3 gap-2">
                        <div className="w-4 h-4 rounded bg-accent-cyan/20" />
                        <span className="text-[8px] font-bold text-accent-cyan uppercase">Media carregada</span>
                    </div>
                ) : (
                    <div className="h-full w-full flex items-center justify-center opacity-10">
                        <span className="text-[8px] font-bold uppercase">Nenhum sinal</span>
                    </div>
                )}
            </div>
        </div>

        {/* Track: Legenda */}
        <div className="flex gap-4 items-center">
            <span className="w-16 text-[8px] font-bold text-[#444] uppercase tracking-wider">Legenda</span>
            <div className="flex-1 h-10 bg-black/40 rounded-lg relative border border-white/5 flex gap-2 p-1 overflow-hidden">
                {isProcessing && (
                    <div className="h-full w-32 bg-orange-500/10 border border-orange-500/30 rounded flex items-center justify-center animate-pulse">
                        <span className="text-[7px] font-bold text-orange-500 uppercase">Processando...</span>
                    </div>
                )}
            </div>
        </div>

        {/* Track: SFX */}
        <div className="flex gap-4 items-center">
            <span className="w-16 text-[8px] font-bold text-[#444] uppercase tracking-wider">Audio / SFX</span>
            <div className="flex-1 h-10 bg-black/40 rounded-lg relative border border-white/5 flex items-center p-1 overflow-hidden">
                {isProcessing ? (
                     <div className="h-full w-full bg-gradient-to-r from-transparent via-accent-cyan/5 to-transparent flex items-center gap-[1px] px-8">
                        {Array.from({length: 40}).map((_, i) => (
                            <div key={i} className="w-[1px] bg-accent-cyan/20 animate-pulse" style={{height: `${Math.random() * 80 + 10}%`}} />
                        ))}
                    </div>
                ) : (
                    <div className="h-full w-full flex items-center justify-center opacity-10">
                        <span className="text-[7px] font-bold uppercase tracking-widest">Silêncio</span>
                    </div>
                )}
            </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #111;
        }
      `}</style>
    </div>
  );
};

export default EditorTimeline;
