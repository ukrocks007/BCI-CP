/**
 * EEG Signal Simulation Service
 * 
 * Simulates EEG-like signals with P300-like characteristics.
 * Paper Reference: Stimulus-evoked potentials (P300) appear 300-600ms after target stimulus
 * 
 * This is a SIMULATION for research demonstration purposes.
 * Real EEG acquisition would use actual electrode hardware.
 */

import {
  EEGSignalResponse,
  SignalSimulationParams,
  SignalType,
} from '../types/index.js';

/**
 * Generates a simulated EEG signal
 * 
 * For TARGET signals: Includes a P300-like spike (elevated amplitude 300-600ms)
 * For NON_TARGET signals: Random noise baseline
 * 
 * @param params - Signal simulation parameters
 * @returns EEG signal with timestamps
 */
export function generateEEGSignal(params: SignalSimulationParams): EEGSignalResponse {
  const samplingRate = params.samplingRate || 250; // Hz (typical for low-cost systems)
  const duration = params.duration || 1000; // ms
  const noiseLevel = params.noiseLevel || 0.5; // Normalized [0,1]
  const type = params.type;

  // Calculate number of samples
  const numSamples = Math.floor((samplingRate * duration) / 1000);

  // Generate timestamps (in milliseconds)
  const timestamps: number[] = [];
  for (let i = 0; i < numSamples; i++) {
    timestamps.push((i * 1000) / samplingRate);
  }

  // Generate raw signal
  const rawSignal: number[] = [];

  for (let i = 0; i < numSamples; i++) {
    // Baseline noise (0-mean Gaussian-like)
    const baselineNoise = generateGaussianNoise(0, noiseLevel);

    let amplitude = baselineNoise;

    if (type === 'target') {
      // Add P300-like spike (300-600 ms window)
      const timeMs = timestamps[i];
      if (timeMs >= 300 && timeMs <= 600) {
        // Gaussian bell curve centered at ~450ms with sigma=75ms
        const mu = 450;
        const sigma = 75;
        const peakAmplitude = 5.0; // µV (typical P300 amplitude)
        const gaussianComponent =
          peakAmplitude * Math.exp(-Math.pow((timeMs - mu) / sigma, 2) / 2);

        amplitude += gaussianComponent;
      }
    }

    rawSignal.push(amplitude);
  }

  return {
    timestamps,
    rawSignal,
  };
}

/**
 * Generates a Gaussian-distributed random number
 * Uses Box-Muller transform for efficiency
 * 
 * @param mean - Mean of distribution
 * @param stdDev - Standard deviation
 * @returns Gaussian random variable
 */
function generateGaussianNoise(mean: number, stdDev: number): number {
  let u1 = Math.random();
  let u2 = Math.random();

  // Avoid log(0)
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();

  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
}

/**
 * Generates multiple signals for training data
 * 
 * @param targetCount - Number of target signals to generate
 * @param nonTargetCount - Number of non-target signals to generate
 * @param noiseLevel - Noise level [0,1]
 * @returns Array of signals with labels
 */
export function generateTrainingData(
  targetCount: number,
  nonTargetCount: number,
  noiseLevel: number = 0.5
): Array<{ signal: EEGSignalResponse; label: 'target' | 'nontarget' }> {
  const data: Array<{ signal: EEGSignalResponse; label: 'target' | 'nontarget' }> = [];

  // Generate target signals
  for (let i = 0; i < targetCount; i++) {
    data.push({
      signal: generateEEGSignal({ type: 'target', noiseLevel }),
      label: 'target',
    });
  }

  // Generate non-target signals
  for (let i = 0; i < nonTargetCount; i++) {
    data.push({
      signal: generateEEGSignal({ type: 'nontarget', noiseLevel }),
      label: 'nontarget',
    });
  }

  return data;
}
