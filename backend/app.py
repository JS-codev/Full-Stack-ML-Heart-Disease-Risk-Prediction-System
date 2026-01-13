"""
Created on Mon May 12 20:50:04 2026

@author: Joshua Soh
"""
 
from fastapi import FastAPI, HTTPException, Request, Response
from pydantic import BaseModel
import pickle
import numpy as np
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import os
import logging

app = FastAPI(title="Heart Disease Prediction API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # set this to [*] if frontend cannot fetch this backend server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This code will make your server work locally and cloudly, by forcing policy to allow these specific address to go through.
# @app.middleware("http")
# async def add_cors_headers(request: Request, call_next):
#     # Handle preflight requests
#     if request.method == "OPTIONS":
#         response = Response()
#     else:
#         response = await call_next(request)
    
#     # Always add CORS headers
#     origin = request.headers.get("origin")
#     if origin in ["http://localhost:3000/"]:
#         response.headers["Access-Control-Allow-Origin"] = origin
#         response.headers["Access-Control-Allow-Credentials"] = "true"
#         response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
#         response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
#     return response


# Load the model and scaler from pickle file
model_path = os.path.join(os.path.dirname(__file__), "heart_disease_model.pkl")
try:
    with open(model_path, 'rb') as file:
        artifact = pickle.load(file)
        best_model = artifact.get('model')
        scaler = artifact.get('scaler')
    
    if best_model and scaler:
        print(f"Model and scaler loaded successfully from {model_path}")
        #  Add missing multi_class attribute  
        if hasattr(best_model, 'multi_class'):
            print(f"Model has multi_class: {best_model.multi_class}")
        else:
            print(" Adding missing 'multi_class' attribute for compatibility")
            best_model.multi_class = 'auto'
    else:
        print(f"Model or scaler not found in pickle file")
        if not best_model:
            print(f"   - Model not found")
        if not scaler:
            print(f"   - Scaler not found")
        
except FileNotFoundError:
    print(f"Model file not found at {model_path}")
    best_model = None
    scaler = None
except Exception as e:
    print(f"Error loading model: {e}")
    best_model = None
    scaler = None

# Define input data model with validation and example
class PatientData(BaseModel):
    Age: int
    Sex: int  # 0 = female, 1 = male
    ChestPainType: int  # 1-4
    BP: int
    Cholesterol: int
    FBS: int  # 0 or 1
    EKG: int  # 0-2
    MaxHR: int
    ExerciseAngina: int  # 0 or 1
    STDepression: float
    SlopeST: int  # 1-3
    NumVessels: int  # 0-3
    Thallium: int  # 3, 6, 7
    
    class Config:
        schema_extra = {
            "example": {
                "Age": 57,
                "Sex": 1,
                "ChestPainType": 2,
                "BP": 124,
                "Cholesterol": 261,
                "FBS": 0,
                "EKG": 0,
                "MaxHR": 141,
                "ExerciseAngina": 0,
                "STDepression": 0.3,
                "SlopeST": 1,
                "NumVessels": 0,
                "Thallium": 7
            }
        }
 

@app.api_route("/", methods=["GET", "HEAD"])
def home(request: Request):
    if request.method == "HEAD":
        return Response(headers={"X-Status": "OK"})
    return {
        "message": "Heart Disease Prediction API",
        "version": "1.0",
        "endpoints": {
            "documentation": "/docs",
            "prediction": "/predict",
            "features": "/features"
        },
        "status": "Ready" if best_model and scaler else "Model not loaded"
    }

@app.post("/predict")
def predict(data: PatientData):
    """
    Predict heart disease based on patient features
    
    Returns:
    - prediction: 0 (Absence) or 1 (Presence)
    - probabilities: Confidence scores for both classes
    - insights: Clinical insights based on input values
    """
    try:
        if best_model is None or scaler is None:
            raise HTTPException(status_code=500, detail="Model or scaler not loaded properly")
        
        # The input data must be in the exact same order as your original data.
        input_data = [
            data.Age,
            data.Sex,
            data.ChestPainType,
            data.BP,
            data.Cholesterol,
            data.FBS,
            data.EKG,
            data.MaxHR,
            data.ExerciseAngina,
            data.STDepression,
            data.SlopeST,
            data.NumVessels,
            data.Thallium
        ]
        
        # Feature names in the exact order 
        feature_names = [
            "Age", "Sex", "Chest pain type", "BP", "Cholesterol", 
            "FBS over 120", "EKG results", "Max HR", "Exercise angina",
            "ST depression", "Slope of ST", "Number of vessels fluro", "Thallium"
        ]
        
        # Create DataFrame 
        test_df = pd.DataFrame([input_data], columns=feature_names)
        
        # Debug: Print input data
        print(f"\n Received prediction request:")
        for name, value in zip(feature_names, input_data):
            print(f"   {name}: {value}")
        
        # Standardize the input using the same scaler
        test_std = scaler.transform(test_df)
        
        # Make prediction
        pred = best_model.predict(test_std)[0]
        prob = best_model.predict_proba(test_std)[0]
        
        # Calculate probabilities
        prob_absence = float(prob[0])
        prob_presence = float(prob[1])
        
        # Store clinical insights
        insights = []
        
        # Thallium (most critical factor)
        if data.Thallium == 3:
            insights.append("Thallium stress test is normal: Low risk indicator")
        elif data.Thallium == 6:
            insights.append("Thallium stress test shows fixed defect: Moderate risk indicator")
        elif data.Thallium == 7:
            insights.append("Thallium stress test shows reversible defect: High risk indicator")
        
        # Max HR (negative correlation - higher is better)
        if data.MaxHR > 140:
            insights.append(f"High maximum heart rate ({data.MaxHR}): Negative correlation with heart disease")
        elif data.MaxHR < 100:
            insights.append(f"Low maximum heart rate ({data.MaxHR}): May indicate reduced exercise capacity")
        
        # Fasting Blood Sugar
        if data.FBS == 1:
            insights.append("Fasting blood sugar > 120 mg/dL: Slight risk factor")
        else:
            insights.append("Normal fasting blood sugar: Good indicator")
        
        # Number of vessels
        if data.NumVessels == 0:
            insights.append("No major vessels affected: Positive indicator")
        else:
            insights.append(f"{data.NumVessels} major vessel(s) affected: This increases risk")
        
        # Age
        if data.Age > 60:
            insights.append(f"Age {data.Age}: Increased risk factor")
        elif data.Age < 40:
            insights.append(f"Age {data.Age}: Lower risk factor")
        
        # Exercise-induced Angina
        if data.ExerciseAngina == 1:
            insights.append("Exercise-induced angina present: Significant risk factor")
        
        # Blood Pressure
        if data.BP > 140:
            insights.append(f"Elevated blood pressure ({data.BP} mm Hg): Risk factor")
        elif data.BP < 90:
            insights.append(f"Low blood pressure ({data.BP} mm Hg): May require investigation")
        
        # Cholesterol
        if data.Cholesterol > 240:
            insights.append(f"High cholesterol ({data.Cholesterol} mg/dL): Risk factor")
        elif data.Cholesterol < 200:
            insights.append(f"Normal cholesterol ({data.Cholesterol} mg/dL): Good indicator")
        
        # ST Depression
        if data.STDepression > 1.0:
            insights.append(f"Significant ST depression ({data.STDepression}): Indicates myocardial ischemia")
        
        return {
            "prediction": int(pred),
            "result": "Heart Disease PRESENCE" if pred == 1 else "Heart Disease ABSENCE",

            "confidence_percentages": {
                "no heart disease": f"{prob_absence:.2%}",
                "heart disease": f"{prob_presence:.2%}"
            },

            "clinical_insights": insights,
            "input_features": {
                "Age": data.Age,
                "Sex": "Male" if data.Sex == 1 else "Female",
                "ChestPainType": data.ChestPainType,
                "BP": f"{data.BP} mm Hg",
                "Cholesterol": f"{data.Cholesterol} mg/dL",
                "FBS": ">120 mg/dL" if data.FBS == 1 else "Normal",
                "EKG": data.EKG,
                "MaxHR": data.MaxHR,
                "ExerciseAngina": "Yes" if data.ExerciseAngina == 1 else "No",
                "STDepression": data.STDepression,
                "SlopeST": data.SlopeST,
                "NumVessels": data.NumVessels,
                "Thallium": {
                    3: "Normal",
                    6: "Fixed defect",
                    7: "Reversible defect"
                }.get(data.Thallium, data.Thallium)
            }
        }
        
    except Exception as e:
        error_msg = f"Prediction error: {str(e)}"
        print(f"{error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)



# Endpoint to get feature information (on what user data should be the input)
@app.get("/features")
def get_feature_info():
    """Get information about the features required for prediction"""
    return {
        "features": [
            {"name": "Age", "type": "int", "description": "Age of the patient in years"},
            {"name": "Sex", "type": "int", "description": "0 = Female, 1 = Male"},
            {"name": "ChestPainType", "type": "int", "description": "Type of chest pain (1-4)"},
            {"name": "BP", "type": "int", "description": "Blood pressure in mm Hg"},
            {"name": "Cholesterol", "type": "int", "description": "Cholesterol level in mg/dL"},
            {"name": "FBS", "type": "int", "description": "Fasting blood sugar > 120 mg/dL: 1 = Yes, 0 = No"},
            {"name": "EKG", "type": "int", "description": "Resting electrocardiographic results (0-2)"},
            {"name": "MaxHR", "type": "int", "description": "Maximum heart rate achieved"},
            {"name": "ExerciseAngina", "type": "int", "description": "Exercise induced angina: 0 = No, 1 = Yes"},
            {"name": "STDepression", "type": "float", "description": "ST depression induced by exercise relative to rest"},
            {"name": "SlopeST", "type": "int", "description": "Slope of the peak exercise ST segment: 1-3"},
            {"name": "NumVessels", "type": "int", "description": "Number of major vessels colored by flourosopy: 0-3"},
            {"name": "Thallium", "type": "int", "description": "Thallium stress test result: 3 = normal, 6 = fixed defect, 7 = reversible defect"}
        ],
        "example": {
            "Age": 57,
            "Sex": 1,
            "ChestPainType": 2,
            "BP": 124,
            "Cholesterol": 257,
            "FBS": 1,
            "EKG": 2,
            "MaxHR": 141,
            "ExerciseAngina": 1,
            "STDepression": 0.4,
            "SlopeST": 1,
            "NumVessels": 0,
            "Thallium": 3
        }
    }

port = 10000
logging.basicConfig(level=logging.INFO)
logging.info(f"\n{'='*40}")
logging.info(f"HEART DISEASE PREDICTION API")
logging.info(f"{'='*40}")
logging.info(f"\033[94mSwagger UI:    http://localhost:{port}/docs\033[0m")
logging.info(f"\033[93mFeature Info:  http://localhost:{port}/features\033[0m")
logging.info(f"{'='*40}")
logging.info(f"Model status: {'Loaded' if best_model else 'Not loaded'}")
logging.info(f"Scaler status: {'Loaded' if scaler else 'Not loaded'}")
logging.info(f"{'='*40}\n")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)