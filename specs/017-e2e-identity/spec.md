# Feature Specification: E2E Identity & Customer Lifecycle (`specs/017-e2e-identity`)

## Summary
Provide comprehensive end-to-end (E2E) automated verification for customer authentication, registration, password recovery, magic link requests, passkeys interface, two-factor authentication gates, and email verification notices using Playwright.

## User Stories & Acceptance Criteria

### Story 1: Customer Registration (`/register`)
- **Given** an unauthenticated visitor on `/register`
- **When** they fill the registration form with a unique email, name, password, and matching confirmation
- **Then** an account and associated personal team are created, the user is authenticated, and redirected to their personal team dashboard (`/{current_team}/dashboard`)
- **When** submitting an already registered email or mismatched password confirmation
- **Then** registration is rejected with appropriate validation feedback and no session is created

### Story 2: Customer Password Login & Logout (`/login`, `/logout`)
- **Given** a registered user with email and password
- **When** submitting valid credentials on `/login`
- **Then** the session is authenticated and redirected to the team dashboard
- **When** submitting incorrect credentials
- **Then** login is rejected with a generic credential error without leaking account existence
- **When** an authenticated user triggers logout
- **Then** the session is terminated and subsequent protected route access redirects to `/login`

### Story 3: Passwordless Magic Link Request (`/login/link`)
- **Given** a visitor on the login page
- **When** they enter their email into the magic link section and submit "Send Sign-In Link"
- **Then** the submission succeeds and displays the confirmation banner: "If your email is registered, we have sent a secure sign-in link to your inbox."

### Story 4: Passkey Authentication Interface
- **Given** a visitor on the login page
- **When** the page renders
- **Then** the passkey authentication interface ("Sign in with a passkey") is visible and accessible

### Story 5: Password Recovery Flow (`/forgot-password`)
- **Given** a user who has forgotten their password visiting `/forgot-password`
- **When** they enter their registered email address and submit the reset form
- **Then** a password reset link is generated and the page displays status feedback confirming the link has been dispatched

### Story 6: Two-Factor Authentication Gate (`/two-factor-challenge`)
- **Given** a user with two-factor authentication enabled who submits valid password credentials
- **When** the login controller redirects to `/two-factor-challenge`
- **Then** the 2FA code input and alternate recovery code inputs are rendered

### Story 7: Email Verification Notice (`/email/verify`)
- **Given** an authenticated user whose email is unverified
- **When** accessing `/email/verify`
- **Then** the verification prompt is displayed with a resend verification email action

## Security & Non-Functional Requirements
- **Credential Hygiene:** Never use real user emails or passwords; only synthetic `@example.com` fixtures.
- **Enumeration Resistance:** Ensure error messages on failed auth do not disclose whether an account exists.
- **Zero Destructive Database Operations:** Preserve database integrity without dropping tables or truncating records.
- **Screenshot Evidence:** Milestone screenshots saved locally to gitignored `test-results/screenshots/` when `E2E_SCREENSHOTS=all`.
