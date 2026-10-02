FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copy all workspace source and configuration
COPY . .

# Set build-time env for prisma generate
ENV DATABASE_URL="postgresql://postgres:dummy@localhost:5432/postgres?schema=public"

# Install dependencies and generate Prisma client
RUN pnpm install
RUN pnpm exec prisma generate

# Build NestJS API
RUN pnpm --filter @colegio-favo/backend build

EXPOSE 3001
CMD ["node", "apps/backend/dist/main"]
