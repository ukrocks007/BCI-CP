/**
 * API client for BCI backend
 */

import axios, { AxiosInstance } from 'axios';
import {
  EEGSignalResponse,
  FeatureVector,
  ClassificationResult,
  Session,
  Trial,
  TrialFeedback,
} from '../types/index.js';

class BCIApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = '/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // EEG Signal Endpoints

  async simulateEEG(type: 'target' | 'nontarget', noiseLevel: number = 0.5): Promise<EEGSignalResponse> {
    const response = await this.client.get<EEGSignalResponse>('/eeg/simulate', {
      params: { type, noiseLevel },
    });
    return response.data;
  }

  async preprocessSignal(rawSignal: number[], timestamps: number[]) {
    const response = await this.client.post('/eeg/preprocess', {
      rawSignal,
      timestamps,
    });
    return response.data;
  }

  async extractFeatures(filteredSignal: number[], timestamps: number[]): Promise<FeatureVector> {
    const response = await this.client.post<FeatureVector>('/eeg/extract-features', {
      filteredSignal,
      timestamps,
    });
    return response.data;
  }

  async classify(features: FeatureVector): Promise<ClassificationResult> {
    const response = await this.client.post<ClassificationResult>('/eeg/classify', features);
    return response.data;
  }

  async getTrainingData(targetCount: number = 30, nonTargetCount: number = 30) {
    const response = await this.client.get('/eeg/training-data', {
      params: { targetCount, nonTargetCount },
    });
    return response.data;
  }

  // Session Endpoints

  async createSession(userId: string): Promise<Session> {
    const response = await this.client.post<Session>('/sessions', { userId });
    return response.data;
  }

  async getSession(sessionId: string): Promise<Session> {
    const response = await this.client.get<Session>(`/sessions/${sessionId}`);
    return response.data;
  }

  async recordTrial(
    sessionId: string,
    trialNumber: number,
    targetType: string,
    prediction: string,
    confidence: number,
    responseTime: number
  ): Promise<{ trial: Trial; calibration: any; feedback: TrialFeedback }> {
    const response = await this.client.post(`/sessions/${sessionId}/trials`, {
      trialNumber,
      targetType,
      prediction,
      confidence,
      responseTime,
    });
    return response.data;
  }

  async smoothPredictions(
    sessionId: string,
    predictions: Array<{ prediction: string; confidence: number }>
  ) {
    const response = await this.client.post(`/sessions/${sessionId}/smooth-predictions`, {
      predictions,
    });
    return response.data;
  }
}

export const apiClient = new BCIApiClient();
