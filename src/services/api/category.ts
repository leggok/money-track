import axiosApiInstance from "@/services/api/axiosConfig";
import type { Category } from "@/interfaces/index";

export default class CategoriesService {
	static create(category: Category) {
		const formData = new FormData();
		formData.append("title", category.title);
		formData.append("color", category.color);

		if (category.icon instanceof File) {
			formData.append("icon", category.icon);
		}

		return axiosApiInstance.post("/category", formData, {
			headers: { "Content-Type": "multipart/form-data" }
		});
	}
}
