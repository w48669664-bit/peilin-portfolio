/** Keep native page scrolling until a deliberate, stationary long press. */
export function bindWaterGestures(surface, {
  canStart, prepare, tap, press, hold, move, release,
  schedule = setTimeout, unschedule = clearTimeout,
}) {
  let touch = null;
  let holdTimer = null;
  let pointer = null;
  const position = event => ({clientX: event.clientX, clientY: event.clientY});
  const clearHold = () => { if (holdTimer !== null) unschedule(holdTimer); holdTimer = null; };
  const cancel = () => {
    clearHold();
    touch = null;
    const captured = pointer;
    pointer = null;
    if (captured !== null && surface.hasPointerCapture?.(captured)) surface.releasePointerCapture(captured);
    release();
  };
  const pointerDown = event => {
    if (event.pointerType === 'touch' || event.isPrimary === false || event.button > 0 || !canStart(event.target)) return;
    cancel();
    pointer = event.pointerId;
    try { surface.setPointerCapture?.(pointer); } catch { /* Detached or unsupported capture. */ }
    press(position(event));
  };
  const pointerMove = event => {
    if (event.pointerType === 'touch' || event.isPrimary === false) return;
    if (pointer !== null && event.pointerId !== pointer) return;
    if (pointer === null && !canStart(event.target)) return;
    move(position(event), pointer !== null);
  };
  const pointerEnd = event => { if (event.pointerType !== 'touch' && event.pointerId === pointer) cancel(); };
  const pointerLeave = () => { if (pointer === null) release(); };
  const touchStart = event => {
    cancel();
    if (event.touches.length !== 1 || !canStart(event.target)) return;
    const first = event.touches[0];
    touch = {id: first.identifier, origin: position(first), point: position(first), drawing: false};
    // Warm up decoding and resume an already-unlocked context before the hold timer.
    prepare();
    holdTimer = schedule(() => {
      holdTimer = null;
      if (!touch || !canStart(event.target)) return;
      touch.drawing = true;
      hold(touch.point);
    }, 320);
  };
  const touchMove = event => {
    if (!touch) return;
    if (event.touches.length !== 1) { cancel(); return; }
    const current = Array.from(event.touches).find(item => item.identifier === touch.id);
    if (!current) { cancel(); return; }
    touch.point = position(current);
    if (!touch.drawing) {
      // Once movement expresses scroll intent, never take over this gesture later.
      if (Math.hypot(current.clientX - touch.origin.clientX, current.clientY - touch.origin.clientY) > 8) cancel();
      return;
    }
    if (!event.cancelable) { cancel(); return; }
    // Only a long press claims movement. Swipes and pinch zoom retain browser defaults.
    event.preventDefault();
    move(touch.point, true);
  };
  const touchEnd = event => {
    if (!touch) return;
    const ended = Array.from(event.changedTouches).find(item => item.identifier === touch.id);
    if (!ended) return;
    const tapped = !touch.drawing && event.touches.length === 0;
    cancel();
    if (tapped && canStart(event.target)) tap(position(ended));
    else prepare(); // Safari may require the first completed tap/touch before audio.
  };
  const contextMenu = event => { if (touch?.drawing && event.cancelable) event.preventDefault(); };
  const listeners = [
    ['pointerdown', pointerDown], ['pointermove', pointerMove], ['pointerup', pointerEnd],
    ['pointercancel', pointerEnd], ['lostpointercapture', pointerEnd], ['pointerleave', pointerLeave],
    ['touchstart', touchStart, {passive: true}], ['touchmove', touchMove, {passive: false}],
    ['touchend', touchEnd, {passive: true}], ['touchcancel', cancel, {passive: true}],
    ['contextmenu', contextMenu], ['scroll', cancel, true],
  ];
  for (const [type, listener, options] of listeners) surface.addEventListener(type, listener, options);
  return {cancel, dispose() {cancel();for (const [type, listener, options] of listeners) surface.removeEventListener(type, listener, options);}};
}
