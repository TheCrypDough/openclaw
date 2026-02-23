/*
 * AUTO ANNOTATION
 * File: extensions/voice-call/src/telephony-audio.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const TELEPHONY_SAMPLE_RATE = 8000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function clamp16(value: number): number {
  return Math.max(-32768, Math.min(32767, value));
}

/**
 * Resample 16-bit PCM (little-endian mono) to 8kHz using linear interpolation.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resamplePcmTo8k(input: Buffer, inputSampleRate: number): Buffer {
  if (inputSampleRate === TELEPHONY_SAMPLE_RATE) {
    return input;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const inputSamples = Math.floor(input.length / 2);
  if (inputSamples === 0) {
    return Buffer.alloc(0);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ratio = inputSampleRate / TELEPHONY_SAMPLE_RATE;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const outputSamples = Math.floor(inputSamples / ratio);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const output = Buffer.alloc(outputSamples * 2);

  for (let i = 0; i < outputSamples; i++) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const srcPos = i * ratio;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const srcIndex = Math.floor(srcPos);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const frac = srcPos - srcIndex;

    const s0 = input.readInt16LE(srcIndex * 2);
    const s1Index = Math.min(srcIndex + 1, inputSamples - 1);
    const s1 = input.readInt16LE(s1Index * 2);

    const sample = Math.round(s0 + frac * (s1 - s0));
    output.writeInt16LE(clamp16(sample), i * 2);
  }

  return output;
}

/**
 * Convert 16-bit PCM to 8-bit mu-law (G.711).
 */
export function pcmToMulaw(pcm: Buffer): Buffer {
  const samples = Math.floor(pcm.length / 2);
  const mulaw = Buffer.alloc(samples);

  for (let i = 0; i < samples; i++) {
    const sample = pcm.readInt16LE(i * 2);
    mulaw[i] = linearToMulaw(sample);
  }

  return mulaw;
}

export function convertPcmToMulaw8k(pcm: Buffer, inputSampleRate: number): Buffer {
  const pcm8k = resamplePcmTo8k(pcm, inputSampleRate);
  return pcmToMulaw(pcm8k);
}

/**
 * Chunk audio buffer into 20ms frames for streaming (8kHz mono mu-law).
 */
export function chunkAudio(audio: Buffer, chunkSize = 160): Generator<Buffer, void, unknown> {
  return (function* () {
    for (let i = 0; i < audio.length; i += chunkSize) {
      yield audio.subarray(i, Math.min(i + chunkSize, audio.length));
    }
  })();
}

function linearToMulaw(sample: number): number {
  const BIAS = 132;
  const CLIP = 32635;

  const sign = sample < 0 ? 0x80 : 0;
  if (sample < 0) {
    sample = -sample;
  }
  if (sample > CLIP) {
    sample = CLIP;
  }

  sample += BIAS;
  let exponent = 7;
  for (let expMask = 0x4000; (sample & expMask) === 0 && exponent > 0; exponent--) {
    expMask >>= 1;
  }

  const mantissa = (sample >> (exponent + 3)) & 0x0f;
  return ~(sign | (exponent << 4) | mantissa) & 0xff;
}
