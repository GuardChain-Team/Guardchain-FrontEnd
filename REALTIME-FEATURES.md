# 🚀 GuardChain Real-time Features

## Overview

GuardChain now includes comprehensive real-time capabilities powered by **Kafka** for data streaming and **Socket.IO** for live frontend updates. This transforms the application from a static demonstration into a dynamic, live fraud detection system.

## 🔧 Real-time Architecture

### Components

1. **Kafka Service** (`src/lib/kafka/kafka-service.ts`)

   - Generates realistic transaction data every 3-8 seconds
   - Calculates risk scores using multiple algorithms
   - Publishes transaction events to Kafka topics
   - Automatically creates alerts for high-risk transactions

2. **Socket.IO Server** (`src/lib/realtime/server.ts`)

   - WebSocket server running on port 8000
   - Consumes Kafka events and broadcasts to connected clients
   - Manages client subscriptions and authentication
   - Provides real-time analytics and dashboard updates

3. **Frontend Integration** (`src/components/websocket-provider.tsx`)
   - React context for managing WebSocket connections
   - Automatic reconnection and error handling
   - Real-time UI updates for transactions, alerts, and analytics

## 🚀 Quick Start

### Option 1: Automated Startup (Recommended)

```bash
# Using Node.js script
npm run realtime

# Using PowerShell script (Windows)
.\start-realtime.ps1

# Using Batch file (Windows)
.\start-realtime.bat
```

### Option 2: Manual Startup

```bash
# Terminal 1: Start the real-time server
npm run server

# Terminal 2: Start the Next.js application
npm run dev
```

## 📊 Live Data Generation

### Transaction Simulation

The Kafka service automatically generates:

- **Realistic transactions** with varying amounts ($10 - $500,000)
- **Risk scoring** based on:
  - Amount thresholds
  - Time-based patterns (off-hours risk)
  - Geographic patterns (simulated)
  - Historical behavior patterns
  - ML-inspired random factors

### Risk Categories

- **Low Risk** (0.0 - 0.3): Normal transactions
- **Medium Risk** (0.3 - 0.7): Flagged for review
- **High Risk** (0.7 - 0.9): Automatic alerts generated
- **Critical Risk** (0.9 - 1.0): Immediate investigation required

## 🔗 Real-time Endpoints

### WebSocket Events

**Client → Server:**

- `subscribe`: Join specific data streams
- `unsubscribe`: Leave data streams
- `message`: Send custom messages

**Server → Client:**

- `transactions`: New transaction data
- `alerts`: Fraud alerts and notifications
- `analytics`: Dashboard metrics updates
- `system`: System status and health

### HTTP APIs

All existing REST endpoints now broadcast real-time updates:

- `POST /api/transactions` → Broadcasts new transactions
- `POST /api/alerts` → Broadcasts new alerts
- `GET /api/analytics/*` → Updates dashboard metrics

## 🎯 Frontend Integration

### Real-time Components

```tsx
import { useWebSocketContext } from "@/components/websocket-provider";

function TransactionFeed() {
  const { lastMessage, isConnected } = useWebSocketContext();

  useEffect(() => {
    if (lastMessage?.type === "transactions") {
      // Handle new transaction data
      console.log("New transaction:", lastMessage.data);
    }
  }, [lastMessage]);

  return (
    <div>
      <div>Status: {isConnected ? "Connected" : "Disconnected"}</div>
      {/* Live transaction display */}
    </div>
  );
}
```

### Real-time Stores

The application uses Zustand stores that automatically update from WebSocket events:

- `transaction-store.ts`: Live transaction data
- `alert-store.ts`: Real-time alerts
- `websocket-store.ts`: Connection management

## 🔧 Configuration

### Environment Variables

```env
# Real-time server configuration
REALTIME_PORT=8000
KAFKA_BROKER=localhost:9092
REDIS_URL=redis://localhost:6379

# Frontend WebSocket connection
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:8000
```

### Kafka Topics

- `transactions`: Transaction events
- `alerts`: Fraud alerts
- `analytics`: Metrics and statistics
- `system`: Health and status updates

## 📈 Monitoring & Analytics

### Real-time Metrics

The system tracks and broadcasts:

- **Transaction volume** (per second/minute/hour)
- **Risk distribution** (low/medium/high/critical)
- **Alert frequency** and resolution times
- **System performance** metrics
- **User activity** patterns

### Dashboard Updates

All dashboard components receive live updates:

- Transaction feed refreshes automatically
- Alert notifications appear instantly
- Charts and graphs update in real-time
- Statistics counters increment live

## 🛠️ Development

### Adding New Real-time Features

1. **Extend Kafka Service:**

   ```typescript
   // Add new event types
   await this.producer.send({
     topic: "custom-events",
     messages: [{ value: JSON.stringify(eventData) }],
   });
   ```

2. **Update Socket.IO Server:**

   ```typescript
   // Add new event handlers
   this.consumer.on("custom-events", (data) => {
     this.io.emit("custom", data);
   });
   ```

3. **Frontend Integration:**
   ```tsx
   // Listen for new events
   socket.on("custom", (data) => {
     // Handle custom event
   });
   ```

### Testing Real-time Features

```bash
# Test WebSocket connection
curl -i -N -H "Connection: Upgrade" \
     -H "Upgrade: websocket" \
     -H "Host: localhost:8000" \
     http://localhost:8000/socket.io/

# Monitor Kafka topics (if Kafka CLI is available)
kafka-console-consumer --bootstrap-server localhost:9092 --topic transactions

# Check real-time server health
curl http://localhost:8000/health
```

## 🔍 Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**

   - Ensure real-time server is running on port 8000
   - Check firewall settings
   - Verify CORS configuration

2. **No Live Data**

   - Confirm Kafka service is generating transactions
   - Check console for error messages
   - Verify database connection

3. **Performance Issues**
   - Monitor memory usage during high transaction volumes
   - Consider Redis caching for heavy analytics
   - Implement connection pooling for database queries

### Debug Mode

Enable debug logging:

```bash
# Set environment variable
DEBUG=guardchain:* npm run realtime
```

## 🚦 Production Considerations

### Scalability

- Use Redis for session management across multiple server instances
- Implement Kafka partitioning for high-volume transaction processing
- Consider horizontal scaling with load balancers

### Security

- Implement JWT token validation for WebSocket connections
- Use SSL/TLS for production WebSocket connections
- Rate limit WebSocket connections to prevent abuse

### Monitoring

- Set up health checks for all real-time components
- Monitor Kafka lag and consumer performance
- Track WebSocket connection metrics and errors

---

## 🎉 Ready to Experience Real-time Fraud Detection!

Your GuardChain application now features:

✅ **Live transaction streaming**
✅ **Real-time risk assessment**
✅ **Instant fraud alerts**
✅ **Dynamic dashboard updates**
✅ **Interactive investigation tools**

Start the application with `npm run realtime` and watch your fraud detection system come to life!
