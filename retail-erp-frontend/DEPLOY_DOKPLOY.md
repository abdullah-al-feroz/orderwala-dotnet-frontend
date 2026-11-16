# Deploying `retail-erp-frontend` on Dokploy

Everything needed is inside this folder:

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build: `node:22-alpine` compiles the SPA → `nginx:stable-alpine` serves it |
| `nginx/default.conf.template` | SPA fallback, caching, gzip, and same-origin reverse proxy for the 3 .NET APIs |
| `.dockerignore` | Keeps `node_modules`, `build`, `.git` etc. out of the build context |
| `.env.production` | Production API endpoints, baked into the bundle at build time |
| `.env.development` | Original `localhost` endpoints — local `npm start` is unchanged |
| `.env.example` | Template for Docker Compose / Dokploy environment variables |
| `docker-compose.yml` | Optional Compose deployment |

---

## 0. Before you push (important)

`src/Components/Common/Http.js` was listed in `.gitignore` and is **not tracked by git**.
A fresh repo clone has no `Http.js`, so the build fails with:

```
Module not found: Can't resolve './Common/Http'
```

The ignore entries have been removed. Commit the file:

```bash
cd C:\Users\UseR\OneDrive\Desktop\orderwala-dotnet-frontend
git add retail-erp-frontend/src/Components/Common/Http.js \
        retail-erp-frontend/.gitignore \
        retail-erp-frontend/Dockerfile \
        retail-erp-frontend/nginx \
        retail-erp-frontend/.dockerignore \
        retail-erp-frontend/.env.production \
        retail-erp-frontend/.env.development \
        retail-erp-frontend/.env.example \
        retail-erp-frontend/docker-compose.yml \
        retail-erp-frontend/DEPLOY_DOKPLOY.md
git commit -m "Dockerize retail-erp-frontend for Dokploy"
git push
```

Verify it is tracked:

```bash
git ls-files retail-erp-frontend/src/Components/Common/Http.js
```

---

## 1. What changed in the code

The four .NET clients used hardcoded `https://localhost:...` URLs. In a browser,
`localhost` means **the visitor's own machine**, so every .NET call would fail
after deployment. They now read build-time variables:

| File | Old hardcoded value | New default |
|---|---|---|
| `Http.js` (PHP) | `https://backend.orderwalabd.com/public/api` | `REACT_APP_PHP_API` |
| `HttpHR.js` | `https://localhost:7101/api` | `REACT_APP_HR_API` → `/dotnet/hr/api` |
| `HttpHrShift.js` | `https://localhost:7084/api/` | `REACT_APP_HR_SHIFT_API` → `/dotnet/um/api/` |
| `HttpUser.js` | `https://localhost:7084/api/UserManagement` | `REACT_APP_USER_API` → `/dotnet/um/api/UserManagement` |
| `HttpSupplyChain.js` | `https://localhost:7031/api` | `REACT_APP_SC_API` → `/dotnet/sc/api` |
| `Url.js` (uploads) | `http://127.0.0.1:8000/` | `REACT_APP_FILE_BASE` |

The relative `/dotnet/...` paths are **not** public folders — nginx proxies them:

```
browser  →  https://erp.yourdomain.com/dotnet/hr/api/Staff
nginx    →  ${HR_UPSTREAM}/api/Staff
```

Because the browser only ever talks to your frontend's own origin, **no CORS
configuration is needed on the .NET services**.

> Create React App inlines `REACT_APP_*` at build time. Changing any of them
> requires a rebuild — they are **not** runtime variables.

### Build-time shim (do not remove)

Three report pages import the wrong case:

- `Pages/Reports/TrackingReports/Reports/AMList.jsx`
- `Pages/Reports/TrackingReports/Reports/MDOList.jsx`
- `Pages/Reports/TrackingReports/Reports/RSMList.jsx`

They contain `import Http from "../../../../Common/http";` while the actual file is
`Common/Http.js`. Windows resolves that case-insensitively, so local builds pass;
the Linux Docker build fails with:

```
Module not found: Can't resolve '../../../../Common/http'
```

Rather than editing application source, the Dockerfile creates a one-line
re-export shim inside the image before compiling:

```dockerfile
RUN printf '%s\n' 'export { default } from "./Http";' > src/Components/Common/http.js
```

It exists only in the build stage — nothing in the repository changes. **Do not
remove that line.** Once the three imports are corrected to `Common/Http` in
source, the shim can be deleted.

---

## 2. Deploy — Option A: Dokploy "Dockerfile" application (recommended)

In Dokploy: **Create Application → Git provider → `abdullah-al-feroz/orderwala-dotnet-frontend`**.

| Field | Value |
|---|---|
| Branch | your deploy branch |
| Build Type | **Dockerfile** |
| Dockerfile Path | `retail-erp-frontend/Dockerfile` |
| Docker Context Path | `retail-erp-frontend` |
| Port | `80` |
| Domain | e.g. `erp.yourdomain.com` (enable HTTPS / Let's Encrypt) |

### Environment tab (runtime — required)

Set the three proxy targets. Use the .NET services' **public HTTPS domains**
(they are separate apps) or their internal Docker hostnames.

```env
HR_UPSTREAM=https://hr-api.yourdomain.com
UM_UPSTREAM=https://usermanagement-api.yourdomain.com
SC_UPSTREAM=https://supplychain-api.yourdomain.com
```

Rules:

- **No trailing slash** (`https://host` ✔, `https://host/` ✘ — you get `//`).
- `http://` also works for same-network containers, e.g. `http://usermanagement-api:8080`.
- If you leave the defaults (`http://127.0.0.1:*`), the site loads but every
  .NET request returns **502**. That is expected until you set these.

### Build args (optional)

Only needed if you want to override `.env.production`:

```env
REACT_APP_PHP_API=https://backend.orderwalabd.com/public/api
REACT_APP_FILE_BASE=https://backend.orderwalabd.com/public/
REACT_APP_HR_API=/dotnet/hr/api
REACT_APP_HR_SHIFT_API=/dotnet/um/api/
REACT_APP_UM_API=/dotnet/um/api/
REACT_APP_USER_API=/dotnet/um/api/UserManagement
REACT_APP_SC_API=/dotnet/sc/api
```

If Dokploy's plan does not expose build args, the values in `.env.production`
are used automatically — nothing breaks.

Click **Deploy**. First build takes ~3–8 minutes.

---

## 3. Deploy — Option B: Dokploy "Docker Compose" application

Create **Compose** → same repo → Compose Path `retail-erp-frontend/docker-compose.yml`.

Add the variables from `.env.example` in the Environment tab. This option lets
you build and run locally the same way:

```bash
cd retail-erp-frontend
cp .env.example .env      # edit HR_UPSTREAM / UM_UPSTREAM / SC_UPSTREAM
docker compose up -d --build
# open http://localhost:3000
```

---

## 4. Local (no Docker)

```bash
npm install
npm start          # uses .env.development → localhost:7084 / 7031 / 7101 as before
npm run build      # uses .env.production → /dotnet/... proxy paths
```

---

## 5. Verify after deploy

```bash
# 1. Container is healthy (Dockerfile HEALTHCHECK hits this)
curl -i https://erp.yourdomain.com/healthz
# → 200 ok

# 2. SPA fallback works (deep link must NOT 404)
curl -i https://erp.yourdomain.com/some/deep/route
# → 200 (index.html)

# 3. Proxy reaches each service
curl -i https://erp.yourdomain.com/dotnet/hr/api/...
curl -i https://erp.yourdomain.com/dotnet/um/api/...
curl -i https://erp.yourdomain.com/dotnet/sc/api/...
# → 401 / 400 from the API is GOOD (it means the proxy reached it)
# → 502 means the matching *_UPSTREAM is wrong or the service is down
```

Browser check: open DevTools → Network. .NET calls should go to
`https://erp.yourdomain.com/dotnet/...` (same origin). If you still see
`localhost:7084`, the image was built from an old commit — rebuild.

---

## 6. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Build fails: `Can't resolve './Common/Http'` | `Http.js` not committed | `git add` it (§0) |
| Build fails: `Can't resolve '../../../../Common/http'` | the case shim was removed from the Dockerfile | restore the `RUN printf ... http.js` line |
| nginx exits: `host not found in upstream` | a `*_UPSTREAM` hostname is not resolvable from this container | use the service's public domain, or its exact container name on a shared Docker network |
| Build fails: `npm ci` lock mismatch | `package-lock.json` out of sync | run `npm install` locally, commit the lockfile |
| Build OOM-killed | CRA is memory hungry | raise the builder's memory; the Dockerfile already sets `--max-old-space-size=4096` |
| Page is blank | assets requested from a wrong base path | `homepage` is `"/"` — deploy at a domain root, not a sub-path |
| All .NET calls 502 | `*_UPSTREAM` unset/wrong | set the three env vars and restart the container |
| .NET calls 404 | upstream includes the prefix already | set `HR_UPSTREAM` to the host only, e.g. `https://hr-api.example.com` — **not** `.../api` |
| HTTPS upstream error `unexpected eof` | SNI/verification | already covered: `proxy_ssl_server_name on` is set; internal self-signed certs are not verified by default in this config |
| Uploaded-file links broken | `REACT_APP_FILE_BASE` wrong | confirm where `vendor_documents/` is actually served from, then set it and rebuild |
| Deep links 404 | SPA fallback missing | ensure the nginx template was rendered: `docker exec <c> cat /etc/nginx/conf.d/default.conf` |
| Old content after redeploy | browser cached `index.html` | already handled with `expires -1`; hard-refresh once |

---

## 7. Notes

- The image serves plain **HTTP on port 80**. TLS is terminated by Dokploy/Traefik.
- `client_max_body_size 50m` allows photo/document uploads through the proxy.
- `gzip` is enabled for text/JS/CSS/JSON/SVG.
- Static assets under `/static/` are cached for 1 year (content-hashed by CRA);
  `index.html` is never cached.
- The container runs as root (nginx default). Fine for this app; nginx never
  writes to the web root.
- No `.env` secrets are baked into the frontend bundle — all `REACT_APP_*` values
  are public by definition. Never put a secret there.
