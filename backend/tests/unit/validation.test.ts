import { expect, test, describe, mock } from "bun:test";
import { app } from "../../index";

describe("Validation: Order Creation", () => {
  test("should reject missing required fields (customerName, totalAmount, etc.)", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // missing customerName, date, totalAmount, items
        }),
      })
    );
    expect(res.status).toBe(422); // Elysia validation error
  });

  test("should reject invalid negative totalAmount", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "Test User",
          date: "2023-10-25 10:30",
          totalAmount: -100, // Invalid
          items: [],
        }),
      })
    );
    expect(res.status).toBe(422);
  });

  test("should reject items with negative quantity or price", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "Test User",
          date: "2023-10-25 10:30",
          totalAmount: 1000,
          items: [
            {
              productId: "prod1",
              productName: "Cake",
              quantity: 0, // Invalid (minimum 1)
              unitPrice: 1000,
            }
          ],
        }),
      })
    );
    expect(res.status).toBe(422);
  });

  test("should reject if items is not an array", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "Test User",
          date: "2023-10-25 10:30",
          totalAmount: 1000,
          items: "not-an-array", // Invalid
        }),
      })
    );
    expect(res.status).toBe(422);
  });
});
