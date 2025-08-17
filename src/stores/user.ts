import { defineStore } from "pinia";
import type { User } from "@/interfaces";

interface UserState {
	user: User;
}

interface UserActions {
	setUser(user: User): void;
	clearUser(): void;
}

const emptyUser: User = {
	id: null,
	first_name: "",
	last_name: "",
	username: "",
	email: "",
	avatar: "",
	total_budget: 0,
	main_currency_id: 0
};

export const useUserStore = defineStore<"user", UserState, Record<string, never>, UserActions>(
	"user",
	{
		state: (): UserState => ({
			user: emptyUser
		}),

		actions: {
			setUser(user: User) {
				this.user = user;
			},
			clearUser() {
				this.user = emptyUser;
			}
		},

		persist: true // To save user in localStorage
	}
);
