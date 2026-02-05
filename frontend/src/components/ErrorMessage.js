import React from 'react';

export default function ErrorMessage({ error }) {
  if (!error) return null;

  return (
    <div className="mt-6 p-4 bg-red-900/40 backdrop-blur-md border border-red-500/70 text-red-200 rounded-lg animate-pulse">
      <div className="flex items-center justify-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">{error}</span>
      </div>
    </div>
  );
}