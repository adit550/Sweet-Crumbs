import { expect, test, describe, beforeAll, afterAll } from "bun:test";
import { app } from "../../index";
import { prisma } from "../../db";

describe("Integration: Authentication & Authorization API", () => {
  const testEmail = "test_auth_user@example.com";
  const testPassword = "password123";
  let authToken: string;

  beforeAll(async () => {
    // Cleanup any existing test user in test DB
    await prisma.user.deleteMany({
      where: { email: testEmail }
    });
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.user.deleteMany({
      where: { email: testEmail }
    });
  });

  test("CREATE/REGISTER: should register a new user", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          role: "ADMIN"
        })
      })
    );
    expect(res.status).toBe(200);
    
    // Verify persistence
    const user = await prisma.user.findUnique({ where: { email: testEmail } });
    expect(user).toBeDefined();
    expect(user?.email).toBe(testEmail);
  });

  test("ERROR HANDLING: should reject registration if email exists", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail, // duplicate
          password: testPassword
        })
      })
    );
    expect(res.status).toBe(400); // 400 defined in index.ts for duplicate email
    const data = await res.json() as any;
    expect(data.error).toBe("Email already in use");
  });

  test("LOGIN: should login with correct credentials and return token", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword
        })
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.token).toBeDefined();
    authToken = data.token; // Save token for protected tests
  });

  test("LOGIN FAILURE: should fail with wrong password", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          password: "wrongpassword"
        })
      })
    );
    expect(res.status).toBe(401);
  });

  test("PROTECTED ENDPOINT: should allow access to /me with valid token", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/auth/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.email).toBe(testEmail);
  });

  test("UNAUTHORIZED: should deny access to /me without token", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/auth/me", {
        method: "GET"
      })
    );
    expect(res.status).toBe(401);
  });
});
