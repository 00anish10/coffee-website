# syntax=docker/dockerfile:1

FROM node:22-alpine

WORKDIR /app

# Install all deps (including Vite/TypeScript) so the client can be built.
COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY . .

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Apply migrations, seed an empty database, then boot Express + serve /dist
CMD ["sh", "-c", "npm run db:migrate && npm run db:seed && npm start"]
