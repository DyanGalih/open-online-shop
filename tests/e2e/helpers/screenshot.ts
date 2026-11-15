import { Page } from '@playwright/test';
import path from 'path';

/**
 * Capture a milestone step screenshot if E2E_SCREENSHOTS is set to 'all'.
 *
 * @param page The Playwright Page instance
 * @param name The descriptive name of the milestone/step (e.g. 'home-page-hero')
 */
export async function captureStepScreenshot(page: Page, name: string): Promise<string | null> {
  const mode = process.env.E2E_SCREENSHOTS;

  if (mode !== 'all') {
    return null;
  }

  const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const timestamp = Date.now();
  const filename = `${safeName}-${timestamp}.png`;
  const screenshotPath = path.join('test-results', 'screenshots', filename);

  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  return screenshotPath;
}
