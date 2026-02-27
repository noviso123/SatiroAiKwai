"use client";

import { useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";

interface AIResult {
  final_video: string;
  thumbnail: string;
}

const ReactEditor: NextPage = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [result, setResult] = useState<AIResult | null>(null);

  const startReactEdit = async () => {
    if (!videoFile || !bgFile) return;

    setIsProcessing(true);
    setStatus("Removendo fundo do vídeo e compondo com o print...");

    const formData = new FormData();
    formData.append("mode", "react");
    formData.append("video", videoFile);
    formData.append("image", bgFile);

    try {
      const response = await fetch("/api/automate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.result);
        setStatus("Vídeo estilo comentário gerado com sucesso!");
      } else {
        setStatus("Erro: " + data.error);
      }
    } catch (error) {
      console.error(error);
      setStatus("Erro na conexão com o servidor.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center p-8">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        <header className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
                <Link href="/" className="text-xs text-accent-cyan hover:underline mb-2 block font-bold tracking-widest">← VOLTAR AO DASHBOARD</Link>
                <h1 className="text-4xl font-black font-display tracking-tightest">React Style AI</h1>
                <p className="text-[#444] text-xs font-bold uppercase tracking-widest">Geração automática de vídeos estilo comentário</p>
            </div>
            <div className="glass px-4 py-2 rounded-full text-[10px] font-black text-accent-cyan tracking-[0.2em] border-accent-cyan/20">
                MODO REAÇÃO PRO
            </div>
        </header>

        {!result ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Step 1: BG Image */}
            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#666]">1. Print do Conteúdo (Background)</h3>
                <div className={`premium-card h-64 border-dashed border-2 ${bgFile ? 'border-accent' : 'border-[#222]'} flex flex-col items-center justify-center p-6 text-center transition-all`}>
                {bgFile ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-accent/20 flex items-center justify-center text-3xl">🖼️</div>
                        <span className="font-bold text-sm truncate max-w-[200px]">{bgFile.name}</span>
                        <button onClick={() => setBgFile(null)} className="text-[10px] text-[#444] hover:text-white underline">Trocar Print</button>
                    </div>
                ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-4 group">
                        <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-2xl group-hover:scale-110 transition-all">+</div>
                        <span className="text-xs font-bold text-[#444] group-hover:text-[#888]">Upload do Print/Screenshot</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => setBgFile(e.target.files?.[0] || null)} />
                    </label>
                )}
                </div>
            </div>

            {/* Step 2: FG Video */}
            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#666]">2. Seu Vídeo (Foreground)</h3>
                <div className={`premium-card h-64 border-dashed border-2 ${videoFile ? 'border-accent' : 'border-[#222]'} flex flex-col items-center justify-center p-6 text-center transition-all`}>
                {videoFile ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-accent/20 flex items-center justify-center text-3xl">🎬</div>
                        <span className="font-bold text-sm truncate max-w-[200px]">{videoFile.name}</span>
                        <button onClick={() => setVideoFile(null)} className="text-[10px] text-[#444] hover:text-white underline">Trocar Vídeo</button>
                    </div>
                ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-4 group">
                        <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-2xl group-hover:scale-110 transition-all">+</div>
                        <span className="text-xs font-bold text-[#444] group-hover:text-[#888]">Upload do seu vídeo (pessoa falando)</span>
                        <input type="file" className="hidden" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
                    </label>
                )}
                </div>
            </div>

            <div className="md:col-span-2 mt-4">
                <button
                    onClick={startReactEdit}
                    disabled={!videoFile || !bgFile || isProcessing}
                    className={`w-full py-6 rounded-2xl font-black text-xl tracking-widest transition-all ${
                        !videoFile || !bgFile || isProcessing
                        ? 'bg-white/5 text-[#222] cursor-not-allowed border border-white/5'
                        : 'bg-accent-cyan text-black shadow-[0_20px_40px_rgba(34,211,238,0.2)] hover:scale-[1.01] active:scale-[0.99]'
                    }`}
                >
                    {isProcessing ? "PROCESSANDO IA..." : "🔥 GERAR VÍDEO ESTILO REAÇÃO"}
                </button>

                {isProcessing && (
                    <div className="mt-8 flex flex-col gap-4 items-center">
                        <div className="w-full h-1 bg-[#111] rounded-full overflow-hidden">
                            <div className="h-full bg-accent animate-[loading_2s_infinite]" style={{width: '30%'}}></div>
                        </div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent">{status}</p>
                    </div>
                )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-in zoom-in duration-500 max-w-2xl mx-auto w-full">
            <div className="premium-card p-10 flex flex-col gap-8 text-center border-green-500/30 bg-green-500/5">
              <div className="flex flex-col items-center gap-4">
                <span className="text-6xl">🔥</span>
                <h2 className="text-3xl font-bold">Viral Pronto!</h2>
                <p className="text-sm text-[#888]">Sua reação foi composta com o print em 1080x1920.</p>
              </div>

              <div className="flex flex-col gap-4">
                <a
                    href={result.final_video.split('public')[1].replace(/\\/g, '/')}
                    download
                    className="w-full bg-white text-black py-5 rounded-2xl font-black text-center hover:bg-[#ccc] transition-all text-lg shadow-xl"
                >
                    BAIXAR VÍDEO VIRAL
                </a>
                <button
                    onClick={() => {setResult(null); setVideoFile(null); setBgFile(null);}}
                    className="w-full glass py-4 rounded-2xl font-bold hover:bg-white/5 transition-all text-[#666]"
                >
                    CRIAR OUTRO REACT
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-12 pt-8 border-t border-[#111] flex justify-between items-center text-[8px] text-[#333] uppercase tracking-[0.3em]">
          <span>Satiro React Module v1.0</span>
          <span>Powered by rembg & FFmpeg</span>
        </footer>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </main>
  );
};

export default ReactEditor;
