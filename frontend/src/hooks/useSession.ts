/**
 * Custom hook for managing BCI game session
 */

import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../utils/apiClient.js';
import { Session, CalibrationState } from '../types/index.js';

export interface UseSessionState {
  session: Session | null;
  calibration: CalibrationState | null;
  isLoading: boolean;
  error: string | null;
}

export function useSession(sessionId: string | null) {
  const [state, setState] = useState<UseSessionState>({
    session: null,
    calibration: null,
    isLoading: false,
    error: null,
  });

  const createSession = useCallback(async (userId: string): Promise<Session | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const session = await apiClient.createSession(userId);
      setState(prev => ({
        ...prev,
        session,
        calibration: session.calibration || null,
      }));
      return session;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create session';
      setState(prev => ({ ...prev, error: errorMessage }));
      return null;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const getSession = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const session = await apiClient.getSession(id);
      setState(prev => ({
        ...prev,
        session,
        calibration: session.calibration || null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch session';
      setState(prev => ({ ...prev, error: errorMessage }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Auto-fetch session when sessionId changes
  useEffect(() => {
    if (sessionId) {
      getSession(sessionId);
    }
  }, [sessionId, getSession]);

  return { ...state, createSession, getSession };
}
