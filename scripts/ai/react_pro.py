import sys
import os
import cv2
import numpy as np
from rembg import remove, new_session
from PIL import Image

def compose_react_pro(bg_source_path, front_image_path, fg_video_path, output_path, use_gpu=False):
    print(f"🔥 PRO COMPOSITION (GPU={use_gpu}): BG={bg_source_path}, FRONT={front_image_path}, FG={fg_video_path}")

    # 1. Initialize rembg session with GPU if requested
    providers = ['CUDAExecutionProvider', 'CPUExecutionProvider'] if use_gpu else ['CPUExecutionProvider']
    session = new_session("u2net", providers=providers)

    # 2. Detect if BG is Image or Video
    is_bg_video = False
    bg_ext = os.path.splitext(bg_source_path)[1].lower()
    if bg_ext in ['.mp4', '.mov', '.avi', '.mkv']:
        is_bg_video = True
        print("Detected VIDEO background.")
    else:
        print("Detected IMAGE background.")

    # 3. Open Foreground Video
    cap_fg = cv2.VideoCapture(fg_video_path)
    fps = cap_fg.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap_fg.get(cv2.CAP_PROP_FRAME_COUNT))

    # 4. Setup Background
    cap_bg = None
    bg_static_img = None
    if is_bg_video:
        cap_bg = cv2.VideoCapture(bg_source_path)
    else:
        bg_static_img = Image.open(bg_source_path).convert("RGBA").resize((1080, 1920), Image.Resampling.LANCZOS)

    # 5. Front Image (Logo/Overlay)
    front_img = None
    if front_image_path and os.path.exists(front_image_path):
        bg_name = os.path.basename(bg_source_path)
        front_name = os.path.basename(front_image_path)
        if bg_name != front_name:
            front_img = Image.open(front_image_path).convert("RGBA")
            front_w = 250
            front_h = int(front_img.height * (front_w / front_img.width))
            front_img = front_img.resize((front_w, front_h), Image.Resampling.LANCZOS)

    # 6. Output Video setup
    temp_raw = "temp_pro_comp.mp4"
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(temp_raw, fourcc, fps, (1080, 1920))

    frame_count = 0
    while True:
        ret_fg, frame_fg = cap_fg.read()
        if not ret_fg: break

        # a. Get Core Background Frame
        if is_bg_video:
            ret_bg, frame_bg = cap_bg.read()
            if not ret_bg:
                cap_bg.set(cv2.CAP_PROP_POS_FRAMES, 0)
                ret_bg, frame_bg = cap_bg.read()
            bg_frame_rgb = cv2.cvtColor(frame_bg, cv2.COLOR_BGR2RGB)
            bg_canvas = Image.fromarray(bg_frame_rgb).convert("RGBA").resize((1080, 1920), Image.Resampling.LANCZOS)
        else:
            bg_canvas = bg_static_img.copy()

        # b. Remove FG Background (Ultra Fast Session Mode)
        frame_fg_rgb = cv2.cvtColor(frame_fg, cv2.COLOR_BGR2RGB)
        fg_pil = Image.fromarray(frame_fg_rgb).convert("RGBA")
        fg_no_bg = remove(fg_pil, session=session)

        # c. Scale and Position FG
        fg_h = 768
        fg_w = int(fg_no_bg.width * (fg_h / fg_no_bg.height))
        fg_no_bg = fg_no_bg.resize((fg_w, fg_h), Image.Resampling.LANCZOS)

        # d. Paste FG (Bottom-Right)
        fg_x = 1080 - fg_w - 60
        fg_y = 1920 - fg_h - 100
        bg_canvas.paste(fg_no_bg, (fg_x, fg_y), mask=fg_no_bg)

        # e. Paste Front Image (Top-Left)
        if front_img:
            bg_canvas.paste(front_img, (60, 60), mask=front_img)

        # f. Write Frame
        res_frame = cv2.cvtColor(np.array(bg_canvas.convert("RGB")), cv2.COLOR_RGB2BGR)
        out.write(res_frame)

        frame_count += 1
        if frame_count % 30 == 0:
            print(f"Progress: {frame_count}/{total_frames} frames (Pro-React Mode)...")

    cap_fg.release()
    if cap_bg: cap_bg.release()
    out.release()

    if os.path.exists(output_path): os.remove(output_path)
    os.rename(temp_raw, output_path)
    print(f"✅ Pro-React Composition Complete: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python react_pro.py <bg> <front> <fg_video> <output> [--gpu]")
        sys.exit(1)

    gpu_flag = "--gpu" in sys.argv
    compose_react_pro(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], use_gpu=gpu_flag)
