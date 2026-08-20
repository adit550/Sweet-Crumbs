import { prisma } from './db';

async function main() {
  // Hash passwords
  const adminPassword = await Bun.password.hash('admin1');
  const customerPassword = await Bun.password.hash('mahen27');

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin1@gmail.com' },
    update: {
      password: adminPassword,
      role: 'ADMIN',
    },
    create: {
      email: 'admin1@gmail.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log(`Created Admin account: ${admin.email}`);

  // Create Customer User
  const customer = await prisma.user.upsert({
    where: { email: 'mahen@gmail.com' },
    update: {
      password: customerPassword,
      role: 'CUSTOMER',
    },
    create: {
      email: 'mahen@gmail.com',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  });

  console.log(`Created Customer account: ${customer.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
