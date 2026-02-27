import sys
import os
import subprocess

def enhance_video(input_path, output_path, use_gpu=False):
    print(f"Enhancing video (GPU={use_gpu}): {input_path}")

    # scale: 1080x1920 (Vertical)
    # unsharp: sharpen for clarity
    # GPU Mode: use h264_nvenc for 5-10x faster encoding on Colab

    v_codec = "h264_nvenc" if use_gpu else "libx264"
    preset = "p4" if use_gpu else "faster" # p4 is a balanced nvenc preset

    cmd = [
        "ffmpeg", "-y", "-i", input_path,
        "-vf", "scale=1080:1920,unsharp=5:5:1.0:5:5:0.0",
        "-c:v", v_codec,
        "-pix_fmt", "yuv420p"
    ]

    if use_gpu:
        cmd.extend(["-preset", preset, "-cq", "20"]) # Constant Quality for nvenc
    else:
        cmd.extend(["-preset", preset, "-crf", "18"])

    cmd.extend(["-c:a", "copy", output_path])

    subprocess.run(cmd, check=True, capture_output=True)
    print(f"✅ Enhanced video saved to: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python video_enhancer.py <input> <output> [--gpu]")
        sys.exit(1)

    gpu_flag = "--gpu" in sys.argv
    enhance_video(sys.argv[1], sys.argv[2], use_gpu=gpu_flag)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(1)
    enhance_video(sys.argv[1], sys.argv[2])
