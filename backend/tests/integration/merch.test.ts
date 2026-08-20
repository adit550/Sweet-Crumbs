import { expect, test, describe, beforeAll, afterAll } from "bun:test";
import { app } from "../../index";
import { prisma } from "../../db";

describe("Integration: Merchandise API CRUD & DB Persistance", () => {
  let createdMerchId: string;
  let adminToken: string;

  beforeAll(async () => {
    // Clear merch in the test database to ensure isolation
    await prisma.merchandise.deleteMany();
    await prisma.user.deleteMany({ where: { email: "admin_merch@test.com" }});
    
    // Create admin user and login to get token
    const pwd = await Bun.password.hash("admin123");
    await prisma.user.create({
      data: { email: "admin_merch@test.com", password: pwd, role: "ADMIN" }
    });
    
    const res = await app.handle(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin_merch@test.com", password: "admin123" })
      })
    );
    const data = await res.json() as any;
    adminToken = data.token;
  });

  afterAll(async () => {
    // Clean up created test data
    await prisma.merchandise.deleteMany();
    await prisma.user.deleteMany({ where: { email: "admin_merch@test.com" }});
  });

  test("CREATE: should create a new merchandise successfully and persist to DB", async () => {
    const payload = {
      name: "Test Croissant",
      category: "Pastry",
      price: 25000,
      stock: 10,
      description: "A test croissant",
      status: "ACTIVE",
    };

    const res = await app.handle(
      new Request("http://localhost/api/merch", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload),
      })
    );

    expect(res.status).toBe(201);
    const data = await res.json() as any;
    
    expect(data.id).toBeDefined();
    expect(data.name).toBe("Test Croissant");
    createdMerchId = data.id;

    // Verify Database Persistence
    const dbRecord = await prisma.merchandise.findUnique({
      where: { id: createdMerchId }
    });
    expect(dbRecord).toBeDefined();
    expect(dbRecord?.name).toBe("Test Croissant");
  });

  test("READ: should fetch the created merchandise via GET list", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/merch", { method: "GET" })
    );

    expect(res.status).toBe(200);
    const data = await res.json() as any;
    
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data.some((m: any) => m.id === createdMerchId)).toBe(true);
  });

  test("READ DETAIL: should fetch a single merchandise by valid ID", async () => {
    const res = await app.handle(
      new Request(`http://localhost/api/merch/${createdMerchId}`, { method: "GET" })
    );

    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.id).toBe(createdMerchId);
    expect(data.name).toBe("Test Croissant");
  });

  test("UPDATE: should update merchandise and persist changes", async () => {
    const payload = {
      price: 30000,
      stock: 15,
    };

    const res = await app.handle(
      new Request(`http://localhost/api/merch/${createdMerchId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload),
      })
    );

    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.price).toBe(30000);
    expect(data.stock).toBe(15);

    // Verify Database Persistence
    const dbRecord = await prisma.merchandise.findUnique({
      where: { id: createdMerchId }
    });
    expect(dbRecord?.price).toBe(30000);
  });

  test("ERROR HANDLING: should return 404 when getting non-existent ID", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/merch/invalid-id-xyz", { method: "GET" })
    );
    // Based on Elysia route handling for not found
    expect(res.status).toBe(404);
  });

  test("ERROR HANDLING: should fail validation if required fields are missing on CREATE", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/merch", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({}), // Missing fields
      })
    );
    expect(res.status).toBe(422); // Elysia validation failure
  });

  test("DELETE: should delete merchandise and remove it from DB", async () => {
    const res = await app.handle(
      new Request(`http://localhost/api/merch/${createdMerchId}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${adminToken}` }
      })
    );

    expect(res.status).toBe(200);

    // Verify Database Persistence
    const dbRecord = await prisma.merchandise.findUnique({
      where: { id: createdMerchId }
    });
    expect(dbRecord).toBeNull();
  });
});
