"use client";

import { useState, useEffect } from "react";
import TopMetricsBar from "../components/TopMetricsBar";
import {
  FiVideo,
  FiZap,
  FiPlay,
  FiUploadCloud,
  FiLayers,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiMusic,
  FiFileText
} from "react-icons/fi";

type JobStatus = "idle" | "uploading" | "processing" | "completed" | "failed";

export default function Home() {
  const [mode, setMode] = useState<"standard" | "react">("standard");
  const [status, setStatus] = useState<JobStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Files
  const [fgFiles, setFgFiles] = useState<File[]>([]);
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [frontFile, setFrontFile] = useState<File | null>(null);

  // Poll status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "processing" && jobId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/status?jobId=${jobId}`);
          const data = await res.json();
          if (data.status === "completed") {
            setStatus("completed");
            setResultVideo(data.videoUrl);
            setProgress(100);
            clearInterval(interval);
          } else if (data.status === "failed") {
            setStatus("failed");
            setError(data.error);
            clearInterval(interval);
          } else {
            // Incremental progress
            setProgress(prev => Math.min(prev + 2, 98));
          }
        } catch (e) {
          console.error("Status check failed", e);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [status, jobId]);

  const handleProcess = async () => {
    if (fgFiles.length === 0) return alert("Selecione pelo menos um vídeo!");

    setStatus("uploading");
    setProgress(5);
    setError(null);

    const formData = new FormData();
    formData.append("mode", mode);
    fgFiles.forEach(file => formData.append("fgFile", file));
    if (bgFile) formData.append("bgFile", bgFile);
    if (frontFile) formData.append("frontFile", frontFile);

    try {
      const res = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setJobId(data.jobId);
        setStatus("processing");
        setProgress(20);
      } else {
        setStatus("failed");
        setError(data.error);
      }
    } catch (e: any) {
      setStatus("failed");
      setError(e.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-slate-200 p-4 md:p-8 font-sans selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500 font-display">
              SATIRO <span className="text-cyan-400 italic">AI</span> HUB
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] pl-1">
              Automated Video Production Protocol v4.0
            </p>
          </div>
          <TopMetricsBar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Panel: Configuration */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass rounded-[2rem] p-8 border border-white/5 space-y-8 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

              {/* Mode Selector */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Selecione o Fluxo</label>
                <div className="grid grid-cols-2 gap-3 p-1.5 bg-black/40 rounded-2xl border border-white/5">
                  <button
                    onClick={() => { setMode("standard"); setFgFiles([]); }}
                    className={`flex items-center justify-center gap-3 py-3 rounded-xl transition-all duration-500 ${mode === "standard" ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.1)]" : "hover:bg-white/5 text-slate-500"}`}
                  >
                    <FiZap className={`text-lg transition-colors ${mode === "standard" ? "text-cyan-600" : ""}`} />
                    <span className="text-[11px] font-black uppercase tracking-widest">Auto Edição</span>
                  </button>
                  <button
                    onClick={() => { setMode("react"); setFgFiles([]); }}
                    className={`flex items-center justify-center gap-3 py-3 rounded-xl transition-all duration-500 ${mode === "react" ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.1)]" : "hover:bg-white/5 text-slate-500"}`}
                  >
                    <FiLayers className={`text-lg transition-colors ${mode === "react" ? "text-cyan-600" : ""}`} />
                    <span className="text-[11px] font-black uppercase tracking-widest">Modo React</span>
                  </button>
                </div>
              </div>

              {/* Upload Section */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                      {mode === "standard" ? "Clipes para Edição" : "Vídeo do Personagem (FG)"}
                    </label>
                    {fgFiles.length > 0 && (
                      <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-400/10 px-2 py-0.5 rounded-full">
                        {fgFiles.length} {fgFiles.length === 1 ? 'Clip' : 'Clips'}
                      </span>
                    )}
                  </div>

                  <label className="relative flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed border-white/10 rounded-[1.5rem] hover:border-cyan-500/50 hover:bg-cyan-500/5 cursor-pointer transition-all group overflow-hidden bg-black/20">
                    <input
                      type="file"
                      multiple={mode === "standard"}
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setFgFiles(files);
                      }}
                    />

                    {fgFiles.length > 0 ? (
                      <div className="w-full p-4 space-y-2 max-h-32 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in duration-300">
                        {fgFiles.map((f, i) => (
                          <div key={i} className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg border border-white/5 group/item">
                            <FiVideo className="text-cyan-400 shrink-0" />
                            <span className="text-[11px] font-bold truncate flex-1">{f.name}</span>
                            <FiCheckCircle className="text-green-500 opacity-50 group-hover/item:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 py-4 opacity-50 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <FiUploadCloud className="text-3xl text-cyan-500" />
                        </div>
                        <div className="text-center">
                          <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-white">Carregue seus arquivos</span>
                          <span className="block text-[8px] font-bold text-slate-600 mt-1">MP4, MOV, AVI suportados</span>
                        </div>
                      </div>
                    )}
                  </label>
                </div>

                {mode === "react" && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Fundo (BG)</label>
                      <label className="flex flex-col items-center justify-center h-28 border border-white/10 rounded-2xl hover:border-cyan-500/50 hover:bg-cyan-500/5 cursor-pointer transition-all bg-black/20 group">
                        <input type="file" className="hidden" onChange={(e) => setBgFile(e.target.files?.[0] || null)} />
                        {bgFile ? (
                          <div className="flex flex-col items-center gap-2 text-cyan-400">
                            <FiCheckCircle />
                            <span className="text-[9px] font-black px-2 text-center truncate w-full">{bgFile.name}</span>
                          </div>
                        ) : (
                          <>
                            <FiVideo className="text-lg opacity-20 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[9px] font-black mt-2 opacity-30 group-hover:opacity-60 uppercase tracking-tighter">Escolher BG</span>
                          </>
                        )}
                      </label>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Logo/Front</label>
                      <label className="flex flex-col items-center justify-center h-28 border border-white/10 rounded-2xl hover:border-orange-500/50 hover:bg-orange-500/5 cursor-pointer transition-all bg-black/20 group">
                        <input type="file" className="hidden" onChange={(e) => setFrontFile(e.target.files?.[0] || null)} />
                        {frontFile ? (
                          <div className="flex flex-col items-center gap-2 text-orange-400">
                            <FiCheckCircle />
                            <span className="text-[9px] font-black px-2 text-center truncate w-full">{frontFile.name}</span>
                          </div>
                        ) : (
                          <>
                            <FiFileText className="text-lg opacity-20 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[9px] font-black mt-2 opacity-30 group-hover:opacity-60 uppercase tracking-tighter">Opcional</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="space-y-4">
                <button
                  onClick={handleProcess}
                  disabled={status === "processing" || status === "uploading" || fgFiles.length === 0}
                  className={`group relative w-full py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-xs transition-all duration-500 overflow-hidden shadow-2xl ${
                    status === "processing" || status === "uploading" || fgFiles.length === 0
                      ? "bg-white/5 text-slate-600 cursor-not-allowed border border-white/5"
                      : "bg-gradient-to-r from-cyan-600 to-blue-700 text-white hover:shadow-cyan-500/20 active:scale-[0.98] border border-cyan-400/20"
                  }`}
                >
                  <div className="relative z-10 flex items-center justify-center gap-4">
                    {status === "uploading" ? (
                      <FiRefreshCw className="animate-spin text-lg" />
                    ) : status === "processing" ? (
                      <FiZap className="animate-pulse text-lg" />
                    ) : (
                      <FiZap className="text-lg" />
                    )}
                    <span>{status === "idle" ? "Iniciar Protocolo AI" : status === "uploading" ? "Enviando Dados..." : "Editando Vídeo..."}</span>
                  </div>
                  {status === "idle" && fgFiles.length > 0 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                  )}
                </button>

                {status === "completed" && (
                  <button
                    onClick={() => { setStatus("idle"); setProgress(0); setJobId(null); setResultVideo(null); setFgFiles([]); }}
                    className="w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-all bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 flex items-center justify-center gap-2"
                  >
                    <FiRefreshCw className="text-xs" /> Novo Workflow
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Output & Monitoring */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass rounded-[2rem] p-8 min-h-[580px] flex flex-col border border-white/5 relative bg-black/60 shadow-inner overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/50 to-blue-500/50 opacity-20" />

              {/* Status Header */}
              <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${status === "processing" ? "bg-cyan-500 animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.8)]" : status === "completed" ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]" : status === "failed" ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" : "bg-white/10"}`} />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 block">Satiro Engine Status</span>
                    <span className="text-[11px] font-black uppercase tracking-widest block text-white">
                      {status === "idle" ? "READY FOR INPUT" : `${status.toUpperCase()}`}
                    </span>
                  </div>
                </div>
                {jobId && <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[9px] font-mono text-white/40 tracking-widest">{jobId}</div>}
              </div>

              {/* Main Workspace Area */}
              <div className="flex-1 flex flex-col items-center justify-center relative">
                {status === "idle" && (
                  <div className="text-center space-y-10 animate-in fade-in duration-1000">
                    <div className="relative">
                      <div className="absolute inset-0 bg-cyan-500/20 blur-[60px] rounded-full animate-pulse" />
                      <FiVideo className="text-9xl text-white opacity-5 relative" />
                    </div>
                    <div className="space-y-2 max-w-xs">
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Aguardando Sequência</p>
                      <p className="text-[9px] font-medium leading-relaxed text-slate-600">Carregue seus arquivos no painel ao lado para iniciar a orquestração da IA de edição.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-8 pt-6 opacity-30">
                      <div className="flex flex-col items-center gap-2"><FiMusic className="text-sm"/><span className="text-[8px] font-bold">AUDIO</span></div>
                      <div className="flex flex-col items-center gap-2"><FiFileText className="text-sm"/><span className="text-[8px] font-bold">SUBS</span></div>
                      <div className="flex flex-col items-center gap-2"><FiZap className="text-sm"/><span className="text-[8px] font-bold">HDR</span></div>
                    </div>
                  </div>
                )}

                {(status === "uploading" || status === "processing") && (
                  <div className="w-full max-w-md space-y-12 animate-in zoom-in duration-700">
                    <div className="space-y-6">
                      <div className="flex justify-between items-end px-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
                          {status === "uploading" ? "PROTOCOL DATA TRANSFER" : "AI NEURAL RENDERING"}
                        </span>
                        <span className="text-2xl font-black italic text-white">{progress}%</span>
                      </div>
                      <div className="relative h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                        <div
                          className="absolute h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-500 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(6,182,212,0.5)] bg-[length:200%_100%] animate-gradient-x"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="glass p-5 rounded-2xl border border-white/5 group hover:border-cyan-500/30 transition-all">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Stage</p>
                        <p className="text-xs font-black tracking-widest uppercase text-white">
                          {progress < 20 ? "INIT KERNEL" : progress < 40 ? "TRANSCRIPTION" : progress < 65 ? "VIDEO MERGE" : progress < 85 ? "PRECISION SYNC" : "FINAL PACK"}
                        </p>
                      </div>
                      <div className="glass p-5 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Engine</p>
                        <p className="text-xs font-black tracking-widest text-white uppercase italic">Satiro-V4</p>
                      </div>
                    </div>

                    <div className="p-6 bg-black/40 rounded-2xl border border-white/5 font-mono text-[9px] text-slate-600 leading-relaxed shadow-inner">
                      <div className="space-y-1 animate-pulse">
                        <span className="text-cyan-500/60 block">&gt; Establishing Neural Bridge... COMPLETE</span>
                        <span className="text-cyan-500/60 block">&gt; Initializing Faster-Whisper Medium... READY</span>
                        <span className="text-cyan-500/60 block">&gt; Calibrating Karaoke Centiseconds... OK</span>
                        {mode === "standard" && fgFiles.length > 1 && <span className="text-blue-500/60 block">&gt; Merging {fgFiles.length} clips via FFmpeg concat...</span>}
                        <span className="text-slate-700 block">&gt; Processing high-fidelity stream...</span>
                      </div>
                    </div>
                  </div>
                )}

                {status === "completed" && resultVideo && (
                  <div className="w-full space-y-8 animate-in fade-in zoom-in duration-1000">
                    <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl relative bg-black group-hover:shadow-cyan-500/5 transition-all duration-1000">
                      <video
                        src={resultVideo}
                        controls
                        className="w-full h-full object-contain"
                        autoPlay
                      />
                      <div className="absolute top-6 right-6 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black text-white tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                        AI MASTERED HEVC
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <a
                        href={resultVideo}
                        download
                        className="flex-1 bg-white text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.4em] text-center hover:bg-cyan-400 transition-all duration-500 flex items-center justify-center gap-4 shadow-xl hover:scale-[1.02] active:scale-[1.0]"
                      >
                        <FiUploadCloud className="text-lg" /> Exportar 4K Kwai
                      </a>
                      <button className="px-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white/50 hover:text-white group">
                        <FiZap className="text-lg transition-transform group-hover:rotate-12" />
                      </button>
                    </div>
                  </div>
                )}

                {status === "failed" && (
                  <div className="text-center space-y-8 animate-in shake duration-500">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-red-500/20 blur-[40px] rounded-full animate-pulse" />
                      <FiAlertCircle className="text-8xl text-red-600 relative" />
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm font-black uppercase tracking-[0.4em] text-red-500">Protocol Critical Failure</p>
                      <div className="p-6 bg-red-500/10 rounded-2xl border border-red-500/20 max-w-md mx-auto">
                        <p className="text-[10px] text-red-400 font-mono leading-relaxed break-words">
                          {error || "Unknown backend orchestration error. Reset kernel suggested."}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setStatus("idle")}
                      className="px-10 py-3.5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                    >
                      Resetar Núcleo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* System Footer info */}
        <div className="flex flex-col items-center justify-center py-10 opacity-10 pointer-events-none space-y-2">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-white to-transparent mb-4" />
          <p className="text-[9px] font-mono tracking-[1em] uppercase">SYSTEM PROTOCOL SATIRO-AI VER.4.2.0-ELITE</p>
          <p className="text-[8px] font-mono tracking-[0.5em] uppercase">ALL NEURAL PATHWAYS ESTABLISHED • 2026 DEEPMIND CORE</p>
        </div>

      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');

        .font-display { font-family: 'Outfit', sans-serif; }

        .glass {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
        }

        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </main>
  );
}
