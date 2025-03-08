<template>
	<v-container class="d-flex align-center justify-center" style="height: 100vh">
		<v-card class="pa-6" width="400">
			<v-card-title class="text-center text-h5">Registration</v-card-title>
			<v-card-text>
				<v-form @submit.prevent="sendDataForRegister" ref="form" lazy-validation>
					<v-text-field
						v-model="firstName"
						label="First Name"
						:rules="[rules.required]"
						required
					></v-text-field>
					<v-text-field
						v-model="lastName"
						label="Last Name"
						:rules="[rules.required]"
						required
					></v-text-field>
					<v-text-field
						v-model="username"
						label="Username"
						:rules="[rules.required]"
						required
					></v-text-field>
					<v-text-field
						v-model="email"
						label="Email"
						:rules="[rules.required]"
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

					<v-btn type="submit" color="primary" block class="mt-4">Submit</v-btn>
				</v-form>

				<v-btn @click="goToLogin" color="secondary" block class="mt-4"> Login </v-btn>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useRouter } from "vue-router";
	import { AuthService } from "@/services/api";
	import type { Registration } from "@/interfaces/index";
	import { showMessage } from "@/utils/message";
	import axios from "axios";

	const firstName = ref<string>("");
	const lastName = ref<string>("");
	const username = ref<string>("");
	const email = ref<string>("");
	const password = ref<string>("");
	const confirmPassword = ref<string>("");
	const showPassword = ref<boolean>(false);
	const router = useRouter();

	const togglePasswordVisibility = (): void => {
		showPassword.value = !showPassword.value;
	};

	const sendDataForRegister = async (): Promise<void> => {
		try {
			const authData: Registration = {
				firstName: firstName.value,
				lastName: lastName.value,
				username: username.value,
				email: email.value,
				password: password.value
			};

			const response = await AuthService.registration(authData);

			if (response.data.success) {
				showMessage("Registration successful!", "success");
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
		router.push("/");
	};

	const rules = {
		required: (value: string) => !!value || "This field is required",
		minLength: (length: number) => (value: string) =>
			(value && value.length >= length) || `Minimum length is ${length} characters`
	};
</script>
