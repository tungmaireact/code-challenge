export interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
}

export interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
    usdValue: number;
    priority: number;
}

export type Prices = Record<string, number>;