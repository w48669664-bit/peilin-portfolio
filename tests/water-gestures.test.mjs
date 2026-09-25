import test from 'node:test';
import assert from 'node:assert/strict';
import {bindWaterGestures} from '../src/waterGestures.js';

function fixture() {
  const handlers = new Map(), calls = [], timers = new Map();
  let sequence = 0, captured = null;
  const surface = {
    addEventListener: (type, fn, options) => handlers.set(type, {fn, options}),
    removeEventListener: type => handlers.delete(type),
    setPointerCapture: id => {captured = id;},
    hasPointerCapture: id => captured === id,
    releasePointerCapture: () => {captured = null;},
  };
  const api = bindWaterGestures(surface, {
    canStart: target => target === 'water',
    ...Object.fromEntries(['prepare','tap','press','hold','move','release'].map(name => [name, (...args) => calls.push([name, ...args])])),
    schedule: fn => {timers.set(++sequence, fn);return sequence;},
    unschedule: id => timers.delete(id),
  });
  return {api, handlers, calls, timers,
    emit(type, values = {}) {let prevented = false;handlers.get(type)?.fn({target:'water',cancelable:true,preventDefault:()=>{prevented=true;},...values});return prevented;},
    wait() {for (const [id, fn] of timers) {timers.delete(id);fn();}},
    count: name => calls.filter(item => item[0] === name).length,
  };
}
const finger = (x=100,y=100,id=1) => ({clientX:x,clientY:y,identifier:id});

test('vertical swipe preserves native scrolling and never turns into water drawing', () => {
  const f=fixture();f.emit('touchstart',{touches:[finger()]});
  assert.equal(f.emit('touchmove',{touches:[finger(102,75)]}),false);
  f.wait();f.emit('touchmove',{touches:[finger(102,20)]});
  f.emit('touchend',{touches:[],changedTouches:[finger(102,20)]});
  assert.equal(f.count('hold'),0);assert.equal(f.count('move'),0);assert.equal(f.count('tap'),0);
});
test('tap unlocks audio in start event but plays only after release', () => {
  const f=fixture();f.emit('touchstart',{touches:[finger()]});
  assert.equal(f.count('prepare'),1);assert.equal(f.count('tap'),0);
  f.emit('touchend',{touches:[],changedTouches:[finger()]});f.wait();
  assert.equal(f.count('tap'),1);assert.equal(f.count('hold'),0);
  assert.equal(f.calls.at(-2)[0],'release');
});
test('stationary long press claims subsequent movement, including very slow motion', () => {
  const f=fixture();f.emit('touchstart',{touches:[finger()]});f.wait();
  assert.equal(f.count('hold'),1);
  assert.equal(f.emit('touchmove',{touches:[finger(101,102)]}),true);
  assert.equal(f.calls.at(-1)[2],true);
  f.emit('touchend',{touches:[],changedTouches:[finger(101,102)]});
  assert.equal(f.calls.at(-2)[0],'release');assert.equal(f.calls.at(-1)[0],'prepare');assert.equal(f.count('tap'),0);
});
test('native scroll, cancelled touch, and non-cancellable pan terminate the hold', () => {
  for (const reason of ['scroll','touchcancel','native-pan']) {
    const f=fixture();f.emit('touchstart',{touches:[finger()]});
    if(reason==='native-pan'){f.wait();f.emit('touchmove',{touches:[finger(101,101)],cancelable:false});}
    else f.emit(reason);
    const before=f.count('release');f.wait();
    f.emit('touchmove',{touches:[finger(110,110)]});
    assert.equal(f.count('move'),0);assert.ok(before>0);
  }
});
test('second finger cancels water interaction and leaves pinch zoom available', () => {
  const f=fixture();f.emit('touchstart',{touches:[finger()]});f.wait();
  assert.equal(f.emit('touchstart',{touches:[finger(),finger(120,120,2)]}),false);
  assert.equal(f.emit('touchmove',{touches:[finger(),finger(125,125,2)]}),false);
  assert.equal(f.count('move'),0);assert.equal(f.calls.at(-1)[0],'release');
});
test('buttons and text regions keep their own touches; touch pointer events are not doubled', () => {
  const f=fixture();f.emit('touchstart',{target:'button',touches:[finger()]});f.wait();
  f.emit('pointerdown',{pointerId:1,pointerType:'touch',button:0});
  assert.equal(f.count('prepare'),0);assert.equal(f.count('hold'),0);assert.equal(f.count('press'),0);
});
test('mouse press keeps its trail after an idle pause and ends on pointer release', () => {
  const f=fixture();f.emit('pointerdown',{pointerId:1,pointerType:'mouse',button:0,clientX:100,clientY:100});
  f.emit('pointermove',{pointerId:2,pointerType:'pen',clientX:105,clientY:105});
  assert.equal(f.count('move'),0);
  f.emit('pointermove',{pointerId:1,pointerType:'mouse',clientX:101,clientY:101});
  assert.equal(f.calls.at(-1)[2],true);
  f.emit('pointerup',{pointerId:1,pointerType:'mouse'});assert.equal(f.calls.at(-1)[0],'release');
  f.api.dispose();assert.equal(f.handlers.size,0);assert.equal(f.timers.size,0);
});
