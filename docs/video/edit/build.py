#!/usr/bin/env python3
"""Deal Desk v2 assembler: marker-synced scenes (screen-capture (6).mp4) + card segments; voice beats placed at markers. Run: python3 build.py, then python3 mix.py. Paths are for the author machine."""
import subprocess, os, json, shutil, sys, concurrent.futures as cf
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from plan import M, ids, EV, D

HOME = "/Users/vijaychilaka"
R6 = f"{HOME}/Downloads/screen-capture (6).mp4"
O = f"{HOME}/Downloads/screen-capture (4).mp4"
SCR = os.path.dirname(os.path.abspath(__file__))
VOICE = f"{HOME}/Downloads/startup-ideas/deal-desk/docs/video/voice/audio/calm"
OUT = f"{HOME}/Downloads/deal-desk-final"
TMP = f"{OUT}/_work2"
os.makedirs(TMP, exist_ok=True)
TAG_O = eval(open(f"{SCR}/tag_O_iv.txt").read())

LEAD = 0.3      # footage starts this long before a marker
VOFF = 0.1      # voice starts this long after the marker
TAIL = 0.8      # breathing room after a beat

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: raise RuntimeError(" ".join(cmd[:8]) + "\n" + r.stderr[-900:])
    return r
def dur(p): return float(run(["ffprobe","-v","error","-show_entries","format=duration","-of","default=nw=1:nk=1",p]).stdout)

SITE = "[0:v]split=2[a][b];[b]crop=400:112:640:0[p];[a][p]overlay=1240:0,crop=2808:1440:36:36,scale=1920:985,pad=1920:1004:0:9:color=0x0c141b"
CARD = "[0:v]split=2[a][b];[b]crop=500:112:560:0[p];[a][p]overlay=1170:0,crop=2740:1392:70:36,scale=1920:975,pad=1920:1004:0:14:color=0x15110f"
def o_chain(s, e):
    iv = [(max(a, s), min(b, e)) for a, b in TAG_O if b > s and a < e]
    expr = "+".join(f"between(t+{s},{a:.2f},{b:.2f})" for a, b in iv)
    parts = ["[0:v]crop=2800:1500:40:36,split=3[a][b][c]", "[b]crop=500:78:560:0[p]", "[a][p]overlay=1150:0[m]"]
    last = "[m]"
    if iv:
        parts += ["[c]crop=280:6:0:1424,scale=280:66[q]", f"{last}[q]overlay=0:1434:enable='{expr}'[n]"]; last = "[n]"
    else:
        parts += ["[c]nullsink"]
    return ";".join(parts) + f";{last}scale=1920:-2,crop=1920:1004:0:12"

items = []   # dict(name, src, ss, len_src, chain, speed, hold, voice=[(wav, at_offset)], sfx=[(file, offset, gain)], kind)

def live(beat, nxt=None, tail=TAIL, compress=False, maxslow=1.25):
    m = EV[beat]
    i = ids.index(beat)
    avail = (M[i + 1] - M[i]) if i + 1 < len(M) else 99.0
    d = D[beat]; V = d + tail
    ss = m - LEAD
    if compress:
        items.append(dict(name=beat, src=R6, ss=ss, ln=avail, chain=SITE, speed=avail / V, hold=0.0, voice=[(beat, LEAD / (avail / V) + VOFF)], kind="live"))
        return
    if avail >= V:
        items.append(dict(name=beat, src=R6, ss=ss, ln=V, chain=SITE, speed=1.0, hold=0.0, voice=[(beat, LEAD + VOFF)], kind="live"))
    else:
        s = min(maxslow, V / avail)
        shown = avail * s
        items.append(dict(name=beat, src=R6, ss=ss, ln=avail, chain=SITE, speed=1 / s, hold=max(0.0, V - shown), voice=[(beat, LEAD * s + VOFF)], kind="live"))

def card_o(name, s, e, voice, sfx=(), tail=0.5):
    items.append(dict(name=name, src=O, ss=s, ln=e - s, chain=o_chain(s, e), speed=1.0, hold=0.0, voice=voice, sfx=list(sfx), kind="card", tail=tail))

def card_r6(name, ss, ee, t0, voices, sfx=(), tail=0.5):
    # voices: [(beat, time inside the card)], t0 = card start in the recording
    items.append(dict(name=name, src=R6, ss=ss, ln=ee - ss, chain=CARD, speed=1.0, hold=0.0,
                      voice=[(b, t0 + t - ss) for b, t in voices], sfx=[(f, t0 + t - ss, g) for f, t, g in sfx], kind="card", tail=tail))

W = "wipe.mp3"; H = "title_hit.mp3"; ST = "stamp.mp3"
# hook
for b in ["h1","h2","h3","h4","h5"]: live(b)
live("h6", tail=0.9)
card_o("st1", 50.2, 57.3, [("st1", 0.6)], [(W, 0.0, 1.0), (H, 0.5, 1.0)])
# chapter 2
for b in ["v1","v2","v3","v4","v5"]: live(b)
card_o("tr1", 68.4, 73.0, [("tr1", 0.25)], [(W, 0.0, 1.0)])
# the Walk
for b in ["w0","w1","w2","w3","w4","w5","w6","w7","w8"]: live(b)
for b in ["w9a","w9b","w9c"]: live(b)
card_o("tr2", 74.4, 78.9, [("tr2", 0.25)], [(W, 0.0, 1.0)])
# the Desk
live("d1"); live("d2", compress=True); live("d3")
for b in ["d4","d5","d6"]: live(b)
card_o("tr3", 80.4, 84.8, [("tr3", 0.25)], [(W, 0.0, 1.0)])
# AI + guard
live("a1"); live("a2")
card_r6("guard", 16.6, 30.5, 16.4, [("a3", 0.8)], [(ST, 9.0, 1.0)])
live("a4"); live("a5")
card_o("tr4", 86.4, 90.8, [("tr4", 0.25)], [(W, 0.0, 1.0)])
# Learn
for b in ["l1","l2b"]: pass
live("l1"); live("l2a", tail=0.25); live("l2b"); live("l3"); live("l4"); live("l5")
card_o("tr5", 97.9, 102.3, [("tr5", 0.25)], [(W, 0.0, 1.0)])
card_r6("redesign", 33.6, 90.95, 33.45, [("r1",0.7),("r2",4.78),("r3",28.19),("r4a",37.59),("r4b",44.55),("r4c",48.74)], [(ST, 50.74, 1.0)], tail=0.6)
card_o("tr6", 103.6, 108.3, [("tr6", 0.25)], [(W, 0.0, 1.0)])
card_r6("checks", 91.2, 154.9, 91.0, [("c1",0.7),("c2",4.58),("c3",11.05),("c4a",17.45),("c4b",23.8),("c4c",28.07),("c5a",33.53),("c5b",43.78),("c5c",49.89),("c6",58.84)], [(ST, 58.84, 1.0)], tail=0.0)
card_o("tr7", 109.6, 114.3, [("tr7", 0.25)], [(W, 0.0, 1.0)])
for b in ["n1","n2","n3"]: live(b, tail=(1.0 if b == "n3" else TAIL))
card_o("sh", 115.8, 124.0, [("sh", 0.5)], [(W, 0.0, 1.0)])
card_o("en", 130.7, 148.6, [("en", 0.5)], [(W, 0.0, 1.0), (H, 0.4, 1.0), ("end_chime.mp3", 1.2, 1.0)], tail=1.5)

# lengths: cards must hold until the voice ends
for it in items:
    if it["kind"] == "card":
        vend = max([at + D[b] for b, at in it["voice"]] + [0])
        base = it["ln"] / it["speed"]
        it["hold"] = max(0.0, vend + it.get("tail", 0.5) - base)

def render(it):
    out = f"{TMP}/{it['name']}.mp4"
    fg = f"{it['chain']},setpts=PTS/{it['speed']:.5f},fps=30"
    if it["hold"] > 0.01: fg += f",tpad=stop_mode=clone:stop_duration={it['hold']:.3f}"
    fg = fg.replace("[0:v]", "[0:v]", 1)
    # the chain ends on an implicit output; name it
    fg += "[v]"
    cmd = ["ffmpeg","-nostdin","-v","error","-y","-ss",f"{it['ss']:.3f}","-t",f"{it['ln']:.3f}","-i",it["src"],"-filter_complex",fg,"-map","[v]","-an",
           "-c:v","libx264","-preset","veryfast","-crf","20","-pix_fmt","yuv420p","-r","30",out]
    run(cmd); return out

if __name__ == "__main__":
    if "--plan" in sys.argv:
        t = 0
        for it in items:
            L = it["ln"] / it["speed"] + it["hold"]
            print(f"{t:7.1f} {L:6.1f} {it['name']:9s} speed={it['speed']:.2f} hold={it['hold']:.1f}")
            t += L
        print("total", t); sys.exit()
    with cf.ThreadPoolExecutor(4) as ex: files = list(ex.map(render, items))
    T = 0.0; tl = []
    for it, f in zip(items, files):
        L = dur(f); it["T"] = T; it["L"] = L; T += L
        tl.append(dict(name=it["name"], T=T - L, L=L, voice=[(b, T - L + at) for b, at in it["voice"]], sfx=[(f_, T - L + at, g) for f_, at, g in it.get("sfx", [])], kind=it["kind"]))
    open(f"{TMP}/list.txt", "w").write("".join(f"file '{f}'\n" for f in files))
    run(["ffmpeg","-nostdin","-v","error","-y","-f","concat","-safe","0","-i",f"{TMP}/list.txt","-c","copy",f"{TMP}/video_all.mp4"])
    json.dump(tl, open(f"{TMP}/timeline.json", "w"), indent=1)
    print("video", round(dur(f"{TMP}/video_all.mp4"), 1), "s; items", len(items))
