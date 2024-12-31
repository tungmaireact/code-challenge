import { useMemo } from 'react';

import { WalletBalance, FormattedWalletBalance, Prices } from './types';
import { filterValidBalances, mapToFormattedBalance, sortByPriority } from './utils';

/**
 * Custom hook to get formatted wallet balances.
 * Filters out invalid balances, maps them to formatted balances, and sorts them by priority.
 *
 * @param {WalletBalance[]} balances - The array of wallet balances to format.
 * @param {Prices} prices - The prices object containing currency to USD conversion rates.
 * @returns {FormattedWalletBalance[]} - The array of formatted wallet balances.
 */
export const useFormattedBalances = (
    balances: WalletBalance[] = [],
    prices: Prices = {}
): FormattedWalletBalance[] => {
    return useMemo(() => {
        if (!balances.length) return [];
        return balances
            .filter(filterValidBalances)
            .map((balance) => mapToFormattedBalance(balance, prices))
            .sort(sortByPriority);
    }, [balances, prices]);
};