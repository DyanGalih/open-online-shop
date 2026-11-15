import type { Page } from '@playwright/test';

export interface TestCartItem {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
}

/**
 * Seed the shopping cart in both frontend localStorage and backend session.
 *
 * @param page The Playwright Page instance
 * @param items Array of cart items to populate
 */
export async function seedCart(
    page: Page,
    items: TestCartItem[],
): Promise<void> {
    await page.evaluate(async (cartItems) => {
        localStorage.setItem('online_shop_cart', JSON.stringify(cartItems));

        const csrfToken =
            (
                document.querySelector(
                    'meta[name="csrf-token"]',
                ) as HTMLMetaElement
            )?.content ?? '';

        await fetch('/cart/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                Accept: 'application/json',
            },
            body: JSON.stringify({
                items: cartItems.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            }),
        });
    }, items);
}

/**
 * Clear the shopping cart in both localStorage and backend session.
 *
 * @param page The Playwright Page instance
 */
export async function clearCart(page: Page): Promise<void> {
    await page.evaluate(async () => {
        localStorage.removeItem('online_shop_cart');

        const csrfToken =
            (
                document.querySelector(
                    'meta[name="csrf-token"]',
                ) as HTMLMetaElement
            )?.content ?? '';

        await fetch('/cart/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                Accept: 'application/json',
            },
            body: JSON.stringify({ items: [] }),
        });
    });
}
