import axiosApiInstance from "@/services/api/axiosConfig";
import type { Registration, Login } from "@/interfaces/index";

export default class AuthService {
	static registration(auth: Registration) {
		return axiosApiInstance.post("/auth/registration", auth);
	}

	static login(auth: Login) {
		return axiosApiInstance.post("/auth/login", auth);
	}

	static checkRole() {
		return axiosApiInstance.get("/auth/check-role");
	}

	static refreshToken() {
		return axiosApiInstance.get("/auth/refresh-token");
	}
}
