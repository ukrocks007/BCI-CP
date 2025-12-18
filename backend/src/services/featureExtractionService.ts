/**
 * Feature Extraction Service
 * 
 * Extracts discriminative features from EEG signals.
 * Paper Reference: Features are extracted from 300-600ms post-stimulus window (P300 time window)
 * 
 * Extracted Features:
 * - Mean amplitude: Average voltage in P300 window
 * - Peak amplitude: Maximum voltage in P300 window
 * - Peak latency: Time of maximum amplitude (relative to stimulus onset)
 */

import { FeatureVector } from '../types/index.js';

/**
 * P300 time window bounds (milliseconds)
 * Paper: Peak P300 response typically appears 250-600ms after stimulus
 */
const P300_START_MS = 300;
const P300_END_MS = 600;

/**
 * Extracts features from filtered EEG signal
 * 
 * The 300-600ms window is where target signals show characteristic P300 spike.
 * This window is used in the original research for classification.
 * 
 * @param filteredSignal - Preprocessed EEG signal
 * @param timestamps - Time in milliseconds for each sample
 * @returns FeatureVector with mean, peak, and latency
 */
export function extractFeatures(
  filteredSignal: number[],
  timestamps: number[]
): FeatureVector {
  // Find indices corresponding to P300 window
  const startIdx = findClosestIndex(timestamps, P300_START_MS);
  const endIdx = findClosestIndex(timestamps, P300_END_MS);

  // Extract window signal
  const windowSignal = filteredSignal.slice(startIdx, endIdx + 1);
  const windowTimestamps = timestamps.slice(startIdx, endIdx + 1);

  if (windowSignal.length === 0) {
    return {
      mean: 0,
      peak: 0,
      latency: 0,
    };
  }

  // Calculate mean amplitude in P300 window
  const mean = windowSignal.reduce((a, b) => a + b, 0) / windowSignal.length;

  // Calculate peak amplitude (maximum absolute value)
  const peak = Math.max(...windowSignal.map(s => Math.abs(s)));

  // Calculate peak latency (time of maximum amplitude relative to stimulus)
  const peakIdx = windowSignal.findIndex(s => Math.abs(s) === peak);
  const latency = windowTimestamps[peakIdx] || 0;

  return {
    mean,
    peak,
    latency,
  };
}

/**
 * Finds the array index closest to a target value
 * 
 * @param array - Array to search
 * @param target - Target value
 * @returns Index of closest element
 */
function findClosestIndex(array: number[], target: number): number {
  let minDiff = Math.abs(array[0] - target);
  let closestIdx = 0;

  for (let i = 1; i < array.length; i++) {
    const diff = Math.abs(array[i] - target);
    if (diff < minDiff) {
      minDiff = diff;
      closestIdx = i;
    }
  }

  return closestIdx;
}

/**
 * Extracts features from multiple signals
 * Useful for training LDA classifier
 * 
 * @param signals - Array of filtered signals
 * @param timestampsList - Timestamps for each signal
 * @returns Array of feature vectors
 */
export function extractFeaturesFromMultiple(
  signals: number[][],
  timestampsList: number[][]
): FeatureVector[] {
  return signals.map((signal, idx) =>
    extractFeatures(signal, timestampsList[idx])
  );
}
