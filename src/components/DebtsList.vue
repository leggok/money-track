<template>
	<v-card class="recent-debts pa-6 rounded-lg" elevation="2">
		<div class="d-flex justify-space-between align-center mb-4">
			<v-card-title class="text-h6 font-weight-bold pa-0">{{ title }}</v-card-title>
		</div>

		<v-list class="debts-list" lines="two">
			<v-list-item
				v-for="debt in debts"
				:key="debt.id"
				class="debt-item mb-2 rounded-lg"
				:class="debt.status"
			>
				<template v-slot:prepend>
					<v-avatar
						:color="debt.status === 'paid' ? 'success' : 'warning'"
						size="40"
						class="elevation-1"
					>
						<v-icon
							:icon="debt.status === 'paid' ? 'mdi-check' : 'mdi-alert'"
							color="white"
						></v-icon>
					</v-avatar>
				</template>

				<v-list-item-title class="text-body-1 font-weight-medium">
					{{ debt.description || "No description" }}
				</v-list-item-title>
				<v-list-item-subtitle class="text-caption">
					<div class="d-flex align-center">
						<span class="amount mr-2">
							{{ debt.status === "paid" ? "-" : "" }}
							{{
								convertCurrencyValue(
									debtConverted(debt),
									userMainCurrency || null,
									currencies
								).symbol
							}}
							{{
								convertCurrencyValue(
									debtConverted(debt),
									userMainCurrency || null,
									currencies
								).value.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})
							}}
						</span>
						<v-chip
							size="x-small"
							:color="debt.status === 'paid' ? 'success' : 'warning'"
							variant="tonal"
							class="mr-2"
						>
							{{ debt.status }}
						</v-chip>
						<v-chip size="x-small" variant="outlined" class="text-caption">
							{{ formatDate(debt.timestamp) }}
						</v-chip>
					</div>
				</v-list-item-subtitle>
			</v-list-item>
		</v-list>
	</v-card>
</template>

<script setup lang="ts">
	import { computed as vueComputed } from "vue";
	import { useUserStore } from "@/stores/user";
	import type { Debt, Currency } from "@/interfaces";
	import convertCurrencyValue from "@/utils/convertCurrencyValue";

	const props = defineProps<{ debts: Debt[]; currencies: Currency[]; cardTitle?: string }>();
	console.log("props", props);

	const userStore = useUserStore();

	// default title
	const title = vueComputed(() => props.cardTitle ?? "Debts");

	// Get user's main currency
	const userMainCurrency = vueComputed(() => {
		const mainCurrencyId = userStore.user.main_currency_id;
		return props.currencies.find((currency) => currency.id === mainCurrencyId);
	});

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	}

	// convertCurrencyValue expects Transaction-like object with currency property; we adapt
	function debtConverted(debt: Debt) {
		return {
			...debt,
			currency: props.currencies.find((c) => c.id === debt.currency_id) || {
				symbol: "₴",
				currency_value: 1,
				id: debt.currency_id,
				name: "",
				code: "",
				country: "",
				is_main: false,
				currency_date: new Date()
			},
			type: (debt.lender_id === userStore.user.id ? "income" : "expense") as
				| "income"
				| "expense" // added to satisfy Transaction type
		};
	}
</script>

<style scoped lang="scss">
	.recent-debts {
		background: #fff;
	}

	.debts-list {
		max-height: 328px;
		overflow-y: auto;
	}

	.debt-item {
		background: rgba(var(--v-theme-surface-variant), 0.5);
		transition: transform 0.2s ease-in-out;

		&:hover {
			background: rgba(var(--v-theme-surface-variant), 0.5);
		}

		&.paid {
			border-left: 4px solid rgb(var(--v-theme-success));
		}

		&.pending {
			border-left: 4px solid rgb(var(--v-theme-warning));
		}
	}

	.amount {
		font-weight: 600;
	}

	:deep(.v-list-item__prepend) {
		padding-right: 16px;
	}

	:deep(.v-list-item-title) {
		line-height: 1.2;
		margin-bottom: 4px;
	}

	:deep(.v-list-item-subtitle) {
		line-height: 1.2;
	}
</style>
