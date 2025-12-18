/**
 * Custom hook for processing EEG signal through the pipeline
 */

import { useState, useCallback } from 'react';
import { apiClient } from '../utils/apiClient.js';
import { FeatureVector, ClassificationResult } from '../types/index.js';

export interface ProcessingState {
  rawSignal: number[] | null;
  filteredSignal: number[] | null;
  features: FeatureVector | null;
  classification: ClassificationResult | null;
  isProcessing: boolean;
  error: string | null;
}

export function useEEGProcessing() {
  const [state, setState] = useState<ProcessingState>({
    rawSignal: null,
    filteredSignal: null,
    features: null,
    classification: null,
    isProcessing: false,
    error: null,
  });

  /**
   * Processes EEG signal through the complete pipeline:
   * 1. Simulate signal
   * 2. Preprocess
   * 3. Extract features
   * 4. Classify
   */
  const processSignal = useCallback(async (type: 'target' | 'nontarget') => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      // Step 1: Simulate EEG
      const eegSignal = await apiClient.simulateEEG(type, 0.5);
      setState(prev => ({ ...prev, rawSignal: eegSignal.rawSignal }));

      // Step 2: Preprocess
      const preprocessed = await apiClient.preprocessSignal(
        eegSignal.rawSignal,
        eegSignal.timestamps
      );
      setState(prev => ({ ...prev, filteredSignal: preprocessed.filteredSignal }));

      // Step 3: Extract features
      const features = await apiClient.extractFeatures(
        preprocessed.filteredSignal,
        eegSignal.timestamps
      );
      setState(prev => ({ ...prev, features }));

      // Step 4: Classify
      const classification = await apiClient.classify(features);
      setState(prev => ({ ...prev, classification }));

      return classification;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      rawSignal: null,
      filteredSignal: null,
      features: null,
      classification: null,
      isProcessing: false,
      error: null,
    });
  }, []);

  return { ...state, processSignal, reset };
}
