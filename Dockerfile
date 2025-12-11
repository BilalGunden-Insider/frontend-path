FROM node:20-alpine AS base
WORKDIR /app
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package.json /app/package.json
RUN chown -R nuxtjs:nodejs /app
USER nuxtjs
EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", ".output/server/index.mjs"]

