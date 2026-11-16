# Implementation Tasks: E2E Identity & Customer Lifecycle (`specs/017-e2e-identity`)

## Task Breakdown

### Phase 1: Test Suite & Fixture Scaffold
- [x] **Task 1.1:** Create `tests/e2e/identity.spec.ts` structure with `test.describe('E2E Identity Suite')` and `setupIdentityFixtures()` with cached JSON in `test-results/identity-fixtures.json`.
- [x] **Task 1.2:** Configure synthetic test users in Tinker:
  - Standard customer user with known password (`password`).
  - User with two-factor authentication enabled (`two_factor_secret != null`, `two_factor_confirmed_at != null`).
  - User with unverified email (`email_verified_at = null`).

### Phase 2: Registration & Credential Validation
- [x] **Task 2.1:** Implement successful registration test: fill name, unique email, password, confirm password -> expect redirect to `/{current_team}/dashboard` and capture screenshot `identity-register-success`.
- [x] **Task 2.2:** Implement registration validation failure test: submit duplicate email and mismatched password confirmation -> expect validation errors and stay on `/register`.

### Phase 3: Password Authentication & Session Invalidation
- [x] **Task 3.1:** Implement valid login test: submit credentials -> expect arrival at dashboard and capture screenshot `identity-login-success`.
- [x] **Task 3.2:** Implement invalid credential test: submit incorrect password -> expect error message and verify anti-enumeration wording.
- [x] **Task 3.3:** Implement logout test: log in -> click logout -> verify redirect to `/` or `/login` and unauthenticated state.

### Phase 4: Passwordless & Alternate Authentication
- [x] **Task 4.1:** Implement magic link request test: enter email -> click "Send Sign-In Link" -> verify confirmation text and capture screenshot `identity-magic-link-sent`.
- [x] **Task 4.2:** Implement passkey UI verification test: assert passkey login entrypoint is visible and capture screenshot `identity-passkey-view`.

### Phase 5: Account Recovery & Security Challenges
- [x] **Task 5.1:** Implement password reset request test: navigate to `/forgot-password`, submit email, assert success status feedback, and capture screenshot `identity-forgot-password`.
- [x] **Task 5.2:** Implement two-factor authentication challenge test: submit credentials for 2FA user -> expect arrival at `/two-factor-challenge`, verify code input and recovery code toggle, and capture screenshot `identity-two-factor-challenge`.
- [x] **Task 5.3:** Implement unverified email notification test: log in as unverified user, navigate to `/email/verify`, verify prompt and resend button, and capture screenshot `identity-email-verify-prompt`.

### Phase 6: Verification & Hygiene
- [x] **Task 6.1:** Run Playwright suite `npx playwright test tests/e2e/identity.spec.ts`.
- [x] **Task 6.2:** Run full regression suite across all tests (Smoke, Checkout, Home, Orders, Identity).
- [x] **Task 6.3:** Run ESLint, TypeScript check (`npm run types:check`), and `architecture-guard hygiene`.
