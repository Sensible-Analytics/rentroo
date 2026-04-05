#!/bin/bash
set -e

# Cloudflare R2 Setup via Wrangler CLI
# Requires: wrangler installed and authenticated (wrangler login)

echo "=== Cloudflare R2 Setup ==="

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "wrangler not found. Install with: npm install -g wrangler"
    exit 1
fi

# Check if authenticated
if ! wrangler whoami &> /dev/null; then
    echo "Not authenticated. Run: wrangler login"
    exit 1
fi

# Configuration
BUCKET_NAME="rentroo"
ACCOUNT_ID=$(wrangler whoami --json | jq -r '.account.id' 2>/dev/null)

if [ -z "$ACCOUNT_ID" ]; then
    echo "Failed to get Cloudflare account ID. Please check authentication."
    exit 1
fi

echo "Creating R2 bucket: $BUCKET_NAME"
wrangler r2 bucket create "$BUCKET_NAME" 2>&1 | grep -q "Created" && echo "Bucket created." || echo "Bucket may already exist."

echo "Generating API tokens..."
# Note: Wrangler does not currently support generating API tokens via CLI.
# You'll need to create API tokens in the Cloudflare dashboard:
# 1. Go to Cloudflare Dashboard → R2 → Manage API Tokens
# 2. Create token with Object Read & Write permissions for the bucket
# 3. Copy Access Key ID and Secret Access Key

echo "=== Setup Complete ==="
echo "Bucket: $BUCKET_NAME"
echo "Account ID: $ACCOUNT_ID"
echo "Region: auto (use 'auto' in R2 configuration)"
echo ""
echo "Manual steps required:"
echo "1. Create API token in Cloudflare dashboard"
echo "2. Add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME to Render environment variables"