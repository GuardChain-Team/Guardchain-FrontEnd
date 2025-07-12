#!/usr/bin/env node

console.log("🔍 Testing hydration fixes...");

// Test that skeleton component doesn't use Math.random
const fs = require("fs");
const path = require("path");

const skeletonPath = path.join(
  __dirname,
  "src",
  "components",
  "ui",
  "skeleton.tsx"
);
const skeletonContent = fs.readFileSync(skeletonPath, "utf8");

if (skeletonContent.includes("Math.random()")) {
  console.error(
    "❌ Skeleton component still uses Math.random() - hydration issue!"
  );
  process.exit(1);
} else {
  console.log("✅ Skeleton component fixed - no more Math.random()");
}

// Test theme provider has proper hydration protection
const themeProviderPath = path.join(
  __dirname,
  "src",
  "components",
  "theme-provider.tsx"
);
const themeProviderContent = fs.readFileSync(themeProviderPath, "utf8");

if (
  themeProviderContent.includes("suppressHydrationWarning") ||
  themeProviderContent.includes("mounted")
) {
  console.log("✅ Theme provider has hydration protection");
} else {
  console.error("❌ Theme provider missing hydration protection");
  process.exit(1);
}

// Test layout has suppressHydrationWarning
const layoutPath = path.join(__dirname, "src", "app", "layout.tsx");
const layoutContent = fs.readFileSync(layoutPath, "utf8");

if (layoutContent.includes("suppressHydrationWarning")) {
  console.log("✅ Layout has suppressHydrationWarning");
} else {
  console.error("❌ Layout missing suppressHydrationWarning");
  process.exit(1);
}

console.log("🎉 All hydration fixes applied successfully!");
console.log("💡 To test:");
console.log("   1. Run: npm run dev");
console.log("   2. Open: http://localhost:3000");
console.log("   3. Check browser console for hydration errors");
