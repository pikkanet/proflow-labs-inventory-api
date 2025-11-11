import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;

  // Seed users with hashed passwords
  const users = [
    {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
    },
    {
      email: 'user@example.com',
      password: 'user123',
      name: 'Regular User',
      role: 'user',
    },
  ];

  for (const userData of users) {
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        password_hash: passwordHash,
        name: userData.name,
        role: userData.role,
      },
      create: {
        email: userData.email,
        password_hash: passwordHash,
        name: userData.name,
        role: userData.role,
      },
    });

    console.log(`Seeded user: ${user.email}`);
  }

  console.log('Seed completed successfully!');
}

void (async () => {
  try {
    await main();
  } catch (e) {
    console.error('Error seeding database:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
