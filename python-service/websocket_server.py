import asyncio
import json
import websockets
from typing import Dict, Any
import logging
from logging.handlers import RotatingFileHandler
from main import model, TransactionFeatures
import socketio
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        RotatingFileHandler('logs/websocket.log', maxBytes=1024*1024, backupCount=5),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Connect to TypeScript Socket.IO server
async def connect_to_typescript_server():
    sio = socketio.AsyncClient()
    
    @sio.on('connect')
    async def on_connect():
        logger.info("Connected to TypeScript Socket.IO server")
        
    @sio.on('transaction')
    async def on_transaction(data):
        await process_transaction(data)
        
    try:
        await sio.connect('http://localhost:8000')
        await sio.wait()
    except Exception as e:
        logger.error(f"Error connecting to TypeScript server: {e}")

async def process_transaction(transaction: Dict[str, Any]):
    """Process transaction from TypeScript server and return analysis."""
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

        # Send analysis back to TypeScript server using Socket.IO
        try:
            await sio.emit('analysis', {
                'transactionId': transaction['transactionId'],
                'riskScore': risk_score,
                'riskLevel': risk_level,
                'riskFactors': risk_factors,
                'recommendations': recommendations
            })
            logger.info(f"Sent analysis to TypeScript server for transaction: {transaction['transactionId']}")
        except Exception as e:
            logger.error(f"Error sending analysis to TypeScript server: {e}")

    except Exception as e:
        logger.error(f"Error processing transaction: {e}")
    """Analyze a transaction and return risk analysis results."""
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

        # Send analysis to Kafka
        if producer:
            try:
                producer.send('transaction_analysis', {
                    'transactionId': transaction['transactionId'],
                    'riskScore': risk_score,
                    'riskLevel': risk_level,
                    'riskFactors': risk_factors,
                    'recommendations': recommendations,
                    'timestamp': datetime.now().isoformat()
                })
                logger.info(f"Analysis sent to Kafka for transaction: {transaction['transactionId']}")
                logger.info(f"Analysis result: {risk_score:.2f} - {risk_level}")
            except Exception as e:
                logger.error(f"Error sending to Kafka: {e}")
                logger.error(f"Failed analysis data: {risk_score:.2f} - {risk_level}")

        return {
            "type": "analysis",
            "data": {
                "transactionId": transaction['transactionId'],
                "riskScore": risk_score,
                "riskLevel": risk_level,
                "riskFactors": risk_factors,
                "recommendations": recommendations
            }
        }
    except Exception as e:
        logger.error(f"Error analyzing transaction: {e}")
        return None

async def handler(websocket, path):
    """Handle WebSocket connections."""
    try:
        logger.info("New WebSocket connection")
        
        async for message in websocket:
            try:
                # Parse incoming message
                data = json.loads(message)
                
                if data.get('type') == 'transaction':
                    transaction = data['data']
                    logger.info(f"Received transaction: {transaction['transactionId']}")
                    
                    # Analyze transaction
                    analysis = await analyze_transaction(transaction)
                    if analysis:
                        # Send analysis result back
                        await websocket.send(json.dumps(analysis))
                        logger.info(f"Sent analysis for transaction: {transaction['transactionId']}")
                    
            except json.JSONDecodeError:
                logger.error("Invalid JSON received")
            except Exception as e:
                logger.error(f"Error processing message: {e}")
                
    except websockets.exceptions.ConnectionClosed:
        logger.info("WebSocket connection closed")
    except Exception as e:
        logger.error(f"WebSocket handler error: {e}")

async def main():
    """Start the WebSocket server."""
    if not model:
        logger.error("Model not loaded, cannot start server")
        return

    # Start processing transactions from TypeScript server
    asyncio.create_task(connect_to_typescript_server())

    # Start WebSocket server for other clients
    async with websockets.serve(handler, "0.0.0.0", 8002):
        logger.info("WebSocket server started on port 8002")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
