import sys
import os
import json
import subprocess

# Import modularized scripts
from audio_enhancer import enhance_audio
from transcriber import transcribe_video
from smart_cutter import remove_silence
from lip_sync_validator import validate_lip_sync
from video_enhancer import enhance_video
from bg_remover import remove_background
from react_composer import compose_react_video

from subtitle_generator import generate_ass

def run_pipeline(input_path, output_dir, use_gpu=False):
    print(f"Starting Ultra-Fast Satiro AI Pipeline (GPU={use_gpu}) for: {input_path}")

    if not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)

    base_name = os.path.splitext(os.path.basename(input_path))[0]

    # Paths
    transcription_json = os.path.join(output_dir, f"{base_name}_transcription.json")
    subtitle_ass = os.path.join(output_dir, f"{base_name}_subs.ass")
    enhanced_audio_video = os.path.join(output_dir, f"{base_name}_enhanced.mp4")
    smart_cut_video = os.path.join(output_dir, f"{base_name}_cut.mp4")
    hdr_video = os.path.join(output_dir, f"{base_name}_hdr.mp4")
    final_video = os.path.join(output_dir, f"{base_name}_final_subs.mp4")
    thumbnail_img = os.path.join(output_dir, f"{base_name}_thumb.jpg")
    video_with_thumb = os.path.join(output_dir, f"{base_name}_ready_for_kwai.mp4")

    # 1. Transcribe
    print("--- Phase 1: Transcription ---")
    transcribe_video(input_path, transcription_json)

    # 2. Generate Subtitles (Pro-Max Style)
    print("--- Phase 2: Generation Subtitle Style ---")
    generate_ass(transcription_json, subtitle_ass)

    # 3. Enhance Audio
    print("--- Phase 3: Audio Enhancement ---")
    enhance_audio(input_path, enhanced_audio_video)

    # 4. Smart Cuts
    print("--- Phase 4: Smart Cutting ---")
    remove_silence(enhanced_audio_video, smart_cut_video)

    # 5. Video Enhancement (HDR)
    print("--- Phase 5: HDR/Color Optimization ---")
    enhance_video(smart_cut_video, hdr_video, use_gpu=use_gpu)

    # 6. Burn Subtitles
    print("--- Phase 6: Subtitle Burning ---")
    v_codec = "h264_nvenc" if use_gpu else "libx264"
    subprocess.run([
        "ffmpeg", "-y", "-i", hdr_video,
        "-vf", f"ass={subtitle_ass.replace('\\', '/')}",
        "-c:v", v_codec, "-pix_fmt", "yuv420p", "-c:a", "copy",
        final_video
    ], check=True, capture_output=True)

    # 7. Generate Thumbnail
    print("--- Phase 7: Thumbnail Generation ---")
    subprocess.run([
        "ffmpeg", "-y", "-i", final_video, "-vframes", "1", "-q:v", "2", thumbnail_img
    ], check=True, capture_output=True)

    # 8. Final Polish (Concat with Thumb Intro)
    print("--- Phase 8: Final Polish & Packaging ---")
    thumb_video = os.path.normpath(os.path.join(output_dir, "thumb_intro.mp4")).replace("\\", "/")

    # Generate static thumb video
    subprocess.run([
        "ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
        "-loop", "1", "-i", thumbnail_img,
        "-c:v", v_codec, "-t", "0.5", "-pix_fmt", "yuv420p", "-vf", "scale=1080:1920",
        "-c:a", "aac", "-shortest",
        thumb_video
    ], check=True, capture_output=True)

    # Final concat
    subprocess.run([
        "ffmpeg", "-y", "-i", thumb_video, "-i", final_video,
        "-filter_complex", "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]",
        "-map", "[v]", "-map", "[a]", "-c:v", v_codec, "-pix_fmt", "yuv420p", "-c:a", "aac",
        video_with_thumb
    ], check=True, capture_output=True)

    # Cleanup intermediate files
    for f in [enhanced_audio_video, smart_cut_video, hdr_video, final_video, thumb_video, subtitle_ass]:
        if os.path.exists(f): os.remove(f)

    return {
        "success": True,
        "final_video": video_with_thumb,
        "thumbnail": thumbnail_img,
        "transcription": transcription_json
    }

def run_react_pipeline(bg_image, front_image, fg_video, output_dir, use_gpu=False):
    print(f"Starting Ultra-Fast React Pipeline (GPU={use_gpu}): BG={bg_image}, FRONT={front_image}, FG={fg_video}")
    if not os.path.exists(output_dir): os.makedirs(output_dir, exist_ok=True)

    base_name = os.path.splitext(os.path.basename(fg_video))[0]
    enhanced_fg = os.path.join(output_dir, f"{base_name}_enhanced_fg.mp4")
    composed_video = os.path.join(output_dir, f"{base_name}_composed.mp4")
    final_video = os.path.join(output_dir, f"{base_name}_react_ready.mp4")

    # 1. Transcribe & Enhance Audio
    transcription_json = os.path.join(output_dir, f"{base_name}_transcription.json")
    transcribe_video(fg_video, transcription_json)
    enhance_audio(fg_video, enhanced_fg)

    # 2. Subtitles
    subtitle_ass = os.path.join(output_dir, f"{base_name}_react_subs.ass")
    generate_ass(transcription_json, subtitle_ass)

    # 3. Direct Pro Composition (GPU Accelerated)
    from react_pro import compose_react_pro
    compose_react_pro(bg_image, front_image, enhanced_fg, composed_video, use_gpu=use_gpu)

    # 4. Burn Subtitles and Finalize
    v_codec = "h264_nvenc" if use_gpu else "libx264"
    subprocess.run([
        "ffmpeg", "-y", "-i", composed_video, "-i", enhanced_fg,
        "-map", "0:v", "-map", "1:a",
        "-vf", f"ass={subtitle_ass.replace('\\', '/')}",
        "-c:v", v_codec, "-pix_fmt", "yuv420p", "-c:a", "aac",
        final_video
    ], check=True, capture_output=True)

    # Cleanup
    for f in [enhanced_fg, composed_video, subtitle_ass]:
        if os.path.exists(f): os.remove(f)

    return {
        "success": True,
        "final_video": final_video,
        "thumbnail": bg_image
    }

if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(1)

    # Usage: python orchestrator.py <input> <output_dir> [mode] [bg_image] [front_image] [--gpu]
    args = sys.argv[1:]
    gpu_enabled = "--gpu" in args
    if gpu_enabled: args.remove("--gpu")

    input_paths = args[0].split(',')
    output_dir = args[1]
    mode = args[2] if len(args) > 2 else "standard"

    # Ensure current directory is in path for imports
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))

    final_input = input_paths[0]

    if mode == "standard" and len(input_paths) > 1:
        print(f"--- Phase 0: Multi-Video Concatenation ---")
        if not os.path.exists(output_dir): os.makedirs(output_dir, exist_ok=True)
        concat_list = os.path.join(output_dir, "concat_list.txt")
        with open(concat_list, "w") as f:
            for p in input_paths:
                f.write(f"file '{p.replace('\\', '/')}'\n")

        merged_video = os.path.join(output_dir, "merged_source.mp4")
        subprocess.run([
            "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_list,
            "-c", "copy", merged_video
        ], check=True, capture_output=True)
        final_input = merged_video
        os.remove(concat_list)

    if mode == "react":
        bg = args[3] if len(args) > 3 else None
        front = args[4] if len(args) > 4 else None
        result = run_react_pipeline(bg, front, final_input, output_dir, use_gpu=gpu_enabled)
    else:
        result = run_pipeline(final_input, output_dir, use_gpu=gpu_enabled)

    print(json.dumps(result))
