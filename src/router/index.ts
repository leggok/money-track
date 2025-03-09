import { createRouter, createWebHistory } from "vue-router";

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
			component: () => import("../views/LoginView.vue")
		},
		{
			path: "/register",
			name: "Register",
			component: () => import("../views/RegisterView.vue")
		}
	]
});

export default router;
