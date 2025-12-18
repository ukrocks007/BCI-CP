/**
 * Frontend TypeScript Types
 */

export interface EEGSignalResponse {
  timestamps: number[];
  rawSignal: number[];
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

export interface Session {
  id: string;
  userId: string;
  startedAt: string;
  endedAt: string | null;
  status: string;
  totalTrials: number;
  accuracy: number;
  calibration?: CalibrationState;
}

export interface CalibrationState {
  id: string;
  sessionId: string;
  flashSpeed: number;
  objectCount: number;
  recentAccuracy: number;
  confidenceThreshold: number;
  trialInterval: number;
}

export interface Trial {
  id: string;
  sessionId: string;
  trialNumber: number;
  targetType: string;
  stimulusTime: string;
  responseTime: number;
  accuracy: boolean;
  predictions: Prediction[];
}

export interface Prediction {
  id: string;
  trialId: string;
  prediction: string;
  confidence: number;
  timestamp: string;
}

export interface GameState {
  sessionId: string;
  currentTrial: number;
  isGameActive: boolean;
  selectedTarget: number | null;
  flashingObject: number | null;
}

export interface TrialFeedback {
  correct: boolean;
  notification: string;
  recentAccuracy: number;
  sessionAccuracy: number;
}
