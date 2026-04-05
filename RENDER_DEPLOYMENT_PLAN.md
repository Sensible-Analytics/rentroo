# Alternative Production Deployment Plan - Free-Tier Services

## Overview
This plan provides an alternative to Google Cloud VM deployment using only free-tier services. The target domain remains: `rentroo.sensibleanalytics.co`.

## 1. Architecture Changes for Free-Tier Deployment

### Current Architecture (8 services + 2 databases + frontends):
- Gateway (port 8080)
- API (port 8200)
- Authenticator (port 8000)
- TenantAPI (port 8250)
- Emailer (port 8400)
- PDFGenerator (port 8300)
- Resetservice (port 8900)
- Landlord Frontend (port 8180)
- Tenant Frontend (port 8190)
- MongoDB (port 27017)
- Redis (port 6379)

### Proposed Free-Tier Architecture:

#### Service Consolidation Strategy:
1. **Combine Authenticator + API** → Single "api-auth" service (port 8200)
2. **Combine Emailer + PDFGenerator** → Single "notifications" service (port 8400)
3. **Combine TenantAPI + Resetservice** → Single "tenant" service (port 8250)
4. **Keep Gateway separate** → Required for routing (port 8080)

**Reduced to 4 backend services:**
- Gateway (8080)
- API-Auth (8200)
- Tenant (8250)
- Notifications (8400)

#### Infrastructure Services:
- MongoDB: MongoDB Atlas M0 (free tier, 512MB)
- Redis: Render Redis (free on Starter plan, or Upstash free tier)
- Auth: Clerk (free tier, 10K MAU)
- Storage: Cloudflare R2 (free tier, 10GB)
- Email: Resend (free tier, 3K/month)

#### Frontend:
- Landlord Frontend → Vercel (free tier, unlimited deploys)
- Tenant Frontend → Vercel (free tier, unlimited deploys)

## 2. Service Mapping to Free-Tier Platforms

| Service | Platform | Plan | Monthly Hours | Notes |
|---------|----------|------|---------------|-------|
| **Gateway** | Render | Web Service | 750 hrs | Must stay awake 24/7 |
| **API-Auth** | Render | Web Service | 750 hrs | Combined authenticator + API |
| **Tenant** | Render | Web Service | 750 hrs | Combined tenantapi + resetservice |
| **Notifications** | Render | Web Service | 750 hrs | Combined emailer + pdfgenerator |
| **Landlord Frontend** | Vercel | Hobby | Unlimited | Free |
| **Tenant Frontend** | Vercel | Hobby | Unlimited | Free |
| **MongoDB** | MongoDB Atlas | M0 | Free | 512MB |
| **Redis** | Upstash | Free | Free | 256MB, 10K commands/day |
| **Auth** | Clerk | Free | 10K MAU | Replace custom JWT auth |
| **Storage** | Cloudflare R2 | Free | Free | 10GB, 1M Class A ops |
| **Email** | Resend | Free | 3K/month | Replace Mailgun/SMTP |

**Total Render Hours Needed:** 4 services × 750 hours = 3,000 hours (but only 750 hours available total)

### Solution for Render Hour Limit:
**Option A:** Use multiple Render accounts (need 4 accounts)
**Option B:** Use Render's Starter plan ($7/month per service) = $28/month total
**Option C:** Use auto-sleep for non-critical services (saves hours)

**Recommended:** Use auto-sleep for non-critical services:
- Gateway: Keep awake (critical, handles all traffic)
- API-Auth: Keep awake (critical, handles authentication)
- Tenant: Can sleep after 15 minutes of inactivity (saves ~500 hours)
- Notifications: Can sleep (saves another ~500 hours)

This reduces needed hours from 3,000 to approximately 1,500 hours (still more than 750). We'll need at least 2 Render accounts or use the Starter plan for critical services.

## 3. Step-by-Step Deployment Plan

### Phase 1: Frontend Deployment to Vercel
1. **Connect GitHub repository to Vercel**
2. **Configure landlord app:**
   - Root directory: `webapps/landlord`
   - Build command: `npm run build`
   - Output directory: `.next`
   - Environment variables:
     ```
     NEXT_PUBLIC_GATEWAY_URL=https://api.rentroo.sensibleanalytics.co
     NEXT_PUBLIC_BASE_PATH=/landlord
     ```
3. **Configure tenant app:**
   - Root directory: `webapps/tenant`
   - Build command: `npm run build`
   - Output directory: `.next`
   - Environment variables:
     ```
     NEXT_PUBLIC_GATEWAY_URL=https://api.rentroo.sensibleanalytics.co
     NEXT_PUBLIC_BASE_PATH=/tenant
     ```
4. **Configure custom domains:**
   - `landlord.rentroo.sensibleanalytics.co`
   - `tenant.rentroo.sensibleanalytics.co`

### Phase 2: Database Setup
1. **Create MongoDB Atlas M0 cluster:**
   - Region: Same as Render services
   - Create database user
   - Whitelist Render service IPs (0.0.0.0/0 for simplicity, or specific IPs)
   - Get connection string: `mongodb+srv://<user>:<pass>@cluster.mongodb.net/rentroo`
2. **Set up Upstash Redis (optional, can use Render Redis):**
   - Create free Upstash Redis instance
   - Get connection details

### Phase 3: Backend Service Deployment to Render
1. **Create Render account(s)**
2. **Deploy each service using render.yaml configuration**

#### Service Configuration Files:
- Each service needs a `Dockerfile` (already exists)
- Each service needs a `render.yaml` or manual configuration

#### Render Configuration (render.yaml):
```yaml
services:
  # Gateway Service
  - type: web
    name: rentroo-gateway
    runtime: docker
    dockerfilePath: services/gateway/Dockerfile
    dockerContext: .
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 8080
      - key: API_URL
        fromService:
          name: rentroo-api
          property: host
      - key: AUTHENTICATOR_URL
        fromService:
          name: rentroo-api  # Combined with API
      - key: EMAILER_URL
        fromService:
          name: rentroo-notifications
      - key: PDFGENERATOR_URL
        fromService:
          name: rentroo-notifications
      - key: TENANTAPI_URL
        fromService:
          name: rentroo-tenant
      - key: LANDLORD_FRONTEND_URL
        value: https://landlord.rentroo.sensibleanalytics.co
      - key: TENANT_FRONTEND_URL
        value: https://tenant.rentroo.sensibleanalytics.co
      - key: APP_DOMAIN
        value: rentroo.sensibleanalytics.co
      - key: CORS_ENABLED
        value: "true"
      - key: ALLOWED_ORIGINS
        value: https://landlord.rentroo.sensibleanalytics.co,https://tenant.rentroo.sensibleanalytics.co
    plan: free  # or starter for $7/mo
```

### Phase 4: Authentication Migration
1. **Create Clerk application**
2. **Configure Clerk:**
   - Add domains: `landlord.rentroo.sensibleanalytics.co`, `tenant.rentroo.sensibleanalytics.co`
   - Enable email/password authentication
   - Configure JWT templates
3. **Update API services:**
   - Replace JWT verification with Clerk token verification
   - Use Clerk's backend SDK: `@clerk/backend`
4. **Remove authenticator service** (can be decommissioned)

### Phase 5: Email Service Migration
1. **Create Resend account and API key**
2. **Update emailer service:**
   - Replace SendGrid/Mailgun with Resend SDK
   - Configure sender domain in Resend
   - Update email templates if needed
3. **Set environment variables:**
   ```
   RESEND_API_KEY=re_***
   EMAIL_FROM=noreply@rentroo.sensibleanalytics.co
   ```

### Phase 6: DNS Configuration
1. **Configure DNS records:**
   ```
   landlord.rentroo.sensibleanalytics.co. → CNAME landlord.vercel-dns.com.
   tenant.rentroo.sensibleanalytics.co. → CNAME tenant.vercel-dns.com.
   api.rentroo.sensibleanalytics.co. → CNAME rentroo-gateway.onrender.com.
   *.rentroo.sensibleanalytics.co. → CNAME rentroo-gateway.onrender.com.
   ```
2. **Verify SSL certificates** (Vercel and Render provide automatic SSL)

### Phase 7: E2E Testing and Verification
1. **Run health checks:**
   ```bash
   curl -s https://api.rentroo.sensibleanalytics.co/health
   curl -s https://landlord.rentroo.sensibleanalytics.co
   curl -s https://tenant.rentroo.sensibleanalytics.co
   ```
2. **Execute E2E tests:**
   ```bash
   ./scripts/run-e2e.sh https://api.rentroo.sensibleanalytics.co
   ```

## 4. Cost Analysis

### Free Tier Only (MVP):
| Service | Cost | Limitations |
|---------|------|-------------|
| Vercel (Frontend) | $0 | Unlimited deploys, 100GB bandwidth |
| Render (4 services) | $0 | 750 hrs total (need ~1,500 hrs) |
| MongoDB Atlas M0 | $0 | 512MB storage, no backups |
| Clerk | $0 | 10,000 MAU |
| Cloudflare R2 | $0 | 10GB storage |
| Resend | $0 | 3,000 emails/month |
| **Total** | **$0** | **Not sustainable due to hour limit** |

### Minimum Viable Paid (~$28/month):
| Service | Cost | Notes |
|---------|------|-------|
| Vercel | $0 | Free tier sufficient |
| Render (4 services × Starter) | $28 | $7/service, unlimited hours |
| MongoDB Atlas M0 | $0 | Free tier sufficient |
| Clerk | $0 | Free under 10K MAU |
| Cloudflare R2 | $0 | Free tier sufficient |
| Resend | $0 | Free tier sufficient |
| **Total** | **$28/month** | **Sustainable for production** |

## 5. Deployment Scripts

### Render Deployment Script:
```bash
#!/bin/bash
# deploy-render.sh
echo "Deploying to Render..."

# This would use Render CLI or API to deploy services
# For now, manual deployment via Render dashboard is recommended

echo "1. Create services on Render dashboard"
echo "2. Connect GitHub repository"
echo "3. Set environment variables"
echo "4. Deploy!"
```

### Environment Configuration for Render:
```env
# .env.render
NODE_ENV=production
PORT=8080

# MongoDB Atlas connection
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/rentroo

# Redis connection (Upstash)
REDIS_URL=rediss://user:pass@redis.upstash.io:6379

# Clerk authentication
CLERK_SECRET_KEY=sk_test_***
CLERK_PUBLISHABLE_KEY=pk_test_***

# Resend email
RESEND_API_KEY=re_***

# Cloudflare R2 storage
R2_ACCOUNT_ID=***
R2_ACCESS_KEY_ID=***
R2_SECRET_ACCESS_KEY=***
R2_BUCKET_NAME=rentroo

# Domain configuration
APP_DOMAIN=rentroo.sensibleanalytics.co
APP_PROTOCOL=https
ALLOWED_ORIGINS=https://landlord.rentroo.sensibleanalytics.co,https://tenant.rentroo.sensibleanalytics.co
```

## 6. Migration Timeline

| Week | Task | Effort |
|------|------|--------|
| 1 | Set up Vercel for frontends | 2-3 hours |
| 1 | Configure MongoDB Atlas | 1 hour |
| 2 | Deploy services to Render | 4-6 hours |
| 2 | Migrate authentication to Clerk | 6-8 hours |
| 3 | Migrate email to Resend | 2-3 hours |
| 3 | Configure Cloudflare R2 | 1-2 hours |
| 4 | DNS configuration and testing | 2-3 hours |
| 4 | E2E testing and verification | 4-6 hours |
| **Total** | | **18-26 hours** |

## 7. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Render hour limit exceeded | Service outages | Use auto-sleep, monitor usage, upgrade to Starter |
| MongoDB Atlas M0 too small | Performance issues | Monitor usage, plan upgrade to M2 |
| Clerk MAU limit reached | Authentication failures | Monitor usage, upgrade to Pro |
| Email limit exceeded | Emails not sent | Monitor usage, upgrade plan |

## 8. Rollback Plan
- Keep Google Cloud deployment running during migration
- Switch DNS back if issues occur
- Maintain database backups in both locations

## Next Steps:
1. Set up Vercel and deploy frontends
2. Create Render account and deploy services
3. Migrate authentication to Clerk
4. Configure email service (Resend)
5. Run E2E tests and verify deployment