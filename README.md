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

### Running the Validator
```bash
pip install pydantic
python feature_validator.py
```
