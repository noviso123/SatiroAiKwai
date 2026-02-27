import { NextRequest, NextResponse } from "next/server";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { text, goal, subtext } = data;

    // Ensure output directory exists
    const outputDir = path.join(process.cwd(), "public", "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFileName = `hook-${Date.now()}.mp4`;
    const outputPath = path.join(outputDir, outputFileName);

    console.log("Bundling Remotion project...");
    const bundleLocation = await bundle({
      entryPoint: path.join(process.cwd(), "src", "remotion", "index.ts"),
    });

    console.log("Selecting composition...");
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: "StrategicHook",
      inputProps: {
        text: text || "O SEGREDO DO KWAI",
        subtext: subtext || "Gatilho de Retenção",
        themeColor: goal === "venda" ? "#ff4d4d" : "#0070f3",
      },
    });

    console.log("Rendering video...");
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      outputLocation: outputPath,
      inputProps: {
        text: text || "O SEGREDO DO KWAI",
        subtext: subtext || "Gatilho de Retenção",
        themeColor: goal === "venda" ? "#ff4d4d" : "#0070f3",
      },
      codec: "h264",
    });

    return NextResponse.json({
      success: true,
      path: `/output/${outputFileName}`,
      message: "Vídeo de retenção gerado com sucesso via Remotion!"
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Error rendering video:", error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
