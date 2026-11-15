import { Page, expect } from '@playwright/test';
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
  credentials: TestUserCredentials = { email: 'admin@example.com', password: 'password' }
): Promise<void> {
  await gotoPage(page, '/login');

  await page.fill('input[type="email"], input[name="email"]', credentials.email);
  await page.fill('input[type="password"], input[name="password"]', credentials.password || 'password');

  await Promise.all([
    page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 }),
    page.click('button[type="submit"]'),
  ]);

  // Verify session is active by ensuring we are no longer on login page
  expect(page.url()).not.toContain('/login');
}

/**
 * Log out the currently authenticated user if a logout action is visible.
 *
 * @param page The Playwright Page instance
 */
export async function logoutUser(page: Page): Promise<void> {
  const logoutButton = page.locator('button:has-text("Log Out"), form[action*="logout"] button');
  if (await logoutButton.isVisible()) {
    await Promise.all([
      page.waitForURL((url) => url.pathname.includes('/login') || url.pathname === '/', { timeout: 10000 }),
      logoutButton.click(),
    ]);
  }
}
