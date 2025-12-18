/**
 * Decision Logic and Session State Management
 * 
 * Handles:
 * 1. Multi-trial decision smoothing
 * 2. Adaptive difficulty scaling
 * 3. Session state persistence using Prisma
 * 
 * Paper Reference: The system provides adaptive feedback and difficulty scaling
 * based on user performance over multiple trials.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface DecisionState {
  recentPredictions: Array<{ prediction: string; confidence: number }>;
  smoothedDecision: 'YES' | 'NO';
  smoothedConfidence: number;
}

/**
 * Processes multiple predictions and provides smoothed decision
 * 
 * Uses a sliding window approach:
 * - Collects last N predictions
 * - Weights recent predictions more heavily
 * - Provides smoothed decision and confidence
 * 
 * @param predictions - Array of recent predictions
 * @param windowSize - Number of predictions to consider
 * @returns Smoothed decision and confidence
 */
export function smoothPredictions(
  predictions: Array<{ prediction: string; confidence: number }>,
  windowSize: number = 5
): { decision: 'YES' | 'NO'; confidence: number } {
  if (predictions.length === 0) {
    return { decision: 'NO', confidence: 0.5 };
  }

  // Use only the last windowSize predictions
  const window = predictions.slice(Math.max(0, predictions.length - windowSize));

  // Calculate weighted average confidence
  // More recent predictions get higher weight
  let weightedConfidence = 0;
  let weightSum = 0;

  for (let i = 0; i < window.length; i++) {
    const weight = i + 1; // Linear weight increase
    weightedConfidence += window[i].confidence * weight;
    weightSum += weight;
  }

  const avgConfidence = weightedConfidence / weightSum;

  // Count YES predictions
  const yesCount = window.filter(p => p.prediction === 'YES').length;
  const threshold = Math.ceil(window.length / 2); // Majority vote

  const decision = yesCount >= threshold ? 'YES' : 'NO';

  return {
    decision,
    confidence: avgConfidence,
  };
}

/**
 * Adaptive difficulty management
 * 
 * Adjusts game parameters based on recent performance:
 * - High accuracy (>70%): Increase difficulty
 * - Medium accuracy (40-70%): Maintain difficulty
 * - Low accuracy (<40%): Decrease difficulty
 * 
 * Prevents overload (child fatigue) and maintains engagement
 * 
 * @param recentAccuracy - Accuracy from recent trials
 * @param currentFlashSpeed - Current flash speed multiplier
 * @param currentObjectCount - Current number of objects
 * @returns Updated difficulty parameters
 */
export function adaptDifficulty(
  recentAccuracy: number,
  currentFlashSpeed: number,
  currentObjectCount: number
): {
  newFlashSpeed: number;
  newObjectCount: number;
  notification: string;
} {
  let newFlashSpeed = currentFlashSpeed;
  let newObjectCount = currentObjectCount;
  let notification = '';

  if (recentAccuracy > 0.7) {
    // High performance: increase difficulty
    newFlashSpeed = Math.min(1.5, currentFlashSpeed * 1.1); // Max 50% faster
    if (currentObjectCount < 4) {
      newObjectCount = currentObjectCount + 1;
      notification = 'Great job! Adding more objects.';
    } else {
      notification = 'Excellent! Speeding up the game.';
      newFlashSpeed = Math.min(1.5, newFlashSpeed * 1.15);
    }
  } else if (recentAccuracy < 0.4) {
    // Low performance: decrease difficulty
    newFlashSpeed = Math.max(0.6, currentFlashSpeed * 0.9); // Min 40% slower
    if (currentObjectCount > 3) {
      newObjectCount = currentObjectCount - 1;
      notification = 'Let\'s slow down a bit. Removing an object.';
    } else {
      notification = 'No worries! We\'ll take it slower.';
      newFlashSpeed = Math.max(0.6, newFlashSpeed * 0.85);
    }
  } else {
    notification = 'You\'re doing great! Keep going!';
  }

  return {
    newFlashSpeed,
    newObjectCount,
    notification,
  };
}

/**
 * Session management with Prisma
 * Creates and updates calibration state during gameplay
 */
export async function createSession(userId: string) {
  const session = await prisma.session.create({
    data: {
      userId,
      calibration: {
        create: {
          flashSpeed: 1.0,
          objectCount: 3,
        },
      },
    },
    include: { calibration: true },
  });

  return session;
}

export async function getSession(sessionId: string) {
  return await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      calibration: true,
      trials: {
        include: {
          predictions: true,
        },
      },
    },
  });
}

export async function updateCalibrationState(
  sessionId: string,
  flashSpeed: number,
  objectCount: number,
  recentAccuracy: number,
  confidenceThreshold: number
) {
  return await prisma.calibrationState.update({
    where: { sessionId },
    data: {
      flashSpeed,
      objectCount,
      recentAccuracy,
      confidenceThreshold,
      lastTrialTime: new Date(),
    },
  });
}

export async function recordTrial(
  sessionId: string,
  trialNumber: number,
  targetType: string,
  prediction: string,
  confidence: number,
  responseTime: number
) {
  const trial = await prisma.trial.upsert({
    where: {
      sessionId_trialNumber: {
        sessionId,
        trialNumber,
      },
    },
    update: {
      responseTime,
      accuracy: (targetType === 'target' && prediction === 'YES') || 
                (targetType === 'nontarget' && prediction === 'NO'),
      predictions: {
        create: {
          prediction,
          confidence,
        },
      },
    },
    create: {
      sessionId,
      trialNumber,
      targetType,
      responseTime,
      accuracy: (targetType === 'target' && prediction === 'YES') || 
                (targetType === 'nontarget' && prediction === 'NO'),
      predictions: {
        create: {
          prediction,
          confidence,
        },
      },
    },
    include: {
      predictions: true,
    },
  });

  // Update session accuracy
  const session = await getSession(sessionId);
  if (session) {
    const totalTrials = session.trials.length;
    const correctTrials = session.trials.filter((t: any) => t.accuracy).length;
    const accuracy = totalTrials > 0 ? correctTrials / totalTrials : 0;

    await prisma.session.update({
      where: { id: sessionId },
      data: {
        totalTrials,
        accuracy,
      },
    });
  }

  return trial;
}
