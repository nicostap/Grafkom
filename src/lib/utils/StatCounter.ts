import { writable } from "svelte/store";

// @hmr:keep-all

export const fpsStore = writable(0);
export const tickStore = writable(0);

const fpsBuffer: number[] = [0];
const fpsBufferSamples = 60;

const tickBuffer: number[] = [];
const tickBufferSamples = 60;

export function calculateTick(tickStart: number) {
  const tickEnd = performance.now();
  const tick = tickEnd - tickStart;

  tickBuffer.push(tick);
  if (tickBuffer.length > tickBufferSamples) {
    tickBuffer.shift();
  }

  const sum = tickBuffer.reduce((a, b) => a + b, 0);
  const avg = sum / tickBuffer.length;

  tickStore.set(avg);
}

export function calculateFPS(dt: number) {
  const fps = 1000 / dt;

  fpsBuffer.push(fps);
  if (fpsBuffer.length > fpsBufferSamples) {
    fpsBuffer.shift();
  }

  const sum = fpsBuffer.reduce((a, b) => a + b, 0);
  const avg = sum / fpsBuffer.length;

  fpsStore.set(avg);
}
