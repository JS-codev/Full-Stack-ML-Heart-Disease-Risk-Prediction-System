import React, { useState, useEffect } from 'react';
import SplashCursor from './components/SplashCursor';
import ShinyText from './components/ShinyText';
import Header from './components/Header';
import AnimatedSelect from './components/AnimatedSelect';

import './styles/output.css';
import Card from './styles/card';
import Background from './styles/background';

  const formFields = [
    { name: 'Age', label: 'Age', type: 'number', min: 0, max: 120, placeholder: 'Enter age' },
    { name: 'Sex', label: 'Gender', type: 'select', options: [
      { value: '0', label: 'Female' },
      { value: '1', label: 'Male' }
    ]},
    { name: 'ChestPainType', label: 'Chest Pain Type', type: 'select', options: [
      { value: '1', label: 'Typical Angina' },
      { value: '2', label: 'Atypical Angina' },
      { value: '3', label: 'Non-anginal Pain' },
      { value: '4', label: 'Asymptomatic' }
    ]},
    { name: 'BP', label: 'Blood Pressure (mm Hg)', type: 'number', min: 0, max: 300, placeholder: 'e.g., 120' },
    { name: 'Cholesterol', label: 'Cholesterol (mg/dl)', type: 'number', min: 0, max: 700, placeholder: 'e.g., 200' },
    { name: 'FBS', label: 'Fasting Blood Sugar > 120 mg/dl', type: 'select', options: [
      { value: '0', label: 'No (< 120)' },
      { value: '1', label: 'Yes (> 120)' }
    ]},
    { name: 'EKG', label: 'EKG Results', type: 'select', options: [
      { value: '0', label: 'Normal' },
      { value: '1', label: 'ST-T Abnormality' },
      { value: '2', label: 'Left Ventricular Hypertrophy' }
    ]},
    { name: 'MaxHR', label: 'Maximum Heart Rate', type: 'number', min: 0, max: 250, placeholder: 'e.g., 150' },
    { name: 'ExerciseAngina', label: 'Exercise Induced Angina', type: 'select', options: [
      { value: '0', label: 'No' },
      { value: '1', label: 'Yes' }
    ]},
    { name: 'STDepression', label: 'ST Depression', type: 'number', step: '0.1', min: 0, max: 10, placeholder: 'e.g., 0.0' },
    { name: 'SlopeST', label: 'Slope of ST Segment', type: 'select', options: [
      { value: '1', label: 'Upsloping' },
      { value: '2', label: 'Flat' },
      { value: '3', label: 'Downsloping' }
    ]},
    { name: 'NumVessels', label: 'Number of Major Vessels', type: 'select', options: [
      { value: '0', label: '0' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' }
    ]},
    { name: 'Thallium', label: 'Thallium Scan', type: 'select', options: [
      { value: '3', label: 'Normal' },
      { value: '6', label: 'Fixed Defect' },
      { value: '7', label: 'Reversible Defect' }
    ]}
  ];
  
function App() {
  const [formData, setFormData] = useState({
    Age: '',
    Sex: '0',
    ChestPainType: '1',
    BP: '',
    Cholesterol: '',
    FBS: '0',
    EKG: '0',
    MaxHR: '',
    ExerciseAngina: '0',
    STDepression: '',
    SlopeST: '1',
    NumVessels: '0',
    Thallium: '3'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // backend server (which runs on "http://localhost:10000" or render server: process.env.REACT_APP_API_URL)
  const API_URL = process.env.REACT_APP_API_URL

  // Open the rander server to prevent backend server from sleeping
  const [serverReady, setServerReady] = useState(false);
   
  const wakeServer = async () => {
    try {
      // Use HEAD request to click render URL to wake up 
      await fetch(`${API_URL}/`, { 
        method: 'HEAD',
        headers: { 'Accept': 'application/json' }
      });
      setServerReady(true);
    } catch (error) {
      // Even if fetch errors, the server will still wake up
      console.log('Server start attempt sent from React App.js');
    }
  };

  useEffect(() => { // call wakeServer(); once
    console.log('App loaded, waking server...');
    wakeServer();
  }, []); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serverReady) {  
      setError('Server is starting up. Please click predict again after 15 seconds...');
      wakeServer(); // click on render's server api URL to start server
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Age: parseInt(formData.Age) || 0,
          Sex: parseInt(formData.Sex),
          ChestPainType: parseInt(formData.ChestPainType),
          BP: parseInt(formData.BP) || 0,
          Cholesterol: parseInt(formData.Cholesterol) || 0,
          FBS: parseInt(formData.FBS),
          EKG: parseInt(formData.EKG),
          MaxHR: parseInt(formData.MaxHR) || 0,
          ExerciseAngina: parseInt(formData.ExerciseAngina),
          STDepression: parseFloat(formData.STDepression) || 0,
          SlopeST: parseInt(formData.SlopeST),
          NumVessels: parseInt(formData.NumVessels),
          Thallium: parseInt(formData.Thallium)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Prediction failed');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err.message || 'Error making prediction. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return ( 
    <Background>

    {/* Mouse colourful effect */}
    <div className="fixed inset-0 z-0 pointer-events-none">
      <SplashCursor 
        SIM_RESOLUTION={64}
        DYE_RESOLUTION={512}
        DENSITY_DISSIPATION={5.5}
        VELOCITY_DISSIPATION={2.5}
        PRESSURE={0.2}
        CURL={3}
        SPLAT_RADIUS={0.2}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={10}
      />
    </div>

    {/* Header */}
    <Card>
    <Header/>
    </Card>

      {/* User Inputs */}
      <div className="max-w-6xl mx-auto relative z-10">
      <Card>
        <div className="p-8 mb-8 text-white">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {formFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-semibold text-indigo-100">
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <AnimatedSelect
                      field={field}
                      value={formData[field.name]}
                      onChange={handleChange}
                    />
                    // <select
                    //   name={field.name}
                    //   value={formData[field.name]}
                    //   onChange={handleChange}
                    //   required
                    //   className="w-full px-4 py-3 bg-gray-800/40 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                    // >
                    //   {field.options.map(opt => (
                    //     <option key={opt.value} value={opt.value}>
                    //       {opt.label}
                    //     </option>
                    //   ))}
                    // </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      min={field.min}
                      max={field.max}
                      step={field.step || '1'}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-gray-800/40 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                    />
                  )}
                </div>
              ))}
            </div>
            
         

          {/* Prediction Button */}
          <div className="text-center">
          
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-5 bg-gradient-to-r from-indigo-500/80 to-teal-400/80 backdrop-blur-sm text-white font-bold rounded-lg border border-white/20 hover:from-indigo-500 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] transform hover:-translate-y-1 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Predicting...
              </span>
            ) : (
              <ShinyText
                text="Predict Heart Disease Risk"
                speed={2}
                color="#ffffff" // Base text white
                shineColor="#93c5fd" // Light blue shine for a medical/tech feel
                spread={100}
                yoyo={true}
                className="font-bold text-base tracking-tight uppercase"
              />
            )}
            
          </button>
          </div>
        
        {/* Color Error message */}
        {error && (
          <div className="mt-6 p-4 bg-red-900/40 backdrop-blur-md border border-red-500/70 text-red-200 rounded-lg animate-pulse">
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}
      </form>
    </div>

    {prediction && (
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
            {prediction.clinical_insights && prediction.clinical_insights.length > 0 && (
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
          )}

            {/* Input Features Review - uncomment below to debug items*/}
            {/* <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Input Features
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {prediction.input_features && Object.entries(prediction.input_features).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-semibold text-gray-600 mb-1">{key}</div>
                    <div className="text-lg font-medium text-gray-800">{String(value)}</div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setPrediction(null)}
                className="px-6 py-3 bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <ShinyText
                text="Make Another Prediction"
                speed={2}
                color="#ffffff" // Base text white
                shineColor="#93c5fd" // Light blue shine for a medical/tech feel
                spread={100}
                yoyo={true}
                className="font-bold text-base tracking-tight uppercase"
              />
              </button>
            </div>
          </div>
        )}
        </Card>

        {/* Quick Stats / Info Model Section */}
        <Card>
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
        </Card>
      </div>
      

      <footer className="relative z-10 text-center mt-12 text-white/50 text-sm">
        <p>Heart Disease Risk Prediction API v1.1 • Stateless REST API for clinical risk inference</p>
        <p className="mt-2">Classification Model trained on real clinical data • Results are for informational purposes only</p>
      </footer>
    </Background>
  );
}

export default App;