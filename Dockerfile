# SisaRasa Frontend — Next.js Production Dockerfile
# ====================================================
FROM node:18-slim AS builder
WORKDIR /app

# Install package dependencies
COPY package*.json ./
RUN npm install

# Salin source code
COPY . .

# Ambil argumen build-env untuk disuntikkan ke bundel statis Next.js saat build-time
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Jalankan kompilasi build statis Next.js
RUN npm run build

# Stage Runner ringan
FROM node:18-slim AS runner
WORKDIR /app

ENV PORT=8080
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080

CMD ["npm", "run", "start"]
