FROM node:24-alpine AS base

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json ./
RUN pnpm install --no-frozen-lockfile

COPY . .

EXPOSE 3001

CMD ["pnpm", "run", "dev"]