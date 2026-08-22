FROM oven/bun:1 as base
WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lock ./
COPY prisma ./prisma/
RUN bun install --frozen-lockfile

# Generate Prisma client
RUN bunx prisma generate

# Copy the rest of the application
COPY . .

# Expose port 3001 (or the port your app uses)
EXPOSE 3001

# Command to run the application
CMD ["bun", "run", "index.ts"]
