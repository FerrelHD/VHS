"use client";

class AudioEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  /**
   * Mechanical relay click when tape carousel advances.
   */
  public playClick(pitch = 1.0) {
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const now = this.ctx.currentTime;
      osc.type = "sine";
      osc.frequency.setValueAtTime(800 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(140 * pitch, now + 0.035);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio auto-play policies or unsupported context
    }
  }

  /**
   * Heavier mechanical thud when a tape settles into the center slot.
   */
  public playSnap() {
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const now = this.ctx.currentTime;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio policies
    }
  }

  /**
   * High-voltage static discharge when B&W switch is toggled.
   */
  public playSwitch() {
    try {
      this.init();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1800;

      const gain = this.ctx.createGain();
      gain.gain.value = 0.07;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {
      // Audio policies
    }
  }

  /**
   * CRT channel-switch / signal distortion glitch burst.
   */
  public playGlitch() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Static noise burst
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 1200;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.09, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      // 2. Sub-bass displacement pop
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.06);

      oscGain.gain.setValueAtTime(0.08, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      noise.start(now);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Audio policies
    }
  }
}

export const audio = new AudioEngine();

