export const BEAT_VH = 10;
export const TRANSITION_BEATS = 6;
export const STICKY_VIEWPORT_BASE_VH = 100;

export function scrollLengthFromBeats(sceneBeats: number, transitionBeats = 0) {
  return STICKY_VIEWPORT_BASE_VH + (sceneBeats + transitionBeats) * BEAT_VH;
}
