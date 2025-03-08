import axios from "axios";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import { AxiosError } from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosApiInstance = axios.create();

// Оновлений тип для помилок
interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
		message?: string;
	};
	message?: string;
	config: AxiosRequestConfig;
}

axiosApiInstance.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	async (error: AxiosError<ErrorResponse>) => {
		const { response, config } = error;

		if (response?.data?.message === "No access token") {
			// Перевірка, чи є повідомлення про відсутність токена
			const originalRequest = config;

			try {
				// Спробуємо отримати новий токен
				await axios.get("/auth/refresh-token");
				// Після успішного оновлення токена, повторюємо запит
				if (originalRequest) {
					return axios(originalRequest);
				}
				return Promise.reject(new Error("Original request is undefined"));
			} catch (err) {
				// Якщо не вдалося оновити токен, перенаправляємо на сторінку логіну
				console.error("Failed to refresh token, redirecting to login.");
				window.location.href = "/login/";
				return Promise.reject(err);
			}
		}

		// У випадку інших помилок
		return Promise.reject(error);
	}
);

export default axiosApiInstance;
