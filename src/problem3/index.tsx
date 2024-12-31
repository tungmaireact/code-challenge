import React from 'react';

import { FormattedWalletBalance } from './types';
import { useFormattedBalances } from './hooks';

interface Props extends BoxProps {
    children?: React.ReactNode;
}

const WalletRowComponent: React.FC<FormattedWalletBalance> = ({
    currency,
    amount,
    formatted,
    usdValue,
}) => (
    <WalletRow
        key={currency}
        className={classes.row}
        amount={amount}
        usdValue={usdValue}
        formattedAmount={formatted}
    />
);

export const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;

    const balances = useWalletBalances();
    const prices = usePrices();

    const formattedBalances = useFormattedBalances(balances, prices);

    return (
        <div {...rest}>
            {formattedBalances.map((balance) => (
                <WalletRowComponent key={balance.currency} {...balance} />
            ))}
        </div>
    );
};