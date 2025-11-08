# SSO Integration (CMS ↔ HMS)

This repository contains an SSO bridge between the College Management System (CMS) and the Hostel Management System (HMS).

Overview
- CMS issues a short-lived, one-time transfer token and provides a redirect URL to the HMS backend.
- The HMS backend calls back to CMS to validate & consume the transfer token (one-time use), then issues an HMS JWT and sets it as an HttpOnly cookie.
- HMS frontend calls `/api/auth/me` to detect the session and load the user.

Required environment variables

CMS (CMS_1-main/backend)
- JWT_SECRET or CMS_JWT_SECRET: the CMS JWT signing secret (used for normal login tokens).
- CMS_SSO_SECRET (optional): secret used to sign transfer tokens. If not set, `JWT_SECRET` is used.
- HMS_API_URL (optional): URL to HMS backend (e.g. `http://localhost:5000`). Used when building redirect URL.

HMS (hms_full_project/backend)
- HMS_JWT_SECRET or JWT_SECRET: secret used to sign HMS JWTs.
- CMS_SSO_SECRET: must match the CMS SSO secret so HMS can verify transfer tokens (if CMS_SSO_SECRET used).
- CMS_API_URL: URL to CMS backend (e.g. `http://localhost:4000`). Used to call `/api/sso/validate-transfer` to consume tokens.
- HMS_FRONTEND_URL: HMS frontend origin (e.g. `http://localhost:5173`). Used to redirect user after SSO.

Frontend
- HMS frontend should set VITE_API_URL (or similar) to point to HMS backend API and must allow credentials.
- In the HMS frontend, axios is configured with `withCredentials = true` so the browser will send cookies.

How it works (sequence)
1. User in CMS clicks "Hostel" or logs in as a Hostel Administrator.
2. CMS creates a transfer JWT with a `jti`, stores a TransferToken record (one-time), and returns a redirect URL: `HMS_BACKEND/api/sso/accept?transfer=<token>`.
3. Browser navigates to that redirect URL.
4. HMS backend receives `transfer` and POSTs it to `CMS/api/sso/validate-transfer` to validate & consume it.
5. CMS marks the transfer token as used and returns payload.
6. HMS issues an HMS JWT, sets it as an HttpOnly cookie (`hms_token`) and redirects browser to `HMS_FRONTEND_URL/sso/complete`.
7. HMS frontend at `/sso/complete` calls `/auth/me` to discover the user session and redirects to dashboard.

Security notes
- Transfer tokens are short-lived (default 60s) and one-time-use (consumed by CMS).
- HMS JWT is set in an HttpOnly cookie to reduce token leakage.
- For production, ensure HTTPS and set `secure: true` for cookies and configure proper `sameSite`/`domain` options.
- Consider adding jti replay-protection logs and monitoring.

Troubleshooting
- If SSO fails with `Transfer validation failed`, check that:
  - `CMS_API_URL` in HMS backend points to the CMS server.
  - `CMS_SSO_SECRET` values match between CMS and HMS (or both use JWT_SECRET).
  - CMS backend has MongoDB running (TransferToken requires DB storage).

Testing locally
- Start CMS backend (port 4000), CMS frontend.
- Start HMS backend (port 5000), HMS frontend (port 5173).
- Create a faculty with designation `Hostel Administrator` in CMS.
- Login in CMS and click "Hostel Admin" — you should be redirected and end up logged in to HMS.

