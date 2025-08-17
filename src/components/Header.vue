<template>
	<v-app-bar color="primary" elevation="2">
		<v-container class="d-flex align-center">
			<v-row align="center" no-gutters>
				<!-- Logo/Title -->
				<v-col cols="auto" class="mr-8">
					<v-app-bar-title class="text-h5 font-weight-bold text-white">
						Money Track
					</v-app-bar-title>
				</v-col>

				<!-- Balance Section -->
				<v-col cols="auto" class="mr-6">
					<v-card class="balance-section pa-3" elevation="0" color="rgba(255,255,255,0.1)">
						<v-row align="center" no-gutters>
							<v-col cols="auto" class="mr-3">
								<v-icon size="20" color="white">mdi-wallet</v-icon>
							</v-col>
							<v-col>
								<div class="text-caption text-white text-opacity-70">Balance</div>
								<div class="d-flex align-center">
									<div class="text-body-1 font-weight-bold text-white mr-2">
										₴{{ balance.toLocaleString() }}
									</div>
									<v-btn
										icon="mdi-refresh"
										size="small"
										color="white"
										variant="text"
										@click="refreshBalance"
										:loading="isRefreshingBalance"
									></v-btn>
								</div>
							</v-col>
						</v-row>
					</v-card>
				</v-col>

				<!-- Currency Exchange Section -->
				<v-col cols="auto" class="mr-4" v-if="currencies.length > 0">
					<v-card class="currency-section pa-3" elevation="0" color="rgba(255,255,255,0.1)">
						<v-row align="center" no-gutters>
							<v-col>
								<div class="text-caption text-white text-opacity-70">Exchange Rate</div>
								<div class="d-flex align-center">
									<v-select
										v-model="selectedCurrency"
										:items="currencies"
										item-title="code"
										item-value="code"
										density="compact"
										variant="outlined"
										hide-details
										class="currency-select mr-2"
										@update:model-value="onCurrencyChange"
									>
										<template #selection="{ item }">
											<div class="d-flex align-center flex-nowrap">
												<span class="text-white font-weight-medium text-no-wrap">{{ item.raw.code }}</span>
												<span class="text-white text-opacity-70 ml-1 text-no-wrap">({{ Number(item.raw.currency_value).toFixed(2) }})</span>
												<v-tooltip :text="new Date(item.raw.currency_date).toLocaleString()">
													<template v-slot:activator="{ props }">
														<v-icon v-bind="props" size="16" class="ml-1 flex-shrink-0">mdi-information-outline</v-icon>
													</template>
												</v-tooltip>
											</div>
										</template>
										<template #item="{ item, props }">
											<v-list-item v-bind="props">
												<template #prepend>
													<v-icon size="16" color="primary">mdi-currency-{{ item.raw.code.toLowerCase() }}</v-icon>
												</template>
												<v-list-item-title>{{ item.raw.code }}</v-list-item-title>
												<v-list-item-subtitle>{{ item.raw.name }}</v-list-item-subtitle>
												<template #append>
													<span class="text-caption">{{ Number(item.raw.currency_value).toFixed(2) }}</span>
												</template>
											</v-list-item>
										</template>
									</v-select>
									<v-btn
										icon="mdi-refresh"
										size="small"
										color="white"
										variant="text"
										@click="refreshCurrencies"
										:loading="isRefreshing"
									></v-btn>
								</div>
							</v-col>
						</v-row>
					</v-card>
				</v-col>

				<!-- User Menu -->
				<v-spacer></v-spacer>
				<v-col cols="auto">
					<v-menu>
						<template #activator="{ props }">
							<v-btn
								v-bind="props"
								icon="mdi-account-circle"
								color="white"
								variant="text"
								size="large"
							></v-btn>
						</template>
						<v-list>
							<v-list-item @click="logout">
								<template #prepend>
									<v-icon>mdi-logout</v-icon>
								</template>
								<v-list-item-title>Logout</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
				</v-col>
			</v-row>
		</v-container>
	</v-app-bar>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import { useRouter } from "vue-router";
	import { useUserStore } from "@/stores/user";
	import { useAuthStore } from "@/stores/auth";
	import CurrenciesService from "@/services/api/currency";
	import { UsersService, AuthService } from "@/services/api";
	import type { Currency } from "@/interfaces";

	const router = useRouter();
	const userStore = useUserStore();
	const authStore = useAuthStore();

	const balance = ref(0);
	const currencies = ref<Currency[]>([]);
	const selectedCurrency = ref<string>("");
	const isRefreshing = ref(false);
	const isRefreshingBalance = ref(false);

	const user_id = userStore.user.id ?? 0;
	
	const user_main_currency_id = userStore.user.main_currency_id ?? 0;

	async function getBalance() {
		try {
			const { data } = await UsersService.getBalance(user_id);
			balance.value = data.balance;
		} catch (error) {
			console.error("Error fetching balance:", error);
		}
	}

	async function getCurrencies(update = false) {
		try {
			const { data } = await CurrenciesService.getAll(update);
			currencies.value = data.currencies || [];
			
			if (currencies.value.length > 0) {
				if (user_main_currency_id > 0) {
					// Find currency by user's main currency ID
					const userCurrency = currencies.value.find(currency => currency.id === user_main_currency_id);

					if (userCurrency) {
						selectedCurrency.value = userCurrency.code;
					} else {
						// Fallback to first currency if user's currency not found
						selectedCurrency.value = currencies.value[0].code;
					}
				} else {
					// If user has no main currency set, use first available
					selectedCurrency.value = currencies.value[0].code;
				}
			}
		} catch (error) {
			console.error("Error fetching currencies:", error);
		}
	}

	async function refreshCurrencies() {
		isRefreshing.value = true;
		try {
			await getCurrencies(true);
		} finally {
			isRefreshing.value = false;
		}
	}

	async function refreshBalance() {
		isRefreshingBalance.value = true;
		try {
			await getBalance();
		} finally {
			isRefreshingBalance.value = false;
		}
	}

	async function onCurrencyChange() {
		try {
			const newSelectedCurrency = currencies.value.find((currency) => currency.code === selectedCurrency.value);
			const userCurrencyId = newSelectedCurrency?.id;
			
			if (user_id && userCurrencyId) {
				await CurrenciesService.updateMainCurrencyForUser(user_id, userCurrencyId);
				
				// Update user store with new main currency ID
				userStore.user.main_currency_id = userCurrencyId;
			}
		} catch (error) {
			console.error("Error updating main currency:", error);
			// Optionally revert the selection if the API call fails
			// You might want to show a user-friendly error message here
		}
	}

	async function logout() {
		await AuthService.logout();
		authStore.clearToken();
		userStore.clearUser();
		router.push({ name: "Login" });
	}

	onMounted(() => {
		getBalance();
		getCurrencies();
	});
</script>

<style scoped>
	.balance-section,
	.currency-section {
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.currency-select {
		max-width: 180px;
		min-width: 120px;
	}

	:deep(.currency-select .v-field) {
		background: rgba(255, 255, 255, 0.1) !important;
		border: 1px solid rgba(255, 255, 255, 0.3) !important;
	}

	:deep(.currency-select .v-field__input) {
		color: white !important;
	}

	:deep(.currency-select .v-field__outline) {
		--v-field-border-opacity: 0.3;
	}

	:deep(.currency-select .v-field__outline__start) {
		border-color: rgba(255, 255, 255, 0.3) !important;
	}

	:deep(.currency-select .v-field__outline__end) {
		border-color: rgba(255, 255, 255, 0.3) !important;
	}

	:deep(.currency-select .v-field__outline__notch) {
		border-color: rgba(255, 255, 255, 0.3) !important;
	}

	:deep(.currency-select .v-field__outline__notch::before) {
		border-color: rgba(255, 255, 255, 0.3) !important;
	}

	:deep(.currency-select .v-field__outline__notch::after) {
		border-color: rgba(255, 255, 255, 0.3) !important;
	}

	:deep(.currency-select .v-field__input) {
		overflow: hidden;
	}

	:deep(.currency-select .v-field__input > div) {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.text-no-wrap {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.flex-nowrap {
		flex-wrap: nowrap;
	}

	.flex-shrink-0 {
		flex-shrink: 0;
	}
</style>
