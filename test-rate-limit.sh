#!/bin/bash

# Rate Limiting Test Script
# This script tests the IP-based rate limiting functionality

echo "================================================"
echo "Skills Marketplace - Rate Limiting Test Script"
echo "================================================"
echo ""

# Configuration
BASE_URL="${BASE_URL:-http://localhost:3000}"
SEARCH_ENDPOINT="${BASE_URL}/api/skills/search"

echo "Testing URL: ${BASE_URL}"
echo ""

# Test 1: Search endpoint rate limit (60 requests per minute)
echo "Test 1: Testing search endpoint rate limit (60 requests/minute)"
echo "----------------------------------------------------------------"
echo "Sending 65 requests to search endpoint..."
echo ""

SUCCESS_COUNT=0
RATE_LIMITED_COUNT=0

for i in {1..65}; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${SEARCH_ENDPOINT}?q=test")
  
  if [ "$HTTP_CODE" = "200" ]; then
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    echo -n "."
  elif [ "$HTTP_CODE" = "429" ]; then
    RATE_LIMITED_COUNT=$((RATE_LIMITED_COUNT + 1))
    echo -n "X"
  else
    echo -n "?"
  fi
  
  # Brief pause to avoid overwhelming the system
  sleep 0.1
done

echo ""
echo ""
echo "Results:"
echo "  Successful requests (200): ${SUCCESS_COUNT}"
echo "  Rate limited (429): ${RATE_LIMITED_COUNT}"
echo ""

if [ $RATE_LIMITED_COUNT -gt 0 ]; then
  echo "✅ PASS: Rate limiting is working correctly"
  echo "   (Got ${RATE_LIMITED_COUNT} rate limit responses as expected)"
else
  echo "⚠️  WARNING: No rate limiting detected"
  echo "   (This could be because the test ran too slowly)"
fi

echo ""
echo "================================================"
echo "Test complete!"
echo "================================================"
echo ""
echo "To test other endpoints manually:"
echo "  - Upload (10 req/10 min): curl -X POST ${BASE_URL}/api/skills/upload"
echo "  - Download (30 req/min): curl ${BASE_URL}/api/skills/[id]/download"
echo "  - Details (60 req/min): curl ${BASE_URL}/api/skills/[id]"
echo ""
