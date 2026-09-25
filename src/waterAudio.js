/** Small original Web Audio soundscape, started only by a water pointer gesture. */
export function createWaterAudio() {
  let context;
  let master;
  let noiseBuffer;
  let disposed = false;
  let enabled = true;
  let lastDrop = -Infinity;
  let lastTrail = -Infinity;
  const active = new Set();

  const unlock = () => {
    if (disposed || !enabled) return false;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    if (!context) {
      try {
        context = new AudioContext();
        master = context.createGain();
        master.gain.value = 0.38;
        master.connect(context.destination);
        noiseBuffer = context.createBuffer(1, Math.ceil(context.sampleRate * 0.6), context.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        // Smooth random water texture, with no external samples or network dependency.
        let prior = 0;
        for (let i = 0; i < data.length; i++) {
          prior = (prior + (Math.random() * 2 - 1) * 0.35) / 1.35;
          data[i] = prior * 1.6;
        }
      } catch { return false; }
    }
    if (context.state === 'suspended') context.resume().catch(() => {});
    return context.state !== 'closed';
  };

  function voice(source, filter, gain, pan, duration, delay = 0) {
    if (active.size >= 16) return;
    const start = context.currentTime + delay;
    const envelope = context.createGain();
    const panner = context.createStereoPanner?.();
    source.connect(filter || envelope);
    if (filter) filter.connect(envelope);
    if (panner) {
      panner.pan.value = Math.max(-0.85, Math.min(0.85, pan));
      envelope.connect(panner);
      panner.connect(master);
    } else envelope.connect(master);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain), start + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    const cleanup = () => {
      active.delete(source);
      source.disconnect();
      filter?.disconnect();
      envelope.disconnect();
      panner?.disconnect();
    };
    source.addEventListener('ended', cleanup, { once: true });
    active.add(source);
    source.start(start);
    source.stop(start + duration + 0.02);
  }

  function noise(gain, pan, frequency, duration) {
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = frequency;
    filter.Q.value = 0.65;
    voice(source, filter, gain, pan, duration);
  }

  return {
    setEnabled(value) {
      enabled = value;
      if (master && context.state !== 'closed') {
        master.gain.cancelScheduledValues(context.currentTime);
        master.gain.setTargetAtTime(value ? 0.38 : 0, context.currentTime, 0.025);
      }
    },
    drop(x = 0.5) {
      if (!unlock()) return;
      const now = context.currentTime;
      if (now - lastDrop < 0.085) return;
      lastDrop = now;
      const pan = (x - 0.5) * 1.45;
      const pitch = 620 + Math.random() * 200;
      for (let i = 0; i < 2; i++) {
        const bubble = context.createOscillator();
        bubble.type = 'sine';
        const delay = i * 0.035;
        bubble.frequency.setValueAtTime(pitch * (i ? 1.9 : 1.3), now + delay);
        bubble.frequency.exponentialRampToValueAtTime(pitch * (i ? 0.82 : 0.42), now + delay + 0.17);
        voice(bubble, null, i ? 0.09 : 0.2, pan, i ? 0.19 : 0.34, delay);
      }
      noise(0.2, pan, 1150, 0.38);
      const body = context.createOscillator();
      body.type = 'sine';
      body.frequency.setValueAtTime(210, now);
      body.frequency.exponentialRampToValueAtTime(85, now + 0.2);
      voice(body, null, 0.08, pan, 0.26);
    },
    trail(x = 0.5, strength = 0.5) {
      // Hover can never unlock sound or autoplay: a prior explicit click is required.
      if (!enabled || disposed || !context || context.state !== 'running') return;
      const now = context.currentTime;
      if (now - lastTrail < 0.16) return;
      lastTrail = now;
      noise(0.04 + Math.min(1, strength) * 0.05, (x - 0.5) * 1.5, 680 + strength * 480, 0.22);
    },
    suspend() { if (context?.state === 'running') context.suspend().catch(() => {}); },
    dispose() {
      disposed = true;
      active.forEach(source => { try { source.stop(); } catch { /* Already ended. */ } });
      active.clear();
      if (context && context.state !== 'closed') context.close().catch(() => {});
      context = null;
      noiseBuffer = null;
    },
  };
}
