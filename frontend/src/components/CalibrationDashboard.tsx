/**
 * Calibration and Feedback Dashboard
 * 
 * Displays real-time performance metrics and system state
 */

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Session, CalibrationState } from '../types/index.js';

interface CalibrationDashboardProps {
  session: Session | null;
  calibration: CalibrationState | null;
  recentAccuracies: number[];
}

export const CalibrationDashboard: React.FC<CalibrationDashboardProps> = ({
  session,
  calibration,
  recentAccuracies,
}) => {
  const accuracyPercentage = session ? Math.round(session.accuracy * 100) : 0;
  const recentAccuracyPercentage = calibration ? Math.round(calibration.recentAccuracy * 100) : 0;

  // Prepare chart data
  const chartData = recentAccuracies.map((accuracy, index) => ({
    trial: index + 1,
    accuracy: Math.round(accuracy * 100),
  }));

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Performance Dashboard</h2>
        <p className="text-gray-600 text-sm">Real-time system adaptation metrics</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Session Accuracy */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-gray-600 text-sm font-medium mb-2">Session Accuracy</p>
          <p className="text-3xl font-bold text-blue-600">{accuracyPercentage}%</p>
          <p className="text-gray-500 text-xs mt-2">{session?.totalTrials || 0} trials</p>
        </div>

        {/* Recent Accuracy */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-gray-600 text-sm font-medium mb-2">Recent Accuracy</p>
          <p className="text-3xl font-bold text-green-600">{recentAccuracyPercentage}%</p>
          <p className="text-gray-500 text-xs mt-2">Last 10 trials</p>
        </div>

        {/* Difficulty Level */}
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-gray-600 text-sm font-medium mb-2">Difficulty</p>
          <p className="text-3xl font-bold text-purple-600">
            {calibration ? (calibration.flashSpeed * 100).toFixed(0) : '100'}%
          </p>
          <p className="text-gray-500 text-xs mt-2">Flash Speed</p>
        </div>

        {/* Objects Count */}
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <p className="text-gray-600 text-sm font-medium mb-2">Complexity</p>
          <p className="text-3xl font-bold text-orange-600">{calibration?.objectCount || 3}</p>
          <p className="text-gray-500 text-xs mt-2">Objects</p>
        </div>
      </div>

      {/* Accuracy Trend Chart */}
      {chartData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Accuracy Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="trial" />
              <YAxis domain={[0, 100]} label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Calibration Info */}
      {calibration && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">System State</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Flash Speed Multiplier</p>
              <p className="text-lg font-semibold text-gray-800">{(calibration.flashSpeed * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-gray-600">Confidence Threshold</p>
              <p className="text-lg font-semibold text-gray-800">{(calibration.confidenceThreshold * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-gray-600">Trial Interval</p>
              <p className="text-lg font-semibold text-gray-800">{calibration.trialInterval}ms</p>
            </div>
            <div>
              <p className="text-gray-600">Object Count</p>
              <p className="text-lg font-semibold text-gray-800">{calibration.objectCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Status Message */}
      <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 text-blue-800 text-sm">
        <p>
          <strong>System Adaptation:</strong> The BCI system automatically adjusts difficulty based on your
          performance. Doing well? We'll make it harder. Struggling? We'll slow down.
        </p>
      </div>
    </div>
  );
};
