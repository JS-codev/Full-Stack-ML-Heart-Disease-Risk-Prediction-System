import React from 'react';
import ShinyText from './ShinyText';

export default function PredictionButton({ loading }) {
  return (
    <div className="text-center">
      <button
        type="submit"
        disabled={loading}
        className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Predicting...
          </span>
        ) : (
          <ShinyText
            text="Predict Heart Disease Risk"
            speed={2}
            color="#ffffff"
            shineColor="#93c5fd"
            spread={100}
            yoyo={true}
            className="font-bold text-base tracking-tight uppercase"
          />
        )}
      </button>
    </div>
  );
}