/**
 * Game Board Component
 * 
 * Displays stimulus objects and manages game logic
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GameObject } from './GameObject.js';
import { apiClient } from '../utils/apiClient.js';
import { useEEGProcessing } from '../hooks/useEEGProcessing.js';
import { PipelineMonitor } from './PipelineMonitor.js';
import { ClassificationResult } from '../types/index.js';

interface GameBoardProps {
  sessionId: string;
  calibration: {
    flashSpeed: number;
    objectCount: number;
    trialInterval: number;
  } | null;
  onTrialComplete: (result: {
    targetType: string;
    prediction: string;
    confidence: number;
  }) => void;
  isActive: boolean;
}

const EMOJIS = ['🐱', '🐶', '🐻', '🦁'];

export const GameBoard: React.FC<GameBoardProps> = ({
  sessionId,
  calibration,
  onTrialComplete,
  isActive,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<number>(0);
  const [flashingObject, setFlashingObject] = useState<number | null>(null);
  const [trialCount, setTrialCount] = useState(0);
  // Use processing state from the EEG hook for real-time pipeline
  const {
    rawSignal,
    filteredSignal,
    features,
    classification,
    isProcessing,
    processSignal,
  } = useEEGProcessing();
  const [feedback, setFeedback] = useState<string>('');

  const flashSpeed = calibration?.flashSpeed || 1.0;
  const objectCount = calibration?.objectCount || 3;
  const trialInterval = calibration?.trialInterval || 2000;

  const emojis = EMOJIS.slice(0, objectCount);

  /**
   * Runs a single trial:
   * 1. Select random target
   * 2. Flash target
   * 3. Simulate EEG and classify
   * 4. Record result
   */
  const runTrial = useCallback(async () => {
    if (!isActive || isProcessing) return;
    
    setFeedback('Processing...');

    try {
      // Step 1: Select target
      const newTarget = Math.floor(Math.random() * objectCount);
      setSelectedTarget(newTarget);

      // Step 2: Flash animation
      setFlashingObject(newTarget);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setFlashingObject(null);

      // Step 3: Run full pipeline via hook (populates live UI)
      const classification = await processSignal('target');

      // Step 4: Record trial
      const response = await apiClient.recordTrial(
        sessionId,
        trialCount + 1,
        'target',
        classification.prediction,
        classification.confidence,
        1000
      );

      // Show feedback
      const isCorrect = classification.prediction === 'YES';
      setFeedback(
        isCorrect
          ? `✨ Correct! Confidence: ${(classification.confidence * 100).toFixed(1)}%`
          : `Hmm, let's try again!`
      );

      onTrialComplete({
        targetType: 'target',
        prediction: classification.prediction,
        confidence: classification.confidence,
      });

      setTrialCount(prev => prev + 1);
    } catch (error) {
      setFeedback('Error processing trial');
      console.error('Trial error:', error);
    } finally {
      setTimeout(() => setFeedback(''), 2000);
    }
  }, [isActive, isProcessing, objectCount, sessionId, trialCount, onTrialComplete, processSignal]);

  /**
   * Auto-run trials at intervals
   */
  useEffect(() => {
    if (!isActive || isProcessing) return;

    const timer = setTimeout(() => {
      runTrial();
    }, trialInterval);

    return () => clearTimeout(timer);
  }, [isActive, isProcessing, runTrial, trialInterval]);

  const handleObjectClick = (id: number) => {
    setSelectedTarget(id);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-purple-50 rounded-lg">
      {/* Instructions */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Focus on the flashing animal!
        </h2>
        <p className="text-gray-600">Trial {trialCount}</p>
      </div>

      {/* Game Objects Grid */}
      <div
        className="grid gap-6 mb-8"
        style={{
          gridTemplateColumns: `repeat(${Math.min(2, objectCount)}, minmax(0, 1fr))`,
        }}
      >
        {emojis.map((emoji, idx) => (
          <GameObject
            key={idx}
            id={idx}
            emoji={emoji}
            isFlashing={flashingObject === idx}
            isSelected={selectedTarget === idx}
            onClick={handleObjectClick}
            flashSpeed={flashSpeed}
          />
        ))}
      </div>

      {/* Feedback */}
      <div className="h-8 text-center">
        {feedback && (
          <p className={feedback.includes('Correct') ? 'text-green-600 font-semibold' : 'text-gray-600'}>
            {feedback}
          </p>
        )}
      </div>

      {/* Live Pipeline Monitor */}
      <div className="mt-6">
        <PipelineMonitor
          rawSignal={rawSignal}
          filteredSignal={filteredSignal}
          features={features}
          classification={classification}
          isProcessing={isProcessing}
        />
      </div>

      {/* Status */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow text-center">
        <p className="text-sm text-gray-600">
          Flash Speed: {(flashSpeed * 100).toFixed(0)}% | Objects: {objectCount} | Trial Interval: {trialInterval}ms
        </p>
      </div>
    </div>
  );
};
