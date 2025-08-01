import { defineStore } from "pinia";
import type { User } from "@/interfaces";

interface UserState {
	user: User;
}

interface UserActions {
	setUser(user: User): void;
	clearUser(): void;
	setUserRole(role: string): void;
}

const emptyUser: User = {
	id: null,
	first_name: "",
	last_name: "",
	username: "",
	email: "",
	avatar: "",
	total_budget: 0
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
			},
			setUserRole(role: string) {
				this.role = role;
			}
		},

		persist: true // To save user in localStorage
	}
);
