import json
import os

def generate_ass(whisper_json, output_ass):
    with open(whisper_json, 'r', encoding='utf-8') as f:
        data = json.load(f)

    header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,60,&H0000FFFF,&H00FFFFFF,&H00000000,&H00FFFFFF,-1,0,0,0,100,100,0,0,3,2,1,2,10,10,850,1
Style: Karaoke,Arial,60,&H0000FFFF,&H00FFFFFF,&H00000000,&H00FFFFFF,-1,0,0,0,100,100,0,0,3,2,1,2,10,10,850,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

    def format_time(seconds):
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = seconds % 60
        return f"{h}:{m:02}:{s:05.2f}"

    with open(output_ass, 'w', encoding='utf-8') as f:
        f.write(header)
        for segment in data.get('segments', []):
            start = format_time(segment['start'])
            end = format_time(segment['end'])

            # Karaoke effect: {\kXX} where XX is duration in centiseconds
            karaoke_text = ""
            if 'words' in segment and segment['words']:
                current_time = segment['start']
                for word_data in segment['words']:
                    word = word_data['word'].strip().upper()
                    # Duration in centiseconds
                    duration = int((word_data['end'] - word_data['start']) * 100)
                    # Gap since last word
                    gap = int((word_data['start'] - current_time) * 100)
                    if gap > 0:
                        karaoke_text += f"{{\\k{gap}}}"
                    karaoke_text += f"{{\\k{duration}}}{word} "
                    current_time = word_data['end']
            else:
                karaoke_text = segment['text'].strip().upper()

            f.write(f"Dialogue: 0,{start},{end},Default,,0,0,0,,{karaoke_text}\n")

    return output_ass

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        sys.exit(1)
    generate_ass(sys.argv[1], sys.argv[2])
