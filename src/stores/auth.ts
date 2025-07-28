import { defineStore } from "pinia";
import axiosApiInstance from "@/services/api/axiosConfig";

interface AuthState {
	token: string;
}

interface AuthActions {
	setToken(token: string): void;
	clearToken(): void;
}

export const useAuthStore = defineStore<"auth", AuthState, Record<string, never>, AuthActions>(
	"auth",
	{
		state: (): AuthState => ({
			token: localStorage.getItem("accessToken") || ""
		}),
		actions: {
			setToken(token: string) {
				this.token = token;
				localStorage.setItem("accessToken", token);
				axiosApiInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			},
			clearToken() {
				this.token = "";
				localStorage.removeItem("accessToken");
				delete axiosApiInstance.defaults.headers.common["Authorization"];
			}
		},
		persist: true
	}
);
