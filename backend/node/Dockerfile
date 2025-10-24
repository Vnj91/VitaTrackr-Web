FROM node:18-alpine AS base
WORKDIR /usr/src/app

# Install production dependencies first
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

FROM base AS runner
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENV NODE_ENV=production
EXPOSE 5001
CMD ["node", "server.js"]
