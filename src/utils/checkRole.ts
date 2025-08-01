import { computed } from "vue";
import { AuthService } from "@/services/api/index.js";

export const checkRole = computed(async () => {
    try {
        const { data } = await AuthService.checkRole();
        console.log("data", data);
        return data.role;
    } catch (error) {
        try {
            const { data: refreshData } = await AuthService.refreshToken();

            try {
                const { data: recheckData } = await AuthService.checkRole();
                return recheckData.role;
            } catch (recheckError) {
                if (recheckError.response.status === 404 && recheckError.response.data.message === "User is terminated") {
                    alert("User is terminated");
                } else {
                    router.push({ name: "Login" });
                }
            }
        } catch (refreshError) {
            router.push({ name: "Login" });
        }
    }
});
