FROM node:24-alpine AS base

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
RUN pnpm install --no-frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "dev"]
