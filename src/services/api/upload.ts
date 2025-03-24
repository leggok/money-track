import axiosApiInstance from "@/services/api/axiosConfig";
import type { UploadFile } from "@/interfaces";

export default class UploadsService {
	static upload(body: UploadFile) {
		return axiosApiInstance.post("/upload", body);
	}
}
