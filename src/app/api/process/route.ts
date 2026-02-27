import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const mode = formData.get("mode") as string; // 'react' or 'standard'
    const bgFile = formData.get("bgFile") as File;
    const fgFile = formData.get("fgFile") as File;
    const frontFile = formData.get("frontFile") as File;

    const jobId = `job_${Date.now()}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", jobId);
    await mkdir(uploadDir, { recursive: true });

    let bgPath = "";
    let fgPaths: string[] = [];
    let frontPath = "";

    const fgFiles = formData.getAll("fgFile") as File[];
    for (const file of fgFiles) {
      if (file && file.size > 0) {
        const filePath = path.join(uploadDir, file.name);
        await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
        fgPaths.push(filePath);
      }
    }

    if (bgFile) {
      bgPath = path.join(uploadDir, bgFile.name);
      await writeFile(bgPath, Buffer.from(await bgFile.arrayBuffer()));
    }

    if (frontFile) {
      frontPath = path.join(uploadDir, frontFile.name);
      await writeFile(frontPath, Buffer.from(await frontFile.arrayBuffer()));
    }

    const outputDir = path.join(process.cwd(), "public", "output", jobId);
    await mkdir(outputDir, { recursive: true });

    // Trigger Python orchestrator asynchronously
    let cmd = "";
    const fgInput = fgPaths.join(",");
    if (mode === "react") {
      cmd = `python scripts/ai/orchestrator.py "${fgInput}" "${outputDir}" react "${bgPath}" "${frontPath}"`;
    } else {
      cmd = `python scripts/ai/orchestrator.py "${fgInput}" "${outputDir}" standard`;
    }

    console.log(`Executing: ${cmd}`);

    // We don't await the exec so it runs in background
    const process = exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Job ${jobId} failed: ${error.message}`);
        fs.writeFileSync(path.join(outputDir, "error.log"), error.message);
      }
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
    });

    return NextResponse.json({
      success: true,
      jobId,
      status: "processing",
      outputFolder: `/output/${jobId}`
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
