#!/usr/bin/env python3
"""Mixes voice, music, ambience and sfx for the v2 film from timeline.json, then muxes with video_all.mp4."""
import json, subprocess, os, sys
HOME="/Users/vijaychilaka"
OUT=f"{HOME}/Downloads/deal-desk-final"; TMP=f"{OUT}/_work2"
VOICE=f"{HOME}/Downloads/startup-ideas/deal-desk/docs/video/voice/audio/calm"
SND=f"{HOME}/Downloads/startup-ideas/deal-desk/docs/video/voice/sound"
tl=json.load(open(f"{TMP}/timeline.json"))
def run(cmd):
    r=subprocess.run(cmd,capture_output=True,text=True)
    if r.returncode: raise RuntimeError(" ".join(cmd[:6])+"\n"+r.stderr[-1200:])
def dur(p): return float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","default=nw=1:nk=1",p],capture_output=True,text=True).stdout)
TOTAL=dur(f"{TMP}/video_all.mp4")
print("film length",round(TOTAL,1))

def place(inputs, out, total, gain_each=None):
    """inputs: [(path, start_s, gain)] -> one wav of length total"""
    args=["ffmpeg","-nostdin","-v","error","-y"]; fl=[]
    for k,(p,t,g) in enumerate(inputs):
        args+=["-i",p]
        ms=int(t*1000)
        fl.append(f"[{k}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={g},adelay={ms}|{ms}[s{k}]")
    mix="".join(f"[s{k}]" for k in range(len(inputs)))
    fl.append(f"{mix}amix=inputs={len(inputs)}:normalize=0:dropout_transition=0,apad=whole_dur={total:.3f},atrim=0:{total:.3f}[o]")
    run(args+["-filter_complex",";".join(fl),"-map","[o]","-ar","48000",out])

# ---- voice
vin=[]
for it in tl:
    for b,t in it["voice"]: vin.append((f"{VOICE}/{b}.wav",t,1.0))
place(vin,f"{TMP}/voice.wav",TOTAL)
# ---- sfx
sg={"wipe.mp3":0.2,"stamp.mp3":0.5,"title_hit.mp3":0.9,"end_chime.mp3":0.5}
sin=[]
for it in tl:
    for f,t,g in it["sfx"]: sin.append((f"{SND}/{f}",t,sg[f]*g))
place(sin,f"{TMP}/sfx.wav",TOTAL)

# ---- ambience: crossfaded long bed, then cut to the live runs with soft edges
amb=[f"{SND}/new/amb1.mp3",f"{SND}/new/amb4.mp3",f"{SND}/new/amb3.mp3"]
base=f"{TMP}/amb_base.wav"
if not os.path.exists(base):
    fl=[]; 
    for k in range(3): fl.append(f"[{k}:a]aformat=sample_rates=48000:channel_layouts=stereo,loudnorm=I=-34:TP=-9:LRA=7,aformat=sample_rates=48000:channel_layouts=stereo[n{k}]")
    fl.append("[n0][n1]acrossfade=d=1.5:c1=tri:c2=tri[x1];[x1][n2]acrossfade=d=1.5:c1=tri:c2=tri[o]")
    run(["ffmpeg","-nostdin","-v","error","-y",*sum([["-i",a] for a in amb],[]),"-filter_complex",";".join(fl),"-map","[o]",base])
bd=dur(base); n=int(TOTAL/(bd-2))+2
fl=[f"[{k}:a]anull[b{k}]" for k in range(n)]
chain="[b0]"
for k in range(1,n):
    chain+=f"[b{k}]acrossfade=d=2:c1=tri:c2=tri"+(f"[c{k}];[c{k}]" if k<n-1 else "[o]")
# fix chain syntax: build iteratively
fl=[]; prev="[0:a]"
for k in range(1,n):
    out="[o]" if k==n-1 else f"[c{k}]"
    fl.append(f"{prev}[{k}:a]acrossfade=d=2:c1=tri:c2=tri{out}"); prev=out
run(["ffmpeg","-nostdin","-v","error","-y",*sum([["-i",base] for _ in range(n)],[]),"-filter_complex",";".join(fl),"-map","[o]","-t",f"{TOTAL:.2f}",f"{TMP}/amb_long.wav"])
# live runs
runs=[]
for it in tl:
    if it["kind"]=="live":
        if runs and abs(runs[-1][1]-it["T"])<0.05: runs[-1][1]=it["T"]+it["L"]
        else: runs.append([it["T"],it["T"]+it["L"]])
fl=[]; 
for k,(a,b) in enumerate(runs):
    L=b-a; ms=int(a*1000)
    fl.append(f"[0:a]atrim=start={a:.3f}:end={b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.5,afade=t=out:st={L-0.5:.3f}:d=0.5,adelay={ms}|{ms}[r{k}]")
mix="".join(f"[r{k}]" for k in range(len(runs)))
fl.append(f"{mix}amix=inputs={len(runs)}:normalize=0:dropout_transition=0,apad=whole_dur={TOTAL:.3f},atrim=0:{TOTAL:.3f}[o]")
run(["ffmpeg","-nostdin","-v","error","-y","-i",f"{TMP}/amb_long.wav","-filter_complex",";".join(fl),"-map","[o]","-ar","48000",f"{TMP}/amb.wav"])
print("ambience runs",len(runs))

# ---- music: intro under the hook, bed under the film, outro on the end card
card_end=[it for it in tl if it["name"]=="en"][0]["T"]
hook_end=[it for it in tl if it["name"]=="st1"][0]["T"]
fl=[
 f"[0:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=0.12,atrim=0:{hook_end+2.0:.2f},afade=t=out:st={hook_end-2.0:.2f}:d=4[i]",
 f"[1:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=0.22,atrim=0:{card_end-(hook_end-3.0)+0.5:.2f},afade=t=in:d=4,afade=t=out:st={card_end-(hook_end-3.0)-2.5:.2f}:d=3,adelay={int((hook_end-3.0)*1000)}|{int((hook_end-3.0)*1000)}[m]",
 f"[2:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=0.34,atrim=0:{TOTAL-card_end:.2f},afade=t=in:d=0.8,afade=t=out:st={TOTAL-card_end-4:.2f}:d=4,adelay={int(card_end*1000)}|{int(card_end*1000)}[e]",
 f"[i][m][e]amix=inputs=3:normalize=0:dropout_transition=0,apad=whole_dur={TOTAL:.3f},atrim=0:{TOTAL:.3f}[o]"]
run(["ffmpeg","-nostdin","-v","error","-y","-i",f"{SND}/intro.mp3","-i",f"{SND}/main_long.wav","-i",f"{SND}/end.mp3","-filter_complex",";".join(fl),"-map","[o]","-ar","48000",f"{TMP}/music.wav"])

# ---- final: duck music and ambience under the voice, add sfx, normalise
fl=[
 "[0:a]asplit=3[v1][v2][v3]",
 "[1:a][v2]sidechaincompress=threshold=0.02:ratio=6:attack=40:release=700:makeup=1[md]",
 "[2:a]volume=0.75[ad]",
 "[ad][v3]sidechaincompress=threshold=0.03:ratio=3:attack=40:release=500:makeup=1[add]",
 "[v1]volume=1.0[vv]",
 "[vv][md][add][3:a]amix=inputs=4:normalize=0:dropout_transition=0,loudnorm=I=-16:TP=-1.5:LRA=9,aresample=48000,aformat=channel_layouts=stereo[o]"]
run(["ffmpeg","-nostdin","-v","error","-y","-i",f"{TMP}/voice.wav","-i",f"{TMP}/music.wav","-i",f"{TMP}/amb.wav","-i",f"{TMP}/sfx.wav","-filter_complex",";".join(fl),"-map","[o]","-ar","48000",f"{TMP}/mix.wav"])
final=sys.argv[1] if len(sys.argv)>1 else f"{OUT}/deal-desk-video-v2.mp4"
run(["ffmpeg","-nostdin","-v","error","-y","-i",f"{TMP}/video_all.mp4","-i",f"{TMP}/mix.wav","-map","0:v","-map","1:a","-c:v","copy","-c:a","aac","-b:a","192k","-ar","48000","-movflags","+faststart","-shortest",final])
print("final",final,round(dur(final),1))
