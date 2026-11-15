import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Navigate to a URL and wait for the Inertia application to be fully mounted.
 *
 * @param page The Playwright Page instance
 * @param url Target relative or absolute URL
 */
export async function gotoPage(page: Page, url: string): Promise<void> {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBeLessThan(400);

    // Ensure Inertia root element exists and is attached to DOM
    const appContainer = page.locator('#app');
    await expect(appContainer).toBeAttached({ timeout: 10000 });
}
