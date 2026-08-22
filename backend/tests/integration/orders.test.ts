import { expect, test, describe, beforeAll, afterAll } from "bun:test";
import { app } from "../../index";
import { prisma } from "../../db";

describe("Integration: Orders API", () => {
  let createdOrderId: string;
  let adminToken: string;
  let customerToken: string;
  const adminEmail = "admin_order_test@example.com";
  const customerEmail = "customer_order_test@example.com";

  beforeAll(async () => {
    // Clear relevant collections
    await prisma.order.deleteMany();
    await prisma.user.deleteMany({
      where: {
        email: { in: [adminEmail, customerEmail] }
      }
    });

    // Create admin user and login
    const bcrypt = require("bcryptjs");
    const adminPwd = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: { email: adminEmail, password: adminPwd, role: "ADMIN" }
    });
    const resAdmin = await app.handle(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, password: "admin123" })
      })
    );
    const dataAdmin = await resAdmin.json() as any;
    adminToken = dataAdmin.token;

    // Create customer user and login
    const customerPwd = await bcrypt.hash("customer123", 10);
    await prisma.user.create({
      data: { email: customerEmail, password: customerPwd, role: "CUSTOMER" }
    });
    const resCustomer = await app.handle(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: customerEmail, password: "customer123" })
      })
    );
    const dataCustomer = await resCustomer.json() as any;
    customerToken = dataCustomer.token;
  });

  afterAll(async () => {
    await prisma.order.deleteMany();
    await prisma.user.deleteMany({
      where: {
        email: { in: [adminEmail, customerEmail] }
      }
    });
  });

  test("CREATE: should create a new order (Customer)", async () => {
    const orderPayload = {
      customerName: customerEmail,
      date: "2023-11-01 10:00",
      totalAmount: 150000,
      items: [
        {
          productId: "prod-1",
          productName: "Integration Test Product",
          quantity: 2,
          unitPrice: 75000
        }
      ]
    };

    const res = await app.handle(
      new Request("http://localhost/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${customerToken}`
        },
        body: JSON.stringify(orderPayload)
      })
    );

    expect(res.status).toBe(201);
    const data = await res.json() as any;
    expect(data.id).toBeDefined();
    expect(data.customerName).toBe(customerEmail);
    expect(data.items.length).toBe(1);
    expect(data.items[0].productName).toBe("Integration Test Product");
    
    createdOrderId = data.id;
  });

  test("CREATE ERROR: should reject unauthorized order creation", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "Anonymous",
          date: "2023-11-01 10:00",
          totalAmount: 100,
          items: []
        })
      })
    );
    expect(res.status).toBe(401);
  });

  test("READ: should fetch orders list (Customer sees own)", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/orders", {
        method: "GET",
        headers: { "Authorization": `Bearer ${customerToken}` }
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(1);
    expect(data[0].customerName).toBe(customerEmail);
  });

  test("UPDATE: should change order status (Admin only)", async () => {
    const res = await app.handle(
      new Request(`http://localhost/api/orders/${createdOrderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: "Completed" })
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.status).toBe("Completed");

    // Verify DB
    const dbOrder = await prisma.order.findUnique({ where: { id: createdOrderId } });
    expect(dbOrder?.status).toBe("Completed");
  });

  test("UPDATE ERROR: should reject status update by non-admin", async () => {
    const res = await app.handle(
      new Request(`http://localhost/api/orders/${createdOrderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${customerToken}` // Customer is not admin
        },
        body: JSON.stringify({ status: "Canceled" })
      })
    );
    expect(res.status).toBe(403);
  });

  test("DELETE: should delete order (Admin only)", async () => {
    const res = await app.handle(
      new Request(`http://localhost/api/orders/${createdOrderId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${adminToken}` }
      })
    );
    expect(res.status).toBe(200);

    // Verify DB
    const dbOrder = await prisma.order.findUnique({ where: { id: createdOrderId } });
    expect(dbOrder).toBeNull();
  });
});
