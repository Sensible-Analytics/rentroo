# Production Deployment Plan for Rentroo

## Target Domain: `rentroo.sensibleanalytics.co`

## 1. Compute Infrastructure

### Primary Compute: Google Cloud Free Tier VM
- **Service**: Google Cloud e2-micro always free VM
- **Specs**: 1 vCPU, 1 GB RAM, 30 GB persistent disk
- **Cost**: $0/month (always free)
- **OS**: Ubuntu 22.04 LTS
- **Location**: us-central1 (Iowa)
- **Domain**: `api.rentroo.sensibleanalytics.co` → VM IP

### Frontend Hosting: Vercel
- **Service**: Vercel Hobby Plan (free)
- **Bandwidth**: 100 GB/month
- **SSL**: Automatic
- **Domains**: 
  - `landlord.rentroo.sensibleanalytics.co`
  - `tenant.rentroo.sensibleanalytics.co`

## 2. Database & Caching

### MongoDB Atlas M0 (Free)
- **Storage**: 0.5 GB
- **Connections**: 500 max
- **Throughput**: 100 ops/sec
- **Backup**: None
- **Connection**: `mongodb+srv://<user>:<pass>@cluster0.abc123.mongodb.net/rentroo`

### Redis Cloud (Free)
- **Memory**: 30 MB
- **Connections**: 30
- **Use**: Session storage for authenticator service

## 3. Authentication

### Clerk (Free Tier)
- **MAUs**: 10,000 free
- **Integration**: Replace existing JWT auth with Clerk
- **Benefits**: Pre-built UI, RBAC, organizations
- **Migration**: Keep existing authenticator service but adapt to use Clerk SDK

## 4. Email Service

### Resend (Free Tier)
- **Limit**: 3,000 emails/month (100/day)
- **Integration**: Replace Mailgun/Gmail in emailer service
- **Template**: Use React Email for templates

## 5. File Storage

### Cloudflare R2 (Free Tier)
- **Storage**: 10 GB
- **Egress**: Free
- **Integration**: S3-compatible API for PDF storage

## 6. Domain & DNS Configuration

### DNS Records (via Cloudflare)
```
landlord.rentroo.sensibleanalytics.co. → CNAME landlord.vercel-dns.com.
tenant.rentroo.sensibleanalytics.co.   → CNAME tenant.vercel-dns.com.
api.rentroo.sensibleanalytics.co.      → A <GCP_VM_IP>
*.rentroo.sensibleanalytics.co.        → A <GCP_VM_IP> (for future services)
```

### SSL Certificates
- Vercel: Automatic
- Google Cloud VM: Let's Encrypt via Certbot

## 7. Service Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                         │
│  ┌─────────────────────────┐  ┌─────────────────────────┐ │
│  │ Landlord Dashboard      │  │ Tenant Portal           │ │
│  │ landlord.rentroo.*      │  │ tenant.rentroo.*        │ │
│  └─────────────────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                GCP e2-micro VM (Docker)                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               GATEWAY (Port 8080)                   │   │
│  │    Routes → api, authenticator, emailer, etc.       │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                               │
│       ┌──────────────────────┼──────────────────────┐        │
│       ▼                      ▼                      ▼        │
│ ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│ │ API         │    │ Authenticator│    │ TenantAPI   │    │
│ │ (8200)      │    │ (8000)      │    │ (8250)      │    │
│ └─────────────┘    └─────────────┘    └─────────────┘    │
│       │                    │                    │            │
│       ▼                    ▼                    ▼            │
│ ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│ │ Emailer     │    │ PDFGenerator│    │ ResetService│    │
│ │ (8400)      │    │ (8300)      │    │ (8230)      │    │
│ └─────────────┘    └─────────────┘    └─────────────┘    │
└─────────────────────────────────────────────────────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ MongoDB     │    │ Redis       │    │ Cloudflare  │
│ Atlas M0    │    │ Cloud       │    │ R2          │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 8. Deployment Steps

### Phase 1: Google Cloud VM Setup
1. Create Google Cloud account (free tier)
2. Create e2-micro VM instance
3. Install Docker and Docker Compose
4. Configure firewall (ports 80, 443, 8080)
5. Clone repository to VM
6. Set up systemd service for Docker Compose

### Phase 2: Vercel Deployment
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_GATEWAY_URL=https://api.rentroo.sensibleanalytics.co`
   - `NEXT_PUBLIC_BASE_PATH=`
3. Deploy both landlord and tenant apps

### Phase 3: Database Setup
1. Create MongoDB Atlas cluster (M0)
2. Create database user
3. Whitelist VM IP address
4. Get connection string

### Phase 4: Service Configuration
1. Create `.env.production` file with:
   - MongoDB connection string
   - Redis connection string
   - Clerk API keys
   - Resend API key
   - R2 credentials
2. Update Docker Compose to use production env

### Phase 5: Domain Configuration
1. Configure DNS records as above
2. Set up SSL certificates on VM
3. Update CORS settings in gateway

### Phase 6: CI/CD Pipeline
1. Set up GitHub Actions for automatic deployment to VM
2. Configure Vercel for automatic frontend deployment

## 9. Environment Variables Template

```bash
# MongoDB
MONGO_URL=mongodb+srv://<user>:<pass>@cluster0.abc123.mongodb.net/rentroo

# Redis
REDIS_URL=redis://:<password>@redis-12345.c123.us-east-1-1.ec2.redns.redis-cloud.com:12345

# Authentication (Clerk)
CLERK_SECRET_KEY=sk_test_***
CLERK_PUBLISHABLE_KEY=pk_test_***

# Email (Resend)
RESEND_API_KEY=re_***

# Storage (R2)
R2_ACCOUNT_ID=***
R2_ACCESS_KEY_ID=***
R2_SECRET_ACCESS_KEY=***
R2_BUCKET_NAME=rentroo

# Application
APP_DOMAIN=rentroo.sensibleanalytics.co
APP_PROTOCOL=https
ALLOWED_ORIGINS=https://landlord.rentroo.sensibleanalytics.co,https://tenant.rentroo.sensibleanalytics.co
```

## 10. Cost Breakdown

| Service | Free Tier | Overage Cost |
|---------|-----------|--------------|
| Google Cloud VM | 1 e2-micro | N/A (always free) |
| Vercel | 100 GB bandwidth | $20/month |
| MongoDB Atlas M0 | 0.5 GB storage | $9/month (M2) |
| Clerk | 10,000 MAUs | $0.02/MAU |
| Resend | 3,000 emails | $20/month (50K) |
| Cloudflare R2 | 10 GB storage | $0.015/GB |
| **Total at Scale** | **$0** | **~$50-100/month** |

## 11. Monitoring & Alerts

### Health Checks
- Gateway: `https://api.rentroo.sensibleanalytics.co/health`
- Each service: Individual health endpoints

### Uptime Monitoring
- Use UptimeRobot (free) for basic monitoring
- Set up alerts for downtime

### Logging
- Use Google Cloud Logging (free tier includes 50 GB)
- Centralize Docker logs

## 12. Backup Strategy

### MongoDB
- Manual `mongodump` daily to Cloud Storage
- Store backups in Cloudflare R2 (10 GB free)

### Application Data
- Document volume in Docker Compose for persistent storage
- Regular snapshots of VM disk

## 13. Security Considerations

1. **Secrets Management**: Use Google Secret Manager or encrypted env files
2. **Network Security**: Restrict VM firewall to required ports only
3. **Database Security**: IP whitelisting, strong passwords
4. **SSL/TLS**: Enforce HTTPS everywhere
5. **CORS**: Configure allowed origins strictly

## 14. Rollback Plan

1. Keep previous Docker image tags
2. Use Docker Compose `--scale` for zero-downtime deployments
3. Maintain database backups for point-in-time recovery

## 15. Post-Deployment Verification

### Automated Tests
- Run e2e tests against deployed environment
- Verify all health endpoints return 200
- Test critical user flows

### Manual Verification
- Access landlord and tenant portals
- Create test property, tenant, lease
- Send test email
- Generate test PDF invoice

---

**Next Steps**: Implement this plan by creating deployment scripts, Docker configurations, and CI/CD pipelines.