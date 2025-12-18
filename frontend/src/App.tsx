/**
 * Main Application Component
 * 
 * Maps the research paper's BCI pipeline to an interactive game interface
 */

import React, { useState, useCallback } from 'react';
import { SessionInit } from './components/SessionInit.js';
import { GameBoard } from './components/GameBoard.js';
import { CalibrationDashboard } from './components/CalibrationDashboard.js';
import { Session, CalibrationState } from './types/index.js';
import { apiClient } from './utils/apiClient.js';
import './App.css';

type AppState = 'init' | 'playing' | 'paused';

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('init');
  const [session, setSession] = useState<Session | null>(null);
  const [calibration, setCalibration] = useState<CalibrationState | null>(null);
  const [recentAccuracies, setRecentAccuracies] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle session creation
   */
  const handleSessionCreated = useCallback(async (newSession: Session) => {
    setIsLoading(true);

    try {
      // Create session on backend
      const createdSession = await apiClient.createSession(newSession.userId);
      setSession(createdSession);
      setCalibration(createdSession.calibration || null);
      setRecentAccuracies([]);
      setAppState('playing');
    } catch (error) {
      console.error('Error creating session:', error);
      setAppState('init');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle trial completion
   * Updates recent accuracies and session state
   */
  const handleTrialComplete = useCallback(
    async (result: { targetType: string; prediction: string; confidence: number }) => {
      if (!session) return;

      try {
        // Record trial on backend
        const response = await apiClient.recordTrial(
          session.id,
          session.totalTrials + 1,
          result.targetType,
          result.prediction,
          result.confidence,
          1000
        );

        // Update local state
        setSession(prev => (prev ? { ...prev, ...response } : null));
        setCalibration(response.calibration);

        // Track accuracy trend
        const isCorrect = result.prediction === result.targetType;
        setRecentAccuracies(prev => [...prev.slice(-9), isCorrect ? 1 : 0]);
      } catch (error) {
        console.error('Error recording trial:', error);
      }
    },
    [session]
  );

  /**
   * Handle pause/resume
   */
  const togglePause = useCallback(() => {
    setAppState(appState === 'playing' ? 'paused' : 'playing');
  }, [appState]);

  /**
   * Handle session end
   */
  const endSession = useCallback(() => {
    setAppState('init');
    setSession(null);
    setCalibration(null);
    setRecentAccuracies([]);
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {appState === 'init' ? (
        <SessionInit onSessionCreated={handleSessionCreated} isLoading={isLoading} />
      ) : (
        <div className="w-full h-screen flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">🧠 BCI Game Session</h1>
                <p className="text-gray-600 text-sm">
                  Session ID: {session?.id.slice(0, 12)}... | User: {session?.userId}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={togglePause}
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors"
                >
                  {appState === 'playing' ? '⏸ Pause' : '▶ Resume'}
                </button>

                <button
                  onClick={endSession}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                >
                  End Session
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Game Board */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <GameBoard
                  sessionId={session?.id || ''}
                  calibration={calibration}
                  onTrialComplete={handleTrialComplete}
                  isActive={appState === 'playing'}
                />
              </div>

              {/* Calibration Dashboard */}
              <CalibrationDashboard
                session={session}
                calibration={calibration}
                recentAccuracies={recentAccuracies}
              />

              {/* Paper Reference */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Research Implementation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p className="font-semibold text-blue-900">BCI Pipeline (Paper Figure 2)</p>
                    <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                      <li>EEG Simulation: P300-like spikes</li>
                      <li>Preprocessing: Bandpass + Notch filters</li>
                      <li>Features: Mean, Peak, Latency</li>
                      <li>Classification: Linear Discriminant Analysis</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-900">Adaptive Interface (Paper Section 3)</p>
                    <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                      <li>Child-friendly gamified UI</li>
                      <li>Real-time performance tracking</li>
                      <li>Adaptive difficulty scaling</li>
                      <li>Fatigue-aware pacing</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-4 pt-4 border-t border-blue-200">
                  Reference: "Breaking Barriers: Feasibility of Affordable Brain-Computer Interfaces for Pediatric Cerebral Palsy"
                </p>
              </div>
            </div>
          </div>

          {/* Pause Overlay */}
          {appState === 'paused' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-8 text-center max-w-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Session Paused</h2>
                <p className="text-gray-600 mb-6">Take a break! Click resume to continue.</p>
                <button
                  onClick={togglePause}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Resume
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
