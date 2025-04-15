export interface Category {
	id?: number;
	title: string;
	icon: string | File | null; // Додаємо підтримку файлів
	color: string;
	total?: number;
}
