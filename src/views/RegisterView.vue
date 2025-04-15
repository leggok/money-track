<template>
	<v-container class="d-flex align-center justify-center" style="height: 100vh">
		<v-card class="pa-6" width="400">
			<v-card-title class="text-center text-h5">Registration</v-card-title>
			<v-card-text>
				<v-form @submit.prevent="sendDataForRegister" ref="form" lazy-validation>
					<v-text-field
						v-model="first_name"
						label="First Name"
						:rules="[rules.required]"
						required
					></v-text-field>
					<v-text-field v-model="last_name" label="Last Name"></v-text-field>
					<v-text-field
						v-model="username"
						label="Username"
						:rules="[rules.required]"
						required
					></v-text-field>
					<v-text-field
						v-model="email"
						label="Email"
						type="email"
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
					<v-text-field
						v-model="confirmPassword"
						:append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
						@click:append-inner="togglePasswordVisibility"
						label="Confirm password"
						:type="showPassword ? 'password' : 'text'"
						:rules="[rules.required, rules.minLength(6)]"
						required
					></v-text-field>

					<v-btn
						:disabled="disableSubmit"
						type="submit"
						color="primary"
						block
						class="mt-4"
						>Submit</v-btn
					>
				</v-form>

				<v-btn @click="goToLogin" color="secondary" block class="mt-4"> Login </v-btn>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script setup lang="ts">
	import { ref, watchEffect } from "vue";
	import { useRouter } from "vue-router";
	import { AuthService } from "@/services/api";
	import type { Registration } from "@/interfaces/index";
	import { showMessage } from "@/utils/message";
	import axios from "axios";
	import { testEmail } from "@/utils/validation";

	const first_name = ref<string>("");
	const last_name = ref<string>("");
	const username = ref<string>("");
	const email = ref<string>("");
	const password = ref<string>("");
	const confirmPassword = ref<string>("");
	const showPassword = ref<boolean>(false);
	const disableSubmit = ref<boolean>(false);
	const router = useRouter();
	const form = ref();

	const togglePasswordVisibility = (): void => {
		showPassword.value = !showPassword.value;
	};

	const sendDataForRegister = async (): Promise<void> => {
		try {
			const authData: Registration = {
				first_name: first_name.value,
				last_name: last_name.value,
				username: username.value,
				email: email.value,
				password: password.value
			};

			const response = await AuthService.registration(authData);

			if (response.data.success) {
				showMessage("Registration successful!", "success");
				goToLogin();
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

	const goToLogin = (): void => {
		router.push({ name: "Login" });
	};

	watchEffect(async () => {
		if (
			password.value !== confirmPassword.value ||
			!testEmail(email.value) ||
			first_name.value.length === 0 ||
			username.value.length === 0
		) {
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
