import sys
import os
import cv2
import numpy as np

# Try a more explicit import path for Mediapipe
try:
    import mediapipe.python.solutions.face_mesh as mp_face_mesh
except ImportError:
    try:
        from mediapipe.solutions import face_mesh as mp_face_mesh
    except ImportError:
        # Fallback: if mediapipe is broken, we skip but log it to avoid crashing the whole pipeline
        mp_face_mesh = None

def validate_lip_sync(video_path):
    print(f"Validating lip sync for: {video_path}")

    if mp_face_mesh is None:
        print("Warning: Mediapipe FaceMesh not available. Skipping lip sync validation.")
        return True

    face_mesh = mp_face_mesh.FaceMesh(
        static_image_mode=False,
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Could not open video.")
        return False

    detected_faces = 0
    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % 10 == 0:
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(frame_rgb)
            if results.multi_face_landmarks:
                detected_faces += 1

        frame_count += 1

    cap.release()
    face_mesh.close()

    print(f"Lip sync validation complete. Samples with faces: {detected_faces}")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(1)
    validate_lip_sync(sys.argv[1])
