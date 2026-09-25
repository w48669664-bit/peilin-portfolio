import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {createWaterAudio} from './waterAudio.js';
const RIPPLE_COUNT=24;
const vertex=`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;
const fragment=`precision highp float;
varying vec2 vUv;uniform sampler2D uImage;uniform float uTime,uAspect,uImageAspect,uDay,uDawn,uDusk,uMotion;uniform vec4 uRipples[24];
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float wave(vec2 p,float t){return sin(p.x*29.+p.y*35.+t*.8)*.36+sin(p.x*-17.+p.y*52.-t*.64)*.25+sin(p.x*63.+p.y*78.+t*.95)*.12+sin(p.x*113.-p.y*89.-t*.43)*.055;}
void main(){vec2 uv=vUv;float t=uTime*uMotion;vec2 p=vec2((uv.x-.5)*uAspect,(exp(uv.y*1.2)-1.)*.9);float w=wave(p,t);float wx=wave(p+vec2(.002,0.),t)-w;float wy=wave(p+vec2(0.,.002),t)-w;vec2 distortion=vec2(wx,wy)*.011*uMotion;float rippleLight=0.;
for(int i=0;i<24;i++){vec4 r=uRipples[i];float age=uTime-r.z;if(age>=0.&&age<4.5){
  vec2 d=(uv-r.xy)*vec2(uAspect,1.65);float radius=length(d);
  float front=age*.19;float behind=front-radius;float spread=.038+age*.025;
  float packet=exp(-pow((radius-front)/spread,2.));
  float wake=exp(-max(behind,0.)*13.)*smoothstep(-.012,.025,behind);
  float rings=sin((radius-front)*135.)*(packet*.6+wake*.4);
  float amplitude=rings*exp(-age*.75)*r.w*uMotion;
  distortion+=normalize(d+vec2(.0001))*amplitude*.017;
  rippleLight+=amplitude*.1;
}}
vec2 fit=vec2(1.);if(uAspect>uImageAspect)fit.y=uImageAspect/uAspect;else fit.x=uAspect/uImageAspect;
vec2 sampleUv=(uv-.5)*fit+.5+distortion;vec3 base=texture2D(uImage,clamp(sampleUv,.002,.998)).rgb;
vec3 night=base*vec3(.26,.40,.51);vec3 day=base*vec3(.81,.91,.92);vec3 col=mix(night,day,uDay);
col=mix(col,base*vec3(1.12,.69,.42),uDusk*.78);col=mix(col,base*vec3(.79,.77,.72),uDawn*.48);
float lightX=.46+uDusk*.1;float spread=mix(.045,.12,uDay)+(.9-uv.y)*.07;float band=exp(-pow((uv.x-lightX+sin(uv.y*18.+t*.15)*.023)/spread,2.));float facets=pow(noise(vec2(uv.x*62.+sin(uv.y*38.+t*.4)*2.,uv.y*210.-t*.7)),7.)*2.;float shine=band*facets*(.6+uv.y*.55);vec3 glow=mix(vec3(.60,.77,.88),vec3(.89,.93,.92),uDay);glow=mix(glow,vec3(1.,.72,.42),uDusk);
col+=glow*(shine*.75+rippleLight*.6);float edge=smoothstep(.85,.2,length((uv-.5)*vec2(.95,.8)));col*=.78+.22*edge;gl_FragColor=vec4(col,1.);}`;

export function WaterScene({minutes,reduced,paused,onStatus,soundEnabled=true}) {
 const host=useRef(null),audio=useRef(null),live=useRef({minutes,reduced,paused,soundEnabled}),[ready,setReady]=useState(false);
 live.current={minutes,reduced,paused,soundEnabled};
 useEffect(()=>{audio.current?.setEnabled(soundEnabled)},[soundEnabled]);
 useEffect(()=>{
  let renderer,material,geometry,texture,frame,observer,disposed=false;
  let clock=0,last=performance.now(),cursor=0,lastMove=0,previous=null,pressed=false;
  const el=host.current;
  const sound=createWaterAudio();audio.current=sound;sound.setEnabled(live.current.soundEnabled);
  const ripples=Array.from({length:RIPPLE_COUNT},()=>new THREE.Vector4(0,0,-20,0));
  const point=event=>{const b=el.getBoundingClientRect();return {x:(event.clientX-b.left)/b.width,y:1-(event.clientY-b.top)/b.height,aspect:b.width/b.height}};
  const ripple=(p,strength)=>ripples[cursor++%RIPPLE_COUNT].set(p.x,p.y,clock,strength);
  const down=event=>{
   if(live.current.paused||event.isPrimary===false||event.button>0)return;
   const p=point(event);pressed=true;previous={...p,time:performance.now()};
   if(live.current.soundEnabled)sound.drop(p.x);
   if(!live.current.reduced)ripple(p,1);
   if(event.pointerType!=='mouse')el.setPointerCapture?.(event.pointerId);
  };
  const move=event=>{
   if(live.current.paused||live.current.reduced||event.isPrimary===false)return;
   if(event.pointerType!=='mouse'&&!pressed)return;
   const now=performance.now();if(now-lastMove<32)return;
   const p=point(event),prior=previous;previous={...p,time:now};lastMove=now;
   if(!prior||now-prior.time>220)return;
   const distance=Math.hypot((p.x-prior.x)*p.aspect,(p.y-prior.y)*1.65);
   if(distance<.006)return;
   const strength=Math.min(.42,.12+distance*1.5)*(pressed?1.2:1);
   // Interpolate droplets so fast motion leaves a continuous wake, not scattered rings.
   const steps=Math.min(4,Math.max(1,Math.ceil(distance/.035)));
   for(let i=1;i<=steps;i++)ripple({x:prior.x+(p.x-prior.x)*i/steps,y:prior.y+(p.y-prior.y)*i/steps},strength);
   if(live.current.soundEnabled)sound.trail(p.x,Math.min(1,distance*8));
  };
  const up=()=>{pressed=false;};
  const leave=()=>{previous=null;pressed=false;};
  const visibility=()=>{if(document.hidden){sound.suspend();previous=null;}};
  el.addEventListener('pointerdown',down);el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',leave);el.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',visibility);
  const fail=()=>{if(!disposed){setReady(false);onStatus?.('静态水面')}};
  const lost=event=>{event.preventDefault();fail()};
  const restored=()=>{if(!disposed){setReady(true);onStatus?.('动态水面')}};
  const cleanup=()=>{
   disposed=true;cancelAnimationFrame(frame);observer?.disconnect();sound.dispose();audio.current=null;
   el.removeEventListener('pointerdown',down);el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',leave);el.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',visibility);
   renderer?.domElement.removeEventListener('webglcontextlost',lost);renderer?.domElement.removeEventListener('webglcontextrestored',restored);
   texture?.dispose();material?.dispose();geometry?.dispose();renderer?.dispose();renderer?.domElement.remove();
  };
  try {
   renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'});
   renderer.setPixelRatio(Math.min(devicePixelRatio,matchMedia('(max-width:700px)').matches?1.25:1.7));el.append(renderer.domElement);
   const scene=new THREE.Scene(),camera=new THREE.Camera();
   material=new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms:{uImage:{value:null},uTime:{value:0},uAspect:{value:1},uImageAspect:{value:1.5},uDay:{value:0},uDawn:{value:0},uDusk:{value:0},uMotion:{value:1},uRipples:{value:ripples}}});
   geometry=new THREE.PlaneGeometry(2,2);scene.add(new THREE.Mesh(geometry,material));
   const resize=()=>{renderer.setSize(el.clientWidth,el.clientHeight);material.uniforms.uAspect.value=el.clientWidth/Math.max(1,el.clientHeight)};
   observer=new ResizeObserver(resize);observer.observe(el);resize();
   renderer.domElement.addEventListener('webglcontextlost',lost);renderer.domElement.addEventListener('webglcontextrestored',restored);
   new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}assets/water/waterbed.webp`,img=>{
    if(disposed){img.dispose();return;}
    texture=img;texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;material.uniforms.uImage.value=texture;material.uniforms.uImageAspect.value=img.image.width/img.image.height;
    setReady(true);onStatus?.('动态水面');
    let previousReduced=live.current.reduced,lastRendered=-Infinity;
    const render=now=>{
     if(disposed)return;frame=requestAnimationFrame(render);const dt=Math.min((now-last)/1000,.1);last=now;if(document.hidden)return;
     const state=live.current;if(!state.reduced&&!state.paused)clock+=dt;
     if(state.reduced!==previousReduced){ripples.forEach(r=>r.w=0);previousReduced=state.reduced;}
     const hour=state.minutes/60,day=THREE.MathUtils.smoothstep(Math.sin((hour-6)*Math.PI/12),-.12,.65),dawn=Math.exp(-Math.pow((hour-6.4)/1.3,2)),dusk=Math.exp(-Math.pow((hour-18.5)/1.45,2));
     let lightChanging=false;
     for(const [k,v]of [['uDay',day],['uDawn',dawn],['uDusk',dusk]]){if(Math.abs(material.uniforms[k].value-v)>.001)lightChanging=true;material.uniforms[k].value=THREE.MathUtils.lerp(material.uniforms[k].value,v,1-Math.exp(-dt*4))}
     material.uniforms.uTime.value=clock;material.uniforms.uMotion.value=state.reduced?0:1;
     // Keep the static view responsive to time changes without continuously repainting it.
     if((state.reduced||state.paused)&&!lightChanging&&now-lastRendered<500)return;
     renderer.render(scene,camera);lastRendered=now;
    };
    frame=requestAnimationFrame(render);
   },undefined,fail);
  } catch {fail();}
  return cleanup;
 },[]);
 return <div ref={host} className={`water-scene ${ready?'is-ready':''}`} aria-hidden="true" style={{backgroundImage:`url('${import.meta.env.BASE_URL}assets/water/waterbed.webp')`,touchAction:'none'}}/>;
}
