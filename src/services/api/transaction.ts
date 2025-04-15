import axiosApiInstance from "@/services/api/axiosConfig";
import type { Transaction } from "@/interfaces/index";

export default class TransactionsService {
	static add(transaction: Transaction) {
		return axiosApiInstance.post("/transactions", transaction);
	}

	static getAll(userId: number) {
		return axiosApiInstance.get(`/transactions?user_id=${userId}`);
	}
}
