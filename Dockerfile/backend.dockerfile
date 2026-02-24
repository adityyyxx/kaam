# ---------- Base builder ----------
FROM node:20-alpine AS builder

# Install system dependencies for Prisma
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app
ENV TURBO_FORCE=1

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
    
    # Copy workspace metadata first
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
    
    # Copy full monorepo
    COPY . .
    
    # Install all workspace deps
    RUN pnpm install --frozen-lockfile
    
    # Generate Prisma client BEFORE build
    ARG DATABASE_URL
    ENV DATABASE_URL=${DATABASE_URL}
    RUN pnpm --filter=db run generate
    
    # Build only backend and db (skip frontend)
    RUN pnpm --filter db run build
    RUN pnpm --filter backend run build
    
# ---------- Runtime ----------
FROM node:20-alpine AS runner

# Install system dependencies for Prisma
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Accept DATABASE_URL as build arg and set as environment variable
# Can be overridden at runtime with: docker run -e DATABASE_URL=...
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
    
    # Copy workspace metadata for pnpm
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
    COPY packages/db/package.json packages/db/package.json
    COPY packages/typescript-config/package.json packages/typescript-config/package.json
    COPY apps/backend/package.json apps/backend/package.json
    
    # Copy built artifacts
    COPY --from=builder /app/packages/db/dist packages/db/dist
    COPY --from=builder /app/packages/db/src/generated packages/db/src/generated
    COPY --from=builder /app/apps/backend/dist apps/backend/dist

    # Install only production deps for backend and db
    RUN pnpm install --filter backend --filter db --prod --frozen-lockfile
    
    WORKDIR /app/apps/backend
    
    EXPOSE 5000
    CMD ["node", "dist/index.js"]
    