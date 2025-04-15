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
	import { TransactionsService, UsersService } from "@/services/api";
	import type { Transaction } from "@/interfaces";
	import { useUserStore } from "@/stores/user";

	const userStore = useUserStore();

	const totalBalance = ref(0);
	const transactions = reactive(<Transaction[]>[]);

	async function getTransactions() {
		const { data } = await TransactionsService.getAll(userStore.user.id ?? 0);

		transactions.splice(0, transactions.length, ...data.transactions);
	}

	async function getUserBalance() {
		const { data } = await UsersService.getBalance(userStore.user.id ?? 0);
		totalBalance.value = data.balance;
	}

	onMounted(() => {
		getTransactions();
		getUserBalance();
	});
</script>
