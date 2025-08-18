import type { Transaction } from "@/interfaces/transaction";
import type { Currency } from "@/interfaces/currency";

export default function convertCurrencyValue(transaction: Transaction, userMainCurrency: Currency | null, currencies: Currency[]): { value: number; symbol: string } {
    // If user has no main currency set, return original values
    if (!userMainCurrency) {
        return {
            value: Number(transaction.value),
            symbol: transaction.currency.symbol
        };
    }

    if (transaction.currency.id === userMainCurrency.id) {
        return {
            value: Number(transaction.value),
            symbol: transaction.currency.symbol
        };
    }

    const currency_value = currencies.find(currency => currency.id === transaction.currency.id)?.currency_value ?? 1;
    
    const convertedValue = (transaction.value / currency_value) * userMainCurrency.currency_value;

    return {
        value: convertedValue,
        symbol: userMainCurrency.symbol
    };
}