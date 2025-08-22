import type { Currency } from "./currency";

export interface Debt {
	id?: number;
	value: number;
	description?: string;
	currency_id: number;
	category_id: number;
	currency?: Currency;
	lender_id?: number;
	borrower_id?: number;
	status: string; // e.g., "pending", "paid", etc.
	timestamp: string; // ISO date string when debt created
	due_at?: string; // optional due date
	paid_at?: string; // optional paid date
	lender_name?: string; // name of person owed/lender
}
