# ADR 0001 — Independent breached-password screening

Status: Accepted
Date: 2026-09-04

## Decision

Jarvis Legal Enterprise will keep Supabase as the current production database and authentication system, but it will not depend on Supabase's paid leaked-password-protection feature.

Breached-password screening is owned by the application security layer and uses the Have I Been Pwned Pwned Passwords range API through `security/pwned-password.mjs`.

## Why

- The current Supabase database is active, hardened, backed up, and already contains the production legal-enterprise schema.
- Replacing the entire backend only to obtain leaked-password screening would create unnecessary migration risk, downtime risk, authentication migration complexity, and data-integrity risk.
- The HIBP range protocol provides an independent source and uses k-anonymity: only a five-character SHA-1 prefix is sent to the external service.
- This keeps the breached-password control portable if the authentication provider changes later.

## Enforcement requirement

`enforceSafePassword()` must execute before every user signup and password-change operation controlled by the application. A `COMPROMISED_PASSWORD` result must block the operation.

The application must not log, persist, transmit to analytics, or commit plaintext passwords or complete password hashes.

## Availability behavior

A failure of the HIBP source must be treated as a security-service failure, not as proof that a password is safe. Production signup/password-change flows should fail closed or require an explicit administrative override with audit logging.

## Migration boundary

This decision does not prevent a later migration away from Supabase. Any future backend migration must be treated as a separate project with database export/import validation, authentication-user migration, session invalidation planning, rollback, and cutover testing.

## Current architecture

- Database: Supabase PostgreSQL 17
- Authentication: Supabase Auth
- Breached-password source: HIBP Pwned Passwords
- Source control / CI: GitHub
- Encrypted database backup: GitHub Actions
