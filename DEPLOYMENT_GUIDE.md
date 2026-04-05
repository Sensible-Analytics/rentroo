# Rentroo Production Deployment Guide

## Prerequisites

1. Google Cloud account with Free Tier eligibility
2. Domain `rentroo.sensibleanalytics.co` with DNS control
3. GitHub account for repository and secrets
4. Resend account for email service
5. Cloudflare account for R2 storage (optional)

## Step 1: Google Cloud VM Setup

1. Create a new Google Cloud project (or use existing)
2. Enable Compute Engine API
3. Create an e2-micro VM instance in us-central1 region
   - Boot disk: Ubuntu 22.04 LTS
   - Firewall: Allow HTTP, HTTPS, and SSH
4. Note the external IP address
5. Create SSH key pair and add to VM metadata

## Step 2: Domain Configuration

Add DNS records at your registrar or Cloudflare:

```
landlord.rentroo.sensibleanalytics.co. → CNAME landlord.vercel-dns.com.
tenant.rentroo.sensibleanalytics.co.   → CNAME tenant.vercel-dns.com.
api.rentroo.sensibleanalytics.co.      → A <VM_IP>
*.rentroo.sensibleanalytics.co.        → A <VM_IP>
```

## Step 3: Vercel Deployment

1. Connect GitHub repository to Vercel
2. Deploy both `webapps/landlord` and `webapps/tenant`
3. Configure environment variables in Vercel:
   - `NEXT_PUBLIC_GATEWAY_URL=https://api.rentroo.sensibleanalytics.co`
   - `NEXT_PUBLIC_BASE_PATH=`

## Step 4: MongoDB Atlas Setup

1. Create free M0 cluster
2. Create database user
3. Whitelist VM IP address
4. Get connection string

## Step 5: Service Configuration

1. Clone repository to VM:
   ```bash
   git clone https://github.com/sensible-analytics/rentroo.git
   cd rentroo
   ```

2. Create `.env` file from template:
   ```bash
   cp .env.production.gcp .env
   ```

3. Fill in all required values (see `.env.production.gcp` for reference)

4. Generate secure secrets:
   ```bash
   # Generate random passwords
   sed -i "s/generate_secure_password_here/$(openssl rand -hex 16)/" .env
   sed -i "s/generate_32_char_hex/$(openssl rand -hex 32)/" .env
   sed -i "s/generate_16_char_hex/$(openssl rand -hex 16)/" .env
   ```

## Step 6: Deploy Services

1. Install Docker if not present:
   ```bash
   ./scripts/setup-vm.sh
   sudo reboot
   ```

2. Deploy using Docker Compose:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

3. Verify deployment:
   ```bash
   curl -f http://localhost:8080/health
   ```

## Step 7: SSL Certificates

Caddy automatically obtains SSL certificates. Verify with:
```bash
curl -I https://api.rentroo.sensibleanalytics.co/health
```

## Step 8: E2E Testing

Run end-to-end tests:
```bash
./scripts/run-e2e.sh https://rentroo.sensibleanalytics.co
```

## Step 9: Monitoring

1. Set up UptimeRobot for external monitoring
2. Configure Google Cloud Logging for centralized logs
3. Set up alerts for service failures

## Step 10: Backup Strategy

1. Daily MongoDB backups:
   ```bash
   docker compose exec mongo mongodump --gzip --archive=/backup/mongo-$(date +%F).dump
   ```

2. Store backups in Cloudflare R2 or Google Cloud Storage

## Troubleshooting

### Services not starting
```bash
docker compose logs --tail=100
```

### Health check failing
```bash
curl -v http://localhost:8080/health
docker compose ps
```

### Database connection issues
1. Check MongoDB Atlas whitelist
2. Verify connection string in `.env`
3. Ensure network connectivity from VM

### Frontend not loading
1. Check Vercel deployment logs
2. Verify CORS settings in gateway
3. Check browser console for errors

## Scaling Considerations

- Current setup handles ~100 concurrent users
- For growth, consider:
  - Upgrading Google Cloud VM
  - Using managed MongoDB (M2 tier)
  - Adding Redis cache
  - Implementing CDN for static assets

## Cost Monitoring

| Service | Free Tier | Overage Cost |
|---------|-----------|--------------|
| Google Cloud VM | Always free | N/A |
| Vercel | 100GB bandwidth | $20/month |
| MongoDB Atlas M0 | 0.5GB storage | $9/month (M2) |
| Resend | 3,000 emails | $20/month (50K) |
| Cloudflare R2 | 10GB storage | $0.015/GB |

## Security Checklist

- [ ] All secrets are environment variables, not hardcoded
- [ ] MongoDB uses strong passwords
- [ ] Redis requires authentication
- [ ] CORS restricted to frontend domains only
- [ ] SSL certificates valid and auto-renewing
- [ ] Firewall only exposes necessary ports
- [ ] Regular security updates scheduled

## Support

For issues:
1. Check deployment logs
2. Review application logs
3. Open GitHub issue with error details
4. Contact development team