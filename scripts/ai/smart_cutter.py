import sys
import os
from moviepy.editor import VideoFileClip, concatenate_videoclips
from pydub import AudioSegment, silence

def remove_silence(input_path, output_path, min_silence_len=500, silence_thresh=-40):
    print(f"Removing silence from: {input_path}")
    video = VideoFileClip(input_path)
    temp_audio = f"temp_{os.getpid()}_sv.wav"
    video.audio.write_audiofile(temp_audio, codec='pcm_s16le', verbose=False, logger=None)

    audio = AudioSegment.from_wav(temp_audio)
    chunks = silence.detect_nonsilent(audio, min_silence_len=min_silence_len, silence_thresh=silence_thresh)

    print(f"Found {len(chunks)} non-silent sections.")
    clips = [video.subclip(start/1000.0, end/1000.0) for start, end in chunks]

    if clips:
        final_video = concatenate_videoclips(clips)
        final_video.write_videofile(output_path, codec="libx264", audio_codec="aac", verbose=False, logger=None)
    else:
        video.write_videofile(output_path, codec="libx264", audio_codec="aac", verbose=False, logger=None)

    if os.path.exists(temp_audio): os.remove(temp_audio)
    return output_path

if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(1)
    remove_silence(sys.argv[1], sys.argv[2])
