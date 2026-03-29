export const CURRENCY_CODE = 'MAD';


export const formatPrice = (
    amount: number | null | undefined,
    notationStyle: 'standard' | 'compact' = 'standard'
): string => {
    if (amount === undefined || amount === null) return '';

    return amount.toLocaleString('fr-MA', {
        style: 'currency',
        currency: CURRENCY_CODE,
        notation: notationStyle,
        maximumFractionDigits: 0
    });
};