import React, { useState, useEffect } from 'react';
import SplashCursor from './SplashCursor';
import './output.css'

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
  const API_URL = "http://localhost:10000"

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
    <div className="relative min-h-screen bg-linear-to-r from-indigo-200 to-teal-100 p-7">
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

      <header className="relative text-center py-8 px-4 bg-linear-to-r from-indigo-600 to-teal-500 text-white rounded-2xl shadow-xl mb-8">
        <h1 className="text-4xl font-bold mb-2">Heart Disease Risk Predictor</h1>
        <p className="text-lg opacity-90">Enter patient information to predict heart disease risk</p>
      </header>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {formFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    >
                      {field.options.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-linear-to-r from-indigo-600 to-teal-500 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Predicting...
                  </span>
                ) : (
                  'Predict Heart Disease Risk'
                )}
              </button>
            </div>
            
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
          </form>
        </div>

        {prediction && (
          <div className={`bg-white rounded-2xl shadow-2xl p-8 mb-8 border-4 transition-all duration-500 ${
      prediction.prediction === 1 
        ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-in fade-in zoom-in duration-300' 
        : 'border-green-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-in fade-in zoom-in duration-300'
    }`}
  >

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Prediction Results</h2>
                <h3 className={`text-xl font-semibold ${prediction.result === "Heart Disease PRESENCE" ? 'text-red-600' : 'text-green-600'}`}>
                  {prediction.result === "Heart Disease PRESENCE" ? (
                    <span className="flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Heart Disease Detected
                    </span>
                  ) : (
                    <span className="flex items-center">
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
                  <span className="font-semibold text-gray-700">Heart Disease:</span>
                  <span className="px-4 py-2 bg-red-100 text-red-700 font-bold rounded-lg">
                    {prediction.confidence_percentages?.["heart disease"] || '0%'}
                  </span>
                </div>
                <div className="flex justify-between items-center space-x-4">
                  <span className="font-semibold text-gray-700">No Heart Disease:</span>
                  <span className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-lg">
                    {prediction.confidence_percentages?.["no heart disease"] || '0%'}
                  </span>
                </div>
              </div>
            </div>

            {/* Clinical Insights */}
            {prediction.clinical_insights && prediction.clinical_insights.length > 0 && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  Clinical Insights
                </h4>
                <ul className="space-y-3">
                  {prediction.clinical_insights.map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{insight}</span>
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
                Make Another Prediction
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats / Info Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">💡 About This Prediction Model</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-semibold text-blue-700 mb-2">Model Accuracy</div>
              <div className="text-2xl font-bold text-blue-900">85.19%</div>
              <div className="text-sm text-blue-600 mt-1">On test dataset</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-semibold text-green-700 mb-2">Key Factors</div>
              <div className="text-2xl font-bold text-green-900">13 Features</div>
              <div className="text-sm text-green-600 mt-1">Analyzed for prediction</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm font-semibold text-purple-700 mb-2">Response Time</div>
              <div className="text-2xl font-bold text-purple-900">&lt; 1s</div>
              <div className="text-sm text-purple-600 mt-1">Real-time predictions</div>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 text-center mt-12 text-gray-600 text-sm">
        <p>Heart Disease Risk Prediction API v1.0 • Stateless REST API for clinical risk inference</p>
        <p className="mt-2">Classification Model trained on real clinical data • Results are for informational purposes only</p>
      </footer>
    </div>
  );
}

export default App;