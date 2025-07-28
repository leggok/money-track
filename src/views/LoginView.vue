<template>
	<v-container class="d-flex align-center justify-center" style="height: 100vh">
		<v-card class="pa-6" width="400">
			<v-card-title class="text-center text-h5">Login</v-card-title>
			<v-card-text>
				<v-form @submit.prevent="sendDataForLogin" ref="form" lazy-validation>
					<v-text-field
						v-model="email"
						label="Email"
						:rules="[rules.required, rules.email]"
						required
					></v-text-field>

					<v-text-field
						v-model="password"
						:append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
						@click:append-inner="togglePasswordVisibility"
						label="Password"
						:type="showPassword ? 'password' : 'text'"
						:rules="[rules.required, rules.minLength(6)]"
						required
					></v-text-field>

					<v-btn
						type="submit"
						color="primary"
						block
						class="mt-4"
						:disabled="disableSubmit"
						>Login</v-btn
					>
				</v-form>

				<v-btn @click="goToRegister" color="secondary" block class="mt-4">
					Registration
				</v-btn>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script setup lang="ts">
	import { ref, watchEffect } from "vue";
	import axios from "axios";
	import { useRouter } from "vue-router";
	import type { Login } from "@/interfaces/index";
	import { AuthService } from "@/services/api";
	import { showMessage } from "@/utils/message";
	import { testEmail } from "@/utils/validation";
	import { useUserStore } from "@/stores/user";
	import { useAuthStore } from "@/stores/auth";

	const userStore = useUserStore();
	const authStore = useAuthStore();

	const email = ref<string>("");
	const password = ref<string>("");
	const showPassword = ref<boolean>(false);
	const router = useRouter();
	const disableSubmit = ref<boolean>(false);

	const togglePasswordVisibility = (): void => {
		showPassword.value = !showPassword.value;
	};

	const sendDataForLogin = async (): Promise<void> => {
		try {
			const authData: Login = {
				email: email.value,
				password: password.value
			};

			const response = await AuthService.login(authData);

			userStore.setUser(response.data.user);
			// Save access token
			if (response.data.accessToken) {
				authStore.setToken(response.data.accessToken);
			}

			if (response.data.success) {
				showMessage("Login successful!", "success");
			} else {
				showMessage(response.data.message, "error");
			}
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				showMessage(error.response?.data.message, "error");
			} else {
				showMessage("An unexpected error occurred", "error");
			}
		}
	};

	const goToRegister = (): void => {
		router.push({ name: "Register" });
	};

	watchEffect(async () => {
		if (!testEmail(email.value) || password.value.length === 0) {
			disableSubmit.value = true;
		} else {
			disableSubmit.value = false;
		}
	});

	const rules = {
		required: (value: string) => !!value || "This field is required",
		minLength: (length: number) => (value: string) =>
			(value && value.length >= length) || `Minimum length is ${length} characters`,
		email: (value: string) => testEmail(value) || "Please enter a valid email address"
	};
</script>
