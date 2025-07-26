from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import pandas as pd
import pickle
import os
from typing import Dict, Any, Optional
from datetime import datetime
import logging
from logging.handlers import RotatingFileHandler
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        RotatingFileHandler('logs/service.log', maxBytes=1024*1024, backupCount=5),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Transaction Risk Analyzer API")

# Load the model
MODEL_PATH = "models/frauddetection.pkl"

try:
    with open(MODEL_PATH, 'rb') as model_file:
        model = pickle.load(model_file)
    logger.info("Model loaded successfully")
    logger.info(f"Model version: {model.version if hasattr(model, 'version') else 'unknown'}")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    model = None

# No Kafka producer needed

class TransactionFeatures(BaseModel):
    amount: float
    hour_of_day: int
    is_blacklisted: bool
    is_flagged: bool
    has_location: bool
    is_mobile: bool
    is_off_hours: bool
    additional_features: Dict[str, Any] = {}

class PredictionResponse(BaseModel):
    risk_score: float
    risk_level: str
    risk_factors: list[str]
    recommendations: list[str]

@app.get("/")
async def root():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/predict", response_model=PredictionResponse)
async def predict_risk(transaction: Dict[str, Any]):
    logger.info("Prediction request received")
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        # Convert transaction to features
        features = TransactionFeatures(
            amount=transaction['amount'],
            hour_of_day=int(transaction['transactionTime'].split('T')[1].split(':')[0]),
            is_blacklisted=transaction.get('isBlacklisted', False),
            is_flagged=transaction.get('isFlagged', False),
            has_location=bool(transaction.get('location', '')),
            is_mobile=transaction.get('metadata', {}).get('device', 'web') == 'mobile',
            is_off_hours=int(transaction['transactionTime'].split('T')[1].split(':')[0]) in range(0, 6),
            additional_features={
                'transactionId': transaction['transactionId']
            }
        )

        # Get prediction
        feature_array = np.array([
            features.amount,
            features.hour_of_day,
            1 if features.is_blacklisted else 0,
            1 if features.is_flagged else 0,
            1 if features.has_location else 0,
            1 if features.is_mobile else 0,
            1 if features.is_off_hours else 0
        ]).reshape(1, -1)

        risk_score = float(model.predict_proba(feature_array)[0][1])
        
        # Generate response
        risk_level = "HIGH" if risk_score >= 0.7 else "MEDIUM" if risk_score >= 0.4 else "LOW"
        
        risk_factors = []
        if risk_score >= 0.7:
            risk_factors.append("High risk transaction")
        if features.is_blacklisted:
            risk_factors.append("Blacklisted account involved")
        if features.is_flagged:
            risk_factors.append("Previously flagged transaction")
        if features.is_off_hours:
            risk_factors.append("Off-hours transaction")
        if features.is_mobile and features.amount > 10000:
            risk_factors.append("Large mobile transaction")

        recommendations = []
        if risk_score >= 0.7:
            recommendations.append("Block transaction immediately")
            recommendations.append("Create fraud alert")
        elif risk_score >= 0.4:
            recommendations.append("Monitor transaction closely")
            recommendations.append("Contact customer")

        # Log analysis results
        logger.info(f"Analysis for transaction {transaction['transactionId']}: Risk Score={risk_score:.2f}, Level={risk_level}")

        return {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "risk_factors": risk_factors,
            "recommendations": recommendations
        }
    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")
    logger.info("Prediction request received")
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        # Prepare features for prediction
        feature_array = np.array([
            features.amount,
            features.hour_of_day,
            1 if features.is_blacklisted else 0,
            1 if features.is_flagged else 0,
            1 if features.has_location else 0,
            1 if features.is_mobile else 0,
            1 if features.is_off_hours else 0,
            # Add any additional features from the model's expected input
            *[features.additional_features.get(feat, 0) for feat in model.feature_names_in_]
        ]).reshape(1, -1)

        # Get prediction
        risk_score = float(model.predict_proba(feature_array)[0][1])
        
        # Generate response
        risk_level = "HIGH" if risk_score >= 0.7 else "MEDIUM" if risk_score >= 0.4 else "LOW"
        
        risk_factors = []
        if risk_score >= 0.7:
            risk_factors.append("High risk transaction")
        if features.is_blacklisted:
            risk_factors.append("Blacklisted account involved")
        if features.is_flagged:
            risk_factors.append("Previously flagged transaction")
        if features.is_off_hours:
            risk_factors.append("Off-hours transaction")
        if features.is_mobile and features.amount > 10000:
            risk_factors.append("Large mobile transaction")

        recommendations = []
        if risk_score >= 0.7:
            recommendations.append("Block transaction immediately")
            recommendations.append("Create fraud alert")
        elif risk_score >= 0.4:
            recommendations.append("Monitor transaction closely")
            recommendations.append("Contact customer")

        # Send to Kafka topic if producer is available
        if producer:
            try:
                producer.send('transaction_analysis', {
                    'transactionId': features.additional_features.get('transactionId', str(uuid.uuid4())),
                    'riskScore': risk_score,
                    'riskLevel': risk_level,
                    'riskFactors': risk_factors,
                    'recommendations': recommendations,
                    'timestamp': datetime.now().isoformat()
                })
                logger.info("Analysis sent to Kafka")
            except Exception as e:
                logger.error(f"Error sending to Kafka: {e}")

        return {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "risk_factors": risk_factors,
            "recommendations": recommendations
        }
    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
