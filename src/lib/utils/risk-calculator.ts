import type { Transaction } from "@/types/transaction";

interface RiskFactors {
  amountFactor: number;
  locationFactor: number;
  timeFactor: number;
  historyFactor: number;
  patternFactor: number;
}

export function calculateRiskScore(transaction: Partial<Transaction>): number {
  const riskFactors = calculateRiskFactors(transaction);

  // Weighted risk calculation
  const weights = {
    amount: 0.3,
    location: 0.2,
    time: 0.15,
    history: 0.2,
    pattern: 0.15,
  };

  const score =
    riskFactors.amountFactor * weights.amount +
    riskFactors.locationFactor * weights.location +
    riskFactors.timeFactor * weights.time +
    riskFactors.historyFactor * weights.history +
    riskFactors.patternFactor * weights.pattern;

  // Normalize score between 0 and 1
  return Math.min(Math.max(score, 0), 1);
}

function calculateRiskFactors(transaction: Partial<Transaction>): RiskFactors {
  return {
    amountFactor: calculateAmountRisk(transaction.amount || 0),
    locationFactor: calculateLocationRisk(transaction.location || ""),
    timeFactor: calculateTimeRisk(
      typeof transaction.createdAt === "string"
        ? new Date(transaction.createdAt)
        : (transaction.createdAt && typeof transaction.createdAt === "object" && "getTime" in transaction.createdAt)
        ? (transaction.createdAt as Date)
        : new Date()
    ),
    historyFactor: Math.random(), // TODO: Implement actual history analysis
    patternFactor: Math.random(), // TODO: Implement actual pattern analysis
  };
}

function calculateAmountRisk(amount: number): number {
  // Higher risk for larger amounts
  const thresholds = {
    low: 1000000, // 1 million
    medium: 10000000, // 10 million
    high: 50000000, // 50 million
  };

  if (amount > thresholds.high) return 0.9;
  if (amount > thresholds.medium) return 0.7;
  if (amount > thresholds.low) return 0.4;
  return 0.2;
}

function calculateLocationRisk(location: string): number {
  // Handle empty location as moderate risk
  if (!location) {
    return 0.5; // Unknown location is moderate risk
  }

  // Example: Higher risk for certain locations
  const highRiskCities = ["Jakarta", "Surabaya", "Medan"];
  const mediumRiskCities = ["Bandung", "Semarang", "Palembang"];
  const city = location.split(",")[0].trim().toLowerCase();

  if (highRiskCities.map((c) => c.toLowerCase()).includes(city)) {
    return 0.8; // High risk cities
  }
  if (mediumRiskCities.map((c) => c.toLowerCase()).includes(city)) {
    return 0.5; // Medium risk cities
  }
  return 0.3; // Other cities are lower risk
}

function calculateTimeRisk(timestamp: Date): number {
  // Higher risk for transactions during unusual hours (e.g., middle of the night)
  const hour = timestamp.getHours();

  // Higher risk between 11 PM and 4 AM
  if (hour >= 23 || hour <= 4) {
    return 0.8;
  }

  // Moderate risk during non-business hours
  if (hour < 9 || hour > 17) {
    return 0.5;
  }

  return 0.2;
}
