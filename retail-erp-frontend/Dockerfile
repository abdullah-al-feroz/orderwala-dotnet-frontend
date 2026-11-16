# syntax=docker/dockerfile:1
#
# retail-erp-frontend — Create React App (react-scripts 5)
# Multi-stage build: Node compiles the SPA, nginx serves it and reverse-proxies
# the .NET APIs under the same origin (so the browser never hits CORS).
#
# Build from THIS directory:
#   docker build -t retail-erp-frontend .
#
# Run:
#   docker run -p 3000:80 \
#     -e HR_UPSTREAM=https://hr-api.example.com \
#     -e UM_UPSTREAM=https://um-api.example.com \
#     -e SC_UPSTREAM=https://sc-api.example.com \
#     retail-erp-frontend

# ---------------------------------------------------------------------------
# Stage 1 — build the static bundle
# ---------------------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

# CRA inlines REACT_APP_* at BUILD time. Build args default to the production
# values below; override with --build-arg if a service lives on another domain.
# (These leave the .env.production values intact for plain `npm run build`.)
ARG REACT_APP_PHP_API=https://backend.orderwalabd.com/public/api
ARG REACT_APP_FILE_BASE=https://backend.orderwalabd.com/public/
ARG REACT_APP_HR_API=/dotnet/hr/api
ARG REACT_APP_HR_SHIFT_API=/dotnet/um/api/
ARG REACT_APP_UM_API=/dotnet/um/api/
ARG REACT_APP_USER_API=/dotnet/um/api/UserManagement
ARG REACT_APP_SC_API=/dotnet/sc/api

ENV CI=false \
    GENERATE_SOURCEMAP=false \
    NODE_OPTIONS=--max-old-space-size=4096 \
    REACT_APP_PHP_API=$REACT_APP_PHP_API \
    REACT_APP_FILE_BASE=$REACT_APP_FILE_BASE \
    REACT_APP_HR_API=$REACT_APP_HR_API \
    REACT_APP_HR_SHIFT_API=$REACT_APP_HR_SHIFT_API \
    REACT_APP_UM_API=$REACT_APP_UM_API \
    REACT_APP_USER_API=$REACT_APP_USER_API \
    REACT_APP_SC_API=$REACT_APP_SC_API

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
# Linux is case-sensitive. Three report pages import "../../../../Common/http"
# while the file is "Http.js"; that resolves on Windows but NOT in this Linux
# build. Add a re-export shim so the build succeeds without editing app source.
# (Single module: this re-exports the real Http.js, it is not a duplicate.)
RUN printf '%s\n' 'export { default } from "./Http";' > src/Components/Common/http.js

RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2 — serve with nginx
# ---------------------------------------------------------------------------
FROM nginx:stable-alpine AS final

# envsubst renders /etc/nginx/templates/default.conf.template -> conf.d/default.conf
RUN apk add --no-cache gettext

# Reverse-proxy targets. Override at runtime (Dokploy Environment tab / docker -e).
# MUST NOT end with a trailing slash. http:// and https:// are both supported.
# The defaults are placeholders that let nginx start; API calls return 502 until
# you set real values.
ENV HR_UPSTREAM=http://127.0.0.1:7101 \
    UM_UPSTREAM=http://127.0.0.1:7084 \
    SC_UPSTREAM=http://127.0.0.1:7031

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
