# Credential Exposure Response

Status: Contained pending owner password rotation

## Incident
A Chairman login password was disclosed in an interactive chat session. The plaintext credential is not stored in this repository and must not be copied into source control, logs, issues, documentation, CI variables, or application code.

## Containment
The Chairman `MASTER_ADMIN` profile was temporarily deactivated at the application authorization layer. `current_app_role()` and `is_master_admin()` both require `profiles.active = true`, so deactivation removes privileged database access through Row Level Security even if the disclosed password is used to authenticate.

## Recovery procedure
1. Use the secure `account-portal` Edge Function to sign in and set a new password.
2. The new password must be 12–128 characters and is screened by `password-guard` against HIBP Pwned Passwords.
3. Do not reuse the disclosed password.
4. After the owner confirms the password was changed successfully, reactivate the Chairman profile.
5. Verify `is_master_admin()` authorization and run the Supabase Security Advisor.

## Security rule
Never persist plaintext passwords or complete password hashes in GitHub, application logs, analytics, support tickets, or documentation. Credentials disclosed in chat are treated as compromised and rotated before privileged access is restored.
