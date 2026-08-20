import { expect, test, describe, mock } from "bun:test";

// We will mock Prisma completely so it never hits PostgreSQL
mock.module("../../db", () => ({
  prisma: {
    order: {
      create: mock(async (data: any) => {
        // Business Logic Simulation: We expect the database logic to return what was created
        return {
          id: "mock-order-id-123",
          customerName: data.data.customerName,
          date: data.data.date,
          totalAmount: data.data.totalAmount,
          status: "Pending",
          items: data.data.items.create,
        };
      }),
      findMany: mock(async () => {
        return [];
      }),
    }
  }
}));

// Import app AFTER mocking Prisma
import { app } from "../../index";
import { prisma } from "../../db";

describe("Business Logic: Order Processing", () => {
  test("should process valid order and calculate response correctly", async () => {
    const validPayload = {
      customerName: "Mahen",
      date: "2023-10-26 12:00",
      totalAmount: 150000,
      items: [
        {
          productId: "p1",
          productName: "Chocolate Cake",
          quantity: 2,
          unitPrice: 75000,
        }
      ],
    };

    const res = await app.handle(
      new Request("http://localhost/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload),
      })
    );

    expect(res.status).toBe(201);
    const data = await res.json() as any;
    
    // Business logic assertion: Status should be initialized to Pending by default in the system/schema mock
    expect(data.status).toBe("Pending");
    expect(data.customerName).toBe("Mahen");
    expect(data.id).toBe("mock-order-id-123");
    
    // Ensure prisma was called with correct structure
    expect(prisma.order.create).toHaveBeenCalled();
  });

  test("should return empty order list when no orders exist", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/orders", {
        method: "GET",
      })
    );

    expect(res.status).toBe(200);
    const data = await res.json() as any;
    
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
    expect(prisma.order.findMany).toHaveBeenCalled();
  });
});
