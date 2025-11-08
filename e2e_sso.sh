#!/usr/bin/env bash
set -euo pipefail

ts=$(date +%s)
email="hosteladmin+${ts}@example.com"
echo "Registering $email"

curl -s -X POST http://localhost:4000/api/faculty/register \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Test\",\"lastName\":\"Admin\",\"email\":\"$email\",\"password\":\"Passw0rd!\",\"designation\":\"Hostel Administrator\"}" -o /tmp/register.json -w "\nHTTP_STATUS:%{http_code}\n"
echo "Register response:"; cat /tmp/register.json

# login
curl -s -X POST http://localhost:4000/api/faculty/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$email\",\"password\":\"Passw0rd!\"}" -o /tmp/login.json -w "\nHTTP_STATUS:%{http_code}\n"
echo "Login response:"; cat /tmp/login.json

token=$(jq -r '.data.token // .token // .data.token' /tmp/login.json || true)
echo "Got token: ${token:0:40}..."

echo "Requesting redirect URL from CMS"
curl -s -X POST http://localhost:4000/api/sso/redirect \
  -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" -d '{}' -o /tmp/redirect.json -w "\nHTTP_STATUS:%{http_code}\n"
echo "Redirect response:"; cat /tmp/redirect.json
redirect=$(jq -r '.redirectUrl' /tmp/redirect.json)
echo "redirectUrl=$redirect"

echo "Calling HMS accept URL (capture cookies)"
curl -s -i -c /tmp/cookies.txt "$redirect" -o /tmp/sso_follow.html
echo "Saved cookies to /tmp/cookies.txt"
echo "Cookies file:"; cat /tmp/cookies.txt

echo "Calling HMS /api/auth/me with cookies"
curl -s -b /tmp/cookies.txt http://localhost:5000/api/auth/me -o /tmp/me.json -w "\nHTTP_STATUS:%{http_code}\n"
echo "--- /tmp/me.json ---"; cat /tmp/me.json; echo "--- end ---"