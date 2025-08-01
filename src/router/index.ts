import { createRouter, createWebHistory } from "vue-router";
import { AuthService } from "@/services/api";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: "/", name: "Dashboard", component: () => import("@/views/DashboardView.vue") },
		{
			path: "/login",
			name: "Login",
			component: () => import("@/views/LoginView.vue"),
			meta: { auth: false }
		},
		{
			path: "/register",
			name: "Register",
			component: () => import("@/views/RegisterView.vue"),
			meta: { auth: false }
		}
	]
});

router.beforeEach(async (to) => {
	if (to.meta.auth === false) return true; // публічні маршрути

	const authStore = useAuthStore();
	const userStore = useUserStore();

	/* якщо токена немає – спроба тихо поновити */
	if (!authStore.token) {
		try {
			await AuthService.refreshToken();
		} catch {
			return { name: "Login" };
		}
	}

	/* необов’язково: перевірка ролі */
	try {
		const { data } = await AuthService.checkRole();
		userStore.setUserRole(data.role); // ↓ див. примітку
	} catch {
		// якщо роль не дістається – вилогінюємо
		authStore.clearToken();
		userStore.clearUser();
		return { name: "Login" };
	}

	return true;
});

export default router;
