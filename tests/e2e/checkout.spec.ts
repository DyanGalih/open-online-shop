import { execSync } from 'node:child_process';
import { expect, test } from '@playwright/test';
import { clearCart, seedCart } from './helpers/cart';
import { gotoPage } from './helpers/navigation';
import { captureStepScreenshot } from './helpers/screenshot';

interface ProductInfo {
    id: string;
    name: string;
    price: number;
}

/**
 * Retrieve the first product from the database for testing.
 */
function getFirstProduct(): ProductInfo {
    const raw = execSync(
        'php artisan tinker --execute="\\$p = App\\\\Models\\\\Product::first(); echo json_encode([\'id\' => \\$p->id, \'name\' => \\$p->name, \'price\' => \\$p->price]);"',
        { encoding: 'utf-8' },
    ).trim();

    return JSON.parse(raw);
}

/**
 * Generate a valid temporary signed checkout view link for an order.
 */
function createSignedOrderUrl(
    origin: string = process.env.E2E_BASE_URL || 'http://127.0.0.1:8000',
): string {
    const rootOrigin = new URL(origin).origin;
    const rawUrl = execSync(
        'php artisan tinker --execute="' +
            `URL::forceRootUrl('${rootOrigin}'); ` +
            '\\$u = App\\\\Models\\\\User::first(); ' +
            '\\$p = App\\\\Models\\\\Product::first(); ' +
            '\\$order = App\\\\Models\\\\Order::create([' +
            "    'user_id' => \\$u->id, " +
            "    'status' => 'pending', " +
            "    'session_key' => Illuminate\\\\Support\\\\Str::random(40), " +
            "    'payment_method' => 'manual', " +
            "    'shipping_address' => '123 Test Street, Springfield', " +
            '    \'total_amount\' => \\$p->price' +
            ']); ' +
            'App\\\\Models\\\\OrderItem::create([' +
            "    'order_id' => \\$order->id, " +
            "    'product_id' => \\$p->id, " +
            "    'product_name' => \\$p->name, " +
            '    \'price\' => \\$p->price, ' +
            "    'quantity' => 1" +
            ']); ' +
            'echo app(App\\\\Services\\\\SignedUrlService::class)->generateCheckoutLink(\\$order);"',
        { encoding: 'utf-8' },
    ).trim();

    const url = new URL(rawUrl);

    return `${url.pathname}${url.search}`;
}

test.describe('E2E Checkout Suite', () => {
    test.beforeEach(async ({ page }) => {
        await gotoPage(page, '/');
    });

    test('empty cart redirects to storefront root', async ({ page }) => {
        await clearCart(page);

        // Direct access to /checkout with no items
        await page.goto('/checkout');

        // Verify redirection to storefront root
        await expect(page).toHaveURL('/');

        await captureStepScreenshot(page, 'checkout-empty-cart-redirect');
    });

    test('checkout page renders order summary with items and formatted total', async ({
        page,
    }) => {
        const productInfo = getFirstProduct();

        // Seed cart with 2 quantities of the product
        await seedCart(page, [
            {
                id: productInfo.id,
                name: productInfo.name,
                price: productInfo.price,
                quantity: 2,
            },
        ]);

        await gotoPage(page, '/checkout');

        // Verify page heading and order summary
        await expect(
            page.getByRole('heading', { name: 'Checkout', exact: true }),
        ).toBeVisible();
        await expect(
            page.getByRole('heading', { name: 'Order Summary' }),
        ).toBeVisible();

        // Verify product name and quantity in summary
        await expect(page.locator(`text=${productInfo.name}`)).toBeVisible();
        await expect(page.locator('text=Qty: 2')).toBeVisible();

        // Verify total amount is calculated
        const expectedTotal = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(productInfo.price * 2);

        await expect(
            page.locator('text=Total Amount:').locator('..'),
        ).toContainText(expectedTotal);

        await captureStepScreenshot(page, 'checkout-order-summary');
    });

    test('checkout form validates required fields', async ({ page }) => {
        const productInfo = getFirstProduct();

        await seedCart(page, [
            {
                id: productInfo.id,
                name: productInfo.name,
                price: productInfo.price,
                quantity: 1,
            },
        ]);

        await gotoPage(page, '/checkout');

        let checkoutRequestSent = false;
        page.on('request', (request) => {
            if (
                request.url().includes('/checkout') &&
                request.method() === 'POST'
            ) {
                checkoutRequestSent = true;
            }
        });

        const submitBtn = page.getByRole('button', { name: 'Place Order' });

        // Try submitting empty form
        await submitBtn.click();

        // HTML5 required validation marks required inputs invalid and prevents navigation/request
        const nameInput = page.locator('input[type="text"]');
        expect(
            await nameInput.evaluate(
                (el: HTMLInputElement) => el.checkValidity(),
            ),
        ).toBe(false);
        expect(checkoutRequestSent).toBe(false);
        await expect(page).toHaveURL('/checkout');

        await captureStepScreenshot(page, 'checkout-validation-error');
    });

    test('checkout with manual bank transfer creates order successfully', async ({
        page,
    }) => {
        const productInfo = getFirstProduct();

        await seedCart(page, [
            {
                id: productInfo.id,
                name: productInfo.name,
                price: productInfo.price,
                quantity: 1,
            },
        ]);

        await gotoPage(page, '/checkout');

        // Fill valid checkout details with a unique guest email to ensure new guest registration and automatic login
        const guestEmail = `guest-${Date.now()}@example.com`;
        await page.locator('input[type="text"]').first().fill('Jane Doe');
        await page.locator('input[type="email"]').fill(guestEmail);
        await page
            .locator('textarea')
            .fill('742 Evergreen Terrace, Springfield');

        // Select manual bank transfer
        await page.locator('select').selectOption('manual');

        await captureStepScreenshot(page, 'checkout-before-manual-submit');

        // Submit order
        await page.getByRole('button', { name: 'Place Order' }).click();

        // Await redirection to order view
        await page.waitForURL(/\/orders\/\w+/);

        // Verify localStorage cart is cleared
        const storedCart = await page.evaluate(() =>
            localStorage.getItem('online_shop_cart'),
        );
        expect(storedCart).toBeNull();

        await captureStepScreenshot(page, 'checkout-manual-order-success');
    });

    test('checkout with Midtrans redirects to payment gateway', async ({
        page,
    }) => {
        // Intercept Midtrans payment gateway URL
        await page.route('https://app.sandbox.midtrans.com/**', (route) => {
            route.fulfill({
                status: 200,
                contentType: 'text/html',
                body: '<html><body><h1>Mock Midtrans Gateway</h1></body></html>',
            });
        });

        const productInfo = getFirstProduct();

        await seedCart(page, [
            {
                id: productInfo.id,
                name: productInfo.name,
                price: productInfo.price,
                quantity: 1,
            },
        ]);

        await gotoPage(page, '/checkout');

        // Fill valid checkout details
        await page.locator('input[type="text"]').first().fill('John Wayne');
        await page
            .locator('input[type="email"]')
            .fill('john.wayne@example.com');
        await page
            .locator('textarea')
            .fill('100 Western Trail, Tombstone');

        // Select Midtrans
        await page.locator('select').selectOption('midtrans');

        // Submit order
        await page.getByRole('button', { name: 'Place Order' }).click();

        // Assert navigation to intercepted Midtrans sandbox endpoint
        await page.waitForURL(/^https:\/\/app\.sandbox\.midtrans\.com\//);
        await expect(
            page.getByRole('heading', { name: 'Mock Midtrans Gateway' }),
        ).toBeVisible();

        await captureStepScreenshot(page, 'checkout-midtrans-redirect');
    });

    test('single-use signed order confirmation view renders and enforces one-time access', async ({
        page,
        baseURL,
    }) => {
        const rootOrigin = baseURL
            ? new URL(baseURL).origin
            : process.env.E2E_BASE_URL || 'http://127.0.0.1:8000';
        const signedRelativeUrl = createSignedOrderUrl(rootOrigin);

        // 1. Visit with invalid/tampered signature first -> 403 Forbidden
        // (Verifies signature verification independently before the single-use token is consumed)
        const tamperedUrl = `${signedRelativeUrl}&tampered=true`;
        const tamperedResponse = await page.goto(tamperedUrl);
        expect(tamperedResponse?.status()).toBe(403);

        // 2. First visit with valid signature -> 200 OK
        const response = await page.goto(signedRelativeUrl);
        expect(response?.status()).toBe(200);

        // Verify order details header and snapshot notice
        await expect(
            page.locator('text=Viewing single-session order snapshot'),
        ).toBeVisible();
        await expect(
            page.locator('text=123 Test Street, Springfield'),
        ).toBeVisible();

        await captureStepScreenshot(page, 'checkout-signed-view-first-access');

        // 3. Second visit to consumed link -> 403 Forbidden
        const secondResponse = await page.goto(signedRelativeUrl);
        expect(secondResponse?.status()).toBe(403);
    });
});
