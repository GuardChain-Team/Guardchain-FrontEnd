const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log("Testing database connection...");

    // Test database connection
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in database`);

    // Get admin user
    const admin = await prisma.user.findUnique({
      where: { email: "admin@guardchain.com" },
    });

    if (!admin) {
      console.log("❌ Admin user not found in database");
      return;
    }

    console.log("✅ Admin user found:", {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
    });

    // Test password verification
    const testPassword = "admin123";
    const isValid = await bcrypt.compare(testPassword, admin.password);

    if (isValid) {
      console.log("✅ Password verification successful");
    } else {
      console.log("❌ Password verification failed");
    }

    // Test all users
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
        isActive: true,
      },
    });

    console.log("\nAll users in database:");
    allUsers.forEach((user) => {
      console.log(`- ${user.email} (${user.role}) - Active: ${user.isActive}`);
    });
  } catch (error) {
    console.error("Error testing login:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
