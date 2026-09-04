# Jarvis Legal Enterprise — Command Center

Production control repository for Jarvis Legal Enterprise.

## Current production backend
- Supabase project: `idpneeyysraraznqmiio`
- Region: `us-east-1`
- Production Edge Function: `chairman-app`
- Security baseline: JWT verification enabled; entitlement RLS hardened; privileged helper RPC execution revoked from client roles.

## Backup strategy
The repository includes an encrypted daily logical-backup workflow at `.github/workflows/supabase-encrypted-backup.yml`.

Required GitHub Actions secrets:
- `SUPABASE_DB_URL` — Supabase session-pooler or direct PostgreSQL connection string with backup privileges.
- `BACKUP_ENCRYPTION_PASSWORD` — long random password used only for backup encryption.

The workflow never commits database dumps to Git. It encrypts the dump before uploading it as a GitHub Actions artifact.

## Restore
Download an encrypted backup artifact, decrypt it locally, then restore with `pg_restore` to an approved recovery target. Never test restores directly against production first.

## Security
Do not commit service-role keys, database passwords, Stripe secrets, API keys, or backup encryption passwords to this repository.
