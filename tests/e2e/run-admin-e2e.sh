#!/bin/bash
# Builds the site with the test settings, starts the Supabase stand-in and the site, then runs the
# browser test. Anything left running from an earlier run is stopped first, so the test always
# talks to the build it has just made.
set -u
cd "$(dirname "$0")/../.."

stop_leftovers() {
  pkill -9 -f "[n]ext-server" 2>/dev/null
  pkill -9 -f "[n]ext start" 2>/dev/null
  pkill -9 -f "[m]ock-supabase" 2>/dev/null
  sleep 2
}

stop_leftovers

export MOCK_PORT=54399 PORT=3801 NEXT_TELEMETRY_DISABLED=1
export ADMIN_EMAIL='admin@hkbk.test'
export ADMIN_PASSWORD='Correct-Horse-7'
export ADMIN_PASSWORD_HASH='$2b$10$hXlI3HhKo8V638f0HvSf1eBaNuSmwzDI6KTFXBWi/3vZvDTkvQbSG'
export SESSION_SECRET='test-session-secret-0123456789abcdef0123456789'
export NEXT_PUBLIC_SUPABASE_URL='http://127.0.0.1:54399'
export NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY='publishable-test'
export SUPABASE_SECRET_KEY='secret-test'
export BASE="http://localhost:$PORT" MOCK="http://127.0.0.1:$MOCK_PORT"
export PHOTO="$PWD/public/images/champions/aryalekshmi.jpg"
export CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome

node tests/e2e/mock-supabase.mjs > /tmp/mock.log 2>&1 &
MOCK_PID=$!
sleep 1

rm -rf .next
if ! npx next build > /tmp/build-e2e.log 2>&1; then
  echo "BUILD FAILED"; tail -40 /tmp/build-e2e.log; stop_leftovers; exit 1
fi

npx next start -p "$PORT" > /tmp/start-e2e.log 2>&1 &
sleep 7
if grep -q EADDRINUSE /tmp/start-e2e.log; then
  echo "SERVER DID NOT START: port $PORT in use"; stop_leftovers; exit 1
fi

python3 tests/e2e/admin-e2e.py
RC=$?
stop_leftovers
exit $RC
