import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Read environment variables from .env file using ESM URL resolution
dotenv.config({ path: fileURLToPath(new URL('.env', import.meta.url)) });

/**
 * Screenshot configuration mapping:
 * - 'failures-only' -> 'only-on-failure'
 * - 'all' -> 'on'
 * - default / 'off' -> 'off'
 */
const screenshotMode =
    process.env.E2E_SCREENSHOTS === 'failures-only'
        ? 'only-on-failure'
        : process.env.E2E_SCREENSHOTS === 'all'
          ? 'on'
          : 'off';

const appUrl = process.env.APP_URL || 'http://127.0.0.1:8000';

export default defineConfig({
    testDir: './tests/e2e',
    outputDir: './test-results',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['list'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ],
    use: {
        baseURL: appUrl,
        trace: 'on-first-retry',
        screenshot: screenshotMode,
        video: 'off',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: [
        {
            command: 'php artisan serve --port=8000',
            url: appUrl,
            reuseExistingServer: !process.env.CI,
            timeout: 120 * 1000,
        },
        {
            command: 'npm run dev',
            url: 'http://127.0.0.1:5173',
            reuseExistingServer: !process.env.CI,
            timeout: 120 * 1000,
        },
    ],
});
