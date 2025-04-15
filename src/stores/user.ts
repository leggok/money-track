import { defineStore } from "pinia";
import type { User } from "@/interfaces";

interface UserState {
	user: User | null;
}

interface UserActions {
	setUser(user: User): void;
	clearUser(): void;
}

export const useUserStore = defineStore<"user", UserState, Record<string, never>, UserActions>(
	"user",
	{
		state: (): UserState => ({
			user: null
		}),

		actions: {
			setUser(user: User) {
				this.user = user;
			},
			clearUser() {
				this.user = null;
			}
		},

		persist: true // To save user in localStorage
	}
);
