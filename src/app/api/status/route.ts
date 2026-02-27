import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json({ success: false, error: "Missing jobId" }, { status: 400 });
    }

    const outputDir = path.join(process.cwd(), "public", "output", jobId);

    // Check if job folder exists
    if (!fs.existsSync(outputDir)) {
      return NextResponse.json({ status: "pending" });
    }

    // Check for error log
    if (fs.existsSync(path.join(outputDir, "error.log"))) {
      const error = fs.readFileSync(path.join(outputDir, "error.log"), "utf8");
      return NextResponse.json({ status: "failed", error });
    }

    // Check for final video files
    const files = fs.readdirSync(outputDir);
    const finalVideo = files.find(f => f.includes("ready_for_kwai") || f.includes("react_ready"));

    if (finalVideo) {
      return NextResponse.json({
        status: "completed",
        videoUrl: `/output/${jobId}/${finalVideo}`,
        files: files.map(f => `/output/${jobId}/${f}`)
      });
    }

    return NextResponse.json({ status: "processing" });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
