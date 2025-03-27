import axiosApiInstance from "@/services/api/axiosConfig";
import type { Currency } from "@/interfaces/index";

export default class CurrenciesService {
	static add(currency: Currency) {
		return axiosApiInstance.post("/currencies", currency);
	}

	static getAll() {
		return axiosApiInstance.get("/currencies");
	}
}
