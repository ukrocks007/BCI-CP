/**
 * Session and Trial API Routes
 * 
 * Endpoints for managing BCI sessions and recording trial results
 */

import { Router, Request, Response } from 'express';
import {
  createSession,
  getSession,
  updateCalibrationState,
  recordTrial,
  adaptDifficulty,
  smoothPredictions,
} from '../services/decisionLogicService';

const router = Router();

/**
 * POST /api/sessions
 * 
 * Creates a new BCI session for a user
 * 
 * Request Body:
 * ```json
 * {
 *   "userId": "user-123"
 * }
 * ```
 * 
 * Response: Session with CalibrationState
 */
router.post('/', async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const session = await createSession(userId);
    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

/**
 * GET /api/sessions/:sessionId
 * 
 * Retrieves session details with all trials and calibration state
 * 
 * Response: Session with trials and calibration
 */
router.get('/:sessionId', async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  try {
    const session = await getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

/**
 * POST /api/sessions/:sessionId/trials
 * 
 * Records a trial result and updates calibration
 * 
 * Request Body:
 * ```json
 * {
 *   "trialNumber": 1,
 *   "targetType": "target",
 *   "prediction": "YES",
 *   "confidence": 0.85,
 *   "responseTime": 450
 * }
 * ```
 * 
 * Response: Trial with predictions and updated calibration
 */
router.post('/:sessionId/trials', async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { trialNumber, targetType, prediction, confidence, responseTime } = req.body;

  if (!trialNumber || !targetType || !prediction || typeof confidence !== 'number') {
    return res.status(400).json({
      error: 'Missing required fields: trialNumber, targetType, prediction, confidence',
    });
  }

  try {
    // Record the trial
    const trial = await recordTrial(
      sessionId,
      trialNumber,
      targetType,
      prediction,
      confidence,
      responseTime || 0
    );

    // Get updated session
    const session = await getSession(sessionId);

    if (!session || !session.calibration) {
      throw new Error('Failed to retrieve updated session');
    }

    // Calculate recent accuracy (last 10 trials)
    const recentTrials = session.trials.slice(-10);
    const recentAccuracy = 
      recentTrials.length > 0
        ? recentTrials.filter((t: any) => t.accuracy).length / recentTrials.length
        : 0.5;

    // Adapt difficulty
    const { newFlashSpeed, newObjectCount, notification } = adaptDifficulty(
      recentAccuracy,
      session.calibration.flashSpeed,
      session.calibration.objectCount
    );

    // Update calibration
    const updatedCalibration = await updateCalibrationState(
      sessionId,
      newFlashSpeed,
      newObjectCount,
      recentAccuracy,
      session.calibration.confidenceThreshold
    );

    res.status(201).json({
      trial,
      calibration: updatedCalibration,
      feedback: {
        notification,
        recentAccuracy,
        sessionAccuracy: session.accuracy,
      },
    });
  } catch (error) {
    console.error('Error recording trial:', error);
    res.status(500).json({ error: 'Failed to record trial' });
  }
});

/**
 * POST /api/sessions/:sessionId/smooth-predictions
 * 
 * Provides smoothed decision from multiple recent predictions
 * 
 * Request Body:
 * ```json
 * {
 *   "predictions": [
 *     { "prediction": "YES", "confidence": 0.85 },
 *     { "prediction": "YES", "confidence": 0.72 },
 *     { "prediction": "NO", "confidence": 0.55 }
 *   ]
 * }
 * ```
 * 
 * Response: Smoothed decision and confidence
 */
router.post('/:sessionId/smooth-predictions', (req: Request, res: Response) => {
  const { predictions } = req.body;

  if (!Array.isArray(predictions) || predictions.length === 0) {
    return res.status(400).json({
      error: 'Invalid request. Requires array of predictions.',
    });
  }

  try {
    const smoothed = smoothPredictions(predictions, Math.min(5, predictions.length));
    res.json(smoothed);
  } catch (error) {
    console.error('Error smoothing predictions:', error);
    res.status(500).json({ error: 'Failed to smooth predictions' });
  }
});

export default router;
