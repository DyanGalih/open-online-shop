import { expect, test } from '@playwright/test';
import { gotoPage } from './helpers/navigation';
import { captureStepScreenshot } from './helpers/screenshot';

test.describe('E2E Smoke Suite', () => {
    test('home page loads successfully without console errors', async ({
        page,
    }) => {
        const consoleErrors: string[] = [];

        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        await gotoPage(page, '/');

        // Assert Inertia app has rendered
        const app = page.locator('#app');

        await expect(app).toBeVisible();

        // Capture milestone screenshot (respects E2E_SCREENSHOTS env toggle)
        await captureStepScreenshot(page, 'home-page-smoke');

        // Verify no critical console errors occurred
        expect(consoleErrors).toHaveLength(0);
    });
});
