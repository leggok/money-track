import { createRouter, createWebHistory } from "vue-router";
import AuthService from "@/services/api/auth";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "Dashboard",
			component: () => import("../views/DashboardView.vue")
		},
		{
			path: "/login",
			name: "Login",
			component: () => import("../views/LoginView.vue"),
			meta: {
				auth: false
			}
		},
		{
			path: "/register",
			name: "Register",
			component: () => import("../views/RegisterView.vue"),
			meta: {
				auth: false
			}
		}
	]
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.auth !== false) {
        try {
            await AuthService.checkRole();
        } catch (error) {
            try {
                await AuthService.refreshToken();
                await AuthService.checkRole();
            } catch (refreshError) {
                router.push({ name: "Login" });
                return;
            }
        }
    }

    next();
});

export default router;
