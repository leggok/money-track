import axios from "axios";
import type { Registration, Login } from "@/interfaces";
import axiosApiInstance from "@/services/api/axiosConfig";
import { useAuthStore } from "@/stores/auth";
import type { AxiosResponse } from "axios";

// чистий інстанс для refresh-token, без інтерцепторів
const cleanAxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true
});

let isRefreshing = false;
let refreshPromise: Promise<AxiosResponse<unknown>> | null = null;

class AuthService {
	static registration(payload: Registration) {
		return axiosApiInstance.post("/auth/registration", payload);
	}

	static login(payload: Login) {
		return axiosApiInstance.post("/auth/login", payload);
	}

	static checkRole() {
		return axiosApiInstance.get("/auth/check-role");
	}

	static async refreshToken() {
		if (isRefreshing && refreshPromise) return refreshPromise;

		isRefreshing = true;
		refreshPromise = cleanAxiosInstance.get("/auth/refresh-token");

		try {
			const response = (await refreshPromise) as AxiosResponse<{
				accessToken?: string;
				access_token?: string;
			}>;
			const accessToken = response.data?.accessToken || response.data?.access_token;

			if (accessToken) {
				// оновлюємо axios та pinia-store
				axiosApiInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
				const authStore = useAuthStore();
				authStore.setToken(accessToken);
			}

			return response;
		} finally {
			isRefreshing = false;
			refreshPromise = null;
		}
	}
}

export default AuthService;
