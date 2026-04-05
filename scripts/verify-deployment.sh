#!/bin/bash
set -e

echo "Verifying Rentroo deployment..."

BASE_URL=${1:-"https://api.rentroo.sensibleanalytics.co"}
echo "Using base URL: $BASE_URL"

echo "1. Checking gateway health..."
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health" || echo "000")
if [ "$HEALTH_STATUS" = "200" ]; then
    echo "✓ Gateway health check passed"
else
    echo "✗ Gateway health check failed (HTTP $HEALTH_STATUS)"
    exit 1
fi

echo "2. Checking landlord frontend..."
LANDLORD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/landlord" || echo "000")
if [ "$LANDLORD_STATUS" = "200" ]; then
    echo "✓ Landlord frontend accessible"
else
    echo "✗ Landlord frontend not accessible (HTTP $LANDLORD_STATUS)"
fi

echo "3. Checking tenant frontend..."
TENANT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/tenant" || echo "000")
if [ "$TENANT_STATUS" = "200" ]; then
    echo "✓ Tenant frontend accessible"
else
    echo "✗ Tenant frontend not accessible (HTTP $TENANT_STATUS)"
fi

echo "4. Running E2E tests..."
cd e2e
if [ ! -d "node_modules" ]; then
    echo "Installing Cypress dependencies..."
    npm ci
fi

export GATEWAY_BASEURL="$BASE_URL"
export LANDLORD_APP_URL="${BASE_URL}/landlord"
export TENANT_APP_URL="${BASE_URL}/tenant"

npx cypress run \
    --config baseUrl="${BASE_URL}/landlord" \
    --browser chrome \
    --headless \
    --record false \
    --spec "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}"

echo "5. Deployment verification complete!"
echo "All critical checks passed. The deployment is operational."