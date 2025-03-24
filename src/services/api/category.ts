import axiosApiInstance from "@/services/api/axiosConfig";
import type { Category } from "@/interfaces/index";

export default class CategoriesService {
	static create(category: Category) {
		return axiosApiInstance.post("/category", category);
	}
}
