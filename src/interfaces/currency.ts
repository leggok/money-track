export interface Currency {
	id?: number;
	name: string;
	code: string;
	symbol: string;
	country: string;
	currency_value: number;
	currency_date: Date;
	is_main: boolean;
}
