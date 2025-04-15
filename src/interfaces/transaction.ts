export interface Transaction {
	id?: number;
	value: number;
	description?: string;
	category_id: number;
	currency_id: number;
	currency?: {
		rate: number;
		code: string;
	};
	type: "expense" | "income";
	timestamp: string;
}
