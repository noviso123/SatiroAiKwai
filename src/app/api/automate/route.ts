import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const mode = (formData.get("mode") as string) || "standard";
    const file = formData.get("video") as File;
    const bgImage = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "Vídeo é obrigatório." }, { status: 400 });
    }

    // 1. Setup paths
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const outputDir = path.join(process.cwd(), "public", "output", uuidv4());

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const inputPath = path.join(uploadDir, `${Date.now()}-${file.name.replace(/\s/g, '_')}`);

    // 2. Save uploaded video
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(inputPath, new Uint8Array(buffer));

    let bgPath = "";
    if (mode === "react" && bgImage) {
      bgPath = path.join(uploadDir, `${Date.now()}-bg-${bgImage.name.replace(/\s/g, '_')}`);
      const bgBuffer = Buffer.from(await bgImage.arrayBuffer());
      fs.writeFileSync(bgPath, new Uint8Array(bgBuffer));
    }

    console.log(`Starting ${mode} automation. Input: ${inputPath}`);

    // 3. Run Python Orchestrator
    const pythonArgs = [
      "scripts/ai/orchestrator.py",
      inputPath,
      outputDir,
      mode
    ];

    if (mode === "react" && bgPath) {
      pythonArgs.push(bgPath);
    }

    const pythonProcess = spawn("python", pythonArgs);

    let outputData = "";
    pythonProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python Error: ${data.toString()}`);
    });

    const result = await new Promise((resolve, reject) => {
      pythonProcess.on("close", (code) => {
        if (code === 0) {
          try {
            // Find the last line which should be the JSON output
            const lines = outputData.trim().split("\n");
            const lastLine = lines[lines.length - 1];
            resolve(JSON.parse(lastLine));
          } catch {
            reject(new Error("Erro ao processar saída do pipeline."));
          }
        } else {
          reject(new Error(`Pipeline falhou com código: ${code}`));
        }
      });
    });

    return NextResponse.json({
      success: true,
      result,
      message: "Processamento automático concluído com sucesso!"
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Automation error:", error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
