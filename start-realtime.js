#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");

console.log("🚀 Starting GuardChain Full Stack Application...\n");

// Start the Socket.IO real-time server
console.log("📡 Starting Real-time Server (Socket.IO + Kafka)...");
const serverProcess = spawn(
  "node",
  [
    "-e",
    `
  require('ts-node/register');
  require('./src/lib/realtime/server.ts');
`,
  ],
  {
    stdio: "inherit",
    cwd: process.cwd(),
  }
);

// Wait a moment for the server to start
setTimeout(() => {
  // Start the Next.js development server
  console.log("🌐 Starting Next.js Development Server...");
  const nextProcess = spawn("npm", ["run", "dev"], {
    stdio: "inherit",
    cwd: process.cwd(),
    shell: true,
  });

  // Handle process cleanup
  function cleanup() {
    console.log("\n🛑 Shutting down services...");
    serverProcess.kill();
    nextProcess.kill();
    process.exit(0);
  }

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("exit", cleanup);

  nextProcess.on("error", (error) => {
    console.error("Error starting Next.js:", error);
    cleanup();
  });

  serverProcess.on("error", (error) => {
    console.error("Error starting real-time server:", error);
    cleanup();
  });
}, 2000);

console.log(`
📊 GuardChain Application Starting:
   - Real-time Server: http://localhost:8000
   - Frontend Application: http://localhost:3000
   - Real-time Features: Transaction streaming, Live alerts, Analytics updates

🔧 Services:
   ✅ Socket.IO Server (Real-time communication)
   ✅ Kafka Service (Data streaming)
   ✅ Next.js Frontend (React application)
   ✅ Prisma Database (SQLite)

💡 The application will automatically generate realistic transaction data
   and broadcast real-time updates to demonstrate fraud detection capabilities.
`);
