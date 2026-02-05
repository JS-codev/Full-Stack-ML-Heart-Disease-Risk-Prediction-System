import React from 'react';

export default function ClinicalInsights({ prediction }) {
  if (!prediction?.clinical_insights || prediction.clinical_insights.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
      <h4 className="text-lg font-bold text-white mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
        Clinical Insights
      </h4>
      <ul className="space-y-4">
        {prediction.clinical_insights.map((insight, index) => (
          <li key={index} className="flex items-start group">
            <div className="mt-1 mr-3 shrink-0 p-1 bg-indigo-500/20 rounded-full group-hover:bg-indigo-500/40 transition-colors">
              <svg className="w-3 h-3 text-indigo-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-indigo-100 leading-relaxed">{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}