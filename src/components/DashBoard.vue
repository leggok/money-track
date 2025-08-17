<template>
	<v-container>
		<v-row>
			<v-col cols="12" md="6">
				<IncomeExpenseChart :transactions="transactions" />
			</v-col>
			<v-col cols="12" md="6">
				<RecentTransactions :transactions="transactions" />
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<CategoryChart :transactions="transactions" />
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
	import type { Transaction } from "@/interfaces";
	import { useUserStore } from "@/stores/user";

	const userStore = useUserStore();
	const transactions = reactive(<Transaction[]>[]);

	async function getTransactions() {
		const { data } = await TransactionsService.getAll(userStore.user.id ?? 0);
		transactions.splice(0, transactions.length, ...data.transactions);
	}

	onMounted(() => {
		getTransactions();
	});
</script>
