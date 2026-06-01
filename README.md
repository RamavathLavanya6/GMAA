# Global Mobility Application Analyzer (GMAA)

This repository contains the Machine Learning engineering tasks for the Global Mobility Application Analyzer.

## Task 1: Package a Model Inference Service
A frontend web application that simulates gathering features and displaying ML model inference predictions for global mobility applications. Built with HTML, Vanilla CSS (glassmorphism/dark mode), and JS.

## Task 2: Build a Feature Validation Pipeline
A robust Python pipeline (`feature_validator.py`) designed to validate incoming data payloads before they hit the ML inference model. 
- Utilizes `pydantic` for strict type checking and constraint validation.
- Validates numerical bounds (e.g., years of experience).
- Validates categorical data (e.g., valid visa types).
- Includes custom business logic (e.g., origin and destination cannot be the same).

## Task 3: Deploy a Monitored ML Endpoint
A production-ready `FastAPI` REST application (`app.py`) that serves the ML model predictions and exposes infrastructure and model-drift monitoring.
- Provides a `/predict` endpoint that utilizes the feature validation pipeline.
- Implements middleware to track latency and request counts.
- Implements standard `/health` checks.
- Exposes a `/metrics` endpoint serving `prometheus_client` data (tracking latency, request frequency, and statistical distribution of ML prediction scores).

### Running the Monitored API Locally
```bash
pip install -r requirements.txt
python app.py
```
* The API will be available at: http://localhost:8000
* Interactive Swagger Docs: http://localhost:8000/docs
* Prometheus Metrics: http://localhost:8000/metrics
