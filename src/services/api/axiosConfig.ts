import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { AuthService } from "@/services/api";
import { useAuthStore } from "@/stores/auth";

const axiosApiInstance = axios.create({
	withCredentials: true,
	baseURL: import.meta.env.VITE_API_BASE_URL
});

/* ---------- helper ---------- */
function setAuthHeader(token: string | null) {
	if (token) axiosApiInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
	else delete axiosApiInstance.defaults.headers.common.Authorization;
}

/* ---------- request: підставляємо токен ---------- */
axiosApiInstance.interceptors.request.use((config) => {
	const { token } = useAuthStore(); // Pinia store (persisted)
	setAuthHeader(token);
	return config;
});

/* ---------- response: обробка помилок ---------- */
axiosApiInstance.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: AxiosError<{ message: string }>) => {
		// запит було скасовано користувачем/AbortController
		if (error.name === "CanceledError") throw error;

		if (error.response?.status === 401) {
			/* ------ спроба поновити токен ------ */
			try {
				// Спроба тихо оновити токен
				await AuthService.refreshToken();
				// Після успішного оновлення токена повторюємо оригінальний запит
				const originalRequest = error.config as AxiosRequestConfig;
				return axios(originalRequest);
			} catch (refreshErr: unknown) {
				// якщо back-end повернув, що користувача видалено
				if (
					(refreshErr as AxiosError<{ message: string }>).response?.status === 404 &&
					(refreshErr as AxiosError<{ message: string }>).response?.data?.message ===
						"User is terminated"
				) {
					alert("User is terminated");
				}

				// у всіх інших випадках перекидаємо на /login
				const path = window.location.pathname;
				if (!path.includes("login")) window.location.href = "/login/";
				return Promise.reject(refreshErr);
			}
		}

		return Promise.reject(error);
	}
);

export default axiosApiInstance;
