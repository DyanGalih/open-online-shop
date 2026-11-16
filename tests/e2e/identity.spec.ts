import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { expect, test } from '@playwright/test';
import { loginAsUser, logoutUser } from './helpers/auth';
import { gotoPage } from './helpers/navigation';
import { captureStepScreenshot } from './helpers/screenshot';

interface IdentityFixtures {
    standardUserEmail: string;
    twoFactorUserEmail: string;
    unverifiedUserEmail: string;
}

/**
 * Idempotently establish test fixtures for standard user,
 * 2FA-enabled user, and unverified-email user.
 * Caches fixture results to disk to avoid repeated tinker runs across workers.
 */
function setupIdentityFixtures(): IdentityFixtures {
    const cacheFile = path.resolve('test-results', 'identity-fixtures.json');
    const lockFile = path.resolve('test-results', 'identity-fixtures.lock');

    fs.mkdirSync(path.dirname(cacheFile), { recursive: true });

    if (fs.existsSync(cacheFile)) {
        try {
            const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));

            if (cached?.standardUserEmail && cached?.twoFactorUserEmail) {
                return cached;
            }
        } catch {
            // Fall back to establishing fixtures via tinker
        }
    }

    // Acquire cross-worker file lock to avoid SQLite write collision on fresh DB
    let lockFd: number | null = null;

    for (let i = 0; i < 40; i++) {
        try {
            lockFd = fs.openSync(lockFile, 'wx');
            break;
        } catch (e: any) {
            if (e?.code === 'EEXIST') {
                const start = Date.now();

                while (Date.now() - start < 250) {
                    // busy-wait polling for other worker to finish
                }

                if (fs.existsSync(cacheFile)) {
                    try {
                        const cached = JSON.parse(
                            fs.readFileSync(cacheFile, 'utf-8'),
                        );

                        if (
                            cached?.standardUserEmail &&
                            cached?.twoFactorUserEmail
                        ) {
                            return cached;
                        }
                    } catch {
                        // Keep waiting
                    }
                }
            } else {
                throw e;
            }
        }
    }

    try {
        if (fs.existsSync(cacheFile)) {
            try {
                const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));

                if (cached?.standardUserEmail && cached?.twoFactorUserEmail) {
                    return cached;
                }
            } catch {
                // Re-establish
            }
        }

        const raw = execSync(
            'php artisan tinker --execute="' +
                'echo Illuminate\\\\Support\\\\Facades\\\\DB::transaction(function () { ' +
                "    \\$ensureUser = function(\\$email, \\$name, \\$extra = []) { " +
                "        \\$u = App\\\\Models\\\\User::where('email', \\$email)->first(); " +
                '        if (!\\$u) { ' +
                '            \\$u = App\\\\Models\\\\User::factory()->create(array_merge([ ' +
                "                'email' => \\$email, " +
                "                'name' => \\$name, " +
                "                'password' => bcrypt('password'), " +
                '            ], \\$extra)); ' +
                '        } ' +
                '        if (!\\$u->current_team_id) { ' +
                "            \\$team = App\\\\Models\\\\Team::where('name', \\$name.' Team')->first() ?? App\\\\Models\\\\Team::factory()->personal()->create(['name' => \\$name.' Team']); " +
                "            \\$team->members()->syncWithoutDetaching([\\$u->id => ['role' => App\\\\Enums\\\\TeamRole::Owner->value]]); " +
                '            \\$u->switchTeam(\\$team); ' +
                '        } ' +
                '        return \\$u; ' +
                '    }; ' +
                "    \\$standard = \\$ensureUser('e2e-identity-user@example.com', 'E2E Standard User'); " +
                "    \\$twoFactor = \\$ensureUser('e2e-2fa-user@example.com', 'E2E 2FA User', [ " +
                "        'two_factor_secret' => encrypt('test-secret'), " +
                "        'two_factor_confirmed_at' => now(), " +
                "        'two_factor_recovery_codes' => encrypt(json_encode(['code-recovery-1', 'code-recovery-2'])), " +
                '    ]); ' +
                "    \\$unverified = \\$ensureUser('e2e-unverified-user@example.com', 'E2E Unverified User', [ " +
                "        'email_verified_at' => null, " +
                '    ]); ' +
                '    return json_encode([ ' +
                "        'standardUserEmail' => \\$standard->email, " +
                "        'twoFactorUserEmail' => \\$twoFactor->email, " +
                "        'unverifiedUserEmail' => \\$unverified->email, " +
                '    ]); ' +
                '});"',
            { encoding: 'utf-8' },
        ).trim();

        const fixtures = JSON.parse(raw) as IdentityFixtures;
        fs.writeFileSync(cacheFile, JSON.stringify(fixtures, null, 2), 'utf-8');

        return fixtures;
    } finally {
        if (lockFd !== null) {
            try {
                fs.closeSync(lockFd);
                fs.unlinkSync(lockFile);
            } catch {
                // Ignore cleanup error
            }
        }
    }
}

test.describe('E2E Identity & Customer Lifecycle Suite', () => {
    let fixtures: IdentityFixtures;

    test.beforeAll(() => {
        fixtures = setupIdentityFixtures();
    });

    test.beforeEach(async ({ context }) => {
        await context.clearCookies();
    });

    test('successful registration creates customer account and redirects to team dashboard', async ({
        page,
    }) => {
        const uniqueSuffix = Date.now();
        const uniqueEmail = `e2e-customer-${uniqueSuffix}@example.com`;
        const uniqueName = `Customer ${uniqueSuffix}`;

        await gotoPage(page, '/register');

        // Verify registration heading
        await expect(
            page.getByRole('heading', { name: 'Create an account' }),
        ).toBeVisible();

        // Fill registration form
        await page.fill('input#name', uniqueName);
        await page.fill('input#email', uniqueEmail);
        await page.fill('input#password', 'securePassword123!');
        await page.fill('input#password_confirmation', 'securePassword123!');

        // Submit form
        await Promise.all([
            page.waitForURL((url) => !url.pathname.includes('/register')),
            page.click('button[data-test="register-user-button"]'),
        ]);

        // Expect arrival at team dashboard
        expect(page.url()).toContain('/dashboard');
        await expect(page.locator('#app')).toBeVisible();

        await captureStepScreenshot(page, 'identity-register-success');
    });

    test('registration validates duplicate email and mismatched confirmation', async ({
        page,
    }) => {
        await gotoPage(page, '/register');

        // 1. Test duplicate email rejection with matching passwords
        await page.fill('input#name', 'Duplicate User');
        await page.fill('input#email', fixtures.standardUserEmail);
        await page.fill('input#password', 'securePassword123!');
        await page.fill('input#password_confirmation', 'securePassword123!');

        await page.click('button[data-test="register-user-button"]');

        expect(page.url()).toContain('/register');
        await expect(
            page.locator('text=The email has already been taken.'),
        ).toBeVisible();

        // 2. Test mismatched password confirmation with unique email
        await page.fill('input#email', `unique-${Date.now()}@example.com`);
        await page.fill('input#password', 'securePassword123!');
        await page.fill('input#password_confirmation', 'differentPassword123!');

        await page.click('button[data-test="register-user-button"]');

        expect(page.url()).toContain('/register');
        await expect(
            page.locator('text=The password field confirmation does not match.'),
        ).toBeVisible();
    });

    test('customer password authentication and session logout flow', async ({
        page,
    }) => {
        // 1. Log in with standard user credentials
        await loginAsUser(page, {
            email: fixtures.standardUserEmail,
            password: 'password',
        });

        expect(page.url()).toContain('/dashboard');
        await captureStepScreenshot(page, 'identity-login-success');

        // 2. Perform logout
        await logoutUser(page);

        // 3. Verify session is invalidated and protected route redirects to /login
        await page.goto('/orders');
        await page.waitForURL((url) => url.pathname.includes('/login'));
        expect(page.url()).toContain('/login');
    });

    test('login rejection with invalid credentials displays anti-enumeration error', async ({
        page,
    }) => {
        await gotoPage(page, '/login');

        // 1. Attempt login with non-existent email
        await page.fill('input#email, input[name="email"]', 'nonexistent@example.com');
        await page.fill(
            'input#password, input[name="password"]',
            'wrongpassword123',
        );

        await page.click('button[data-test="login-button"]');

        // Verify generic error message without leaking account existence
        await expect(
            page.locator(
                'text=The provided credentials do not match our records.',
            ),
        ).toBeVisible();
        expect(page.url()).toContain('/login');

        // 2. Attempt login with existing registered email and wrong password
        await page.fill('input#email, input[name="email"]', fixtures.standardUserEmail);
        await page.fill(
            'input#password, input[name="password"]',
            'wrongpassword123',
        );

        await page.click('button[data-test="login-button"]');

        // Verify identical anti-enumeration error is displayed
        await expect(
            page.locator(
                'text=The provided credentials do not match our records.',
            ),
        ).toBeVisible();
        expect(page.url()).toContain('/login');
    });

    test('passwordless magic link request displays confirmation feedback', async ({
        page,
    }) => {
        await gotoPage(page, '/login');

        // Verify magic link section
        await expect(
            page.locator('text=Or sign in with email link'),
        ).toBeVisible();

        // Enter email in magic link input
        const magicEmailInput = page.locator('form:has-text("Send Sign-In Link") input[type="email"]');
        await magicEmailInput.fill(fixtures.standardUserEmail);

        // Click Send Sign-In Link
        await page.click('button:has-text("Send Sign-In Link")');

        // Verify confirmation message
        await expect(
            page.locator(
                'text=If your email is registered, we have sent a secure sign-in link to your inbox.',
            ),
        ).toBeVisible();

        await captureStepScreenshot(page, 'identity-magic-link-sent');
    });

    test('passkey authentication entrypoint is rendered and accessible', async ({
        page,
    }) => {
        await gotoPage(page, '/login');

        const passkeyButton = page.locator(
            'button:has-text("Sign in with a passkey")',
        );
        await expect(passkeyButton).toBeVisible();

        await captureStepScreenshot(page, 'identity-passkey-view');
    });

    test('password reset request generates confirmation status feedback', async ({
        page,
    }) => {
        await gotoPage(page, '/forgot-password');

        await expect(
            page.getByRole('heading', { name: 'Forgot password' }),
        ).toBeVisible();

        await page.fill('input#email', fixtures.standardUserEmail);
        await page.click('button[data-test="email-password-reset-link-button"]');

        // Wait for reset link notification status feedback
        await expect(
            page.locator('text=We have emailed your password reset link.'),
        ).toBeVisible({ timeout: 10000 });

        await captureStepScreenshot(page, 'identity-forgot-password');
    });

    test('two-factor authentication challenge gate renders code input and recovery toggle', async ({
        page,
    }) => {
        await gotoPage(page, '/login');

        await page.fill('input#email, input[name="email"]', fixtures.twoFactorUserEmail);
        await page.fill(
            'input#password, input[name="password"]',
            'password',
        );

        // Submit login for 2FA user
        await Promise.all([
            page.waitForURL((url) =>
                url.pathname.includes('/two-factor-challenge'),
            ),
            page.click('button[data-test="login-button"]'),
        ]);

        expect(page.url()).toContain('/two-factor-challenge');

        // Verify 2FA challenge code prompt
        await expect(
            page.locator(
                'text=Enter the authentication code provided by your authenticator application.',
            ),
        ).toBeVisible();

        // Verify toggle to recovery mode
        const recoveryToggle = page.locator(
            'button:has-text("login using a recovery code")',
        );
        await expect(recoveryToggle).toBeVisible();

        // Switch to recovery code mode
        await recoveryToggle.click();
        await expect(page.locator('input[name="recovery_code"]')).toBeVisible();

        await captureStepScreenshot(page, 'identity-two-factor-challenge');
    });

    test('unverified customer account visiting /email/verify displays verification prompt', async ({
        page,
    }) => {
        // Login as unverified user
        await loginAsUser(page, {
            email: fixtures.unverifiedUserEmail,
            password: 'password',
        });

        // Navigate to /email/verify
        await gotoPage(page, '/email/verify');

        // Verify prompt message and resend action
        await expect(
            page.locator(
                'text=Please verify your email address by clicking on the link we just emailed to you.',
            ),
        ).toBeVisible();
        await expect(
            page.locator('button:has-text("Resend verification email")'),
        ).toBeVisible();

        await captureStepScreenshot(page, 'identity-email-verify-prompt');
    });
});
