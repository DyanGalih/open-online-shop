import { expect, test } from '@playwright/test';
import { gotoPage } from './helpers/navigation';
import { captureStepScreenshot } from './helpers/screenshot';

test.describe('E2E Public Pages (Home & Storefront)', () => {
    test.beforeEach(async ({ page }) => {
        // Clear local storage and cookies before each test
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
    });

    test('home page renders hero section and announcement bar without console errors', async ({
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

        await gotoPage(page, '/');

        // Verify announcement bar
        await expect(
            page.locator('text=Free shipping on orders over $75'),
        ).toBeVisible();

        // Verify brand logo
        await expect(
            page.locator('header').getByText('online shop'),
        ).toBeVisible();

        // Verify hero section title & subtitle
        const heroHeading = page.getByRole('heading', {
            name: 'Simple Things, Beautiful Life',
        });
        await expect(heroHeading).toBeVisible();
        await expect(
            page.locator(
                'text=Thoughtfully designed products to make your everyday life better.',
            ),
        ).toBeVisible();

        // Verify call-to-action button
        const shopNowLink = page.getByRole('link', { name: 'Shop Now' });
        await expect(shopNowLink).toBeVisible();
        await expect(shopNowLink).toHaveAttribute('href', '#catalog');

        // Click CTA button to navigate to catalog
        await shopNowLink.click();
        await expect(page.locator('#catalog')).toBeVisible();

        await captureStepScreenshot(page, 'home-hero-showcase');
        expect(consoleErrors).toHaveLength(0);
        expect(pageErrors).toHaveLength(0);
    });

    test('product catalog displays products and allows category filtering', async ({
        page,
    }) => {
        await gotoPage(page, '/');

        // Scroll to catalog section
        const catalogSection = page.locator('#catalog');
        await catalogSection.scrollIntoViewIfNeeded();

        // Verify Category List heading
        await expect(
            page.getByRole('heading', { name: 'Shop by Category' }),
        ).toBeVisible();

        // Verify category card options exist
        const allProductsBtn = page.getByRole('button', {
            name: /All Products/i,
        });
        await expect(allProductsBtn).toBeVisible();

        // Verify product cards are displayed
        const productCards = page.locator('#catalog .grid > div');
        await expect(productCards.first()).toBeVisible();
        const initialCount = await productCards.count();
        expect(initialCount).toBeGreaterThan(0);

        // Filter by the first specific category card
        const categoryButtons = page.locator(
            'section:has-text("Shop by Category") button',
        );
        const secondCategoryBtn = categoryButtons.nth(1);
        const categoryName = (
            await secondCategoryBtn.locator('h3').textContent()
        )?.trim();
        expect(categoryName).toBeTruthy();

        await secondCategoryBtn.click();

        // Verify active category styling and filtered catalog content
        await expect(secondCategoryBtn).toHaveClass(/border-primary/);
        await expect(
            page.getByText(
                new RegExp(`Showing ${categoryName} Collection`, 'i'),
            ),
        ).toBeVisible();

        const filteredCount = await productCards.count();
        expect(filteredCount).toBeGreaterThan(0);
        expect(filteredCount).toBeLessThan(initialCount);

        await captureStepScreenshot(page, 'home-category-filter');

        // Reset filter by clicking All Products
        await allProductsBtn.click();
        await expect(allProductsBtn).toHaveClass(/border-primary/);
        await expect(
            page.getByText(/Showing All Collection/i),
        ).toBeVisible();
        await expect(productCards).toHaveCount(initialCount);
    });

    test('interactive header utilities open search modal and cart drawer', async ({
        page,
    }) => {
        await gotoPage(page, '/');

        // 1. Search Modal
        const searchBtn = page.locator('header button').filter({
            has: page.locator('svg.lucide-search'),
        });
        await expect(searchBtn).toBeVisible();
        await searchBtn.click();

        // Verify Search Modal opens
        const searchHeading = page.getByRole('heading', {
            name: 'Search Products',
        });
        await expect(searchHeading).toBeVisible();
        const searchInput = page.locator('.ant-modal input');
        await expect(searchInput).toBeVisible();

        await captureStepScreenshot(page, 'home-search-modal');

        // Close search modal by pressing Escape
        await page.keyboard.press('Escape');
        await expect(searchHeading).toBeHidden();

        // 2. Cart Drawer
        const cartBtn = page.locator('header button').filter({
            has: page.locator('svg.lucide-shopping-bag'),
        });
        await expect(cartBtn).toBeVisible();
        await cartBtn.click();

        // Verify Cart Drawer opens
        const cartDrawerOpen = page.locator('.ant-drawer-open');
        await expect(cartDrawerOpen).toBeVisible();
        await expect(
            page.locator('.ant-drawer-title:has-text("Shopping Bag")'),
        ).toBeVisible();

        await captureStepScreenshot(page, 'home-cart-drawer');

        // Close cart drawer via close button
        await page.locator('.ant-drawer-close').click();
        await expect(cartDrawerOpen).toBeHidden();
    });

    test('adding a product to cart updates badge counter and persists in cart drawer', async ({
        page,
    }) => {
        await gotoPage(page, '/');

        const catalogSection = page.locator('#catalog');
        await catalogSection.scrollIntoViewIfNeeded();

        const firstProductCard = page.locator('#catalog .grid > div').first();
        await expect(firstProductCard).toBeVisible();

        const productName = (
            await firstProductCard.locator('h3').textContent()
        )?.trim();
        expect(productName).toBeTruthy();

        // Hover over the product card and click Add to Cart
        await firstProductCard.hover();
        const addToCartBtn = firstProductCard
            .getByRole('button', { name: 'Add to Cart' })
            .first();
        await addToCartBtn.click();

        // Adding an item to the cart automatically opens the cart drawer for immediate feedback
        const cartDrawerOpen = page.locator('.ant-drawer-open');
        await expect(cartDrawerOpen).toBeVisible();
        await expect(cartDrawerOpen.locator(`text=${productName}`)).toBeVisible();

        // Close the drawer and verify cart badge in header reflects 1 item
        await page.locator('.ant-drawer-close').click();
        await expect(cartDrawerOpen).toBeHidden();

        const badge = page.locator('header button span.bg-accent');
        await expect(badge).toHaveText('1');

        await captureStepScreenshot(page, 'home-cart-item-added');
    });

    test('responsive layout adapts correctly across mobile and desktop viewports', async ({
        page,
    }) => {
        // 1. Mobile Viewport (375 x 667)
        await page.setViewportSize({ width: 375, height: 667 });
        await gotoPage(page, '/');

        // Verify desktop nav links are hidden on mobile
        const desktopNav = page.locator('header nav');
        await expect(desktopNav).toBeHidden();

        // Verify mobile menu toggle button is visible
        const mobileMenuToggle = page.locator(
            'header button:has(svg.lucide-menu)',
        );
        await expect(mobileMenuToggle).toBeVisible();

        // Verify hero section adapts
        await expect(
            page.getByRole('heading', { name: 'Simple Things, Beautiful Life' }),
        ).toBeVisible();

        await captureStepScreenshot(page, 'home-mobile-responsive');

        // 2. Desktop Viewport (1280 x 800)
        await page.setViewportSize({ width: 1280, height: 800 });

        // Verify desktop nav links are visible on desktop
        await expect(desktopNav).toBeVisible();
        await expect(desktopNav.locator('a:has-text("Shop")')).toBeVisible();

        // Verify mobile menu toggle is hidden on desktop
        await expect(mobileMenuToggle).toBeHidden();

        await captureStepScreenshot(page, 'home-desktop-responsive');
    });
});
