/** CC0 field recordings. Sources, licenses and audio measurements: docs/WATER_AUDIO.md. */
const SAMPLE_ROOT = `${import.meta.env.BASE_URL}assets/audio/water/`;
const SAMPLES = [
  { file: 'hand-splash.mp3', offset: 0.035, gain: 0.55 },
  { file: 'small-splash.mp3', offset: 0, gain: 0.48 },
  { file: 'water-swish.mp3', offset: 0.095, gain: 0.15 },
];

export function createWaterAudio() {
  let context;
  let master;
  let buffers;
  let loading;
  let disposed = false;
  let enabled = true;
  let lastDrop = -Infinity;
  let lastTrail = -Infinity;
  let lastSample = 1;
  let intent = 0;
  const active = new Map();
  const controller = new AbortController();

  // Downloading small local files does not play audio or create an AudioContext.
  // Preloading avoids a network delay between the first water touch and its sound.
  const files = SAMPLES.map(({ file }) => fetch(`${SAMPLE_ROOT}${file}`, { signal: controller.signal })
    .then(response => response.ok ? response.arrayBuffer() : null)
    .catch(() => null));

  function unlock() {
    if (disposed || !enabled) return null;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!context) {
      try {
        context = new AudioContext();
        master = context.createGain();
        master.gain.value = 0.65;
        master.connect(context.destination);
      } catch {
        context?.close().catch(() => {});
        context = null;
        return null;
      }
    }
    if (context.state === 'closed') return null;
    // Called directly by the explicit pointer gesture, including on iOS.
    const resumed = context.state === 'suspended' ? context.resume().catch(() => {}) : Promise.resolve();
    if (!loading) {
      const decodingContext = context;
      loading = Promise.all(files.map(async file => {
        const bytes = await file;
        if (!bytes || disposed || decodingContext.state === 'closed') return null;
        try { return await decodingContext.decodeAudioData(bytes.slice(0)); } catch { return null; }
      })).then(decoded => {
        if (!disposed) buffers = decoded;
      });
    }
    return Promise.all([resumed, loading]);
  }

  function play(index, x, gainScale = 1) {
    if (!enabled || disposed || !context || context.state !== 'running' || document.hidden) return;
    const buffer = buffers?.[index];
    if (!buffer || active.size >= 4) return;
    const sample = SAMPLES[index];
    const offset = Math.min(sample.offset, buffer.duration * 0.2);
    const duration = buffer.duration - offset;
    const now = context.currentTime;
    const source = context.createBufferSource();
    source.buffer = buffer;
    // Preserve the actual recorded water: no oscillators, pitch shift or synthetic noise.
    source.playbackRate.value = 1;
    const envelope = context.createGain();
    const panner = context.createStereoPanner?.();
    // Leave headroom when several natural transients overlap during rapid taps.
    const gain = sample.gain * gainScale / Math.sqrt(active.size + 1);
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(gain, now + 0.008);
    envelope.gain.setValueAtTime(gain, now + Math.max(0.01, duration - 0.1));
    envelope.gain.linearRampToValueAtTime(0, now + duration);
    source.connect(envelope);
    if (panner) {
      panner.pan.value = Math.max(-0.8, Math.min(0.8, (x - 0.5) * 1.4));
      envelope.connect(panner);
      panner.connect(master);
    } else envelope.connect(master);
    const cleanup = () => {
      active.delete(source);
      source.disconnect();
      envelope.disconnect();
      panner?.disconnect();
    };
    source.addEventListener('ended', cleanup, { once: true });
    active.set(source, cleanup);
    source.start(now, offset, duration);
  }

  function stopVoices() {
    for (const [source, cleanup] of active) {
      try { source.stop(); } catch { /* Already ended. */ }
      cleanup();
    }
  }

  return {
    setEnabled(value) {
      enabled = Boolean(value);
      if (!enabled) intent++;
      if (master && context?.state !== 'closed') {
        master.gain.cancelScheduledValues(context.currentTime);
        master.gain.setTargetAtTime(enabled ? 0.65 : 0, context.currentTime, 0.025);
      }
    },
    drop(x = 0.5) {
      if (!enabled || disposed) return;
      const now = performance.now();
      if (now - lastDrop < 170) return;
      lastDrop = now;
      const request = ++intent;
      const ready = unlock();
      if (!ready) return;
      ready.then(() => {
        // Preserve the first explicit gesture while local samples finish loading.
        // Muting, a newer gesture, backgrounding or disposal cancels this request.
        if (request !== intent) return;
        let next = lastSample === 0 ? 1 : 0;
        if (!buffers?.[next]) next = next === 0 ? 1 : 0;
        lastSample = next;
        play(next, x);
      }).catch(() => {});
    },
    trail(x = 0.5, strength = 0.5) {
      // Hover alone never unlocks sound. Sparse, quiet real swishes avoid a mechanical loop.
      if (!enabled || disposed || !context || context.state !== 'running' || !buffers || strength < 0.38) return;
      const now = performance.now();
      if (now - lastTrail < 1000 || now - lastDrop < 950 || active.size) return;
      lastTrail = now;
      play(2, x, 0.65 + Math.min(1, strength) * 0.35);
    },
    suspend() {
      intent++;
      stopVoices();
      if (context?.state === 'running') context.suspend().catch(() => {});
    },
    dispose() {
      disposed = true;
      intent++;
      controller.abort();
      stopVoices();
      if (context && context.state !== 'closed') context.close().catch(() => {});
      context = null;
      buffers = null;
      master = null;
    },
  };
}
