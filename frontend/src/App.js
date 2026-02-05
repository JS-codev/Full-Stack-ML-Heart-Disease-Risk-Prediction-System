import React, { useState, useEffect } from 'react';
import SplashCursor from './components/SplashCursor';
import Header from './components/Header';
import UserInputs from './components/UserInputs';
import PredictionButton from './components/PredictionButton';
import ErrorMessage from './components/ErrorMessage';
import PredictionResults from './components/PredictionResults';
import ActionButtons from './components/ActionButtons';
import ModelStats from './components/ModelStats';
import Footer from './components/Footer';

import './styles/output.css';
import Card from './styles/card';
import Background from './styles/background';

  // Mouse colourful effect  
  const SplashLayer = React.memo(() => (
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
      COLOR_UPDATE_SPEED={10} />
  </div>
));

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
  
  const isMobile = /Android|iPhone/i.test(navigator.userAgent);

  return ( 
    <Background>
    {!isMobile && <SplashLayer />}

    {/* Header */}
    <Card>
    <Header/>
    </Card>

    {/* User Inputs */}
    <div className="max-w-6xl mx-auto relative z-10">
      <Card>
        <div className="p-8 mb-8 text-white">
          <form onSubmit={handleSubmit}>
            <UserInputs formData={formData} handleChange={handleChange} />
            
            {/* Prediction Button */}
            <PredictionButton loading={loading} />
          
            {/* Color Error message */}
            <ErrorMessage error={error} />
          </form>
        </div>
      
        {/* Prediction Results + Clinical Insights*/}
        {prediction && (
          <>
            <PredictionResults prediction={prediction} />

            {/* Action Buttons */}
            <ActionButtons onNewPrediction={() => setPrediction(null)} />
          </>
        )}
      </Card>

      {/* Quick Stats / Info Model Section */}
      <Card>
        <ModelStats />
      </Card>
    </div>
    
    {/* Bottom page Info */}
    <Footer />
    </Background>
  );
}

export default App;