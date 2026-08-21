import { prisma } from './db';

async function main() {
  const result = await prisma.merchandise.deleteMany({
    where: {
      name: {
        in: ["Lemon Pound Cake", "Black Forest Cake"]
      }
    }
  });
  console.log(`Deleted ${result.count} cakes from the database.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
