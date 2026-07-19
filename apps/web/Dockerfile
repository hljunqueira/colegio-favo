FROM node:20-alpine AS builder

# Set env to disable Craco lint overlay or test logs during build
ENV DISABLE_ESLINT_PLUGIN=true
ENV GENERATE_SOURCEMAP=false

RUN npm install -g pnpm

WORKDIR /app

# Copy lock and workspaces configs
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy packages first to resolve workspaces dependencies
COPY packages/ ./packages/
COPY apps/web/package.json ./apps/web/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy web source and build
COPY apps/web/ ./apps/web/
RUN pnpm --filter @colegio-favo/web build

# Runner stage
FROM nginx:alpine
COPY --from=builder /app/apps/web/build /usr/share/nginx/html
COPY --from=builder /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
