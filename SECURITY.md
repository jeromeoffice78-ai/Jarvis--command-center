# Security Policy

## Credential handling

- Never commit plaintext user passwords, database passwords, API secrets, service-role keys, Stripe secret keys, backup-encryption passwords, or refresh/access tokens.
- Public or mobile clients may contain only publishable API keys intended for client distribution.
- Backend secrets must live in provider-managed secret stores or protected CI/CD secrets.
- Do not place secrets in URLs, query parameters, analytics payloads, application logs, screenshots, issue bodies, pull requests, or chat transcripts used as build inputs.
- Browser authentication sessions for the current Chairman and account portals use `sessionStorage`, not persistent `localStorage`.

## Password policy

- New passwords and password changes must pass the `password-guard` service.
- Passwords must be 12–128 characters.
- Known breached passwords are rejected through the Have I Been Pwned Pwned Passwords k-anonymity range service.
- Breach-source failures fail closed.
- Plaintext passwords and complete password hashes must not be logged or persisted by application code.

## Credential exposure response

If any credential is accidentally shared outside its intended authentication field, treat it as potentially exposed:

1. Rotate or change the credential promptly.
2. Revoke stale sessions or keys when supported.
3. Verify the credential is not present in source control, logs, CI artifacts, tickets, or documentation.
4. Replace dependent secrets in production before deleting the old secret when zero-downtime rotation is required.
5. Record only the incident type and remediation status; never record the exposed secret itself.

## Production authorization

Database Row Level Security is the authoritative data-access boundary. The Chairman Command v2 application additionally requires an active `MASTER_ADMIN` profile after user authentication before exposing Chairman controls.

## Reporting

Security issues should be handled privately. Do not open a public issue containing credentials, personal data, exploit details that expose production, or authentication tokens.
