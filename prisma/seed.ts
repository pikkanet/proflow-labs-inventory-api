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

async function seedWarehouses() {
  const warehouses = ['Ladkrabang', 'Bangkok', 'Nonthaburi', 'Khon Kaen'];
  for (const warehouse of warehouses) {
    await prisma.warehouse.upsert({
      where: { name: warehouse },
      update: {
        name: warehouse,
      },
      create: {
        name: warehouse,
      },
    });
    console.log(`Seeded warehouse: ${warehouse}`);
  }
  console.log('Warehouses seeded successfully!');
}

async function seedItems() {
  const items = [
    {
      name: 'Item 1',
      image: 'https://dummyimage.com/600x400/f3a/fff&text=1',
    },
    {
      name: 'Item 2',
      image: 'https://dummyimage.com/600x400/4b7/fff&text=2',
    },
    {
      name: 'Item 3',
      image: 'https://dummyimage.com/600x400/8c2/fff&text=3',
    },
    {
      name: 'Item 4',
      image: 'https://dummyimage.com/600x400/e5d/fff&text=4',
    },
    {
      name: 'Item 5',
      image: 'https://dummyimage.com/600x400/1a9/fff&text=5',
    },
    {
      name: 'Item 6',
      image: 'https://dummyimage.com/600x400/d4f/fff&text=6',
    },
    {
      name: 'Item 7',
      image: 'https://dummyimage.com/600x400/7b3/fff&text=7',
    },
    {
      name: 'Item 8',
      image: 'https://dummyimage.com/600x400/a6e/fff&text=8',
    },
    {
      name: 'Item 9',
      image: 'https://dummyimage.com/600x400/2c8/fff&text=9',
    },
    {
      name: 'Item 10',
      image: 'https://dummyimage.com/600x400/f9b/fff&text=10',
    },
  ];

  for (const item of items) {
    const warehouseId = Math.random() < 0.5 ? 1 : 2;
    await prisma.item.upsert({
      where: { name: item.name },
      update: {
        name: item.name,
        image: item.image,
        warehouse_id: warehouseId,
      },
      create: {
        name: item.name,
        image: item.image,
        warehouse_id: warehouseId,
      },
    });
    console.log(`Seeded item: ${item.name}`);
  }
}

void (async () => {
  try {
    await main();
    await seedWarehouses();
    await seedItems();
  } catch (e) {
    console.error('Error seeding database:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
