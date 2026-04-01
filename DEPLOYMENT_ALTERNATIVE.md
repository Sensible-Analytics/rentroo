# Alternative Deployment Guide (Free-Tier Services)

This guide provides step-by-step instructions to deploy Rentroo using free-tier services (Render, Vercel, MongoDB Atlas, etc.) as an alternative to Google Cloud.

**Target Domain:** `rentroo.sensibleanalytics.co`

## Prerequisites

1. **Accounts required:**
   - GitHub account with repository access
   - Vercel account ([vercel.com](https://vercel.com))
   - Render account ([render.com](https://render.com))
   - MongoDB Atlas account ([mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
   - Clerk account ([clerk.com](https://clerk.com))
   - Resend account ([resend.com](https://resend.com))
   - Cloudflare account ([cloudflare.com](https://cloudflare.com)) for R2

2. **Tools installed (optional):**
   - Vercel CLI: `npm i -g vercel`
   - Render CLI: `npm i -g render.com`
   - Git

## Phase 1: Frontend Deployment to Vercel

The landlord and tenant frontends are Next.js apps. They are already configured with `vercel.json` files.

### 1.1 Connect GitHub Repository to Vercel

1. Go to Vercel Dashboard → **Add New...** → **Project**
2. Import the `rentroo` GitHub repository
3. Configure **landlord** project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `webapps/landlord`
   - **Build Command:** `cd ../.. && yarn install && yarn build && cd webapps/landlord && yarn build`
   - **Output Directory:** `.next`
   - **Install Command:** (leave default)
4. Configure **tenant** project:
   - Same as above, but **Root Directory:** `webapps/tenant`

### 1.2 Environment Variables

Add the following environment variables in each Vercel project (Settings → Environment Variables):

| Variable | Landlord | Tenant |
|----------|----------|--------|
| `NEXT_PUBLIC_GATEWAY_URL` | `https://api.rentroo.sensibleanalytics.co` | `https://api.rentroo.sensibleanalytics.co` |
| `NEXT_PUBLIC_BASE_PATH` | `/landlord` | `/tenant` |
| `NEXT_PUBLIC_APP_NAME` | `Rentro` | `Rentro` |

### 1.3 Custom Domains

1. In each Vercel project, go to **Settings → Domains**
2. Add custom domains:
   - Landlord: `landlord.rentroo.sensibleanalytics.co`
   - Tenant: `tenant.rentroo.sensibleanalytics.co`
3. Vercel will provide DNS records to configure (see Phase 6)

### 1.4 Deploy

Trigger a deployment by pushing to the main branch or using the Vercel CLI:

```bash
# For landlord
cd webapps/landlord
vercel --prod

# For tenant
cd webapps/tenant
vercel --prod
```

## Phase 2: Database Setup

### 2.1 MongoDB Atlas

1. Create a free M0 cluster (512MB)
2. Create a database user with read/write permissions
3. Whitelist Render's IP addresses (0.0.0.0/0 for simplicity, or specific IPs)
4. Get connection string: `mongodb+srv://<user>:<password>@cluster.mongodb.net/rentroo`
5. Store as `MONGO_URL` secret in Render (see Phase 3)

### 2.2 Redis (Upstash)

1. Create a free Upstash Redis instance
2. Get connection details:
   - Host, port, password
   - URL format: `rediss://<user>:<password>@<host>.upstash.io:6379`
3. Store as `REDIS_URL` and `REDIS_PASSWORD` secrets in Render

## Phase 3: Backend Service Deployment to Render

We'll use the provided `render.yaml` blueprint to deploy all backend services.

### 3.1 Import Blueprint

1. Go to Render Dashboard → **New** → **Blueprint**
2. Connect your GitHub repository
3. Select the `render.yaml` file in the repository root
4. Render will preview the services to be created

### 3.2 Configure Secrets

For each service, you'll need to set environment variables (secrets) in the Render dashboard. Use the `.env.render.example` file as a reference.

**Critical secrets to set:**
- `MONGO_URL` (from MongoDB Atlas)
- `REDIS_URL` and `REDIS_PASSWORD` (from Upstash)
- `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, etc. (generate random strings)
- `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY` (from Clerk)
- `RESEND_API_KEY` (from Resend)
- `R2_*` (from Cloudflare R2)

### 3.3 Plan Selection

- **Critical services (Gateway, API, Authenticator, TenantAPI):** Starter plan ($7/month each) for unlimited hours
- **Non-critical services (Emailer, PDFGenerator, Resetservice):** Free plan with auto-sleep

### 3.4 Deploy

Click **Apply** in the Render Blueprint dashboard. Render will build and deploy each service.

### 3.5 Verify Services

Once deployed, each service will have a URL like `https://rentroo-gateway.onrender.com`. Verify health endpoints:

```bash
curl https://rentroo-gateway.onrender.com/health
curl https://rentroo-api.onrender.com/health
# etc.
```

## Phase 4: External Service Configuration

### 4.1 Clerk Authentication

1. Create a Clerk application
2. Add your domains:
   - `landlord.rentroo.sensibleanalytics.co`
   - `tenant.rentroo.sensibleanalytics.co`
   - `api.rentroo.sensibleanalytics.co`
3. Enable email/password authentication
4. Get API keys and add to Render secrets

### 4.2 Resend Email

1. Create a Resend account and verify your domain
2. Create an API key
3. Set `RESEND_API_KEY` and `EMAIL_FROM` in Render

### 4.3 Cloudflare R2 Storage

1. Create an R2 bucket
2. Generate access keys
3. Set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` in Render

## Phase 5: DNS Configuration

Configure the following DNS records with your domain registrar:

| Type | Name | Value |
|------|------|-------|
| CNAME | `landlord` | `cname.vercel-dns.com.` |
| CNAME | `tenant` | `cname.vercel-dns.com.` |
| CNAME | `api` | `rentroo-gateway.onrender.com.` |
| CNAME | `*` (wildcard) | `rentroo-gateway.onrender.com.` |

**Note:** SSL certificates are automatically provisioned by Vercel and Render.

## Phase 6: E2E Testing

### 6.1 Set Environment Variables

Create a `.env` file in the `e2e` directory:

```env
LANDLORD_APP_URL=https://landlord.rentroo.sensibleanalytics.co
GATEWAY_URL=https://api.rentroo.sensibleanalytics.co
```

### 6.2 Run Tests

```bash
cd e2e
npm ci
npm run test  # or use the script: ../scripts/run-e2e.sh
```

## Rollback Plan

If issues occur:
1. Switch DNS back to previous deployment
2. Maintain database backups in both locations
3. Keep the Google Cloud deployment running during migration

## Monitoring and Maintenance

- Monitor Render service metrics in the dashboard
- Set up alerts for service health
- Regularly backup MongoDB Atlas data
- Monitor usage limits (Render hours, MongoDB storage, etc.)

## Next Steps

1. Set up CI/CD pipeline for automated deployments
2. Configure monitoring and alerting
3. Implement database backup automation
4. Set up staging environment

---

**Estimated Cost:** $28/month (4 services × $7) for production stability, or $0 with limited hours.