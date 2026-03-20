FROM node:22-alpine AS base

WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./

RUN npm ci

# Build the app
FROM base AS builder

ENV NODE_ENV=production

# Baked into the client JS at build time — must be your public kt-ingress-svc URL (https://…).
# Cloud Build / CI must pass: --build-arg NEXT_PUBLIC_API_GATEWAY_URL=https://kt-ingress-svc-….run.app
ARG NEXT_PUBLIC_API_GATEWAY_URL
ENV NEXT_PUBLIC_API_GATEWAY_URL=${NEXT_PUBLIC_API_GATEWAY_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN test -n "$NEXT_PUBLIC_API_GATEWAY_URL" || (echo "NEXT_PUBLIC_API_GATEWAY_URL is required at build (see Dockerfile)" >&2; exit 1)
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.* ./ 
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]

