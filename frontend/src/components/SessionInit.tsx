/**
 * Session Initialization Component
 * 
 * Allows user to start a new BCI session
 */

import React, { useState } from 'react';
import { Session } from '../types/index.js';

interface SessionInitProps {
  onSessionCreated: (session: Session) => void;
  isLoading: boolean;
}

export const SessionInit: React.FC<SessionInitProps> = ({ onSessionCreated, isLoading }) => {
  const [userId, setUserId] = useState('child-001');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate session creation
      const newSession: Session = {
        id: `session-${Date.now()}`,
        userId,
        startedAt: new Date().toISOString(),
        endedAt: null,
        status: 'active',
        totalTrials: 0,
        accuracy: 0,
        calibration: {
          id: `calib-${Date.now()}`,
          sessionId: `session-${Date.now()}`,
          flashSpeed: 1.0,
          objectCount: 3,
          recentAccuracy: 0.5,
          confidenceThreshold: 0.5,
          trialInterval: 2000,
        },
      };

      onSessionCreated(newSession);
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🧠 BCI Game</h1>
          <p className="text-gray-600">Brain-Computer Interface Research Demo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="Enter user ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting || isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              This identifies your session for data tracking
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoading || !userId}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {isSubmitting || isLoading ? 'Starting...' : 'Start Session'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">How it works:</h3>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>Watch animals flash on screen</li>
            <li>Focus on the target animal</li>
            <li>System detects your attention</li>
            <li>Game adapts to your performance</li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600">
            <strong>Disclaimer:</strong> This is a research demonstration prototype, not a medical device.
            All EEG signals are simulated for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
};
