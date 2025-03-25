<script setup lang="ts">
	import { computed } from "vue";
	import { Chart, registerables } from "chart.js";
	Chart.register(...registerables);

	const props = defineProps<{ transactions: { type: string; amount: number }[] }>();

	const chartData = computed(() => {
		const income = props.transactions
			.filter((t) => t.type === "income")
			.reduce((sum, t) => sum + t.amount, 0);
		const expense = props.transactions
			.filter((t) => t.type === "expense")
			.reduce((sum, t) => sum + t.amount, 0);
		return {
			labels: ["Доходи", "Витрати"],
			datasets: [{ data: [income, expense], backgroundColor: ["#4CAF50", "#F44336"] }]
		};
	});
</script>

<template>
	<v-card class="pa-4">
		<v-card-title>Доходи vs Витрати</v-card-title>
		<v-card-text>
			<canvas id="incomeExpenseChart"></canvas>
		</v-card-text>
	</v-card>
</template>
