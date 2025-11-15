import { ActivityType, PrismaClient, StockStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function users() {
  const saltRounds = 10;

  // Seed users with hashed passwords
  const users = [
    {
      username: 'admin',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
    },
    {
      username: 'user',
      password: 'user123',
      name: 'Regular User',
      role: 'user',
    },
  ];

  for (const userData of users) {
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    const user = await prisma.user.upsert({
      where: { username: userData.username },
      update: {
        password_hash: passwordHash,
        name: userData.name,
        role: userData.role,
      },
      create: {
        username: userData.username,
        password_hash: passwordHash,
        name: userData.name,
        role: userData.role,
      },
    });

    console.log(`Seeded user: ${user.username}`);
  }

  console.log('Seed completed successfully!');
}

async function seedWarehouses() {
  const warehouses = [
    'Ladkrabang',
    'Bangkok',
    'Khon Kaen',
    'Nonthaburi',
    'Chiang Mai',
    'Phuket',
    'Hat Yai',
    'Nakhon Ratchasima',
    'Udon Thani',
  ];
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
      name: 'Fresh Milk',
      image: 'https://dummyimage.com/600x400/B0E/B0E',
    },
    {
      name: 'White Bread',
      image: 'https://dummyimage.com/600x400/DDC/DDC',
    },
    {
      name: 'Organic Eggs',
      image: 'https://dummyimage.com/600x400/EDC/EDC',
    },
    {
      name: 'Bananas',
      image: 'https://dummyimage.com/600x400/FFB/FFB',
    },
    {
      name: 'Chicken Breast',
      image: 'https://dummyimage.com/600x400/F9C/F9C',
    },
    {
      name: 'Tomatoes',
      image: 'https://dummyimage.com/600x400/FF8/FF8',
    },
    {
      name: 'Potatoes',
      image: 'https://dummyimage.com/600x400/DDB/DDB',
    },
    {
      name: 'Onions',
      image: 'https://dummyimage.com/600x400/E6E/E6E',
    },
    {
      name: 'Rice 5kg',
      image: 'https://dummyimage.com/600x400/EDC/EDC',
    },
    {
      name: 'Cooking Oil',
      image: 'https://dummyimage.com/600x400/FF8/FF8',
    },
    {
      name: 'Sugar',
      image: 'https://dummyimage.com/600x400/FFD/FFD',
    },
    {
      name: 'Salt',
      image: 'https://dummyimage.com/600x400/DDD/DDD',
    },
    {
      name: 'Pasta',
      image: 'https://dummyimage.com/600x400/DDC/DDC',
    },
    {
      name: 'Canned Beans',
      image: 'https://dummyimage.com/600x400/9A8/9A8',
    },
    {
      name: 'Yogurt',
      image: 'https://dummyimage.com/600x400/FFD/FFD',
    },
    {
      name: 'Cheese',
      image: 'https://dummyimage.com/600x400/EDC/EDC',
    },
    {
      name: 'Butter',
      image: 'https://dummyimage.com/600x400/F9C/F9C',
    },
    {
      name: 'Orange Juice',
      image: 'https://dummyimage.com/600x400/FF7/FF7',
    },
    {
      name: 'Coffee Beans',
      image: 'https://dummyimage.com/600x400/A87/A87',
    },
    {
      name: 'Cereal',
      image: 'https://dummyimage.com/600x400/DDB/DDB',
    },
    {
      name: 'Frozen Vegetables',
      image: 'https://dummyimage.com/600x400/9F8/9F8',
    },
  ];

  for (const item of items) {
    const warehouseId = Math.floor(Math.random() * 3) + 1;
    const existingItem = await prisma.item.findFirst({
      where: {
        name: item.name,
        warehouse_id: warehouseId,
      },
    });

    if (existingItem) {
      await prisma.item.update({
        where: { sku: existingItem.sku },
        data: {
          name: item.name,
          image: item.image,
          warehouse_id: warehouseId,
          updated_by: 'system',
        },
      });
    } else {
      await prisma.item.create({
        data: {
          name: item.name,
          image: item.image,
          warehouse_id: warehouseId,
          updated_by: 'system',
        },
      });
    }
    console.log(`Seeded item: ${item.name}`);
  }
}

async function seedInitialInventoryMovements() {
  const items = await prisma.item.findMany();
  for (const item of items) {
    const inventoryMovement = await prisma.inventoryMovement.create({
      data: {
        activity_type: 'inbound',
        qty: 100,
        current_qty: item.qty,
        sku: item.sku,
        warehouse_id: item.warehouse_id,
        created_by: 'system',
      },
    });
    await prisma.item.update({
      where: { sku: item.sku },
      data: {
        qty: 100,
        stock_status: StockStatus.in_stock,
        updated_by: 'system',
      },
    });
    console.log(`Seeded inventory movement: ${inventoryMovement.id}`);
  }
}

async function seedLastedItemInventoryMovements() {
  const items = await prisma.item.findMany({
    orderBy: {
      created_at: 'desc',
    },
  });

  for (const item of items) {
    let currentQty = item?.qty || 0;
    for (let i = 0; i < 7; i++) {
      const qty = Math.floor(Math.random() * 10) + 1;
      const isInbound = i !== 0 ? Math.random() < 0.3 : true;
      if (isInbound) {
        currentQty = currentQty + qty;
      } else {
        currentQty = currentQty - qty;
      }
      await prisma.inventoryMovement.create({
        data: {
          activity_type: isInbound
            ? ActivityType.inbound
            : ActivityType.outbound,
          qty: qty,
          current_qty: currentQty,
          sku: item?.sku || '',
          warehouse_id: item?.warehouse_id || 0,
          created_by: 'system',
        },
      });
      await prisma.item.update({
        where: { sku: item?.sku || '' },
        data: {
          qty: currentQty,
          stock_status:
            currentQty > 0 ? StockStatus.in_stock : StockStatus.out_of_stock,
          updated_by: 'system',
        },
      });
    }
  }

  console.log('Seeded lasted item inventory movements successfully!');
}

void (async () => {
  try {
    await users();
    await seedWarehouses();
    await seedItems();
    await seedInitialInventoryMovements();
    await seedLastedItemInventoryMovements();
  } catch (e) {
    console.error('Error seeding database:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
