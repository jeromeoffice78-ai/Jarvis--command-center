# Jarvis Legal Enterprise — Command Center

Production control repository for Jarvis Legal Enterprise.

## Current production backend
- Supabase project: `idpneeyysraraznqmiio`
- Region: `us-east-1`
- PostgreSQL: 17
- Production Edge Functions:
  - `chairman-app` — Chairman command center, JWT verification enabled.
  - `password-guard` — breached-password enforcement gateway for signup and password changes.
  - `account-portal` — public secure account UI for signup, sign-in, password changes, session refresh, and sign-out.
- Security baseline: entitlement RLS hardened; privileged helper RPC execution revoked from client roles.
- Database hardening: covering indexes added for previously unindexed public foreign keys.
- RLS performance: repeated `auth.uid()` / role lookups in flagged policies converted to initialization-plan-safe expressions.
- Current public schema: 26 tables.

## Database migrations
Production migrations are tracked under `supabase/migrations/` as they are applied.

Recent hardening migrations:
- `20260904223801_index_all_unindexed_public_foreign_keys.sql`
- `20260904223828_optimize_rls_auth_initialization.sql`

## Backup strategy
The repository includes an encrypted daily logical-backup workflow at `.github/workflows/supabase-encrypted-backup.yml`.

Required GitHub Actions secrets:
- `SUPABASE_DB_URL` — Supabase session-pooler or direct PostgreSQL connection string with backup privileges.
- `BACKUP_ENCRYPTION_PASSWORD` — long random password used only for backup encryption.

The workflow never commits database dumps to Git. It encrypts the dump before uploading it as a GitHub Actions artifact.

The restore drill decrypts the archive, restores portable pre-data and table data into an isolated PostgreSQL 17 container, and fails if no public tables are recovered. The latest validation restored all 26 public tables successfully.

## Restore
Download an encrypted backup artifact, decrypt it locally, then restore with `pg_restore` to an approved recovery target. Never test restores directly against production first.

## Security
Do not commit service-role keys, database passwords, Stripe secrets, API keys, or backup encryption passwords to this repository.

### External breached-password protection
Jarvis Legal Enterprise does not depend on Supabase's paid leaked-password protection feature. Compromised-password screening is implemented independently using the Have I Been Pwned Pwned Passwords range API.

The reusable library is `security/pwned-password.mjs`. The production enforcement gateway is `supabase/functions/password-guard/index.ts`.

The integration uses the k-anonymity model: the candidate password is SHA-1 hashed locally, only the first five hash characters are sent to the external range service, and the returned suffixes are compared locally. The full password and complete password hash are not sent to the breach source.

Production password policy:
- 12–128 characters.
- Known breached passwords are rejected.
- HIBP lookup failures fail closed instead of treating an unchecked password as safe.
- Plaintext passwords are never logged or persisted by the password-guard service.

`password-guard` intentionally has platform JWT verification disabled because signup is public and the function performs its own application-key validation. Password-change requests additionally require and validate the caller's user bearer token before forwarding the update to Supabase Auth.

The public `account-portal` routes signup and password changes through `password-guard`, uses a publishable API key only, and keeps session tokens in browser `sessionStorage` rather than persistent local storage.

The external source is monitored by `.github/workflows/pwned-password-source-check.yml`, which validates the integration on changes, on demand, and weekly.
