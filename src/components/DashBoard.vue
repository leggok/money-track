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
	import { ref } from "vue";
	import BalanceCard from "@/components/BalanceCard.vue";
	import IncomeExpenseChart from "@/components/IncomeExpenseChart.vue";
	import RecentTransactions from "@/components/RecentTransactions.vue";
	import CategoryChart from "@/components/CategoryChart.vue";

	const totalBalance = ref(12500);
	const transactions = ref([
		{ id: 1, type: "income", amount: 2500, category: "Salary", date: "2025-03-20" },
		{ id: 2, type: "expense", amount: 150, category: "Food", date: "2025-03-21" },
		{ id: 3, type: "expense", amount: 300, category: "Transport", date: "2025-03-22" }
	]);
</script>
