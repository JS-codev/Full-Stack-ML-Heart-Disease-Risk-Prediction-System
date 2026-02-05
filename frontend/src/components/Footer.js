import React from 'react';

export default function Footer() {
  return (
    <footer className="relative z-10 text-center mt-12 text-white/50 text-sm">
      <p>Heart Disease Risk Prediction API v1.1 • Stateless REST API for clinical risk inference</p>
      <p className="mt-2">Classification Model trained on real clinical data • Results are for informational purposes only</p>
    </footer>
  );
}