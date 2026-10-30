# Multi-stage Production Dockerfile for SentinelTrust AI Backend (Render / Cloud Run)
FROM node:22-alpine AS builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend/ ./
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app/backend
ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app/backend/package*.json ./
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/sql ./sql

EXPOSE 5000

CMD ["node", "dist/index.js"]
