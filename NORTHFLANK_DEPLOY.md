# Northflank Deployment Guide for Rentrooo

## Prerequisites
- Northflank account (https://app.northflank.com)
- GitHub repository connected: https://github.com/Sensible-Analytics/rentrooo

## Step-by-Step Deployment

### Step 1: Create Project (via Web UI)
1. Login to https://app.northflank.com
2. Click "Create Project"
3. Name: `rentrooo` (or use existing)
4. Region: Select nearest region

### Step 2: Create MongoDB Addon
1. Go to "Addons" → "Create Addon"
2. Select "MongoDB"
3. Name: `mongodb`
4. Plan: Free tier or paid based on needs
5. Wait for deployment

### Step 3: Create Redis Addon
1. Go to "Addons" → "Create Addon"
2. Select "Redis"
3. Name: `redis`
4. Plan: Free tier
5. Wait for deployment

### Step 4: Deploy Gateway Service
1. Go to "Services" → "Create Service" → "Combined Service"
2. Name: `gateway`
3. Build Settings:
   - Repository: `https://github.com/Sensible-Analytics/rentrooo`
   - Branch: `main`
   - Build Type: Dockerfile
   - Dockerfile Path: `services/gateway/Dockerfile`
4. Deployment Plan: `nf-compute-50` (1 vCPU, 1GB RAM)
5. Ports: Add port 8080 (HTTP)
6. Environment Variables:
   ```
   NODE_ENV=production
   PORT=8080
   API_URL=http://api:3001
   AUTHENTICATOR_URL=http://authenticator:3002
   EMAILER_URL=http://emailer:3003
   PDFGENERATOR_URL=http://pdfgenerator:3004
   ```
7. Click "Create"

### Step 5: Deploy API Service
1. Create Combined Service
2. Name: `api`
3. Build Settings:
   - Repository: Same as above
   - Dockerfile Path: `services/api/Dockerfile`
4. Deployment Plan: `nf-compute-50`
5. Environment Variables:
   ```
   NODE_ENV=production
   PORT=3001
   MONGO_URL=<from mongodb addon>
   REDIS_URL=<from redis addon>
   REDIS_PASSWORD=<from redis addon>
   AUTHENTICATOR_ACCESS_TOKEN_SECRET=<generate>
   AUTHENTICATOR_REFRESH_TOKEN_SECRET=<generate>
   AUTHENTICATOR_RESET_TOKEN_SECRET=<generate>
   CIPHER_KEY=<generate>
   CIPHER_IV_KEY=<generate>
   ```

### Step 6: Deploy Other Services
Repeat for:
- **authenticator**: `services/authenticator/Dockerfile`, port 3002
- **emailer**: `services/emailer/Dockerfile`, port 3003
- **pdfgenerator**: `services/pdfgenerator/Dockerfile`, port 3004

### Step 7: Configure Environment Variables
Generate secrets for:
```bash
# Run this locally to generate secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Required secrets:
- `AUTHENTICATOR_ACCESS_TOKEN_SECRET`
- `AUTHENTICATOR_REFRESH_TOKEN_SECRET`
- `AUTHENTICATOR_RESET_TOKEN_SECRET`
- `CIPHER_KEY`
- `CIPHER_IV_KEY`

### Step 8: Deploy Frontend to Vercel
1. Go to https://vercel.com
2. Import GitHub repository
3. Select `webapps/landlord`
4. Framework: Next.js
5. Build Command: `yarn build`
6. Environment Variables:
   ```
   NEXT_PUBLIC_APP_NAME=Rentrooo
   NEXT_PUBLIC_GATEWAY_URL=<northflank gateway url>
   ```
7. Deploy
8. Repeat for `webapps/tenant`

## Northflank CLI Commands

If you prefer CLI after initial setup:

```bash
# Login
northflank login

# List projects
northflank list project

# Set context
northflank context --project rentrooo

# List services
northflank list service

# View service logs
northflank get service gateway --project rentrooo
```

## Estimated Costs

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| Gateway | nf-compute-50 | $12 |
| API | nf-compute-50 | $12 |
| Authenticator | nf-compute-50 | $12 |
| Emailer | nf-compute-50 | $12 |
| PDF Generator | nf-compute-50 | $12 |
| MongoDB | Free tier | $0 |
| Redis | Free tier | $0 |
| **Total** | | **$60/month** |

## Troubleshooting

### Service won't start
- Check environment variables are set
- Verify MongoDB/Redis addons are running
- Check service logs in Northflank dashboard

### Build fails
- Verify Dockerfile path is correct
- Check repository is accessible
- Review build logs for errors

### Can't connect to database
- Verify MONGO_URL and REDIS_URL are correct
- Check if addons are in same project
- Ensure credentials are correct

## Support

- Northflank Docs: https://northflank.com/docs
- Northflank Support: support@northflank.com
- Project Repo: https://github.com/Sensible-Analytics/rentrooo