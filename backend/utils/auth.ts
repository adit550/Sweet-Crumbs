import { prisma } from "../db.js";

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
