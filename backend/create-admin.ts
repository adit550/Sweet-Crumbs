import { prisma } from './db';

async function main() {
  const adminEmail = 'admin1@gmail.com';
  const adminPassword = 'admin1';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`User with email ${adminEmail} already exists.`);
    return;
  }

  // Create admin
  const newAdmin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: adminPassword, // Note: In production, password should be hashed
      role: 'ADMIN',
    },
  });

  console.log('Successfully created admin user:');
  console.log(newAdmin);
}

main()
  .catch((e) => {
    console.error('Error creating admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
