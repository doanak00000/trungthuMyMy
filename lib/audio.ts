"use client";

import { audioConfig } from "@/data/festival";

/**
 * Âm thanh nhẹ nhàng cho cả trải nghiệm, không cần file nhạc:
 * - nhạc nền ngũ cung kiểu đàn tranh (tổng hợp bằng Web Audio)
 * - gió đêm rất nhỏ
 * - chuông, trống lân, tiếng đom đóm khi tương tác
 * Chỉ bắt đầu sau lần chạm đầu tiên của người dùng.
 */

export type Mood = "street" | "walk" | "quiet" | "gift";

const MOOD_LEVEL: Record<Mood, number> = { street: 1, walk: 0.9, quiet: 0.45, gift: 0.32 };

// D major pentatonic (D E F# A B) — nghe dân gian, dịu.
const SCALE = [293.66, 329.63, 369.99, 440, 493.88, 587.33, 659.25, 739.99, 880];
const STORAGE_KEY = "tt-sound";

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private timer: number | null = null;
  private nextNoteTime = 0;
  private step = 3;
  private phraseLeft = 0;
  private started = false;
  private element: HTMLAudioElement | null = null;
  private mood: Mood = "street";
  private listeners = new Set<(on: boolean) => void>();
  enabled = true;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.enabled = window.localStorage.getItem(STORAGE_KEY) !== "off";
      } catch {
        /* private mode */
      }
    }
  }

  subscribe(fn: (on: boolean) => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  /** Gọi trong một sự kiện chạm/nhấn để trình duyệt cho phép phát âm thanh. */
  unlock() {
    if (!this.enabled) return;
    try {
      if (!this.ctx) this.build();
      void this.ctx?.resume();
      if (!this.started) this.startMusic();
      this.element?.play().catch(() => undefined);
    } catch {
      /* Web Audio không khả dụng: im lặng là được */
    }
  }

  toggle() {
    this.setEnabled(!this.enabled);
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    try {
      window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
    } catch {
      /* ignore */
    }
    if (on) {
      this.unlock();
      this.ramp(this.master, audioConfig.volume, 0.6);
    } else {
      this.ramp(this.master, 0, 0.4);
      this.element?.pause();
    }
    this.listeners.forEach((fn) => fn(on));
  }

  setMood(mood: Mood) {
    this.mood = mood;
    const level = MOOD_LEVEL[mood];
    this.ramp(this.musicBus, level, 2.5);
    if (this.element) this.element.volume = audioConfig.volume * level;
  }

  // ---------- sfx ----------

  bell(pitch = 1) {
    const c = this.ready();
    if (!c) return;
    const t = c.currentTime;
    [1, 2.76, 5.4].forEach((ratio, i) => {
      this.tone(1046 * pitch * ratio, t, 1.8 - i * 0.4, 0.09 / (i + 1), "sine", this.sfxBus!);
    });
  }

  chime() {
    const c = this.ready();
    if (!c) return;
    const f = SCALE[5 + Math.floor(Math.random() * 4)] * 2;
    this.tone(f, c.currentTime, 0.9, 0.06, "sine", this.sfxBus!);
  }

  thud() {
    const c = this.ready();
    if (!c) return;
    const t = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(48, t + 0.18);
    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    o.connect(g).connect(this.sfxBus!);
    o.start(t);
    o.stop(t + 0.32);
  }

  /** Trống lân: tùng · tùng · cắc — tùng */
  drums() {
    const c = this.ready();
    if (!c) return;
    const t = c.currentTime;
    const hits: [number, "tung" | "cac"][] = [
      [0, "tung"],
      [0.26, "tung"],
      [0.52, "cac"],
      [0.66, "tung"],
      [1.05, "tung"],
      [1.2, "cac"],
      [1.34, "tung"],
    ];
    hits.forEach(([dt, kind]) => (kind === "tung" ? this.drumHit(t + dt) : this.clack(t + dt)));
    this.cymbal(t + 0.66);
    this.cymbal(t + 1.34);
  }

  // ---------- internals ----------

  private ready() {
    if (!this.enabled || !this.ctx || !this.sfxBus) return null;
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private build() {
    const Ctor: typeof AudioContext =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const c = new Ctor();
    this.ctx = c;
    this.master = c.createGain();
    this.master.gain.value = 0;
    this.master.connect(c.destination);
    this.ramp(this.master, audioConfig.volume, 3);

    this.reverb = c.createConvolver();
    this.reverb.buffer = this.impulse(2.8);
    const wet = c.createGain();
    wet.gain.value = 0.55;
    this.reverb.connect(wet).connect(this.master);

    this.musicBus = c.createGain();
    this.musicBus.gain.value = MOOD_LEVEL[this.mood];
    this.musicBus.connect(this.master);
    this.musicBus.connect(this.reverb);

    this.sfxBus = c.createGain();
    this.sfxBus.gain.value = 0.9;
    this.sfxBus.connect(this.master);
    this.sfxBus.connect(this.reverb);
  }

  private startMusic() {
    const c = this.ctx;
    if (!c) return;
    this.started = true;
    this.wind();

    if (audioConfig.musicSrc) {
      this.element = new Audio(audioConfig.musicSrc);
      this.element.loop = true;
      this.element.volume = audioConfig.volume * MOOD_LEVEL[this.mood];
      this.element.play().catch(() => undefined);
      return;
    }

    this.drone();
    this.nextNoteTime = c.currentTime + 0.8;
    this.timer = window.setInterval(() => this.schedule(), 180);
  }

  private schedule() {
    const c = this.ctx;
    if (!c || !this.musicBus) return;
    const beat = 60 / 64;
    while (this.nextNoteTime < c.currentTime + 0.6) {
      if (this.phraseLeft <= 0) {
        // nghỉ giữa các câu nhạc
        this.phraseLeft = 4 + Math.floor(Math.random() * 5);
        this.nextNoteTime += beat * (2 + Math.floor(Math.random() * 3));
        continue;
      }
      const move = [-2, -1, -1, 1, 1, 2, 0][Math.floor(Math.random() * 7)];
      this.step = Math.max(0, Math.min(SCALE.length - 1, this.step + move));
      const long = this.phraseLeft === 1 || Math.random() < 0.25;
      this.pluck(SCALE[this.step], this.nextNoteTime, long ? 3 : 1.8, long);
      if (Math.random() < 0.18) this.pluck(SCALE[Math.max(0, this.step - 3)] / 2, this.nextNoteTime, 2.4, false, 0.05);
      this.nextNoteTime += beat * (long ? 2 : Math.random() < 0.5 ? 1 : 0.5);
      this.phraseLeft -= 1;
    }
  }

  /** Nốt gảy kiểu đàn tranh: vuốt nhẹ lên cao độ, có rung ở nốt dài */
  private pluck(freq: number, t: number, dur: number, vibrato: boolean, vel = 0.085) {
    const c = this.ctx!;
    const o = c.createOscillator();
    const o2 = c.createOscillator();
    const g = c.createGain();
    const g2 = c.createGain();
    const lp = c.createBiquadFilter();
    o.type = "triangle";
    o2.type = "sine";
    o.frequency.setValueAtTime(freq * 0.97, t);
    o.frequency.exponentialRampToValueAtTime(freq, t + 0.07);
    o2.frequency.setValueAtTime(freq * 2, t);
    if (vibrato) {
      const lfo = c.createOscillator();
      const depth = c.createGain();
      lfo.frequency.value = 5.2;
      depth.gain.setValueAtTime(0, t);
      depth.gain.linearRampToValueAtTime(freq * 0.012, t + 0.5);
      lfo.connect(depth).connect(o.frequency);
      lfo.start(t);
      lfo.stop(t + dur);
    }
    lp.type = "lowpass";
    lp.frequency.value = 2600;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g2.gain.value = 0.25;
    o.connect(lp);
    o2.connect(g2).connect(lp);
    lp.connect(g).connect(this.musicBus!);
    o.start(t);
    o2.start(t);
    o.stop(t + dur + 0.05);
    o2.stop(t + dur + 0.05);
  }

  private drone() {
    const c = this.ctx!;
    [146.83, 220].forEach((f, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      const lfo = c.createOscillator();
      const lg = c.createGain();
      o.frequency.value = f;
      g.gain.value = 0.012;
      lfo.frequency.value = 0.07 + i * 0.03;
      lg.gain.value = 0.008;
      lfo.connect(lg).connect(g.gain);
      o.connect(g).connect(this.musicBus!);
      o.start();
      lfo.start();
    });
  }

  private wind() {
    const c = this.ctx!;
    const src = c.createBufferSource();
    src.buffer = this.noise(4);
    src.loop = true;
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 420;
    bp.Q.value = 0.6;
    const g = c.createGain();
    g.gain.value = 0.018;
    const lfo = c.createOscillator();
    const lg = c.createGain();
    lfo.frequency.value = 0.09;
    lg.gain.value = 0.012;
    lfo.connect(lg).connect(g.gain);
    src.connect(bp).connect(g).connect(this.master!);
    src.start();
    lfo.start();
  }

  private drumHit(t: number) {
    const c = this.ctx!;
    const o = c.createOscillator();
    const g = c.createGain();
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(52, t + 0.22);
    g.gain.setValueAtTime(0.4, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    o.connect(g).connect(this.sfxBus!);
    o.start(t);
    o.stop(t + 0.4);
  }

  private clack(t: number) {
    const c = this.ctx!;
    const src = c.createBufferSource();
    src.buffer = this.noise(0.1);
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1800;
    bp.Q.value = 3;
    const g = c.createGain();
    g.gain.setValueAtTime(0.25, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    src.connect(bp).connect(g).connect(this.sfxBus!);
    src.start(t);
  }

  private cymbal(t: number) {
    const c = this.ctx!;
    const src = c.createBufferSource();
    src.buffer = this.noise(0.7);
    const hp = c.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 5000;
    const g = c.createGain();
    g.gain.setValueAtTime(0.06, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    src.connect(hp).connect(g).connect(this.sfxBus!);
    src.start(t);
  }

  private tone(freq: number, t: number, dur: number, vel: number, type: OscillatorType, bus: AudioNode) {
    const c = this.ctx!;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(bus);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private noise(seconds: number) {
    const c = this.ctx!;
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * seconds), c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  private impulse(seconds: number) {
    const c = this.ctx!;
    const len = Math.floor(c.sampleRate * seconds);
    const buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    return buf;
  }

  private ramp(node: GainNode | null, value: number, seconds: number) {
    if (!node || !this.ctx) return;
    const t = this.ctx.currentTime;
    node.gain.cancelScheduledValues(t);
    node.gain.setValueAtTime(node.gain.value, t);
    node.gain.linearRampToValueAtTime(value, t + seconds);
  }
}

let engine: AudioEngine | null = null;

export function getAudio() {
  if (!engine) engine = new AudioEngine();
  return engine;
}
