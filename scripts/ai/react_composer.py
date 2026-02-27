import sys
import os
import subprocess

def compose_react_video(bg_image, fg_video_green, output_path):
    print(f"Composing react video: BG={bg_image}, FG={fg_video_green}")

    # 1. Get foreground video dimensions to scale correctly
    # We want the foreground to be ~35% of the total width or a fixed scale.
    # Total Canvas (Kwai) is 1080x1920.

    # FFmpeg Filter Chain:
    # [1:v]colorkey=0x00FF00:0.1:0.1[fg_keyed];  // Remove green from foreground
    # [fg_keyed]scale=w=400:h=-1[fg_scaled];    // Scale foreground
    # [0:v][fg_scaled]overlay=x=main_w-overlay_w-40:y=main_h-overlay_h-40[outv] // Overlay at bottom-right

    # We also need to loop the background image to match video duration.
    # And scale the background image to 1080x1920 (Kwai format).

    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", bg_image, # [0:v]
        "-i", fg_video_green,          # [1:v]
        "-filter_complex",
        "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920[bg];"
        "[1:v]colorkey=0x00FF00:0.1:0.1[fg_keyed];"
        "[fg_keyed]scale=w=-1:h=672[fg_scaled];" # 35% of 1920
        "[fg_scaled]pad=iw+4:ih+4:2:2:color=white@0.3[fg_bordered];" # Subtle border
        "[bg][fg_bordered]overlay=x=main_w-overlay_w-60:y=main_h-overlay_h-100:shortest=1[outv]",
        "-map", "[outv]",
        "-map", "1:a?",
        "-c:v", "libx264", "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        output_path
    ]

    print("Running FFmpeg composition...")
    subprocess.run(cmd, check=True)
    print(f"React video successfully generated at: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python react_composer.py <bg_image> <fg_video_green> <output_video>")
        sys.exit(1)

    compose_react_video(sys.argv[1], sys.argv[2], sys.argv[3])
