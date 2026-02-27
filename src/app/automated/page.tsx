"use client";

import { useState } from "react";
import type { NextPage } from "next";

interface AIResult {
  final_video: string;
  thumbnail: string;
  transcription: string;
}

const AutomatedEditor: NextPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [result, setResult] = useState<AIResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startAutomatedEdit = async () => {
    if (!file) return;

    setIsProcessing(true);
    setStatus("Fazendo upload e iniciando análise de IA...");

    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await fetch("/api/automate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.result);
        setStatus("Processamento concluído!");
      } else {
        setStatus("Erro no processamento: " + data.error);
      }
    } catch (error) {
      console.error(error);
      setStatus("Erro na conexão com o servidor.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl glass p-10 flex flex-col gap-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-black font-display tracking-tightest">SATIRO<span className="text-accent-cyan">.AI</span></h1>
          <p className="text-xs text-[#444] font-bold uppercase tracking-widest">Edição Totalmente Automática para Kwai</p>
        </header>

        {!result ? (
          <div className="flex flex-col gap-6">
            <div className={`premium-card p-12 border-dashed border-2 ${file ? 'border-accent' : 'border-[#333]'} flex flex-col items-center justify-center gap-4 transition-all`}>
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">🎬</span>
                  <span className="font-bold">{file.name}</span>
                  <button onClick={() => setFile(null)} className="text-xs text-[#666] hover:text-white underline">Remover</button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-3xl">+</div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold">Clique ou arraste seu vídeo bruto</span>
                    <span className="text-xs text-[#666]">Formatos suportados: MP4, MOV, AVI</span>
                  </div>
                  <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} aria-label="Upload de vídeo bruto" />
                </label>
              )}
            </div>

            <button
              onClick={startAutomatedEdit}
              disabled={!file || isProcessing}
              className={`w-full py-5 rounded-2xl font-black text-lg tracking-widest transition-all ${
                !file || isProcessing
                ? 'bg-white/5 text-[#222] cursor-not-allowed border border-white/5'
                : 'bg-accent-cyan text-black shadow-[0_20px_40px_rgba(34,211,238,0.2)] hover:scale-[1.01]'
              }`}
            >
              {isProcessing ? "PROCESSANDO..." : "🚀 FINALIZAR VÍDEO AGORA"}
            </button>

            {isProcessing && (
              <div className="flex flex-col gap-4 animate-pulse">
                <div className="h-1 w-full bg-[#111] rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-1/3 animate-[loading_2s_infinite]"></div>
                </div>
                <p className="text-xs text-accent font-mono uppercase tracking-widest">{status}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-in zoom-in duration-500">
            <div className="premium-card p-6 flex flex-col gap-6 text-left border-green-500/30 bg-green-500/5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <h2 className="text-xl font-bold">Vídeo Finalizado!</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-[#666] uppercase font-bold">Resolução</span>
                  <span className="text-sm">1080p Full HD</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-[#666] uppercase font-bold">Qualidade</span>
                  <span className="text-sm text-accent">HDR10 Ativo</span>
                </div>
              </div>

              <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                <p className="text-xs text-[#888] italic">"O áudio foi tratado, silêncios removidos e imagem otimizada para o Kwai."</p>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href={result!.final_video.split('public')[1].replace(/\\/g, '/')}
                download
                className="flex-1 bg-white text-black py-4 rounded-xl font-bold text-center hover:bg-[#888] transition-all"
              >
                BAIXAR VÍDEO PRO
              </a>
              <button
                onClick={() => {setResult(null); setFile(null);}}
                className="flex-1 glass py-4 rounded-xl font-bold hover:bg-white/5 transition-all"
              >
                NOVO VÍDEO
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 text-[10px] text-[#444] uppercase tracking-widest font-bold">
              <span className="text-green-500/50">🔒</span>
              PROCESSAMENTO SEGURO & PRIVADO
            </div>
          </div>
        )}

        <footer className="mt-8 pt-8 border-t border-[#111]">
          <p className="text-[10px] text-[#444] uppercase tracking-tighter">Satiro AI Engine v2.0 • Powered by Whisper & FFmpeg HDR</p>
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

export default AutomatedEditor;
