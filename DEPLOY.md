# Rentrooo Deployment Configuration

## Overview
This repository contains the Rentrooo property management platform with support for multiple deployment targets.

## Quick Deploy Options

### Option 1: Docker Compose (Recommended for Self-Hosting)
```bash
# Copy environment file
cp .env.example .env
# Edit .env with your values
nano .env

# Deploy everything
docker-compose up -d
```

### Option 2: Railway (Managed Platform)
1. Connect GitHub repo to Railway
2. Add MongoDB and Redis plugins
3. Deploy all services

### Option 3: Render (PaaS)
1. Use `render.yaml` for infrastructure-as-code
2. Connect GitHub repository
3. Automatic deploy on push

### Option 4: VPS (DigitalOcean, Hetzner, AWS)
1. Provision VPS with Docker
2. Clone repository
3. Run docker-compose

## Environment Variables

### Required
- `MONGO_URL` - MongoDB connection string
- `REDIS_URL` - Redis connection string
- `AUTHENTICATOR_ACCESS_TOKEN_SECRET` - JWT secret
- `AUTHENTICATOR_REFRESH_TOKEN_SECRET` - JWT refresh secret
- `AUTHENTICATOR_RESET_TOKEN_SECRET` - Password reset secret
- `CIPHER_KEY` - Encryption key
- `CIPHER_IV_KEY` - Encryption IV

### Optional
- `LANDLORD_APP_URL` - Frontend URL
- `TENANT_APP_URL` - Tenant portal URL
- `EMAIL_FROM` - Email sender address
- `MAILGUN_API_KEY` - Mailgun API key (if using Mailgun)

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Landlord UI   │     │   Tenant UI     │
│   (Next.js)     │     │   (Next.js)     │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
              ┌──────▼──────┐
              │   Gateway   │
              │   (Proxy)   │
              └──────┬──────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────▼────┐ ┌────▼────┐ ┌────▼────┐
   │   API   │ │  Auth   │ │  Email  │
   └─────────┘ └─────────┘ └─────────┘
        │
   ┌────▼────────┐
   │ PDF Generator│
   └─────────────┘
```

## Service Ports
- Gateway: 8080
- API: 3001
- Authenticator: 3002
- Emailer: 3003
- PDF Generator: 3004

## Demo
Visit `/demo` on the Landlord UI for a terminal-style demo page.

## GitHub Repository
https://github.com/Sensible-Analytics/rentrooo