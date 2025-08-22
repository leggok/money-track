import axiosApiInstance from "@/services/api/axiosConfig";
import type { Debt } from "@/interfaces";

export default class DebtsService {
	static getAll(userId: number) {
		return axiosApiInstance.get(`/debt?user_id=${userId}`);
	}

	static create(debt: Debt) {
		return axiosApiInstance.post("/debt", debt);
	}

	static update(id: number, debt: Partial<Debt>) {
		return axiosApiInstance.put(`/debt/${id}`, debt);
	}

	static delete(id: number) {
		return axiosApiInstance.delete(`/debt/${id}`);
	}
}
