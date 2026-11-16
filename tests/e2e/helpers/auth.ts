import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { gotoPage } from './navigation';

export interface TestUserCredentials {
    email: string;
    password?: string;
}

/**
 * Authenticate a user via the login form and verify arrival at dashboard or requested URL.
 *
 * @param page The Playwright Page instance
 * @param credentials User email and password
 */
export async function loginAsUser(
    page: Page,
    credentials: TestUserCredentials = {
        email: 'admin@example.com',
        password: 'password',
    }
): Promise<void> {
    await gotoPage(page, '/login');

    await page.fill('input#email, input[name="email"]', credentials.email);
    await page.fill(
        'input#password, input[name="password"]',
        credentials.password || 'password'
    );

    await Promise.all([
        page.waitForURL(
            (url) =>
                !url.pathname.includes('/login') &&
                !url.pathname.includes('/two-factor-challenge'),
            { timeout: 10000 }
        ),
        page.click('button[data-test="login-button"]'),
    ]);

    // Verify session is active and not stopped at login or 2FA challenge
    expect(page.url()).not.toContain('/login');
    expect(page.url()).not.toContain('/two-factor-challenge');
}

/**
 * Log out the currently authenticated user if a logout action is visible.
 *
 * @param page The Playwright Page instance
 */
export async function logoutUser(page: Page): Promise<void> {
    const directLogout = page.locator(
        'button:has-text("Log Out"), form[action*="logout"] button, [data-test="logout-button"]'
    );

    if (await directLogout.isVisible()) {
        await Promise.all([
            page.waitForURL(
                (url) =>
                    url.pathname.includes('/login') || url.pathname === '/',
                { timeout: 10000 }
            ),
            directLogout.click(),
        ]);

        return;
    }

    // Check if user menu trigger is present (sidebar or header dropdown)
    const userMenuTrigger = page.locator(
        '[data-test="sidebar-menu-button"], button:has([data-test="user-avatar"])'
    );

    if (await userMenuTrigger.isVisible()) {
        await userMenuTrigger.click();

        const dropdownLogout = page.locator('[data-test="logout-button"]');
        await expect(dropdownLogout).toBeVisible();

        await Promise.all([
            page.waitForURL(
                (url) =>
                    url.pathname.includes('/login') || url.pathname === '/',
                { timeout: 10000 }
            ),
            dropdownLogout.click(),
        ]);
    }
}
