import React from 'react';
import { FeatureVector, ClassificationResult } from '../types/index.js';

interface PipelineMonitorProps {
  rawSignal: number[] | null;
  filteredSignal: number[] | null;
  features: FeatureVector | null;
  classification: ClassificationResult | null;
  isProcessing: boolean;
}

const Chart: React.FC<{
  title: string;
  data: number[] | null;
  height?: number;
}> = ({ title, data, height = 120 }) => {
  const width = 400;
  const padding = 8;

  const buildPath = (values: number[]) => {
    if (values.length === 0) return '';

    // Determine symmetric range for nicer look
    const maxAbs = Math.max(1e-6, ...values.map(v => Math.abs(v)));
    const minY = -maxAbs;
    const maxY = maxAbs;

    const toX = (i: number) => padding + (i / (values.length - 1)) * (width - padding * 2);
    const toY = (v: number) => {
      const t = (v - minY) / (maxY - minY);
      return padding + (1 - t) * (height - padding * 2);
    };

    let d = `M ${toX(0)} ${toY(values[0])}`;
    for (let i = 1; i < values.length; i++) {
      d += ` L ${toX(i)} ${toY(values[i])}`;
    }
    return d;
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
        <span className="text-[10px] text-gray-500">{data ? `${data.length} pts` : '—'}</span>
      </div>
      <svg width={width} height={height} className="w-full h-auto">
        {/* Grid */}
        <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="#e5e7eb" strokeWidth={1} />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e7eb" strokeWidth={1} />
        {data && data.length > 1 && (
          <path d={buildPath(data)} fill="none" stroke="#2563eb" strokeWidth={1.5} />
        )}
      </svg>
    </div>
  );
};

export const PipelineMonitor: React.FC<PipelineMonitorProps> = ({
  rawSignal,
  filteredSignal,
  features,
  classification,
  isProcessing,
}) => {
  const stage = (
    rawSignal ? 1 : 0
  ) + (
    filteredSignal ? 1 : 0
  ) + (
    features ? 1 : 0
  ) + (
    classification ? 1 : 0
  );

  return (
    <div className="bg-gradient-to-b from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">EEG → Decision Pipeline</h3>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${isProcessing ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {isProcessing ? 'Live' : 'Idle'}
          </span>
        </div>
        <div className="text-xs text-gray-600">Stage {stage}/4</div>
      </div>

      {/* Stages */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <div className={`px-3 py-2 rounded border text-xs ${rawSignal ? 'bg-white border-blue-300' : 'bg-white/60 border-gray-200 text-gray-400'}`}>
          1. Simulated EEG
        </div>
        <div className={`px-3 py-2 rounded border text-xs ${filteredSignal ? 'bg-white border-blue-300' : 'bg-white/60 border-gray-200 text-gray-400'}`}>
          2. Preprocessed
        </div>
        <div className={`px-3 py-2 rounded border text-xs ${features ? 'bg-white border-blue-300' : 'bg-white/60 border-gray-200 text-gray-400'}`}>
          3. Features
        </div>
        <div className={`px-3 py-2 rounded border text-xs ${classification ? 'bg-white border-blue-300' : 'bg-white/60 border-gray-200 text-gray-400'}`}>
          4. Decision
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Chart title="Raw EEG" data={rawSignal} />
        <Chart title="Filtered EEG" data={filteredSignal} />
      </div>

      {/* Features and Decision */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Features</h4>
          {features ? (
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-blue-50 rounded text-blue-900">
                <div className="font-semibold">Mean</div>
                <div>{features.mean.toFixed(3)}</div>
              </div>
              <div className="p-2 bg-blue-50 rounded text-blue-900">
                <div className="font-semibold">Peak</div>
                <div>{features.peak.toFixed(3)}</div>
              </div>
              <div className="p-2 bg-blue-50 rounded text-blue-900">
                <div className="font-semibold">Latency</div>
                <div>{features.latency.toFixed(1)} ms</div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Awaiting features…</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 md:col-span-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Decision</h4>
          {classification ? (
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded text-sm font-semibold ${classification.prediction === 'YES' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {classification.prediction}
              </div>
              <div className="text-gray-700 text-sm">
                Confidence: {(classification.confidence * 100).toFixed(1)}%
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Awaiting classification…</p>
          )}
        </div>
      </div>
    </div>
  );
};
