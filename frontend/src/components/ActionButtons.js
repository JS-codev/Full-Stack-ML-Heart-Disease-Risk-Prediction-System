import React from 'react';
import ShinyText from './ShinyText';

export default function ActionButtons({ onNewPrediction }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={onNewPrediction}
        className="px-6 py-3 bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <ShinyText
          text="Make Another Prediction"
          speed={2}
          color="#ffffff"
          shineColor="#93c5fd"
          spread={100}
          yoyo={true}
          className="font-bold text-base tracking-tight uppercase"
        />
      </button>
    </div>
  );
}