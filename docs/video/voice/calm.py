#!/usr/bin/env python3
"""Calms the delivery of every voice beat in audio/beats: a slightly slower tempo and longer pauses between sentences,
so the narration breathes. Writes audio/calm/<id>.wav and audio/calm/durations.json.
The v4 model ignores the speed setting, so the pace is shaped here instead.

   python3 calm.py [--tempo 0.93] [--pause 1.5]
"""
import json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = f"{HERE}/audio/beats"
OUT = f"{HERE}/audio/calm"
os.makedirs(OUT, exist_ok=True)

args = sys.argv[1:]
def opt(name, default):
    return float(args[args.index(name) + 1]) if name in args else default
TEMPO = opt("--tempo", 0.93)   # 1.0 = as generated
PAUSE = opt("--pause", 1.5)    # multiply each inner pause (never shorter than MINGAP)
MINGAP = 0.34
MAXGAP = 0.95

def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)

def speech_chunks(path):
    r = run(["ffmpeg", "-nostdin", "-hide_banner", "-i", path, "-af", "silencedetect=noise=-38dB:d=0.18", "-f", "null", "-"])
    total = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", path]).stdout)
    st = None; sil = []
    for l in r.stderr.splitlines():
        m = re.search(r"silence_start: ([\d.]+)", l)
        if m: st = float(m.group(1))
        m = re.search(r"silence_end: ([\d.]+)", l)
        if m and st is not None: sil.append((st, float(m.group(1)))); st = None
    chunks = []; prev = 0.0
    for a, b in sil:
        if a - prev > 0.12: chunks.append((prev, a))
        prev = b
    if total - prev > 0.12: chunks.append((prev, total))
    return chunks or [(0.0, total)], total

durs = {}
ids = sorted(f[:-4] for f in os.listdir(SRC) if f.endswith(".mp3"))
for i in ids:
    path = f"{SRC}/{i}.mp3"
    chunks, total = speech_chunks(path)
    fl = []
    parts = []
    for k, (a, b) in enumerate(chunks):
        a2 = max(0.0, a - 0.03); b2 = min(total, b + 0.05)
        fl.append(f"[0:a]atrim=start={a2:.3f}:end={b2:.3f},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono[c{k}]")
        parts.append(f"[c{k}]")
        if k < len(chunks) - 1:
            gap = chunks[k + 1][0] - b                      # the original pause
            g = min(MAXGAP, max(MINGAP, gap * PAUSE))
            fl.append(f"anullsrc=r=44100:cl=mono,atrim=0:{g:.3f},asetpts=PTS-STARTPTS[g{k}]")
            parts.append(f"[g{k}]")
    fl.append("".join(parts) + f"concat=n={len(parts)}:v=0:a=1,atempo={TEMPO}[o]")
    out = f"{OUT}/{i}.wav"
    r = run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", path, "-filter_complex", ";".join(fl), "-map", "[o]", "-ar", "48000", out])
    if r.returncode:
        print("FAILED", i, r.stderr[-300:]); continue
    durs[i] = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", out]).stdout)

json.dump(durs, open(f"{OUT}/durations.json", "w"), indent=1)
words = {b["id"]: len(b["text"].split()) for b in json.load(open(f"{HERE}/beats.json"))}
tw = sum(words[k] for k in durs); td = sum(durs.values())
print(f"{len(durs)} beats, {td:.0f} s of speech, {tw / td:.2f} words/s ({tw / td * 60:.0f} wpm) at tempo {TEMPO}, pause x{PAUSE}")
