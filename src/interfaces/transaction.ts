import type { Currency } from "./currency";

export interface Transaction {
	id?: number;
	value: number;
	description?: string;
	category_id: number;
	currency_id: number;
	currency: Currency;
	type: "expense" | "income";
	timestamp: string;
}
