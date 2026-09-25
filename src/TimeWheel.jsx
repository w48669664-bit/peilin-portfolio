import {useEffect, useRef, useState} from 'react';
import {ArrowCounterClockwise, GearSix, Moon, Sun, SunHorizon, CloudSun, SpeakerHigh, SpeakerSlash} from '@phosphor-icons/react';
import './time-wheel.css';

const wrap = n => (Math.round(n) % 1440 + 1440) % 1440;
const clock = n => `${String(Math.floor(wrap(n) / 60)).padStart(2, '0')}:${String(wrap(n) % 60).padStart(2, '0')}`;
const localMinutes = () => {const d = new Date(); return d.getHours() * 60 + d.getMinutes();};
const presets = [
  {label: '晨光', en: 'Dawn', value: 390, Icon: SunHorizon},
  {label: '日间', en: 'Daylight', value: 720, Icon: Sun},
  {label: '黄昏', en: 'Dusk', value: 1120, Icon: CloudSun},
  {label: '月夜', en: 'Moonlight', value: 1380, Icon: Moon},
];
const period = m => m < 330 || m >= 1260 ? '月夜' : m < 480 ? '晨光' : m < 1020 ? '日间' : '黄昏';

/** A short escapement click: a crisp tooth contact, a second catch and a muted body. */
function useMechanicalSound(enabled) {
  const context = useRef(null), noise = useRef(null), last = useRef(-Infinity);
  const enabledRef = useRef(enabled), unlocking = useRef(false), tooth = useRef(0);
  enabledRef.current = enabled;
  useEffect(() => () => {
    const ctx = context.current;
    context.current = null; noise.current = null; unlocking.current = false;
    if (ctx && ctx.state !== 'closed') ctx.close().catch(() => {});
  }, []);
  return () => {
    const elapsed = performance.now() - last.current;
    if (!enabledRef.current || elapsed < 58) return;
    last.current = performance.now();
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    try {
      const ctx = context.current || (context.current = new AudioContext());
      const tick = () => {
        if (context.current !== ctx || ctx.state !== 'running' || !enabledRef.current) return;
        // Reuse a dry, double-contact noise impulse. It never loops or sustains.
        if (!noise.current) {
          const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * .035), ctx.sampleRate);
          const samples = buffer.getChannelData(0);
          let seed = 73819;
          for (let i = 0; i < samples.length; i++) {
            const t = i / ctx.sampleRate;
            seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
            const attack = Math.min(1, t / .00035) * Math.exp(-t / .0028);
            const catchTime = t - .0105;
            const catchPulse = catchTime > 0 ? .48 * Math.min(1, catchTime / .00025) * Math.exp(-catchTime / .0018) : 0;
            samples[i] = (seed / 2147483648 - 1) * (attack + catchPulse);
          }
          noise.current = buffer;
        }
        const start = ctx.currentTime, accent = tooth.current++ % 2;
        // Rapid winding is slightly softer, so a run of ticks stays comfortable.
        const level = elapsed < 100 ? .85 : 1;
        const master = ctx.createGain(); master.gain.value = level; master.connect(ctx.destination);
        const source = ctx.createBufferSource(), highpass = ctx.createBiquadFilter();
        const lowpass = ctx.createBiquadFilter(), contact = ctx.createGain();
        source.buffer = noise.current; source.playbackRate.value = accent ? 1.04 : .98;
        highpass.type = 'highpass'; highpass.frequency.value = 850; highpass.Q.value = .55;
        lowpass.type = 'lowpass'; lowpass.frequency.value = 5700; lowpass.Q.value = .55;
        contact.gain.value = .29;
        source.connect(highpass); highpass.connect(lowpass); lowpass.connect(contact); contact.connect(master);
        source.start(start);
        const body = ctx.createOscillator(), bodyGain = ctx.createGain();
        body.type = 'triangle'; body.frequency.setValueAtTime(accent ? 290 : 255, start);
        body.frequency.exponentialRampToValueAtTime(150, start + .022);
        bodyGain.gain.setValueAtTime(.0001, start);
        bodyGain.gain.exponentialRampToValueAtTime(.085, start + .001);
        bodyGain.gain.exponentialRampToValueAtTime(.0001, start + .029);
        body.connect(bodyGain); bodyGain.connect(master); body.start(start); body.stop(start + .031);
        const metal = ctx.createOscillator(), metalGain = ctx.createGain();
        metal.type = 'sine'; metal.frequency.value = accent ? 2470 : 2210;
        metalGain.gain.setValueAtTime(.0001, start);
        metalGain.gain.exponentialRampToValueAtTime(.052, start + .0007);
        metalGain.gain.exponentialRampToValueAtTime(.0001, start + .009);
        metal.connect(metalGain); metalGain.connect(master); metal.start(start); metal.stop(start + .011);
        // All voices finish inside 36 ms, before the next permitted detent.
        source.onended = () => {source.disconnect(); highpass.disconnect(); lowpass.disconnect(); contact.disconnect(); master.disconnect();};
        metal.onended = () => {metal.disconnect(); metalGain.disconnect();};
        body.onended = () => {body.disconnect(); bodyGain.disconnect();};
      };
      if (ctx.state === 'suspended') {
        if (unlocking.current) return;
        unlocking.current = true;
        ctx.resume().then(tick).catch(() => {}).finally(() => {unlocking.current = false;});
      } else tick();
    } catch { /* Sound is an enhancement; time remains fully interactive. */ }
  };
}

export function TimeWheel({minutes, setMinutes, manual, setManual, soundEnabled = true, onSoundToggle}) {
  const wheel = useRef(null), value = useRef(minutes), drag = useRef(null), wheelRemainder = useRef(0);
  const [turn, setTurn] = useState(minutes), [dragging, setDragging] = useState(false);
  const previous = useRef(minutes), changeRef = useRef(null), click = useMechanicalSound(soundEnabled);
  value.current = minutes;
  useEffect(() => {
    let delta = minutes - previous.current;
    if (delta > 720) delta -= 1440;
    if (delta < -720) delta += 1440;
    setTurn(v => v + delta); previous.current = minutes;
  }, [minutes]);
  const change = (next, automatic = false) => {
    const normalized = wrap(next);
    if (normalized !== value.current) {click(); value.current = normalized; setMinutes(normalized);}
    setManual(!automatic);
  };
  changeRef.current = change;
  useEffect(() => {
    const node = wheel.current;
    const onWheel = event => {
      if (event.ctrlKey) return;
      event.preventDefault(); event.stopPropagation();
      wheelRemainder.current += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 120 : 1);
      const steps = Math.trunc(wheelRemainder.current / 16);
      if (!steps) return;
      wheelRemainder.current -= steps * 16;
      changeRef.current(value.current + Math.sign(steps) * Math.min(Math.abs(steps), 12) * 5);
    };
    node.addEventListener('wheel', onWheel, {passive: false});
    return () => node.removeEventListener('wheel', onWheel);
  }, []);
  const pointerAngle = (event, rect) => Math.atan2(event.clientY - rect.top - rect.height / 2, event.clientX - rect.left - rect.width / 2);
  const startDrag = event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    wheel.current.focus({preventScroll: true});
    const rect = wheel.current.getBoundingClientRect();
    drag.current = {id: event.pointerId, angle: pointerAngle(event, rect), minutes: value.current, rect};
    event.currentTarget.setPointerCapture(event.pointerId); setDragging(true);
  };
  const moveDrag = event => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    const angle = pointerAngle(event, current.rect);
    let difference = angle - current.angle;
    if (difference > Math.PI) difference -= Math.PI * 2;
    if (difference < -Math.PI) difference += Math.PI * 2;
    current.minutes -= difference / (Math.PI * 2) * 1440;
    current.angle = angle;
    change(current.minutes);
  };
  const endDrag = () => {drag.current = null; setDragging(false);};
  const onKeyDown = event => {
    const increments = {ArrowUp: 5, ArrowRight: 5, ArrowDown: -5, ArrowLeft: -5, PageUp: 60, PageDown: -60};
    if (event.key in increments) {event.preventDefault(); change(value.current + increments[event.key] * (event.shiftKey ? 6 : 1));}
    else if (event.key === 'Home' || event.key === 'End') {event.preventDefault(); change(event.key === 'Home' ? 0 : 1439);}
  };
  return <section className="time-wheel-panel" aria-labelledby="time-wheel-title">
    <header className="tw-heading"><span className="eyebrow">TIME & LIGHT</span><h1 id="time-wheel-title">光影时刻</h1><p>转动表盘，选择你喜欢的光线。</p></header>
    <div className={`tw-instrument ${dragging ? 'is-dragging' : ''}`} style={{'--dial-turn': `${-turn / 4}deg`, '--gear-turn': `${-turn * 1.5}deg`}}>
      <div className="tw-indicator" aria-hidden="true"/>
      <div className="tw-wheel" ref={wheel} tabIndex="0" role="slider" aria-label="转动时轮调整光影" aria-valuemin={0} aria-valuemax={1439} aria-valuenow={wrap(minutes)} aria-valuetext={`${clock(minutes)}，${period(minutes)}`} aria-describedby="time-wheel-help" onKeyDown={onKeyDown} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}>
        <div className="tw-rotor" aria-hidden="true">
          {Array.from({length: 96}, (_, i) => <span key={i} className={`tw-tick ${i % 4 === 0 ? 'major' : ''}`} style={{'--tick-angle': `${i * 3.75}deg`}}/>)}
          {Array.from({length: 12}, (_, i) => <span key={i} className="tw-hour" style={{'--hour-angle': `${i * 30}deg`}}>{String(i * 2).padStart(2, '0')}</span>)}
        </div>
      </div>
      <div className="tw-core"><span className="tw-mode">{manual ? '此刻的光影' : '本地时间'}</span><label className="tw-sr-only" htmlFor="time-wheel-input">输入光影时间</label><input id="time-wheel-input" type="time" value={clock(minutes)} onChange={e => {if (e.target.value) {const [h, m] = e.target.value.split(':').map(Number); change(h * 60 + m);}}}/><span className="tw-phase">{period(minutes)} · {soundEnabled ? '声音已开启' : '静音探索'}</span><div className="tw-gears" aria-hidden="true"><GearSix size={35} weight="thin"/><GearSix size={25} weight="thin"/></div></div>
    </div>
    <div className="tw-presets" aria-label="光影预设">{presets.map(({label, en, value: preset, Icon}) => <button key={label} onClick={() => change(preset)} className={period(minutes) === label ? 'selected' : ''} aria-pressed={period(minutes) === label}><Icon size={19} weight="light"/><span>{label}</span><small>{en}</small></button>)}</div>
    <footer className="tw-footer"><p id="time-wheel-help">拖动圆环 / 滚轮转动 <span>· 方向键微调</span></p><div className="tw-footer-actions"><button onClick={() => change(localMinutes(), true)}><ArrowCounterClockwise size={15}/>回到现在</button>{onSoundToggle && <button onClick={onSoundToggle} aria-pressed={soundEnabled} aria-label={soundEnabled ? '关闭交互音效' : '开启交互音效'}>{soundEnabled ? <SpeakerHigh size={15}/> : <SpeakerSlash size={15}/>}音效{soundEnabled ? '开' : '关'}</button>}</div></footer>
  </section>;
}
