/**
 * Signal Preprocessing Service
 * 
 * Simulates digital signal processing filters applied in real BCI systems:
 * - Bandpass filter (0.1 - 30 Hz): Removes DC drift and high-frequency noise
 * - Notch filter (50 Hz): Removes power line interference
 * 
 * Paper Reference: Standard preprocessing steps for EEG-based BCI systems
 * These are SIMULATED filters for demonstration purposes.
 */

import { PreprocessedSignalResponse } from '../types/index.js';

/**
 * Applies simulated bandpass filter (0.1-30 Hz)
 * 
 * Simulates a butterworth-like filter by:
 * 1. Applying multiple passes of moving average
 * 2. Attenuating extreme frequencies
 * 
 * In production, would use IIR/FIR filter coefficients.
 * 
 * @param signal - Raw EEG signal
 * @param order - Filter order (higher = steeper cutoff)
 * @returns Bandpass filtered signal
 */
function applyBandpassFilter(signal: number[], order: number = 2): number[] {
  let filtered = [...signal];

  // Apply moving average filter multiple times (simulates higher order)
  for (let pass = 0; pass < order; pass++) {
    const windowSize = 5;
    const tempFiltered: number[] = [];

    for (let i = 0; i < filtered.length; i++) {
      let sum = 0;
      let count = 0;

      // Calculate moving average window
      for (let j = Math.max(0, i - Math.floor(windowSize / 2)); j < Math.min(filtered.length, i + Math.ceil(windowSize / 2)); j++) {
        sum += filtered[j];
        count++;
      }

      tempFiltered.push(sum / count);
    }

    filtered = tempFiltered;
  }

  // Attenuate very low frequencies (DC drift removal)
  for (let i = 1; i < filtered.length; i++) {
    filtered[i] = filtered[i] - filtered[i - 1] * 0.95;
  }

  return filtered;
}

/**
 * Applies simulated notch filter (50 Hz power line interference)
 * 
 * Reduces signal at 50 Hz harmonic by attenuating oscillations at that frequency.
 * Simulated by reducing periodic components around 50 Hz period.
 * 
 * @param signal - Raw EEG signal
 * @param samplingRate - Sampling rate in Hz
 * @returns Notch filtered signal
 */
function applyNotchFilter(signal: number[], samplingRate: number = 250): number[] {
  const notchFrequency = 50; // Hz
  const periodSamples = samplingRate / notchFrequency; // Samples per 50Hz cycle

  const filtered = [...signal];

  // Reduce oscillations at 50 Hz by attenuating periodic patterns
  for (let i = Math.floor(periodSamples); i < filtered.length; i++) {
    const delayed = filtered[i - Math.floor(periodSamples)];
    // Reduce component at notch frequency
    filtered[i] = filtered[i] * 0.8 + delayed * 0.2;
  }

  return filtered;
}

/**
 * Complete preprocessing pipeline
 * 
 * Applies both bandpass and notch filters to raw signal.
 * 
 * @param rawSignal - Raw EEG signal
 * @param samplingRate - Sampling rate in Hz
 * @returns Preprocessed signal response
 */
export function preprocessSignal(
  rawSignal: number[],
  samplingRate: number = 250
): PreprocessedSignalResponse {
  // Step 1: Apply bandpass filter
  let filteredSignal = applyBandpassFilter(rawSignal, 2);

  // Step 2: Apply notch filter
  filteredSignal = applyNotchFilter(filteredSignal, samplingRate);

  // Step 3: Normalize to zero mean (remove DC offset)
  const mean = filteredSignal.reduce((a, b) => a + b, 0) / filteredSignal.length;
  filteredSignal = filteredSignal.map(sample => sample - mean);

  return {
    rawSignal,
    filteredSignal,
  };
}
