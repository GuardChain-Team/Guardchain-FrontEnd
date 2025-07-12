// 🚀 Guardchain Demo Script
// Run this in your browser console to test real-time features

class GuardchainDemo {
  constructor() {
    this.baseUrl = "http://localhost:3000";
    this.token = null;
  }

  // 1. Login as admin
  async login() {
    console.log("🔐 Logging in as admin...");

    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@guardchain.com",
        password: "admin123",
      }),
    });

    const data = await response.json();
    this.token = data.token;

    console.log("✅ Login successful!", data);
    return data;
  }

  // 2. Create a high-risk transaction
  async createHighRiskTransaction() {
    if (!this.token) {
      console.log("❌ Please login first!");
      return;
    }

    console.log("💰 Creating high-risk transaction...");

    const transaction = {
      transactionId: `TXN-DEMO-${Date.now()}`,
      amount: 50000, // High amount to trigger alert
      fromAccount: `ACC-${Math.random().toString(36).substr(2, 9)}`,
      toAccount: `ACC-${Math.random().toString(36).substr(2, 9)}`,
      type: "transfer",
      metadata: {
        channel: "online",
        location: "Suspicious Location",
        deviceId: `device-${Math.random().toString(36).substr(2, 6)}`,
        timestamp: new Date().toISOString(),
        flags: ["high_amount", "unusual_location"],
      },
    };

    const response = await fetch(`${this.baseUrl}/api/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(transaction),
    });

    const data = await response.json();
    console.log("✅ High-risk transaction created!", data);
    return data;
  }

  // 3. Create multiple rapid transactions
  async createRapidTransactions(count = 5) {
    if (!this.token) {
      console.log("❌ Please login first!");
      return;
    }

    console.log(`🔄 Creating ${count} rapid transactions...`);

    const transactions = [];
    for (let i = 0; i < count; i++) {
      const transaction = {
        transactionId: `TXN-RAPID-${Date.now()}-${i}`,
        amount: Math.floor(Math.random() * 20000) + 5000,
        fromAccount: "ACC-RAPID-SOURCE",
        toAccount: `ACC-TARGET-${i}`,
        type: Math.random() > 0.5 ? "transfer" : "payment",
        metadata: {
          channel: "mobile",
          location: `Location-${i}`,
          deviceId: "device-rapid-001",
          sequence: i,
        },
      };

      const response = await fetch(`${this.baseUrl}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(transaction),
      });

      const data = await response.json();
      transactions.push(data);

      console.log(`✅ Transaction ${i + 1}/${count} created`);

      // Small delay between transactions
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("🎉 All rapid transactions created!", transactions);
    return transactions;
  }

  // 4. Fetch current alerts
  async getAlerts() {
    if (!this.token) {
      console.log("❌ Please login first!");
      return;
    }

    console.log("🚨 Fetching current alerts...");

    const response = await fetch(`${this.baseUrl}/api/fraud/alerts`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    const data = await response.json();
    console.log("📋 Current alerts:", data);
    return data;
  }

  // 5. Get analytics data
  async getAnalytics() {
    if (!this.token) {
      console.log("❌ Please login first!");
      return;
    }

    console.log("📊 Fetching analytics...");

    const endpoints = [
      "/api/analytics/overview",
      "/api/analytics/transactions",
      "/api/analytics/fraud-trends",
    ];

    const analytics = {};

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        const data = await response.json();
        analytics[endpoint.split("/").pop()] = data;
      } catch (error) {
        console.log(`⚠️ Error fetching ${endpoint}:`, error);
      }
    }

    console.log("📈 Analytics data:", analytics);
    return analytics;
  }

  // 6. Run complete demo
  async runDemo() {
    console.log("🎬 Starting Guardchain Demo...\n");

    try {
      // Step 1: Login
      await this.login();
      await this.delay(1000);

      // Step 2: Get initial state
      console.log("\n📊 Getting initial analytics...");
      await this.getAnalytics();
      await this.delay(1000);

      // Step 3: Create high-risk transaction
      console.log("\n💰 Creating high-risk transaction...");
      await this.createHighRiskTransaction();
      await this.delay(2000);

      // Step 4: Create rapid transactions
      console.log("\n🔄 Creating rapid transactions...");
      await this.createRapidTransactions(3);
      await this.delay(2000);

      // Step 5: Check alerts
      console.log("\n🚨 Checking generated alerts...");
      await this.getAlerts();
      await this.delay(1000);

      // Step 6: Get updated analytics
      console.log("\n📈 Getting updated analytics...");
      await this.getAnalytics();

      console.log("\n🎉 Demo completed successfully!");
      console.log(
        "👀 Check your Guardchain dashboard to see the real-time updates!"
      );
    } catch (error) {
      console.error("❌ Demo failed:", error);
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Usage instructions
console.log(`
🚀 Guardchain Demo Script Loaded!

Usage:
const demo = new GuardchainDemo();

// Run complete demo
demo.runDemo();

// Or run individual functions:
demo.login();
demo.createHighRiskTransaction();
demo.createRapidTransactions(5);
demo.getAlerts();
demo.getAnalytics();

Make sure your Guardchain server is running at http://localhost:3000
`);

// Auto-create demo instance
window.guardchainDemo = new GuardchainDemo();
