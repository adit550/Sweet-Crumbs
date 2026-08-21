import { prisma } from './db';

async function main() {
  await prisma.merchandise.createMany({
    data: [
      {
        name: "Blueberry Cheesecake",
        category: "Cakes",
        price: 55000,
        stock: 20,
        description: "Creamy cheesecake topped with a rich and tangy blueberry compote.",
        imageUrl: "/products/blueberry_cheesecake.jpg",
        status: "ACTIVE",
      },
      {
        name: "Lemon Cheesecake",
        category: "Cakes",
        price: 50000,
        stock: 25,
        description: "Zesty lemon cheesecake with a buttery graham cracker crust.",
        imageUrl: "/products/lemon_cheesecake.jpg",
        status: "ACTIVE",
      }
    ]
  });
  console.log("Successfully inserted Blueberry Cheesecake and Lemon Cheesecake.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
