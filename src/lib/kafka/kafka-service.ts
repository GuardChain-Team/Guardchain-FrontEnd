// Kafka Producer Service for Real-time Data Streaming
import { Kafka } from "kafkajs";
import { v4 as uuidv4 } from "uuid";

class KafkaService {
  private kafka: Kafka;
  private producer: any;
  private consumer: any;
  private isConnected: boolean = false;

  constructor() {
    // Use lightweight in-memory Kafka for development
    this.kafka = new Kafka({
      clientId: "guardchain-fraud-detection",
      brokers: process.env.KAFKA_BROKERS?.split(",") || ["localhost:9092"],
      retry: {
        initialRetryTime: 100,
        retries: 3,
      },
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: "guardchain-consumer-group",
    });
  }

  async connect() {
    try {
      await this.producer.connect();
      await this.consumer.connect();
      this.isConnected = true;
      console.log("✅ Kafka connected successfully");
    } catch (error) {
      console.log("⚠️ Kafka not available, using fallback mode");
      this.isConnected = false;
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await this.producer.disconnect();
      await this.consumer.disconnect();
      this.isConnected = false;
    }
  }

  async publishTransaction(transaction: any) {
    const message = {
      key: transaction.id,
      value: JSON.stringify({
        ...transaction,
        timestamp: new Date().toISOString(),
        eventType: "TRANSACTION_CREATED",
      }),
    };

    if (this.isConnected) {
      try {
        await this.producer.send({
          topic: "transactions",
          messages: [message],
        });
      } catch (error) {
        console.error("Failed to publish to Kafka:", error);
      }
    }

    // Always return the message for fallback processing
    return message;
  }

  async publishAlert(alert: any) {
    const message = {
      key: alert.id,
      value: JSON.stringify({
        ...alert,
        timestamp: new Date().toISOString(),
        eventType: "ALERT_CREATED",
      }),
    };

    if (this.isConnected) {
      try {
        await this.producer.send({
          topic: "fraud-alerts",
          messages: [message],
        });
      } catch (error) {
        console.error("Failed to publish alert to Kafka:", error);
      }
    }

    return message;
  }

  async publishInvestigationUpdate(investigation: any) {
    const message = {
      key: investigation.id,
      value: JSON.stringify({
        ...investigation,
        timestamp: new Date().toISOString(),
        eventType: "INVESTIGATION_UPDATED",
      }),
    };

    if (this.isConnected) {
      try {
        await this.producer.send({
          topic: "investigations",
          messages: [message],
        });
      } catch (error) {
        console.error(
          "Failed to publish investigation update to Kafka:",
          error
        );
      }
    }

    return message;
  }

  async subscribeToTransactions(callback: (message: any) => void) {
    if (!this.isConnected) return;

    try {
      await this.consumer.subscribe({
        topic: "transactions",
        fromBeginning: false,
      });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }: any) => {
          const data = JSON.parse(message.value?.toString() || "{}");
          callback(data);
        },
      });
    } catch (error) {
      console.error("Failed to subscribe to transactions:", error);
    }
  }

  // Generate realistic transaction data
  generateRealisticTransaction() {
    const transactionTypes = ["transfer", "payment", "withdrawal", "deposit"];
    const channels = ["mobile", "web", "atm", "branch"];
    const locations = [
      "Jakarta",
      "Surabaya",
      "Bandung",
      "Medan",
      "Semarang",
      "Makassar",
    ];
    const banks = ["BCA", "BRI", "BNI", "Mandiri", "CIMB", "Danamon"];

    const amount = Math.random() * 100000 + 1000; // 1K to 100K
    const riskScore = this.calculateRiskScore(amount);

    return {
      transactionId: `TRX${Date.now()}`,
      amount: Math.round(amount),
      currency: "IDR",
      description: `${
        transactionTypes[Math.floor(Math.random() * transactionTypes.length)]
      } transaction`,
      riskScore,
      status: riskScore > 0.7 ? "FLAGGED" : "COMPLETED",
      fromAccount: `ACC-${Math.random().toString(36).substr(2, 8)}`,
      toAccount: `ACC-${Math.random().toString(36).substr(2, 8)}`,
      timestamp: new Date(),
      metadata: {
        channel: channels[Math.floor(Math.random() * channels.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        bank: banks[Math.floor(Math.random() * banks.length)],
        deviceId: `DEV-${Math.random().toString(36).substr(2, 6)}`,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
          Math.random() * 255
        )}`,
        userAgent: "GuardChain Mobile App v1.0",
      },
    };
  }

  private calculateRiskScore(amount: number): number {
    let score = 0;

    // Amount-based risk
    if (amount > 50000) score += 0.3;
    if (amount > 100000) score += 0.4;

    // Random factors for realism
    score += Math.random() * 0.3;

    // Time-based risk (higher risk during off-hours)
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) score += 0.2;

    return Math.min(Math.round(score * 100) / 100, 1.0);
  }

  // Generate continuous stream of transactions
  startTransactionStream(interval: number = 3000) {
    return setInterval(() => {
      const transaction = this.generateRealisticTransaction();
      this.publishTransaction(transaction);

      // Generate alert for high-risk transactions
      if (transaction.riskScore > 0.7) {
        const alert = this.generateAlertFromTransaction(transaction);
        this.publishAlert(alert);
      }
    }, interval);
  }

  private generateAlertFromTransaction(transaction: any) {
    const alertTypes = [
      "HIGH_AMOUNT_TRANSACTION",
      "UNUSUAL_TIME_PATTERN",
      "SUSPICIOUS_LOCATION",
      "VELOCITY_CHECK_FAILED",
      "BLACKLIST_MATCH",
    ];

    return {
      id: `ALERT-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      alertId: `ALT${Date.now()}`,
      transactionId: transaction.id,
      alertType: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      severity: transaction.riskScore > 0.9 ? "CRITICAL" : "HIGH",
      riskScore: transaction.riskScore,
      description: `High-risk ${transaction.type} of ${
        transaction.currency
      } ${transaction.amount.toLocaleString()} detected`,
      status: "PENDING",
      detectedAt: new Date().toISOString(),
      location: transaction.location,
      amount: transaction.amount,
    };
  }
}

export const kafkaService = new KafkaService();
export default KafkaService;
