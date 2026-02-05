import React from 'react';

export default function ModelStats() {
  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold text-white mb-5">💡 About This Prediction Model</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Model Accuracy - Blue Glass */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors">
          <div className="text-sm font-semibold text-blue-300 mb-2">Model Accuracy</div>
          <div className="text-2xl font-bold text-white">85.19%</div>
          <div className="text-sm text-blue-200/70 mt-1">On test dataset</div>
        </div>

        {/* Key Factors - Green Glass */}
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors">
          <div className="text-sm font-semibold text-green-300 mb-2">Key Factors</div>
          <div className="text-2xl font-bold text-white">13 Features</div>
          <div className="text-sm text-green-200/70 mt-1">Analyzed for prediction</div>
        </div>

        {/* Response Time - Purple Glass */}
        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors">
          <div className="text-sm font-semibold text-purple-300 mb-2">Response Time</div>
          <div className="text-2xl font-bold text-white">&lt; 1s</div>
          <div className="text-sm text-purple-200/70 mt-1">Real-time predictions</div>
        </div>

      </div>
    </div>
  );
}