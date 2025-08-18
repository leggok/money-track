<template>
	<v-container>
		<v-row>
			<v-col cols="12" md="6">
				<IncomeExpenseChart :transactions="transactions" :currencies="currencies" />
			</v-col>
			<v-col cols="12" md="6">
				<RecentTransactions :transactions="transactions" :currencies="currencies" />
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<CategoryChart :transactions="transactions" :currencies="currencies" />
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
	import { reactive, onMounted } from "vue";
	import IncomeExpenseChart from "@/components/IncomeExpenseChart.vue";
	import RecentTransactions from "@/components/RecentTransactions.vue";
	import CategoryChart from "@/components/CategoryChart.vue";
	import { TransactionsService } from "@/services/api";
	import CurrenciesService from "@/services/api/currency";
	import type { Transaction, Currency } from "@/interfaces";
	import { useUserStore } from "@/stores/user";

	const userStore = useUserStore();
	const transactions = reactive(<Transaction[]>[]);
	const currencies = reactive(<Currency[]>[]);

	async function getTransactions() {
		const { data } = await TransactionsService.getAll(userStore.user.id ?? 0);
		transactions.splice(0, transactions.length, ...data.transactions);
		transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
	}

	async function getCurrencies() {
		try {
			const { data } = await CurrenciesService.getAll();
			currencies.splice(0, currencies.length, ...(data.currencies || []));
		} catch (error) {
			console.error("Error fetching currencies:", error);
		}
	}

	onMounted(() => {
		getTransactions();
		getCurrencies();
	});
</script>
