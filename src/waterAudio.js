/** CC0 field recordings. Sources, licenses and measurements: docs/WATER_AUDIO.md. */
const SAMPLE_ROOT = `${import.meta.env?.BASE_URL || '/'}assets/audio/water/`;
const SAMPLES = [
  { file: 'hand-splash.mp3', offset: 0.035, gain: 0.55 },
  { file: 'small-splash.mp3', offset: 0, gain: 0.48 },
  { file: 'water-swish.mp3', offset: 0.095, gain: 0.15 },
];
const MAX_VOICES = 6;
const MAX_DROPS = 3;
const TRAIL_FADE = 0.12;
const clamp = (value, min, max, fallback) => Math.max(min, Math.min(max, Number.isFinite(value) ? value : fallback));

export function createWaterAudio() {
  let context, master, buffers, loading;
  let disposed = false, enabled = true;
  let lastDrop = -Infinity, lastSample = 1, dropIntent = 0;
  let trailSession = null;
  const active = new Map();
  const controller = new AbortController();
  // Fetch only: no context or sound before an explicit user gesture.
  const files = SAMPLES.map(({ file }) => fetch(`${SAMPLE_ROOT}${file}`, { signal: controller.signal })
    .then(response => response.ok ? response.arrayBuffer() : null).catch(() => null));

  function unlock() {
    if (disposed || !enabled || document.hidden) return null;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!context) {
      try {
        context = new AudioContext();
        master = context.createGain();
        master.gain.value = 0.65;
        master.connect(context.destination);
        context.addEventListener?.('statechange', onContextState);
      } catch {
        context?.close().catch(() => {});
        context = null;
        return null;
      }
    }
    if (context.state === 'closed') return null;
    // iOS can report "interrupted", not just "suspended". Resume inside the
    // trusted touchstart/press, before awaiting downloads or decode work.
    const resumed = context.state !== 'running' ? context.resume().catch(() => {}) : Promise.resolve();
    if (!loading) {
      const decodingContext = context;
      loading = Promise.all(files.map(async file => {
        const bytes = await file;
        if (!bytes || disposed || decodingContext.state === 'closed') return null;
        try { return await decodingContext.decodeAudioData(bytes.slice(0)); } catch { return null; }
      })).then(decoded => { if (!disposed) buffers = decoded; });
    }
    return Promise.all([resumed, loading]);
  }

  const canPlay = () => enabled && !disposed && context?.state === 'running' && !document.hidden;
  const pan = x => (clamp(x, 0, 1, 0.5) - 0.5) * 1.4;
  const streamGain = strength => 0.2 + 0.34 * Math.sqrt(clamp(strength, 0, 1, 0.15));

  function disconnectSession(session) {
    if (!session.requested && ![...active.values()].some(voice => voice.session === session)) {
      session.gain?.disconnect();
      session.panner?.disconnect();
    }
  }

  function addVoice(buffer, { when, offset, duration, gain, attack, release, destination, type, session }) {
    if (!canPlay() || active.size >= MAX_VOICES || duration <= 0) return false;
    const source = context.createBufferSource();
    const envelope = context.createGain();
    source.buffer = buffer;
    source.playbackRate.value = 1;
    envelope.gain.setValueAtTime(0, when);
    envelope.gain.linearRampToValueAtTime(gain, when + attack);
    envelope.gain.setValueAtTime(gain, when + Math.max(attack, duration - release));
    envelope.gain.linearRampToValueAtTime(0, when + duration);
    source.connect(envelope);
    envelope.connect(destination);
    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      active.delete(source);
      source.removeEventListener?.('ended', cleanup);
      source.disconnect();
      envelope.disconnect();
      if (type === 'drop') destination.disconnect();
      if (session) disconnectSession(session);
    };
    const voice = { source, envelope, type, session, cleanup };
    active.set(source, voice);
    source.addEventListener('ended', cleanup, { once: true });
    try { source.start(when, offset, duration); } catch { cleanup(); return false; }
    return true;
  }

  function playDrop(index, x) {
    if (!canPlay()) return;
    const buffer = buffers?.[index];
    const dropCount = [...active.values()].filter(voice => voice.type === 'drop').length;
    if (!buffer || dropCount >= MAX_DROPS || active.size >= MAX_VOICES) return;
    const destination = context.createStereoPanner?.() || context.createGain();
    if (destination.pan) destination.pan.value = pan(x);
    destination.connect(master);
    const sample = SAMPLES[index];
    const offset = Math.min(sample.offset, buffer.duration * 0.2);
    if (!addVoice(buffer, {
      when: context.currentTime, offset, duration: buffer.duration - offset,
      gain: sample.gain / Math.sqrt(dropCount + 1), attack: 0.008, release: 0.1,
      destination, type: 'drop',
    })) destination.disconnect();
  }

  function updateTrail(session, x, strength) {
    session.x = clamp(x, 0, 1, 0.5);
    session.strength = clamp(strength, 0, 1, 0.15);
    if (!session.gain || !canPlay()) return;
    const now = context.currentTime;
    session.gain.gain.setTargetAtTime(streamGain(session.strength), now, 0.07);
    session.panner?.pan.setTargetAtTime(pan(session.x), now, 0.06);
  }

  function scheduleTrail(session) {
    if (trailSession !== session || !session.requested) return;
    if (!canPlay()) { stopAll(); return; }
    const buffer = buffers?.[2];
    if (!buffer) return;
    const now = context.currentTime;
    // If a foreground frame was late, continue from now instead of firing a backlog.
    session.nextStart = Math.max(session.nextStart, now + 0.012);
    while (session.nextStart < now + 0.16 && active.size < MAX_VOICES) {
      // Slightly different real-recording excerpts make the join less metronomic.
      // Playback stays at its original pitch; no generated noise is introduced.
      const offset = Math.min(0.105 + Math.random() * 0.04, buffer.duration * 0.15);
      const duration = Math.min(0.64 + Math.random() * 0.055, buffer.duration - offset);
      const overlap = Math.min(0.22, duration * 0.35);
      const added = addVoice(buffer, {
        when: session.nextStart, offset, duration, gain: 1.25,
        attack: overlap, release: overlap, destination: session.gain,
        type: 'trail', session,
      });
      if (!added) break;
      session.nextStart += duration - overlap;
    }
  }

  function beginTrail(session) {
    if (trailSession !== session || !session.requested || !canPlay() || !buffers?.[2]) return;
    session.gain = context.createGain();
    session.gain.gain.value = 0;
    session.panner = context.createStereoPanner?.();
    if (session.panner) {
      session.panner.pan.value = pan(session.x);
      session.gain.connect(session.panner);
      session.panner.connect(master);
    } else session.gain.connect(master);
    session.nextStart = context.currentTime + 0.012;
    updateTrail(session, session.x, session.strength);
    scheduleTrail(session);
    if (trailSession === session && session.requested) {
      session.timer = setInterval(() => scheduleTrail(session), 75);
    }
  }

  function stopTrail(fade = true) {
    const session = trailSession;
    trailSession = null;
    if (!session) return;
    session.requested = false;
    clearInterval(session.timer);
    const shouldFade = fade && context?.state === 'running' && !document.hidden;
    const now = context?.currentTime || 0;
    if (session.gain && shouldFade) {
      session.gain.gain.cancelScheduledValues(now);
      session.gain.gain.setTargetAtTime(0, now, TRAIL_FADE / 4);
    }
    for (const voice of [...active.values()]) {
      if (voice.session !== session) continue;
      try { voice.source.stop(shouldFade ? now + TRAIL_FADE : now); } catch { /* Already ended. */ }
      if (!shouldFade) voice.cleanup();
    }
    disconnectSession(session);
  }

  function stopAll() {
    dropIntent++;
    stopTrail(false);
    for (const voice of [...active.values()]) {
      try { voice.source.stop(); } catch { /* Already ended. */ }
      voice.cleanup();
    }
  }

  function suspend() {
    stopAll();
    if (context && context.state !== 'closed' && context.state !== 'suspended') context.suspend().catch(() => {});
  }
  function onContextState() { if (context?.state !== 'running') stopAll(); }
  function onVisibility() { if (document.hidden) suspend(); }
  document.addEventListener?.('visibilitychange', onVisibility);

  return {
    prepare() { return unlock() || Promise.resolve(); },
    setEnabled(value) {
      enabled = Boolean(value);
      if (!enabled) stopAll();
      if (master && context?.state !== 'closed') {
        master.gain.cancelScheduledValues(context.currentTime);
        master.gain.setTargetAtTime(enabled ? 0.65 : 0, context.currentTime, 0.025);
      }
    },
    drop(x = 0.5) {
      if (!enabled || disposed || document.hidden) return;
      const now = performance.now();
      if (now - lastDrop < 170) return;
      lastDrop = now;
      const request = ++dropIntent;
      const ready = unlock();
      ready?.then(() => {
        if (request !== dropIntent) return;
        let next = lastSample === 0 ? 1 : 0;
        if (!buffers?.[next]) next = next === 0 ? 1 : 0;
        lastSample = next;
        playDrop(next, x);
      }).catch(() => {});
    },
    startTrail(x = 0.5, strength = 0.15) {
      if (!enabled || disposed || document.hidden) return;
      if (trailSession?.requested) { updateTrail(trailSession, x, strength); return; }
      const session = { requested: true, x, strength, timer: null };
      trailSession = session;
      const ready = unlock();
      if (!ready) { stopTrail(false); return; }
      ready.then(() => beginTrail(session)).catch(() => {
        if (trailSession === session) stopTrail(false);
      });
    },
    trail(x = 0.5, strength = 0.15) {
      // Updating hover cannot unlock or start audio. Only startTrail owns a gesture.
      if (trailSession?.requested) updateTrail(trailSession, x, strength);
    },
    endTrail() {
      // Releasing also cancels a still-loading press sound, preventing late playback.
      dropIntent++;
      stopTrail(true);
    },
    suspend,
    dispose() {
      if (disposed) return;
      disposed = true;
      controller.abort();
      document.removeEventListener?.('visibilitychange', onVisibility);
      stopAll();
      context?.removeEventListener?.('statechange', onContextState);
      if (context && context.state !== 'closed') context.close().catch(() => {});
      context = master = buffers = null;
    },
  };
}
