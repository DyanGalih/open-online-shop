# Technical Implementation Plan: E2E Identity & Customer Lifecycle (`specs/017-e2e-identity`)

## Architectural Strategy
Implement a robust, isolated, and parallel-safe Playwright test suite in `tests/e2e/identity.spec.ts` covering authentication entrypoints, user registration, credential validation, session invalidation, magic link request, passkey UI elements, password recovery, two-factor authentication challenge, and email verification notice.

## Component Design & Scenarios

### 1. Test Suite Architecture (`tests/e2e/identity.spec.ts`)
- **Isolation:** Each test runs in an independent browser context with empty cookies and isolated storage.
- **Fixture Provisioning:**
  - Idempotent creation of a pre-existing user with two-factor authentication enabled for the 2FA challenge test (`User::factory()->create([...])`).
  - Pre-existing user with `email_verified_at = null` for the unverified email notice test.
  - Cached fixture data saved to `test-results/identity-fixtures.json` wrapped in `DB::transaction(...)`.
- **Milestone Local Screenshots:**
  - `identity-register-success`: Post-registration landing on team dashboard.
  - `identity-login-success`: Authenticated session on team dashboard.
  - `identity-magic-link-sent`: Magic link confirmation alert.
  - `identity-passkey-view`: Passkey authentication option visible.
  - `identity-forgot-password`: Password reset request status.
  - `identity-two-factor-challenge`: Two-factor code input prompt.
  - `identity-email-verify-prompt`: Email verification notice.

### 2. Implementation Steps
1. **Fixtures & Setup:**
   - Define `IdentityFixtures` interface.
   - Establish idempotent Tinker script creating a 2FA user and an unverified email user.
   - Save cached fixture identifiers.
2. **Registration Scenarios:**
   - Happy path: Generate dynamic unique timestamped email (`e2e-new-user-<timestamp>@example.com`). Fill registration form, submit, verify redirect to `/{current_team}/dashboard`.
   - Rejection path: Submit with duplicate email or mismatched password, assert inline validation error and no redirect.
3. **Password Login & Logout:**
   - Login with valid credentials, verify redirect to dashboard.
   - Trigger logout, assert navigation back to login or root and session cookie cleared.
   - Login with invalid password, assert error text without leaking existence.
4. **Magic Link:**
   - Submit email to `/login/link`, assert success alert: "If your email is registered, we have sent a secure sign-in link to your inbox."
5. **Passkey Option:**
   - Assert "Sign in with a passkey" button is rendered on `/login`.
6. **Password Recovery:**
   - Navigate to `/forgot-password`, fill email, submit, verify status notification.
7. **Two-Factor Challenge:**
   - Navigate to `/two-factor-challenge` or simulate 2FA login prompt, assert 2FA input box and recovery code toggle.
8. **Email Verification:**
   - Log in as the unverified user, navigate to `/email/verify`, assert notice text and resend button.

## Verification & Guardrails
- 0 ESLint errors/warnings.
- `tsc --noEmit` passing cleanly.
- Full Playwright E2E regression suite passes across all suites (Smoke, Checkout, Home, Orders, Identity).
- Non-destructive SQLite database operations.
