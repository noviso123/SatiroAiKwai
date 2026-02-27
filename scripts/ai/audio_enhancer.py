import sys
import os
import subprocess
from pydub import AudioSegment, effects

def enhance_audio(input_path, output_path):
    print(f"Enhancing audio for: {input_path}")

    # 1. Extract audio using ffmpeg if it's a video
    temp_audio = f"temp_{os.getpid()}_raw.wav"
    subprocess.run([
        "ffmpeg", "-y", "-i", input_path,
        "-vn", "-acodec", "pcm_s16le", "-ar", "44100", "-ac", "2",
        temp_audio
    ], check=True, capture_output=True)

    # 2. Load audio with pydub
    audio = AudioSegment.from_wav(temp_audio)

    # 3. Apply Normalization
    print("Applying normalization...")
    audio = effects.normalize(audio)

    # 4. Filter chain for final output
    enhanced_wav = f"temp_{os.getpid()}_enhanced.wav"
    audio.export(enhanced_wav, format="wav")

    # Use forward slashes for ffmpeg paths and normalized paths
    input_path = os.path.normpath(input_path).replace("\\", "/")
    enhanced_wav = os.path.normpath(enhanced_wav).replace("\\", "/")
    output_path = os.path.normpath(output_path).replace("\\", "/")

    # - highpass/lowpass: Gentle noise reduction
    # - dynaudnorm: Professional dynamic audio normalization (standard for social media)
    print("Merging enhanced audio with video and applying filters...")
    subprocess.run([
        "ffmpeg", "-y", "-i", input_path, "-i", enhanced_wav,
        "-map", "0:v", "-map", "1:a",
        "-c:v", "copy",
        "-af", "highpass=f=200,lowpass=f=3000,dynaudnorm=p=0.9:s=5",
        "-c:a", "aac", "-b:a", "192k",
        output_path
    ], check=True, capture_output=True)

    # Cleanup
    if os.path.exists(temp_audio): os.remove(temp_audio)
    if os.path.exists(enhanced_wav): os.remove(enhanced_wav)
    return output_path

if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(1)
    enhance_audio(sys.argv[1], sys.argv[2])
