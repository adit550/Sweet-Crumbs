import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";
import { prisma } from "./db";

export const app = new Elysia()
  .use(cors())
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'sweet-crumbs-secret',
    })
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: "Merchandise Dashboard API",
          version: "1.0.0",
          description: "Full CRUD API documentation for Merch Dashboard with Elysia & Prisma",
        },
        tags: [
          { name: "Auth", description: "Authentication endpoints" },
          { name: "Merchandise", description: "Merchandise CRUD operations" },
          { name: "System", description: "System health check" },
        ],
      },
      path: "/swagger",
    })
  );

export const checkAuth = async (headers: any, jwt: any, set: any, requireAdmin: boolean = false) => {
  const authHeader = headers.authorization || headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    set.status = 401;
    return { error: "Unauthorized" };
  }
  const token = authHeader.split(" ")[1];
  const payload = await jwt.verify(token);
  if (!payload) {
    set.status = 401;
    return { error: "Invalid token" };
  }
  const user = await prisma.user.findUnique({
    where: { id: payload.id as string },
  });
  if (!user) {
    set.status = 401;
    return { error: "User not found" };
  }
  if (requireAdmin && user.role !== "ADMIN") {
    set.status = 403;
    return { error: "Forbidden: Admin access required" };
  }
  return { user };
};

app.get(
    "/",
    () => ({
      name: "Merch Dashboard API",
      status: "running",
      documentation: "/swagger",
    }),
    {
      detail: { tags: ["System"] },
    }
  )
  .get(
    "/api/health",
    () => ({
      status: "healthy",
      timestamp: new Date().toISOString(),
    }),
    {
      detail: { tags: ["System"] },
    }
  )
  .group("/api/auth", (auth) =>
    auth
      .post(
        "/register",
        async ({ body, set }) => {
          const { email, password, name, phone, role } = body;
          
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email },
          });
          
          if (existingUser) {
            set.status = 400;
            return { error: "Email already in use" };
          }
          
          // Hash password using Bun's native password hasher
          const hashedPassword = await Bun.password.hash(password);
          
          const user = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              role: role || "CUSTOMER",
              // we don't have name/phone in schema currently, we should just use what's there or update schema.
              // For now, we only store email/password/role in User as per schema.
            },
          });
          
          return { message: "User registered successfully", user: { id: user.id, email: user.email, role: user.role } };
        },
        {
          body: t.Object({
            email: t.String({ format: "email" }),
            password: t.String({ minLength: 6 }),
            name: t.Optional(t.String()),
            phone: t.Optional(t.String()),
            role: t.Optional(t.String()),
          }),
          detail: { tags: ["Auth"], summary: "Register a new user" },
        }
      )
      .post(
        "/login",
        async ({ body, jwt, set }) => {
          const { email, password } = body;
          
          const user = await prisma.user.findUnique({
            where: { email },
          });
          
          if (!user) {
            set.status = 401;
            return { error: "Invalid email or password" };
          }
          
          const isMatch = await Bun.password.verify(password, user.password);
          if (!isMatch) {
            set.status = 401;
            return { error: "Invalid email or password" };
          }
          
          const token = await jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role,
          });
          
          return {
            message: "Login successful",
            token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
            },
          };
        },
        {
          body: t.Object({
            email: t.String({ format: "email" }),
            password: t.String(),
          }),
          detail: { tags: ["Auth"], summary: "Login and get a JWT token" },
        }
      )
      .get(
        "/me",
        async ({ headers, jwt, set }) => {
          const authHeader = headers.authorization;
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            set.status = 401;
            return { error: "Unauthorized" };
          }
          
          const token = authHeader.split(" ")[1];
          const payload = await jwt.verify(token);
          
          if (!payload) {
            set.status = 401;
            return { error: "Invalid token" };
          }
          
          const user = await prisma.user.findUnique({
            where: { id: payload.id as string },
          });
          
          if (!user) {
            set.status = 401;
            return { error: "User not found" };
          }
          
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        },
        {
          headers: t.Object({
            authorization: t.Optional(t.String()),
          }),
          detail: { tags: ["Auth"], summary: "Get current logged-in user profile" },
        }
      )
  )
  .group("/api/merch", (merch) =>
    merch
      // GET ALL MERCHANDISE (with optional search, category, status)
      .get(
        "/",
        async ({ query }) => {
          const { search, category, status } = query;
          return await prisma.merchandise.findMany({
            where: {
              ...(search
                ? {
                    OR: [
                      { name: { contains: search } },
                      { description: { contains: search } },
                    ],
                  }
                : {}),
              ...(category ? { category } : {}),
              ...(status ? { status } : {}),
            },
            orderBy: { createdAt: "desc" },
          });
        },
        {
          query: t.Object({
            search: t.Optional(t.String()),
            category: t.Optional(t.String()),
            status: t.Optional(t.String()),
          }),
          detail: {
            tags: ["Merchandise"],
            summary: "List all merchandise items with filters",
          },
        }
      )
      // GET SINGLE MERCHANDISE BY ID
      .get(
        "/:id",
        async ({ params: { id }, set }) => {
          const item = await prisma.merchandise.findUnique({
            where: { id },
          });
          if (!item) {
            set.status = 404;
            return { error: "Merchandise item not found" };
          }
          return item;
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          detail: {
            tags: ["Merchandise"],
            summary: "Get a single merchandise item by ID",
          },
        }
      )
      // CREATE NEW MERCHANDISE
      .post(
        "/",
        async ({ body, set, headers, jwt }) => {
          const auth = await checkAuth(headers, jwt, set, true);
          if (auth.error) return auth;
          const newItem = await prisma.merchandise.create({
            data: {
              name: body.name,
              category: body.category,
              price: body.price,
              stock: body.stock ?? 0,
              description: body.description,
              imageUrl: body.imageUrl,
              status: body.status ?? "ACTIVE",
            },
          });
          set.status = 201;
          return newItem;
        },
        {
          body: t.Object({
            name: t.String({ minLength: 1 }),
            category: t.String({ minLength: 1 }),
            price: t.Number({ minimum: 0 }),
            stock: t.Optional(t.Number({ minimum: 0 })),
            description: t.Optional(t.String()),
            imageUrl: t.Optional(t.String()),
            status: t.Optional(t.String()),
          }),
          detail: {
            tags: ["Merchandise"],
            summary: "Create a new merchandise item",
          },
        }
      )
      // UPDATE MERCHANDISE
      .put(
        "/:id",
        async ({ params: { id }, body, set, headers, jwt }) => {
          const auth = await checkAuth(headers, jwt, set, true);
          if (auth.error) return auth;
          try {
            const updated = await prisma.merchandise.update({
              where: { id },
              data: body,
            });
            return updated;
          } catch (err) {
            set.status = 404;
            return { error: "Merchandise item not found or update failed" };
          }
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          body: t.Object({
            name: t.Optional(t.String()),
            category: t.Optional(t.String()),
            price: t.Optional(t.Number({ minimum: 0 })),
            stock: t.Optional(t.Number({ minimum: 0 })),
            description: t.Optional(t.String()),
            imageUrl: t.Optional(t.String()),
            status: t.Optional(t.String()),
          }),
          detail: {
            tags: ["Merchandise"],
            summary: "Update merchandise item details",
          },
        }
      )
      // DELETE MERCHANDISE
      .delete(
        "/:id",
        async ({ params: { id }, set, headers, jwt }) => {
          const auth = await checkAuth(headers, jwt, set, true);
          if (auth.error) return auth;
          try {
            await prisma.merchandise.delete({
              where: { id },
            });
            return { success: true, message: "Merchandise deleted successfully" };
          } catch (err) {
            set.status = 404;
            return { error: "Merchandise item not found or already deleted" };
          }
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          detail: {
            tags: ["Merchandise"],
            summary: "Delete a merchandise item",
          },
        }
      )
      // SEED SAMPLE DATA
      .post(
        "/seed",
        async () => {
          const count = await prisma.merchandise.count();
          if (count > 0) {
            return {
              message: `Database already contains ${count} items. Seed skipped.`,
            };
          }

          const sampleItems = [
            {
              name: "Classic Oversized Hoodie",
              category: "Apparel",
              price: 45.0,
              stock: 50,
              description: "Premium heavyweight cotton oversized hoodie with embroidered logo.",
              imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=60",
              status: "ACTIVE",
            },
            {
              name: "Vintage Graphic T-Shirt",
              category: "Apparel",
              price: 25.0,
              stock: 120,
              description: "Soft washed vintage style graphic tee with retro aesthetic print.",
              imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60",
              status: "ACTIVE",
            },
            {
              name: "Insulated Stainless Bottle",
              category: "Accessories",
              price: 22.5,
              stock: 75,
              description: "750ml double-wall vacuum insulated water bottle keep drinks cold for 24h.",
              imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60",
              status: "ACTIVE",
            },
            {
              name: "Embroidered Snapback Cap",
              category: "Headwear",
              price: 18.0,
              stock: 40,
              description: "6-panel classic snapback cap with flat brim and structured crown.",
              imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=60",
              status: "ACTIVE",
            },
            {
              name: "Heavy Canvas Tote Bag",
              category: "Accessories",
              price: 15.0,
              stock: 90,
              description: "Durable eco-friendly canvas tote bag with inner zipped pocket.",
              imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=60",
              status: "ACTIVE",
            },
          ];

          await prisma.merchandise.createMany({
            data: sampleItems,
          });

          return {
            success: true,
            message: `Successfully seeded ${sampleItems.length} demo merchandise items!`,
          };
        },
        {
          detail: {
            tags: ["Merchandise"],
            summary: "Seed initial demo merchandise data",
          },
        }
      )
  )
  .group("/api/orders", (orders) =>
    orders
      .get("/", async ({ set, headers, jwt }) => {
        const auth = await checkAuth(headers, jwt, set, false); // Any authenticated user
        if (auth.error) return auth;
        try {
          // If Admin, return all. If Customer, filter by customerName == user.email
          const whereClause = auth.user!.role === "ADMIN" ? {} : { customerName: auth.user!.email };
          return await prisma.order.findMany({
            where: whereClause,
            include: { items: true },
            orderBy: { createdAt: "desc" },
          });
        } catch (err) {
          console.error("GET /api/orders error:", err);
          set.status = 500;
          return { error: "An internal server error occurred" };
        }
      })
      .post("/", async ({ body, set, headers, jwt }) => {
        const auth = await checkAuth(headers, jwt, set, false); // Any authenticated user
        if (auth.error) return auth;
        try {
          const { customerName, date, totalAmount, items } = body as any;
          const newOrder = await prisma.order.create({
            data: {
              customerName,
              date,
              totalAmount,
              items: {
                create: items.map((item: any) => ({
                  productId: item.productId,
                  productName: item.productName,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                })),
              },
            },
            include: { items: true },
          });
          set.status = 201;
          return newOrder;
        } catch (err) {
          console.error("POST /api/orders error:", err);
          set.status = 500;
          return { error: "An internal server error occurred" };
        }
      }, {
        body: t.Object({
          customerName: t.String({ minLength: 1 }),
          date: t.String({ minLength: 1 }),
          totalAmount: t.Number({ minimum: 0 }),
          items: t.Array(
            t.Object({
              productId: t.String({ minLength: 1 }),
              productName: t.String({ minLength: 1 }),
              quantity: t.Number({ minimum: 1 }),
              unitPrice: t.Number({ minimum: 0 }),
            })
          )
        })
      })
      .put("/:id/status", async ({ params: { id }, body, set, headers, jwt }) => {
        const auth = await checkAuth(headers, jwt, set, true); // Admin only
        if (auth.error) return auth;
        const { status } = body as any;
        if (!status) {
          set.status = 400;
          return { error: "Status is required" };
        }
        try {
          const updated = await prisma.order.update({
            where: { id },
            data: { status },
            include: { items: true },
          });
          return updated;
        } catch (err: any) {
          console.error("PUT /api/orders/:id/status error:", err);
          if (err.code === 'P2025') {
            set.status = 404;
            return { error: "Order not found" };
          }
          set.status = 500;
          return { error: "An internal server error occurred" };
        }
      })
      .delete("/:id", async ({ params: { id }, set, headers, jwt }) => {
        const auth = await checkAuth(headers, jwt, set, true); // Admin only
        if (auth.error) return auth;
        try {
          await prisma.order.delete({
            where: { id },
          });
          return { success: true };
        } catch (err: any) {
          console.error("DELETE /api/orders/:id error:", err);
          if (err.code === 'P2025') {
            set.status = 404;
            return { error: "Order not found" };
          }
          set.status = 500;
          return { error: "An internal server error occurred" };
        }
      })
  )
  .listen(3001);

console.log(
  `🚀 Server running at http://${app.server?.hostname}:${app.server?.port}`
);
console.log(
  `📚 Swagger documentation: http://${app.server?.hostname}:${app.server?.port}/swagger`
);