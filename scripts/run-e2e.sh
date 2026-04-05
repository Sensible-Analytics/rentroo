#!/bin/bash
set -e

LANDLORD_URL=${1:-"https://landlord.rentroo.sensibleanalytics.co"}
GATEWAY_URL=${2:-"https://api.rentroo.sensibleanalytics.co"}
echo "Running e2e tests with:"
echo "  Landlord: $LANDLORD_URL"
echo "  Gateway: $GATEWAY_URL"

cd e2e

# Set environment variables for Cypress
export LANDLORD_APP_URL="$LANDLORD_URL"
export GATEWAY_URL="$GATEWAY_URL"

if [ ! -d "node_modules" ]; then
    echo "Installing Cypress dependencies..."
    npm ci
fi

echo "Starting Cypress tests..."
npx cypress run \
    --config baseUrl="$LANDLORD_URL" \
    --browser chrome \
    --headless \
    --record false \
    --spec "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}"

echo "E2E tests completed."