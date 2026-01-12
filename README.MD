## Heart Disease Risk Prediction App (Production ML Inference System)

[![Predictor system](https://img.youtube.com/vi/ejUCckGOi2w/maxresdefault.jpg)](https://youtu.be/ejUCckGOi2w?si=gbnChcxrDD4pEzp8)

**App:** [Live Build]( https://heart-disease-detector.netlify.app/)



## System Overview

- Deployed a containerized binary classification service for clinical risk prediction, exposing a versioned REST inference API with performance evaluated using ROC-AUC, precision, and recall on a held-out test set.
    - Logistic Regression baseline achieved 85% accuracy. 

- Designed an end-to-end inference pipeline: 
    - Client input → schema validation → model inference → structured response.

### Backend / ML Infrastructure
- Implemented a FastAPI inference service with strict input validation using Pydantic to enforce clinical parameter constraints.
- Containerized the model and runtime with Docker to ensure environment reproducibility across development and deployment.
- Built a stateless inference architecture suitable for horizontal scaling.
- Exposed health-check endpoints and implemented structured logging for service observability and debugging.

### Modeling
- Trained and evaluated a Logistic Regression baseline on tabular clinical data.  
- Applied a reproducible preprocessing pipeline with explicit train/validation split.  
- Evaluated performance using classification-appropriate metrics (ROC-AUC, precision, recall) instead of raw accuracy.  
- Versioned the trained model artifact and decoupled it from application logic to support future updates.  

### Frontend
- Developed a React + Tailwind CSS frontend for real-time inference requests.  
- Enforced strong client-side input constraints to reduce invalid or out-of-distribution inputs.  
- Rendered deterministic prediction outputs with associated confidence scores.  

### Deployment
- Deployed the backend as a containerized web service.  
- Deployed the frontend as a static application with API-based inference integration.  
- Implemented cold-start mitigation to maintain inference availability on managed hosting.  

### Engineering Focus
- Enforced separation of concerns between UI, API, model, and infrastructure layers.  
- Ensured reproducible builds and deterministic inference behavior.  
- Designed the system with production failure modes, validation, and maintainability in mind.  


## Technologies Used

- **Backend:** FastAPI-based inference service with strict request/response schemas, input validation, and low-latency prediction handling.
- **Frontend:** React-based client application for structured parameter input, real-time inference requests, and deterministic result rendering.
- **Containerization:** Dockerized application stack to ensure reproducible builds and consistent runtime behavior across environments.
- **Hosting:** Managed cloud deployment for containerized backend services and static frontend delivery.
- **Service Reliability:** Health-check endpoints and external uptime monitoring to validate inference availability and observe cold-start behavior in production.


## How to run this build (Locally):
1. **Install the prerequisites for this build to run:**
    - Install [Docker desktop ](https://docs.docker.com/desktop/setup/install/windows-install/)
    - `pip install` the following packages:
        - `FastAPI`
        - `Uvicorn`
        - `concurrently`
        - `pydantic`
        - `pickle`
        - `logging`
        - `os`

2. Do `git clone https://github.com/JS-codev/Full-Stack-ML-Heart-Disease-Risk-Prediction-System.git`

3. Open a terminal > `cd backend`

	- `docker build -t heart-disease-api .` & `docker run -p 10000:10000 heart-disease-api`
		- Should run at [http://localhost:10000/docs](http://localhost:10000/docs)

4. Open another terminal >`cd 'frontend'`
	- `npm install` & `npm start`
        - It should auto-open website at [http://localhost:10000/](http://localhost:10000/)

