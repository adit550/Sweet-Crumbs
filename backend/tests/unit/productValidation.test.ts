import { expect, test, describe, mock } from "bun:test";

// Mock Prisma
mock.module("../../db", () => ({
  prisma: {
    merchandise: {
      create: mock(async (data: any) => ({
        id: "mock-id-1",
        ...data.data,
      })),
    }
  }
}));

mock.module("../../utils/auth", () => ({
  checkAuth: mock(async () => ({ user: { id: "admin-id", role: "ADMIN" } }))
}));

import { app } from "../../index";

describe("Validation: Product (Merchandise)", () => {
  // Add an authorization header in our mock requests
  const headers = { 
    "Content-Type": "application/json",
    "Authorization": "Bearer mock-token" 
  };

  test("should pass validation for valid product data", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/merch/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: "Valid Cake",
          category: "Cakes",
          price: 50000,
          stock: 10
        }),
      })
    );
    // 201 Created is expected for a successful POST
    expect(res.status).toBe(201);
  });

  test("should reject missing required fields (nama kosong/data wajib tidak lengkap)", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/merch/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          // missing name
          category: "Cakes",
          price: 50000,
          stock: 10
        }),
      })
    );
    expect(res.status).toBe(422);
  });

  test("should reject negative price (harga negatif)", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/merch/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: "Invalid Cake",
          category: "Cakes",
          price: -5000, // Invalid
          stock: 10
        }),
      })
    );
    expect(res.status).toBe(422);
  });

  test("should reject negative stock (stok negatif)", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/merch/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: "Invalid Cake",
          category: "Cakes",
          price: 50000,
          stock: -5 // Invalid
        }),
      })
    );
    expect(res.status).toBe(422);
  });

  test("should reject empty string for name (nama kosong)", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/merch/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: "", // Invalid minLength 1
          category: "Cakes",
          price: 50000
        }),
      })
    );
    expect(res.status).toBe(422);
  });
});
