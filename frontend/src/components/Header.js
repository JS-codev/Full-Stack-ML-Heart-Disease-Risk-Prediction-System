// Header.js
import React from "react";

export default function Header() {
  return (
    <header className="text-center max-w-full py-8 px-15 bg-transparent text-white mb-2">
      <h1 className="text-4xl font-bold mb-2">Heart Disease Risk Predictor</h1>
      <p className="text-lg opacity-100">
        Enter patient information to predict heart disease risk
      </p>
    </header>
  );
};
