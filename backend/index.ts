import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";
import { prisma } from "./db";
import bcrypt from "bcryptjs";
import { checkAuth } from "./utils/auth";

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
          try {
            const { email, password, name, phone, role } = body;
            
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
              where: { email },
            });
            
            if (existingUser) {
              set.status = 400;
              return { error: "Email already in use" };
            }
            
            // Hash password using bcryptjs for Node.js compatibility on Vercel
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const user = await prisma.user.create({
              data: {
                email,
                password: hashedPassword,
                role: role || "CUSTOMER",
              },
            });
            
            return { message: "User registered successfully", user: { id: user.id, email: user.email, role: user.role } };
          } catch (err: any) {
            set.status = 500;
            return { error: "Database error: " + (err.message || err.toString()) };
          }
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
          
          const isMatch = await bcrypt.compare(password, user.password);
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
          await prisma.merchandise.deleteMany({});
          const sampleItems = [
            {
              name: "Classic Butter Croissant",
              category: "Pastry",
              price: 25000,
              stock: 50,
              description: "Flaky, buttery perfection baked fresh every morning.",
              imageUrl: "/products/butter_croissant.jpg",
              status: "ACTIVE",
            },
            {
              name: "Chocolate Chip Cookie",
              category: "Cookies",
              price: 15000,
              stock: 120,
              description: "Chewy, gooey chocolate chip cookies loaded with premium dark chocolate.",
              imageUrl: "/products/Chocolate-Chip-Cookie.avif",
              status: "ACTIVE",
            },
            {
              name: "Sourdough Loaf",
              category: "Breads",
              price: 45000,
              stock: 30,
              description: "Artisan sourdough bread with a crispy crust and chewy center.",
              imageUrl: "/products/sourdough_loaf.jpg",
              status: "ACTIVE",
            },
            {
              name: "Strawberry Cheesecake",
              category: "Cakes",
              price: 65000,
              stock: 20,
              description: "Creamy cheesecake layered with fresh strawberries.",
              imageUrl: "/products/Strawberry-Cheesecake.avif",
              status: "ACTIVE",
            },
            {
              name: "Cinnamon Roll",
              category: "Pastry",
              price: 30000,
              stock: 40,
              description: "Warm, sweet, and perfectly spiced cinnamon roll with cream cheese frosting.",
              imageUrl: "/products/cinnamon_roll.jpg",
              status: "ACTIVE",
            },
            {
              name: "Iced Latte",
              category: "Drinks",
              price: 35000,
              stock: 50,
              description: "Refreshing iced espresso with creamy milk.",
              imageUrl: "/products/iced_latte.jpg",
              status: "ACTIVE",
            },
            {
              name: "Matcha Latte",
              category: "Drinks",
              price: 40000,
              stock: 45,
              description: "Premium Japanese matcha green tea blended with steamed milk.",
              imageUrl: "/products/matcha_latte.jpg",
              status: "ACTIVE",
            },
            {
              name: "Hot Cappuccino",
              category: "Drinks",
              price: 32000,
              stock: 60,
              description: "Classic hot cappuccino with rich espresso and thick milk foam.",
              imageUrl: "/products/hot_cappuccino.jpg",
              status: "ACTIVE",
            },
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
            },
            {
              name: "Fruit Danish Pastry",
              category: "Pastry",
              price: 28000,
              stock: 35,
              description: "Flaky, buttery pastry topped with sweet custard and fresh berries.",
              imageUrl: "/products/danish_pastry.jpg",
              status: "ACTIVE",
            },
            {
              name: "Almond Croissant",
              category: "Pastry",
              price: 35000,
              stock: 45,
              description: "Twice-baked croissant filled with almond frangipane and topped with toasted almonds.",
              imageUrl: "/products/almond_croissant.jpg",
              status: "ACTIVE",
            },
            {
              name: "Pain au Chocolat",
              category: "Pastry",
              price: 26000,
              stock: 60,
              description: "Classic French pastry with dark chocolate batons wrapped in buttery, flaky dough.",
              imageUrl: "/products/pain_au_chocolat.jpg",
              status: "ACTIVE",
            },
            {
              name: "Oatmeal Raisin Cookie",
              category: "Cookies",
              price: 18000,
              stock: 75,
              description: "Chewy and wholesome oatmeal cookie loaded with sweet plump raisins.",
              imageUrl: "/products/oatmeal_raisin_cookie.jpg",
              status: "ACTIVE",
            },
            {
              name: "Double Chocolate Cookie",
              category: "Cookies",
              price: 20000,
              stock: 65,
              description: "Decadent dark chocolate cookie packed with semi-sweet chocolate chunks.",
              imageUrl: "/products/double_chocolate_cookie.jpg",
              status: "ACTIVE",
            },
            {
              name: "Peanut Butter Cookie",
              category: "Cookies",
              price: 17000,
              stock: 80,
              description: "Classic crumbly peanut butter cookie with the iconic criss-cross pattern.",
              imageUrl: "/products/peanut_butter_cookie.jpg",
              status: "ACTIVE",
            },
            {
              name: "Macadamia Nut Cookie",
              category: "Cookies",
              price: 22000,
              stock: 50,
              description: "Sweet white chocolate chunks mixed with buttery roasted macadamia nuts.",
              imageUrl: "/products/macadamia_nut_cookie.jpg",
              status: "ACTIVE",
            },
            {
              name: "French Baguette",
              category: "Breads",
              price: 20000,
              stock: 40,
              description: "Traditional crispy French baguette, perfect for sandwiches or with soup.",
              imageUrl: "/products/french_baguette.jpg",
              status: "ACTIVE",
            },
            {
              name: "Whole Wheat Loaf",
              category: "Breads",
              price: 28000,
              stock: 35,
              description: "Healthy and hearty whole wheat bread baked to perfection.",
              imageUrl: "/products/whole_wheat_loaf.jpg",
              status: "ACTIVE",
            },
            {
              name: "Ciabatta Bread",
              category: "Breads",
              price: 25000,
              stock: 45,
              description: "Rustic Italian ciabatta bread with a porous, chewy texture.",
              imageUrl: "/products/ciabatta_bread.jpg",
              status: "ACTIVE",
            },
            {
              name: "Sourdough Rye Bread",
              category: "Breads",
              price: 32000,
              stock: 30,
              description: "Artisan sourdough rye loaf with a deep, complex flavor profile.",
              imageUrl: "/products/rye_bread.jpg",
              status: "ACTIVE",
            },
            {
              name: "Chocolate Fudge Cake",
              category: "Cakes",
              price: 45000,
              stock: 20,
              description: "Decadent dark chocolate fudge cake with multiple layers of rich ganache.",
              imageUrl: "/products/chocolate_fudge_cake.jpg",
              status: "ACTIVE",
            },
            {
              name: "Red Velvet Cake",
              category: "Cakes",
              price: 48000,
              stock: 25,
              description: "Vibrant red velvet cake layered with signature smooth cream cheese frosting.",
              imageUrl: "/products/red_velvet_cake.jpg",
              status: "ACTIVE",
            },
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
        };
      })
      .get("/debug-env", () => {
        return {
          hasDbUrl: !!process.env.DATABASE_URL,
          hasDirectUrl: !!process.env.DIRECT_URL,
          nodeEnv: process.env.NODE_ENV,
        };
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
  );

// Only listen locally on Bun. Vercel Node runtime doesn't support listen().
if (typeof Bun !== "undefined") {
  app.listen(process.env.PORT || 3001);
  console.log(
    `🚀 Server running at http://${app.server?.hostname}:${app.server?.port}`
  );
  console.log(
    `📚 Swagger documentation: http://${app.server?.hostname}:${app.server?.port}/swagger`
  );
}

export default {
  fetch: app.fetch,
};