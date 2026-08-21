import { prisma } from './db';

async function main() {
  await prisma.merchandise.createMany({
    data: [
      {
        name: "Butterfly Pea Honey Milk",
        category: "Drinks",
        price: 38000,
        stock: 30,
        description: "Aesthetic, color-changing blue milk infused with butterfly pea flower and honey.",
        imageUrl: "/products/butterfly_pea_honey_milk.jpg",
        status: "ACTIVE",
      },
      {
        name: "Blueberry Latte",
        category: "Drinks",
        price: 42000,
        stock: 25,
        description: "A rich and creamy latte with a blend of fresh blueberries and espresso.",
        imageUrl: "/products/blueberry_latte.jpg",
        status: "ACTIVE",
      },
      {
        name: "Strawberry Milk Crumble",
        category: "Drinks",
        price: 45000,
        stock: 40,
        description: "Sweet strawberry milk topped with a crunchy biscuit crumble and fresh strawberry bits.",
        imageUrl: "/products/strawberry_milk_crumble.jpg",
        status: "ACTIVE",
      },
      {
        name: "Ocean Latte",
        category: "Drinks",
        price: 40000,
        stock: 35,
        description: "A refreshing blue curacao infused latte that brings the ocean breeze to your cup.",
        imageUrl: "/products/ocean_latte.jpg",
        status: "ACTIVE",
      }
    ]
  });
  console.log("Successfully inserted 4 new drinks.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
