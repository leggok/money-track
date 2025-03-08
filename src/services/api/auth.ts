import axiosApiInstance from "@/services/api/axiosConfig";
import type { Auth } from "@/interfaces";

export default class AuthService {
	static registration(auth: Auth) {
		return axiosApiInstance.post("/auth/registration", auth);
	}
}
