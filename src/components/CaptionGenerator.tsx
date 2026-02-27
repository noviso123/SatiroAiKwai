"use client";

import { useState } from "react";

export const CaptionGenerator = () => {
  const [captions] = useState([
    { id: 1, text: "O SEGREDO DO KWAI...", time: "00:01", highlight: true },
    { id: 2, text: "Muitos editores não sabem disso.", time: "00:04", highlight: false },
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[#666] uppercase">Legendas AI</h3>
        <button className="text-[10px] bg-accent/20 text-accent px-2 py-1 rounded-md font-bold hover:bg-accent/30 transition-all">
          + Novo Bloco
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {captions.map((cap) => (
          <div key={cap.id} className="premium-card p-3 flex flex-col gap-2 group relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-accent">{cap.time}</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="sr-only">Destaque</span>
                <input
                  type="checkbox"
                  checked={cap.highlight}
                  onChange={() => {}}
                  className="w-4 h-4 accent-accent"
                />
              </label>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`cap-${cap.id}`} className="sr-only">Texto da Legenda</label>
              <textarea
                id={`cap-${cap.id}`}
                className="bg-transparent border-none text-sm resize-none focus:ring-0 p-0 text-[#ccc] min-h-[44px]"
                rows={2}
                value={cap.text}
                onChange={() => {}}
              />
            </div>
            {cap.highlight && (
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-full shadow-[0_0_10px_var(--accent-glow)]"></div>
            )}
          </div>
        ))}
      </div>

      <button className="w-full py-3 glass text-xs font-bold hover:bg-white/5 transition-all mt-2">
        Sincronizar com Áudio
      </button>
    </div>
  );
};
