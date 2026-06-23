# syntax=docker/dockerfile:1

# ── deps: install node_modules ──
FROM node:22-alpine AS deps
# libc6-compat lets prebuilt native binaries (e.g. sharp) load on musl/alpine.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
# `npm install` (not `npm ci`): the lockfile is generated on Windows and omits
# the Linux-musl native binaries (sharp/@emnapi); install re-resolves for Alpine.
RUN npm install --no-audit --no-fund

# ── builder: compile the Next.js standalone bundle ──
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── runner: minimal image that just runs server.js ──
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs
# public + static aren't bundled into standalone automatically (see Next docs).
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
