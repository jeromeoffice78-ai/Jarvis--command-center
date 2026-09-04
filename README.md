# Jarvis Legal Enterprise — Command Center

Production control repository for Jarvis Legal Enterprise.

## Current production backend
- Supabase project: `idpneeyysraraznqmiio`
- Region: `us-east-1`
- PostgreSQL: 17
- Production Edge Function: `chairman-app`
- Security baseline: JWT verification enabled; entitlement RLS hardened; privileged helper RPC execution revoked from client roles.
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

Supabase Auth currently reports leaked-password protection as disabled. Enable it in the Supabase Auth password-security settings before broad external user onboarding.
