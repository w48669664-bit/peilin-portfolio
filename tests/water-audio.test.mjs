import assert from 'node:assert/strict';
import test from 'node:test';
import { createWaterAudio } from '../src/waterAudio.js';

const flush = () => new Promise(resolve => setImmediate(resolve));

function harness(t, { delayed = false, failed = false } = {}) {
  const saved = new Map(['window', 'document', 'fetch', 'performance', 'setInterval', 'clearInterval'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  let wall = 0, nextTimer = 0, resolveFiles;
  const waits = delayed ? new Promise(resolve => { resolveFiles = resolve; }) : Promise.resolve();
  const timers = new Map(), listeners = new Map(), contexts = [], sources = [], gains = [], panners = [];
  class Param {
    constructor(value = 0) { this.value = value; this.targets = []; }
    setValueAtTime(value, at) { this.value = value; this.targets.push({ value, at }); }
    linearRampToValueAtTime(value, at) { this.value = value; this.targets.push({ value, at }); }
    setTargetAtTime(value, at, constant) { this.value = value; this.targets.push({ value, at, constant }); }
    cancelScheduledValues() {}
  }
  class Node {
    constructor() { this.connected = false; this.disconnected = false; }
    connect(node) { this.connected = true; this.destination = node; }
    disconnect() { this.disconnected = true; }
  }
  class Source extends Node {
    constructor(ctx) { super(); this.ctx = ctx; this.playbackRate = new Param(1); this.listeners = new Set(); sources.push(this); }
    addEventListener(_, callback) { this.listeners.add(callback); }
    removeEventListener(_, callback) { this.listeners.delete(callback); }
    start(at, offset, duration) { this.started = true; this.at = at; this.offset = offset; this.duration = duration; this.endsAt = at + duration; }
    stop(at = this.ctx.currentTime) { this.stoppedAt = at; this.endsAt = Math.min(this.endsAt ?? Infinity, at); this.checkEnded(); }
    checkEnded() { if (!this.ended && this.started && this.ctx.currentTime >= this.endsAt) { this.ended = true; [...this.listeners].forEach(fn => fn()); } }
  }
  class Context {
    constructor() { this.state = 'suspended'; this.currentTime = 0; this.destination = new Node(); this.listeners = new Set(); this.resumes = 0; contexts.push(this); }
    addEventListener(_, fn) { this.listeners.add(fn); }
    removeEventListener(_, fn) { this.listeners.delete(fn); }
    setState(state) { this.state = state; [...this.listeners].forEach(fn => fn()); }
    resume() { this.resumes++; this.setState('running'); return Promise.resolve(); }
    suspend() { this.setState('suspended'); return Promise.resolve(); }
    close() { this.setState('closed'); return Promise.resolve(); }
    createGain() { const node = new Node(); node.gain = new Param(1); gains.push(node); return node; }
    createStereoPanner() { const node = new Node(); node.pan = new Param(); panners.push(node); return node; }
    createBufferSource() { return new Source(this); }
    decodeAudioData(bytes) { const id = new Uint8Array(bytes)[0]; return Promise.resolve({ id, duration: id === 2 ? 0.875 : 1.331 }); }
  }
  Object.assign(globalThis, {
    window: { AudioContext: Context },
    document: {
      hidden: false,
      addEventListener(type, fn) { listeners.set(fn, type); },
      removeEventListener(_, fn) { listeners.delete(fn); },
    },
    fetch: async url => {
      await waits;
      const id = url.includes('hand-splash') ? 0 : url.includes('small-splash') ? 1 : 2;
      return { ok: !failed, arrayBuffer: async () => Uint8Array.of(id).buffer };
    },
    performance: { now: () => wall },
    setInterval(fn, delay) { const id = ++nextTimer; timers.set(id, { fn, delay, next: wall + delay }); return id; },
    clearInterval(id) { timers.delete(id); },
  });
  const audio = createWaterAudio();
  t.after(() => {
    audio.dispose();
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  return {
    audio, contexts, sources, gains, panners, timers,
    resolve: () => resolveFiles?.(),
    get started() { return sources.filter(source => source.started); },
    get live() { return sources.filter(source => source.started && !source.ended && !source.disconnected); },
    advance(ms) {
      for (let rest = ms; rest > 0;) {
        const delta = Math.min(5, rest); rest -= delta; wall += delta;
        contexts.forEach(ctx => { if (ctx.state === 'running') ctx.currentTime += delta / 1000; });
        sources.forEach(source => source.checkEnded());
        for (const timer of [...timers.values()]) if (wall >= timer.next) { timer.next += timer.delay; timer.fn(); }
      }
    },
    hidden(value) {
      document.hidden = value;
      [...listeners].forEach(([fn, type]) => { if (type === 'visibilitychange') fn(); });
    },
  };
}

test('preload and prepare are silent; hover cannot unlock the AudioContext', async t => {
  const h = harness(t);
  await flush();
  h.audio.trail(0.2, 1);
  assert.equal(h.contexts.length, 0);
  await h.audio.prepare();
  assert.equal(h.contexts.length, 1);
  assert.equal(h.contexts[0].state, 'running');
  assert.equal(h.started.length, 0);
  assert.equal(h.timers.size, 0);
});

test('slow dragging and a stationary hold keep a crossfaded real recording stream alive', async t => {
  const h = harness(t);
  await h.audio.prepare();
  h.audio.startTrail(0.1, 0.01);
  await flush();
  assert.ok(h.started.length > 0, 'there must be no minimum speed threshold');
  h.advance(2500);
  assert.ok(h.started.length >= 5, 'one gesture must schedule continued playback without repeated start calls');
  assert.equal(h.timers.size, 1);
  const starts = h.started;
  for (let i = 1; i < starts.length; i++) assert.ok(starts[i].at < starts[i - 1].at + starts[i - 1].duration, 'recorded excerpts must overlap without gaps');
  assert.ok(starts.every(source => source.buffer.id === 2 && source.playbackRate.value === 1));
  h.audio.trail(0.9, 0);
  const bus = starts[0].destination.destination;
  assert.ok(bus.gain.targets.at(-1).value > 0, 'stationary hold keeps a low, nonzero gain');
  assert.ok(h.panners[0].pan.targets.at(-1).value > 0, 'slow drag updates stereo position');
  h.advance(500);
  assert.ok(h.live.length > 0);
});

test('first touch can prepare silently then begin a held stream after delayed download', async t => {
  const h = harness(t, { delayed: true });
  h.audio.prepare();
  h.audio.startTrail(0.4, 0.03);
  h.advance(1800);
  assert.equal(h.started.length, 0);
  h.resolve(); await flush();
  assert.ok(h.started.length > 0, 'the same held gesture must play without requiring a second touch');
  assert.equal(h.contexts.length, 1);
});

test('release cancels pending stream and press playback before decoding completes', async t => {
  const h = harness(t, { delayed: true });
  h.audio.prepare(); h.audio.drop(0.3); h.audio.startTrail(0.3, 0.15);
  h.advance(500); h.audio.endTrail();
  h.resolve(); await flush(); h.advance(2500);
  assert.equal(h.started.length, 0, 'released gestures must never play late');
  assert.equal(h.timers.size, 0);
});

test('release fades out active water and leaves no future scheduler', async t => {
  const h = harness(t);
  h.audio.startTrail(); await flush(); h.advance(600);
  const before = h.started.length;
  h.audio.endTrail();
  assert.equal(h.timers.size, 0);
  assert.ok(h.live.every(source => source.stoppedAt <= h.contexts[0].currentTime + 0.121));
  h.advance(200);
  assert.equal(h.live.length, 0);
  h.advance(2500);
  assert.equal(h.started.length, before);
});

test('mute stops voices and pending starts; unmuting cannot restart an ended gesture', async t => {
  const h = harness(t);
  h.audio.startTrail(); await flush(); h.advance(400);
  h.audio.setEnabled(false);
  assert.equal(h.live.length, 0); assert.equal(h.timers.size, 0);
  const before = h.started.length;
  h.audio.setEnabled(true); h.audio.trail(0.8, 1); h.advance(1500);
  assert.equal(h.started.length, before);
  h.audio.startTrail(); h.audio.setEnabled(false); await flush();
  assert.equal(h.started.length, before, 'muting cancels an async start even if the files are cached');
});

test('backgrounding stops the stream and foregrounding alone cannot restart it', async t => {
  const h = harness(t);
  h.audio.startTrail(); await flush(); h.advance(400);
  h.hidden(true);
  assert.equal(h.contexts[0].state, 'suspended');
  assert.equal(h.live.length, 0); assert.equal(h.timers.size, 0);
  const before = h.started.length;
  h.hidden(false); h.advance(1500);
  assert.equal(h.started.length, before);
  await h.audio.prepare();
  assert.equal(h.contexts[0].state, 'running');
  assert.equal(h.started.length, before, 'prepare remains silent after returning to the tab');
});

test('iOS interrupted state stops old scheduling and resumes on a new trusted gesture', async t => {
  const h = harness(t);
  h.audio.startTrail(); await flush(); h.advance(400);
  h.contexts[0].setState('interrupted');
  assert.equal(h.live.length, 0); assert.equal(h.timers.size, 0);
  const resumes = h.contexts[0].resumes;
  h.audio.startTrail(0.6, 0.02); await flush();
  assert.equal(h.contexts[0].state, 'running');
  assert.ok(h.contexts[0].resumes > resumes);
  assert.ok(h.live.length > 0);
});

test('rapid taps cannot exhaust stream capacity or create unbounded voices', async t => {
  const h = harness(t);
  await h.audio.prepare(); h.audio.startTrail(); await flush();
  for (let i = 0; i < 18; i++) {
    h.audio.drop(i % 2 ? 0.8 : 0.2); await flush(); h.advance(180);
    assert.ok(h.live.length <= 6);
  }
  assert.ok(h.started.filter(source => source.buffer.id === 2).length > 5);
  h.audio.dispose();
  assert.equal(h.live.length, 0); assert.equal(h.timers.size, 0);
  assert.equal(h.contexts[0].state, 'closed');
});

test('missing recordings stay silent with no synthesis fallback or polling loop', async t => {
  const h = harness(t, { failed: true });
  h.audio.drop(); h.audio.startTrail(); await flush(); h.advance(2000);
  assert.equal(h.started.length, 0);
  assert.equal(h.timers.size, 0);
});
