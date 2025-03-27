<template>
	<v-container>
		<v-row>
			<v-col cols="12" md="6">
				<BalanceCard :balance="totalBalance" />
			</v-col>
			<v-col cols="12" md="6">
				<IncomeExpenseChart :transactions="transactions" />
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" md="6">
				<RecentTransactions :transactions="transactions" />
			</v-col>
			<v-col cols="12" md="6">
				<CategoryChart :transactions="transactions" />
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
	import { reactive, ref, onMounted } from "vue";
	import BalanceCard from "@/components/BalanceCard.vue";
	import IncomeExpenseChart from "@/components/IncomeExpenseChart.vue";
	import RecentTransactions from "@/components/RecentTransactions.vue";
	import CategoryChart from "@/components/CategoryChart.vue";
	import { TransactionsService } from "@/services/api";
	import type { Transaction } from "@/interfaces";

	const totalBalance = ref(12500);
	const transactions = reactive(<Transaction[]>[]);

	onMounted(async () => {
		const { data } = await TransactionsService.getAll();

		transactions.splice(0, transactions.length, ...data.transactions);
	});
</script>
