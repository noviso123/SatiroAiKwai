import sys
import os
import cv2
import numpy as np
from rembg import remove, new_session
from PIL import Image

def remove_background(input_path, output_path, use_gpu=False):
    print(f"Removing background (GPU={use_gpu}) from: {input_path}")

    # 1. Initialize rembg session with GPU if requested
    providers = ['CUDAExecutionProvider', 'CPUExecutionProvider'] if use_gpu else ['CPUExecutionProvider']
    session = new_session("u2net", providers=providers)

    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        print("Error: Could not open video.")
        return

    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # Output video with green background (chroma key)
    # Using 'mp4v' or 'avc1' - Colab works best with mp4v for raw writing
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    temp_output = "temp_bg_removed.mp4"
    out = cv2.VideoWriter(temp_output, fourcc, fps, (width, height))

    print(f"Removing background from {total_frames} frames... Ultra Fast Mode.")

    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Convert BGR to RGB for rembg
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img = Image.fromarray(frame_rgb)

        # Remove background using rembg with session for speed
        output_img = remove(img, session=session)

        # Create a green background
        green_bg = Image.new("RGB", output_img.size, (0, 255, 0))
        if output_img.mode == 'RGBA':
            green_bg.paste(output_img, mask=output_img.split()[3])
        else:
            green_bg.paste(output_img)

        # Convert back to BGR for cv2
        res_frame = cv2.cvtColor(np.array(green_bg), cv2.COLOR_RGB2BGR)
        out.write(res_frame)

        frame_count += 1
        if frame_count % 30 == 0:
            print(f"Progress: {frame_count}/{total_frames} frames...")

    cap.release()
    out.release()

    if os.path.exists(output_path):
        os.remove(output_path)
    os.rename(temp_output, output_path)
    print(f"✅ Background removed saved to: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python bg_remover.py <input_video> <output_video> [--gpu]")
        sys.exit(1)

    gpu_flag = "--gpu" in sys.argv
    remove_background(sys.argv[1], sys.argv[2], use_gpu=gpu_flag)
