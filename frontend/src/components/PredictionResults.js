import React from 'react';
import ClinicalInsights from './ClinicalInsights';

export default function PredictionResults({ prediction }) {
  if (!prediction) return null;

  return (
    <div className={`rounded-2xl backdrop-blur-xl p-8 mb-8 border-4 transition-all duration-500 ${
      prediction.prediction === 1 
        ? 'bg-red-900/20 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
        : 'bg-green-900/20 border-green-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">📊 Prediction Results</h2>
          <h3 className={`text-xl font-semibold ${prediction.result === "Heart Disease PRESENCE" ? 'text-red-500' : 'text-emerald-500'}`}>
            {prediction.result === "Heart Disease PRESENCE" ? (
              <span className="flex items-center drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Heart Disease Detected
              </span>
            ) : (
              <span className="flex items-center drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No Heart Disease
              </span>
            )}
          </h3>
        </div>
        
        <div className="mt-4 md:mt-0 space-y-3">
          <div className="flex justify-between items-center space-x-4">
            <span className="font-medium text-white/70">Heart Disease:</span>
            <span className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-200 font-bold rounded-lg shadow-[0_0_10px_rgba(239,68,68,0.2)]">
              {prediction.confidence_percentages?.["heart disease"] || '0%'}
            </span>
          </div>
          <div className="flex justify-between items-center space-x-4">
            <span className="font-medium text-white/70">No Heart Disease:</span>
            <span className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 font-bold rounded-lg shadow-[0_0_10px_rgba(52,211,153,0.2)]">
              {prediction.confidence_percentages?.["no heart disease"] || '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Clinical Insights */}
      <ClinicalInsights prediction={prediction} />
    </div>
  );
}