import { execSync } from 'child_process';
import { expect, test } from '@playwright/test';
import { loginAsUser } from './helpers/auth';
import { gotoPage } from './helpers/navigation';
import { captureStepScreenshot } from './helpers/screenshot';

interface OrderFixtures {
    ownerEmail: string;
    otherEmail: string;
    pendingOrderId: string;
    paidOrderId: string;
    digitalProductId: string;
}

/**
 * Idempotently establish test fixtures for order owner, other customer,
 * pending manual transfer order, and paid digital order.
 */
function setupOrderFixtures(): OrderFixtures {
    const raw = execSync(
        'php artisan tinker --execute="' +
            "\\$ensureUser = function(\\$email, \\$name) { " +
            "    \\$u = App\\\\Models\\\\User::firstOrCreate(['email' => \\$email], ['name' => \\$name, 'password' => bcrypt('password')]); " +
            "    if (!\\$u->current_team_id) { " +
            "        \\$team = App\\\\Models\\\\Team::factory()->personal()->create(['name' => \\$name.' Team']); " +
            "        \\$team->members()->attach(\\$u, ['role' => App\\\\Enums\\\\TeamRole::Owner->value]); " +
            "        \\$u->switchTeam(\\$team); " +
            "    } " +
            "    return \\$u; " +
            "}; " +
            "\\$owner = \\$ensureUser('e2e-owner@example.com', 'E2E Owner'); " +
            "\\$other = \\$ensureUser('e2e-other@example.com', 'E2E Other'); " +
            '\\$prod = App\\\\Models\\\\Product::first(); ' +
            "\\$pendingOrder = App\\\\Models\\\\Order::firstOrCreate(['session_key' => 'e2e-pending-manual-session-key'], [" +
            "    'user_id' => \\$owner->id, " +
            "    'status' => 'pending', " +
            "    'payment_method' => 'manual', " +
            "    'shipping_address' => '742 Evergreen Terrace, Springfield', " +
            '    \'total_amount\' => \\$prod->price * 2, ' +
            ']); ' +
            "App\\\\Models\\\\OrderItem::firstOrCreate(['order_id' => \\$pendingOrder->id, 'product_id' => \\$prod->id], [" +
            "    'product_name' => \\$prod->name, " +
            '    \'price\' => \\$prod->price, ' +
            "    'quantity' => 2, " +
            ']); ' +
            "Illuminate\\\\Support\\\\Facades\\\\Storage::disk('private')->put('digital_products/sample_guide.pdf', '%PDF-1.4 sample digital product content'); " +
            "\\$digitalProd = App\\\\Models\\\\Product::firstOrCreate(['slug' => 'sample-digital-guide'], [" +
            "    'name' => 'Sample Digital Guide', " +
            '    \'price\' => 2500, ' +
            '    \'category_id\' => App\\\\Models\\\\Category::first()->id, ' +
            "    'is_digital' => true, " +
            "    'file_path' => 'digital_products/sample_guide.pdf', " +
            '    \'stock\' => 999, ' +
            "    'status' => 'active', " +
            ']); ' +
            "\\$paidOrder = App\\\\Models\\\\Order::firstOrCreate(['session_key' => 'e2e-paid-digital-order-session-key'], [" +
            "    'user_id' => \\$owner->id, " +
            "    'status' => 'paid', " +
            "    'payment_method' => 'manual', " +
            "    'shipping_address' => '742 Evergreen Terrace, Springfield', " +
            '    \'total_amount\' => 2500, ' +
            ']); ' +
            "App\\\\Models\\\\OrderItem::firstOrCreate(['order_id' => \\$paidOrder->id, 'product_id' => \\$digitalProd->id], [" +
            "    'product_name' => \\$digitalProd->name, " +
            '    \'price\' => 2500, ' +
            "    'quantity' => 1, " +
            ']); ' +
            'echo json_encode([' +
            "    'ownerEmail' => \\$owner->email, " +
            "    'otherEmail' => \\$other->email, " +
            "    'pendingOrderId' => \\$pendingOrder->id, " +
            "    'paidOrderId' => \\$paidOrder->id, " +
            "    'digitalProductId' => \\$digitalProd->id, " +
            ']);"',
        { encoding: 'utf-8' },
    ).trim();

    return JSON.parse(raw);
}

test.describe('E2E Secure Orders Suite', () => {
    let fixtures: OrderFixtures;

    test.beforeAll(() => {
        fixtures = setupOrderFixtures();
    });

    test.beforeEach(async ({ context }) => {
        await context.clearCookies();
    });

    test('unauthenticated visitors are redirected to login when accessing order routes', async ({
        page,
    }) => {
        // 1. Visit /orders without session -> redirect to /login
        await page.goto('/orders');
        await page.waitForURL((url) => url.pathname.includes('/login'));
        expect(page.url()).toContain('/login');

        // 2. Visit /orders/{id} without session -> redirect to /login
        await page.goto(`/orders/${fixtures.pendingOrderId}`);
        await page.waitForURL((url) => url.pathname.includes('/login'));
        expect(page.url()).toContain('/login');

        // 3. Visit /orders/{id}/download/{product} without session -> redirect to /login
        await page.goto(
            `/orders/${fixtures.paidOrderId}/download/${fixtures.digitalProductId}`,
        );
        await page.waitForURL((url) => url.pathname.includes('/login'));
        expect(page.url()).toContain('/login');

        await captureStepScreenshot(page, 'orders-unauth-redirect');
    });

    test('authenticated order owner can view their order history list and navigate to details', async ({
        page,
    }) => {
        const consoleErrors: string[] = [];
        const pageErrors: Error[] = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });
        page.on('pageerror', (err) => {
            pageErrors.push(err);
        });

        // Login as order owner
        await loginAsUser(page, {
            email: fixtures.ownerEmail,
            password: 'password',
        });

        // Navigate to Order History
        await gotoPage(page, '/orders');

        // Verify Order History page headers
        await expect(
            page.getByRole('heading', { name: 'Order History' }),
        ).toBeVisible();
        await expect(
            page.locator('text=Manage and view your past orders.'),
        ).toBeVisible();

        // Verify orders table rendering
        const orderTable = page.locator('table');
        await expect(orderTable).toBeVisible();
        await expect(
            page.getByRole('columnheader', { name: 'Order ID' }),
        ).toBeVisible();
        await expect(
            page.getByRole('columnheader', { name: 'Total' }),
        ).toBeVisible();
        await expect(
            page.getByRole('columnheader', { name: 'Status' }),
        ).toBeVisible();

        // Verify owner's order row is rendered
        const orderRow = page.locator('tbody tr', {
            has: page.locator(`a[href$="/orders/${fixtures.pendingOrderId}"]`),
        });
        await expect(orderRow).toBeVisible();

        // Click "View Details" link on the owner's order row
        const viewDetailsLink = orderRow.getByRole('link', {
            name: /View Details/i,
        });
        await expect(viewDetailsLink).toBeVisible();
        await viewDetailsLink.click();

        // Verify navigation to order detail page
        await page.waitForURL((url) =>
            url.pathname.includes(`/orders/${fixtures.pendingOrderId}`),
        );
        expect(page.url()).toContain(`/orders/${fixtures.pendingOrderId}`);

        await captureStepScreenshot(page, 'orders-history-list');
        expect(consoleErrors).toHaveLength(0);
        expect(pageErrors).toHaveLength(0);
    });

    test('order details page renders complete order information and returns to history', async ({
        page,
    }) => {
        const consoleErrors: string[] = [];
        const pageErrors: Error[] = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });
        page.on('pageerror', (err) => {
            pageErrors.push(err);
        });

        // Login as order owner
        await loginAsUser(page, {
            email: fixtures.ownerEmail,
            password: 'password',
        });

        // Navigate directly to pending order detail page
        await gotoPage(page, `/orders/${fixtures.pendingOrderId}`);

        // Verify Order Details Header
        await expect(page.locator('text=Order Details')).toBeVisible();
        await expect(
            page.getByRole('heading', {
                name: new RegExp(
                    `Order #${fixtures.pendingOrderId.substring(0, 8)}`,
                    'i',
                ),
            }),
        ).toBeVisible();

        // Verify Status Badge
        await expect(
            page.locator('span:has-text("Awaiting Payment")'),
        ).toBeVisible();

        // Verify Order Items section
        await expect(
            page.getByRole('heading', { name: 'Order Items' }),
        ).toBeVisible();
        await expect(
            page.locator('text=Quantity: 2'),
        ).toBeVisible();

        // Verify Summary (Payment Method & Shipping Address)
        await expect(
            page.getByRole('heading', { name: 'Summary' }),
        ).toBeVisible();
        await expect(page.locator('text=MANUAL')).toBeVisible();
        await expect(
            page.locator('text=742 Evergreen Terrace, Springfield'),
        ).toBeVisible();

        // Verify "Back to Orders" navigation link
        const backToOrdersLink = page.getByRole('link', {
            name: /Back to Orders/i,
        });
        await expect(backToOrdersLink).toBeVisible();
        await backToOrdersLink.click();

        await page.waitForURL((url) => url.pathname === '/orders');
        expect(page.url()).toContain('/orders');

        await captureStepScreenshot(page, 'orders-detail-view');
        expect(consoleErrors).toHaveLength(0);
        expect(pageErrors).toHaveLength(0);
    });

    test('anti-IDOR enforcement: authenticated non-owner cannot view or download another customer order', async ({
        page,
    }) => {
        // Login as User B (non-owner)
        await loginAsUser(page, {
            email: fixtures.otherEmail,
            password: 'password',
        });

        // 1. Attempt direct GET access to User A's order -> HTTP 403 Forbidden
        const viewResponse = await page.goto(`/orders/${fixtures.pendingOrderId}`);
        expect(viewResponse?.status()).toBe(403);

        // Verify no order details or shipping address leaked
        await expect(
            page.locator('text=742 Evergreen Terrace, Springfield'),
        ).toBeHidden();

        // 2. Attempt direct GET access to User A's digital download -> HTTP 403 Forbidden
        const downloadResponse = await page.goto(
            `/orders/${fixtures.paidOrderId}/download/${fixtures.digitalProductId}`,
        );
        expect(downloadResponse?.status()).toBe(403);

        await captureStepScreenshot(page, 'orders-idor-forbidden');
    });

    test('pending manual transfer order displays bank transfer instructions and payment proof upload', async ({
        page,
    }) => {
        // Login as order owner
        await loginAsUser(page, {
            email: fixtures.ownerEmail,
            password: 'password',
        });

        // Navigate to pending manual transfer order
        await gotoPage(page, `/orders/${fixtures.pendingOrderId}`);

        // Verify manual transfer alert banner
        await expect(
            page.locator('text=Complete Your Bank Transfer'),
        ).toBeVisible();
        await expect(
            page.locator('text=Please transfer the total amount'),
        ).toBeVisible();

        // Verify bank transfer instruction accordion (Bank BCA)
        const bcaAccordionBtn = page.getByRole('button', {
            name: /Transfer via Bank BCA/i,
        });
        await expect(bcaAccordionBtn).toBeVisible();

        // Expand accordion and verify bank account details
        await bcaAccordionBtn.click();
        await expect(page.locator('text=Account Number:')).toBeVisible();

        // Verify payment proof upload form
        const proofInput = page.locator('input[type="file"]');
        await expect(proofInput).toBeAttached();
        await expect(
            page.getByRole('button', { name: /Submit Payment Evidence/i }),
        ).toBeVisible();

        await captureStepScreenshot(
            page,
            'orders-bank-transfer-instructions',
        );
    });

    test('paid order with digital product displays secure download link for owner', async ({
        page,
    }) => {
        // Login as order owner
        await loginAsUser(page, {
            email: fixtures.ownerEmail,
            password: 'password',
        });

        // Navigate to paid digital order
        await gotoPage(page, `/orders/${fixtures.paidOrderId}`);

        // Verify Paid status badge
        await expect(
            page.locator('span:has-text("Paid")'),
        ).toBeVisible();

        // Verify Download Product link is visible
        const downloadLink = page.getByRole('link', {
            name: /Download Product/i,
        });
        await expect(downloadLink).toBeVisible();
        await expect(downloadLink).toHaveAttribute(
            'href',
            new RegExp(
                `/orders/${fixtures.paidOrderId}/download/${fixtures.digitalProductId}`,
            ),
        );

        await captureStepScreenshot(page, 'orders-digital-download');
    });
});
