# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1 — Build (client + server bundles do React Router Framework Mode)
# VITE_* são embutidos no bundle no build — passe via --build-arg.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_GTM_ID
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_GTM_ID=$VITE_GTM_ID

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2 — Runtime (apenas deps de produção + artefatos de build)
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runtime
WORKDIR /app

LABEL org.opencontainers.image.title="Bizu Hub Bruno Goulart"
LABEL org.opencontainers.image.description="Site pessoal, blog e hub de clientes — brunogoulart.com.br"
LABEL org.opencontainers.image.source="https://gitlab.com/brunopelatieri/bizu-hub"

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/build ./build

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "build/server/index.js"]
