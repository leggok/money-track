import axiosApiInstance from "@/services/api/axiosConfig";
import type { Currency } from "@/interfaces/index";

export default class CurrenciesService {
	static add(currency: Currency) {
		return axiosApiInstance.post("/currencies", currency);
	}

	static getAll(update = false) {
		return axiosApiInstance.get("/currencies", { params: { update } });
	}

	static updateMainCurrencyForUser(user_id: number, currency_id: number) {
		return axiosApiInstance.patch("/currencies/update-main-currency-for-user", {
			user_id,
			currency_id
		});
	}
}
