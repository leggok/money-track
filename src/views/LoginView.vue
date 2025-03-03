<template>
	<v-container class="d-flex align-center justify-center" style="height: 100vh">
		<v-card class="pa-6" width="400">
			<v-card-title class="text-center text-h5">Login</v-card-title>
			<v-card-text>
				<v-form @submit.prevent="sendDataForLogin" ref="form" lazy-validation>
					<v-text-field
						v-model="login"
						label="Login or email"
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

					<v-btn type="submit" color="primary" block class="mt-4">Login</v-btn>
				</v-form>

				<v-btn @click="goToRegister" color="secondary" block class="mt-4">
					Registration
				</v-btn>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useRouter } from "vue-router";

	const login = ref<string>("");
	const password = ref<string>("");
	const showPassword = ref<boolean>(false);
	const router = useRouter();

	const togglePasswordVisibility = (): void => {
		showPassword.value = !showPassword.value;
	};

	const sendDataForLogin = (): void => {
		console.log("Login:", login.value, "Password:", password.value);
	};

	const goToRegister = (): void => {
		router.push({ name: "Register" });
	};

	const rules = {
		required: (value: string) => !!value || "This field is required",
		minLength: (length: number) => (value: string) =>
			(value && value.length >= length) || `Minimum length is ${length} characters`
	};
</script>
