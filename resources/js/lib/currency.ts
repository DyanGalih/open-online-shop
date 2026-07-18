export const CURRENCY_CONFIG = {
    locale: 'en-US',
    currency: 'USD',
    symbol: '$',
};

export function formatCurrency(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num)) {
        return CURRENCY_CONFIG.symbol + '0.00';
    }

    return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
        style: 'currency',
        currency: CURRENCY_CONFIG.currency,
    }).format(num);
}

export function formatNumberInput(value: string): string {
    const clean = value.replace(/[^0-9.]/g, '');
    const parts = clean.split('.');

    const intPart = parts[0];

    if (intPart) {
        const num = parseInt(intPart, 10);
        parts[0] = isNaN(num) ? '' : num.toLocaleString(CURRENCY_CONFIG.locale);
    }

    return parts.join('.');
}

export function parseNumberInput(value: string): number {
    const cleaned = value.replace(/[^0-9.]/g, '');

    return cleaned === '' ? 0 : parseFloat(cleaned);
}
