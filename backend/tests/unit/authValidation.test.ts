import { expect, test, describe, mock } from "bun:test";

// Mock Prisma so it doesn't hit DB on valid validation
mock.module("../../db", () => ({
  prisma: {
    user: {
      findUnique: mock(async () => null),
      create: mock(async () => ({ id: "123", email: "test@example.com", role: "CUSTOMER" })),
    }
  }
}));

import { app } from "../../index";

describe("Validation: Authentication", () => {
  test("should reject empty email", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "",
          password: "TestPassword123!"
        }),
      })
    );
    expect(res.status).toBe(422); // Elysia validation error for invalid email format
  });

  test("should reject invalid email format", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "invalid-email-format",
          password: "TestPassword123!"
        }),
      })
    );
    expect(res.status).toBe(422);
  });

  test("should reject empty password", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: ""
        }),
      })
    );
    expect(res.status).toBe(401); // Empty string passes Elysia body validation but fails login logic (401)
  });

  test("should reject missing required fields (input tidak lengkap)", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com"
          // missing password
        }),
      })
    );
    expect(res.status).toBe(422);
  });

  test("should pass validation for valid email and password", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: "TestPassword123!"
        }),
      })
    );
    // Since we mocked prisma.user.findUnique to return null, it will proceed to create and return 200
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.message).toBe("User registered successfully");
  });
});
