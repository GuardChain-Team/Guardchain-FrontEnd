import { faker } from "@faker-js/faker";
import type { TransactionInput } from "@/types/models";

const BANKS = ["BCA", "Mandiri", "BNI", "BRI", "CIMB Niaga"];
const TRANSACTION_TYPES = ["TRANSFER", "PAYMENT", "WITHDRAWAL", "DEPOSIT"];

export function generateRealisticTransaction(): TransactionInput {
  const amount = faker.number.float({
    min: 100000,
    max: 100000000,
    multipleOf: 0.01,
  });
  const sourceBank = faker.helpers.arrayElement(BANKS);
  const destinationBank = faker.helpers.arrayElement(
    BANKS.filter((b) => b !== sourceBank)
  );

  return {
    transactionId: faker.string.uuid(),
    amount,
    currency: "IDR",
    fromAccount: faker.finance.accountNumber(),
    toAccount: faker.finance.accountNumber(),
    description: faker.lorem.sentence(),
    ipAddress: faker.internet.ip(),
    userAgent: faker.internet.userAgent(),
    location: `${faker.location.city()}, Indonesia`,
    deviceId: faker.string.uuid(),
    metadata: {
      sourceBank,
      sourceName: faker.person.fullName(),
      destinationBank,
      destinationName: faker.person.fullName(),
      transactionType: faker.helpers.arrayElement(TRANSACTION_TYPES),
    },
  };
}

// Generates a batch of transactions for testing
export function generateTransactionBatch(count: number): TransactionInput[] {
  return Array.from({ length: count }, () => generateRealisticTransaction());
}
