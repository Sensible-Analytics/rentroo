#!/bin/bash
set -e

# MongoDB Atlas Setup via CLI
# Requires: mongocli installed and authenticated
# Run: mongocli auth login --browser

echo "=== MongoDB Atlas Setup ==="

# Check if mongocli is installed
if ! command -v mongocli &> /dev/null; then
    echo "mongocli not found. Install with: npm install -g mongocli"
    exit 1
fi

# Check if authenticated
if ! mongocli whoami &> /dev/null; then
    echo "Not authenticated. Run: mongocli auth login --browser"
    exit 1
fi

# Configuration
PROJECT_NAME="rentroo"
CLUSTER_NAME="rentroo-cluster"
REGION="US_EAST_1"  # Choose region closest to your users
CLUSTER_TIER="M0"   # Free tier

echo "Creating project: $PROJECT_NAME"
PROJECT_ID=$(mongocli atlas projects create "$PROJECT_NAME" --output json | jq -r '._id' 2>/dev/null || echo "")

if [ -z "$PROJECT_ID" ]; then
    echo "Project already exists or creation failed. Getting existing project ID..."
    PROJECT_ID=$(mongocli atlas projects list --output json | jq -r '.results[] | select(.name=="'$PROJECT_NAME'") | ._id' 2>/dev/null)
fi

if [ -z "$PROJECT_ID" ]; then
    echo "Failed to get project ID. Please create manually."
    exit 1
fi

echo "Project ID: $PROJECT_ID"

echo "Creating free M0 cluster: $CLUSTER_NAME"
mongocli atlas clusters create "$CLUSTER_NAME" \
    --projectId "$PROJECT_ID" \
    --tier "$CLUSTER_TIER" \
    --region "$REGION" \
    --backup \
    --output json

echo "Waiting for cluster to provision..."
sleep 30

echo "Creating database user..."
mongocli atlas dbusers create "rentroo-user" \
    --projectId "$PROJECT_ID" \
    --password "$(openssl rand -base64 16)" \
    --role "readWriteAnyDatabase"

echo "Whitelisting IP 0.0.0.0/0 (allow all - for development)..."
mongocli atlas accesslist create "0.0.0.0/0" \
    --projectId "$PROJECT_ID"

echo "Getting connection string..."
CONNECTION_STRING=$(mongocli atlas clusters describe "$CLUSTER_NAME" \
    --projectId "$PROJECT_ID" \
    --output json | jq -r '.connectionStrings.standard' 2>/dev/null)

echo "=== Setup Complete ==="
echo "Connection String: $CONNECTION_STRING"
echo "Add this as MONGO_URL in Render environment variables."