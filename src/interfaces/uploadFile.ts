export interface UploadFile {
	base64: string;
	filename: string;
	extension: string;
	folder: "categories" | "users" | "uploads";
}
