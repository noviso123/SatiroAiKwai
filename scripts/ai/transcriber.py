import sys
import json
import os
import subprocess
from vosk import Model, KaldiRecognizer
import wave

def transcribe_video(input_path, output_json):
    print(f"🎤 TRANSCRIPTION (EXTREME SPEED VOSK): {input_path}")

    # 1. Extract 16kHz Mono Audio (Required by Vosk)
    temp_wav = input_path + ".temp.wav"
    subprocess.run([
        "ffmpeg", "-y", "-i", input_path,
        "-ac", "1", "-ar", "16000", "-vn", temp_wav
    ], check=True, capture_output=True)

    # 2. Load Vosk Model (Check for local folder "model" first for 100% guarantee)
    model_path = "scripts/ai/model" if os.path.exists("scripts/ai/model") else "model"
    if os.path.exists(model_path):
        print(f"Loading local model from: {model_path}")
        model = Model(model_path)
    else:
        print("Model folder not found. Falling back to Model(lang='pt')...")
        model = Model(lang="pt")

    wf = wave.open(temp_wav, "rb")
    rec = KaldiRecognizer(model, wf.getframerate())
    rec.SetWords(True) # Get word timestamps

    # 3. Process Audio
    full_text = []
    all_words = []

    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if rec.AcceptWaveform(data):
            res = json.loads(rec.Result())
            if "text" in res:
                full_text.append(res["text"])
                if "result" in res:
                    all_words.extend(res["result"])

    final_res = json.loads(rec.FinalResult())
    if "text" in final_res:
        full_text.append(final_res["text"])
        if "result" in final_res:
            all_words.extend(final_res["result"])

    wf.close()
    if os.path.exists(temp_wav): os.remove(temp_wav)

    # 4. Map Vosk Output to our expected Format
    # Vosk 'conf' is probability, 'start' and 'end' are seconds
    segments = []
    if all_words:
        # Create segments based on silence gaps or fixed word count for Kwai style
        # For simplicity and style, we'll keep it as one continuous segment with all words
        # or split by larger gaps (> 1s)
        current_segment = {"id": 0, "start": all_words[0]["start"], "end": 0, "text": "", "words": []}
        for i, w in enumerate(all_words):
            gap = w["start"] - all_words[i-1]["end"] if i > 0 else 0
            if gap > 1.0: # New segment after 1s silence
                current_segment["end"] = all_words[i-1]["end"]
                segments.append(current_segment)
                current_segment = {"id": len(segments), "start": w["start"], "end": 0, "text": "", "words": []}

            current_segment["words"].append({
                "word": w["word"],
                "start": w["start"],
                "end": w["end"],
                "probability": w["conf"]
            })
            current_segment["text"] += " " + w["word"]

        current_segment["end"] = all_words[-1]["end"]
        segments.append(current_segment)

    result = {
        "text": " ".join(full_text),
        "segments": segments,
        "language": "pt"
    }

    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=4, ensure_ascii=False)

    print(f"✅ EXTREME SPEED TRANSCRIPTION COMPLETE: {output_json}")
    return output_json

if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(1)
    transcribe_video(sys.argv[1], sys.argv[2])
