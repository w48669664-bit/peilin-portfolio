"""Original deterministic ambient compositions. No third-party recordings or melodies."""
from pathlib import Path
import numpy as np, wave, subprocess
root=Path(__file__).resolve().parents[1]/'public/assets/audio';root.mkdir(parents=True,exist_ok=True)
sr=24000;duration=64;t=np.arange(sr*duration)/sr
tracks=[('daybreak',[48,55,60,64,67],3),('drift',[45,52,57,60,64],11),('moonlit',[41,48,53,57,60],29)]
for name,notes,seed in tracks:
 rng=np.random.default_rng(seed);out=np.zeros((len(t),2))
 for j,midi in enumerate(notes):
  f=440*2**((midi-69)/12);env=.5+.5*np.sin(2*np.pi*t/(16+j*8)+j)
  tone=np.sin(2*np.pi*f*t+.12*np.sin(t*.21+j))*.06+np.sin(2*np.pi*f*2.001*t)*.012
  pan=.15+j*.16;out[:,0]+=tone*env*(1-pan);out[:,1]+=tone*env*pan
 for j,start in enumerate(np.arange(2,60,4)):
  midi=notes[(j*3+seed)%len(notes)]+24;f=440*2**((midi-69)/12);a=t-start;env=np.where(a>=0,(1-np.exp(-np.maximum(a,0)*7))*np.exp(-np.maximum(a,0)/2.8),0)
  bell=(np.sin(2*np.pi*f*a)+.18*np.sin(2*np.pi*f*2*a))*.022*env
  pan=rng.uniform(.2,.8)
  for delay,gain in [(0,1),(.37,.35),(.79,.18)]:
   shift=int(delay*sr);v=np.roll(bell,shift)*gain;v[:shift]=0;out[:,0]+=v*(1-pan);out[:,1]+=v*pan
 fade=np.minimum(np.clip(t/3,0,1),np.clip((duration-t)/4,0,1));out*=fade[:,None]
 out=np.tanh(out*1.2);wav=root/(name+'.wav')
 with wave.open(str(wav),'w') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((out*32767).astype('<i2').tobytes())
 subprocess.run(['ffmpeg','-y','-loglevel','error','-i',str(wav),'-c:a','libmp3lame','-b:a','128k',str(root/(name+'.mp3'))],check=True);wav.unlink()
 print(name,'64s original composition')
