import { WalletBalance, FormattedWalletBalance, Prices } from './types';

/**
 * Gets the priority of a given blockchain.
 *
 * @param {string} blockchain - The name of the blockchain.
 * @returns {number} - The priority of the blockchain. Returns -99 if the blockchain is unknown.
 */
export const getPriority = (blockchain: string): number => {
    const priorities: Record<string, number> = {
        Osmosis: 100,
        Ethereum: 50,
        Arbitrum: 30,
        Zilliqa: 20,
        Neo: 20,
    };
    return priorities[blockchain] ?? -99; // Default priority for unknown blockchains
};

/**
 * Filters out invalid wallet balances.
 * A balance is considered valid if its priority is greater than -99 and its amount is greater than 0.
 *
 * @param {WalletBalance} balance - The wallet balance to check.
 * @returns {boolean} - True if the balance is valid, false otherwise.
 */
export const filterValidBalances = (balance: WalletBalance): boolean => {
    const priority = getPriority(balance.blockchain);
    return priority > -99 && balance.amount > 0;
};

/**
 * Maps a wallet balance to a formatted wallet balance.
 * Adds formatted amount, USD value, and priority to the balance.
 *
 * @param {WalletBalance} balance - The wallet balance to format.
 * @param {Prices} prices - The prices object containing currency to USD conversion rates.
 * @returns {FormattedWalletBalance} - The formatted wallet balance.
 */
export const mapToFormattedBalance = (
    balance: WalletBalance,
    prices: Prices
): FormattedWalletBalance => {
    const priority = getPriority(balance.blockchain);
    const usdValue = prices[balance.currency] ? prices[balance.currency] * balance.amount : 0;
    return {
        ...balance,
        formatted: balance.amount.toFixed(2),
        usdValue,
        priority,
    };
};

/**
 * Comparator function to sort formatted wallet balances by priority in descending order.
 *
 * @param {FormattedWalletBalance} a - The first formatted wallet balance to compare.
 * @param {FormattedWalletBalance} b - The second formatted wallet balance to compare.
 * @returns {number} - A negative number if a has a lower priority than b,
 *                     zero if they have the same priority,
 *                     or a positive number if a has a higher priority than b.
 */
export const sortByPriority = (a: FormattedWalletBalance, b: FormattedWalletBalance): number => {
    return b.priority - a.priority;
};
