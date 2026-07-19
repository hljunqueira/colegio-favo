FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

# Copy configuration, prisma and shared packages
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY prisma/ ./prisma/
COPY packages/ ./packages/
COPY apps/backend/package.json ./apps/backend/package.json

# Install dependencies (all links are resolved correctly within /app/node_modules)
RUN pnpm install --frozen-lockfile

# Copy backend source
COPY apps/backend/ ./apps/backend/

# Generate Prisma Client
RUN pnpm exec prisma generate

# Build NestJS API
RUN pnpm --filter @colegio-favo/backend build

EXPOSE 3001
CMD ["node", "apps/backend/dist/main"]
