# 1-bosqich: Build (qurish)
FROM node:20-slim AS builder

# Canvas uchun kerakli kutubxonalar
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

# 2-bosqich: Runner (ishga tushirish)
FROM node:20-slim

# Runtime uchun kutubxonalar
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango-1.0-0 \
    libjpeg62-turbo \
    libgif7 \
    librsvg2-2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Faqat kerakli fayllarni builder'dan nusxalaymiz
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# NestJS odatda dist/main.js ni hosil qiladi
CMD ["node", "dist/main.js"]