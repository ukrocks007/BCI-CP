/**
 * Type definitions for BCI Backend
 * Maps to research paper: "Breaking Barriers: Feasibility of Affordable Brain-Computer Interfaces for Pediatric Cerebral Palsy"
 */

export interface EEGSignalResponse {
  timestamps: number[];
  rawSignal: number[];
}

export interface PreprocessedSignalResponse {
  rawSignal: number[];
  filteredSignal: number[];
}

export interface FeatureVector {
  mean: number;
  peak: number;
  latency: number;
}

export interface ClassificationResult {
  prediction: 'YES' | 'NO';
  confidence: number;
}

export interface TrialRequest {
  sessionId: string;
  trialNumber: number;
}

export interface TrialResponse {
  trialId: string;
  eegSignal: EEGSignalResponse;
  preprocessed: PreprocessedSignalResponse;
  features: FeatureVector;
  classification: ClassificationResult;
  timestamp: number;
}

export type SignalType = 'target' | 'nontarget';

export interface SignalSimulationParams {
  type: SignalType;
  samplingRate?: number;
  duration?: number;
  noiseLevel?: number;
}
