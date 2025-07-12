import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bustickets.com' },
    update: {},
    create: {
      email: 'admin@bustickets.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true
    }
  });

  // Create sample customer
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1234567890',
      role: 'CUSTOMER',
      isVerified: true
    }
  });

  // Create buses
  const bus1 = await prisma.bus.upsert({
    where: { plateNumber: 'BUS001' },
    update: {},
    create: {
      plateNumber: 'BUS001',
      model: 'Mercedes Sprinter',
      capacity: 45,
      amenities: ['WiFi', 'AC', 'USB Charging', 'Reclining Seats']
    }
  });

  const bus2 = await prisma.bus.upsert({
    where: { plateNumber: 'BUS002' },
    update: {},
    create: {
      plateNumber: 'BUS002',
      model: 'Volvo B12R',
      capacity: 50,
      amenities: ['WiFi', 'AC', 'USB Charging', 'Entertainment System']
    }
  });

  // Create routes
  const route1 = await prisma.route.upsert({
    where: { 
      originCity_destinationCity: {
        originCity: 'New York',
        destinationCity: 'Washington DC'
      }
    },
    update: {},
    create: {
      originCity: 'New York',
      destinationCity: 'Washington DC',
      distance: 225.5,
      estimatedDuration: 240, // 4 hours
      basePrice: 45.00
    }
  });

  const route2 = await prisma.route.upsert({
    where: { 
      originCity_destinationCity: {
        originCity: 'Los Angeles',
        destinationCity: 'San Francisco'
      }
    },
    update: {},
    create: {
      originCity: 'Los Angeles',
      destinationCity: 'San Francisco',
      distance: 382.0,
      estimatedDuration: 360, // 6 hours
      basePrice: 65.00
    }
  });

  const route3 = await prisma.route.upsert({
    where: { 
      originCity_destinationCity: {
        originCity: 'Chicago',
        destinationCity: 'Detroit'
      }
    },
    update: {},
    create: {
      originCity: 'Chicago',
      destinationCity: 'Detroit',
      distance: 282.0,
      estimatedDuration: 300, // 5 hours
      basePrice: 55.00
    }
  });

  // Create future trips
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  dayAfter.setHours(14, 0, 0, 0);

  await prisma.trip.create({
    data: {
      routeId: route1.id,
      busId: bus1.id,
      departureTime: tomorrow,
      arrivalTime: new Date(tomorrow.getTime() + 4 * 60 * 60 * 1000), // +4 hours
      price: 45.00,
      availableSeats: 45
    }
  });

  await prisma.trip.create({
    data: {
      routeId: route2.id,
      busId: bus2.id,
      departureTime: dayAfter,
      arrivalTime: new Date(dayAfter.getTime() + 6 * 60 * 60 * 1000), // +6 hours
      price: 65.00,
      availableSeats: 50
    }
  });

  console.log('✅ Seed completed successfully!');
  console.log('👤 Admin user: admin@bustickets.com / admin123');
  console.log('👤 Customer user: customer@example.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
