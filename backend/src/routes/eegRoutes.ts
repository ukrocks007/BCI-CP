/**
 * EEG API Routes
 * 
 * Endpoints for EEG signal simulation and processing
 */

import { Router, Request, Response } from 'express';
import { generateEEGSignal, generateTrainingData } from '../services/eegSignalService';
import { preprocessSignal } from '../services/preprocessingService';
import { extractFeatures } from '../services/featureExtractionService';
import { DefaultLDAClassifier } from '../services/ldaClassifier';
import { EEGSignalResponse, SignalType } from '../types/index';

const router = Router();

// Initialize default LDA classifier
const classifier = new DefaultLDAClassifier();

/**
 * GET /api/eeg/simulate
 * 
 * Simulates EEG signal for a given stimulus type
 * 
 * Query Parameters:
 * - type: 'target' | 'nontarget' (required)
 * - noiseLevel: [0, 1] (optional, default 0.5)
 * 
 * Response: EEGSignalResponse
 */
router.get('/simulate', (req: Request, res: Response) => {
  const type = req.query.type as string;
  const noiseLevel = req.query.noiseLevel ? parseFloat(req.query.noiseLevel as string) : 0.5;

  if (!type || (type !== 'target' && type !== 'nontarget')) {
    return res.status(400).json({
      error: 'Invalid type parameter. Must be "target" or "nontarget"',
    });
  }

  try {
    const signal = generateEEGSignal({
      type: type as SignalType,
      noiseLevel,
    });

    res.json(signal);
  } catch (error) {
    console.error('Error simulating EEG signal:', error);
    res.status(500).json({ error: 'Failed to simulate EEG signal' });
  }
});

/**
 * POST /api/eeg/preprocess
 * 
 * Preprocesses raw EEG signal
 * 
 * Request Body:
 * ```json
 * {
 *   "rawSignal": [number, ...],
 *   "timestamps": [number, ...]
 * }
 * ```
 * 
 * Response: PreprocessedSignalResponse
 */
router.post('/preprocess', (req: Request, res: Response) => {
  const { rawSignal, timestamps } = req.body;

  if (!Array.isArray(rawSignal) || !Array.isArray(timestamps)) {
    return res.status(400).json({
      error: 'Invalid request. Requires rawSignal and timestamps arrays.',
    });
  }

  try {
    const preprocessed = preprocessSignal(rawSignal);
    res.json(preprocessed);
  } catch (error) {
    console.error('Error preprocessing signal:', error);
    res.status(500).json({ error: 'Failed to preprocess signal' });
  }
});

/**
 * POST /api/eeg/extract-features
 * 
 * Extracts features from preprocessed signal
 * 
 * Request Body:
 * ```json
 * {
 *   "filteredSignal": [number, ...],
 *   "timestamps": [number, ...]
 * }
 * ```
 * 
 * Response: FeatureVector
 */
router.post('/extract-features', (req: Request, res: Response) => {
  const { filteredSignal, timestamps } = req.body;

  if (!Array.isArray(filteredSignal) || !Array.isArray(timestamps)) {
    return res.status(400).json({
      error: 'Invalid request. Requires filteredSignal and timestamps arrays.',
    });
  }

  try {
    const features = extractFeatures(filteredSignal, timestamps);
    res.json(features);
  } catch (error) {
    console.error('Error extracting features:', error);
    res.status(500).json({ error: 'Failed to extract features' });
  }
});

/**
 * POST /api/eeg/classify
 * 
 * Classifies EEG features using LDA
 * 
 * Request Body:
 * ```json
 * {
 *   "mean": number,
 *   "peak": number,
 *   "latency": number
 * }
 * ```
 * 
 * Response: ClassificationResult
 */
router.post('/classify', (req: Request, res: Response) => {
  const { mean, peak, latency } = req.body;

  if (typeof mean !== 'number' || typeof peak !== 'number' || typeof latency !== 'number') {
    return res.status(400).json({
      error: 'Invalid request. Requires mean, peak, latency as numbers.',
    });
  }

  try {
    const result = classifier.predict({ mean, peak, latency });
    res.json(result);
  } catch (error) {
    console.error('Error classifying:', error);
    res.status(500).json({ error: 'Classification failed' });
  }
});

/**
 * GET /api/eeg/training-data
 * 
 * Generates training data for LDA (for demonstration)
 * 
 * Query Parameters:
 * - targetCount: number (default 30)
 * - nonTargetCount: number (default 30)
 * 
 * Response: Array of signals with labels
 */
router.get('/training-data', (req: Request, res: Response) => {
  const targetCount = parseInt(req.query.targetCount as string) || 30;
  const nonTargetCount = parseInt(req.query.nonTargetCount as string) || 30;

  try {
    const data = generateTrainingData(targetCount, nonTargetCount, 0.5);
    res.json({
      count: data.length,
      targetCount,
      nonTargetCount,
      samples: data.slice(0, 5), // Return first 5 as preview
    });
  } catch (error) {
    console.error('Error generating training data:', error);
    res.status(500).json({ error: 'Failed to generate training data' });
  }
});

export default router;
