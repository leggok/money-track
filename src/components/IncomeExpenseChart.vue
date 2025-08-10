<script setup lang="ts">
	import { computed, onMounted, watch, nextTick } from "vue";
	import { Chart, registerables } from "chart.js";
	import type { Transaction } from "@/interfaces";
	Chart.register(...registerables);

	const props = defineProps<{ transactions: Transaction[] }>();

	let chart: Chart | null = null;

	const chartData = computed(() => {
		console.log('props.transactions',props.transactions)
		const income = props.transactions
			.filter((t) => t.type === "income")
			.reduce((sum, t) => sum + Number(t.value)	, 0);
		const expense = props.transactions
			.filter((t) => t.type === "expense")
			.reduce((sum, t) => sum + Number(t.value), 0);
		
		return {
			labels: ["Income", "Expense"],
			datasets: [{
				data: [income, expense],
				backgroundColor: ["#4CAF50", "#F44336"],
				borderColor: ["#388E3C", "#D32F2F"],
				borderWidth: 2,
				hoverBackgroundColor: ["#66BB6A", "#EF5350"]
			}]
		};
	});

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'bottom' as const,
				labels: {
					padding: 20,
					font: {
						size: 14
					}
				}
			},
			tooltip: {
				callbacks: {
					label: function(context: any) {
						const label = context.label || '';
						const value = context.parsed || 0;
						return `${label}: ₴${value.toLocaleString()}`;
					}
				}
			}
		}
	};

	function createChart() {
		const canvas = document.getElementById('incomeExpenseChart') as HTMLCanvasElement;
		if (canvas && !chart) {
			const ctx = canvas.getContext('2d');
			if (ctx) {
				chart = new Chart(ctx, {
					type: 'doughnut',
					data: chartData.value,
					options: chartOptions
				});
			}
		}
	}

	function updateChart() {
		if (chart) {
			chart.data = chartData.value;
			chart.update();
		}
	}

	onMounted(async () => {
		await nextTick();
		createChart();
	});

	watch(() => props.transactions, () => {
		updateChart();
	}, { deep: true });
</script>

<template>
	<v-card class="pa-4">
		<v-card-title class="d-flex align-center">
			<v-icon class="mr-2" color="primary">mdi-chart-pie</v-icon>
			Income vs Expense
		</v-card-title>
		<v-card-text>
			<div class="chart-container" style="height: 300px; position: relative;">
				<canvas id="incomeExpenseChart"></canvas>
			</div>
			<div class="mt-4">
				<v-row>
					<v-col cols="6">
						<div class="text-center">
							<div class="text-h6 text-success">₴{{ chartData.labels[0] === "Доходи" ? chartData.datasets[0].data[0].toLocaleString() : chartData.datasets[0].data[1].toLocaleString() }}</div>
							<div class="text-caption text-medium-emphasis">Total Income</div>
						</div>
					</v-col>
					<v-col cols="6">
						<div class="text-center">
							<div class="text-h6 text-error">₴{{ chartData.labels[0] === "Витрати" ? chartData.datasets[0].data[0].toLocaleString() : chartData.datasets[0].data[1].toLocaleString() }}</div>
							<div class="text-caption text-medium-emphasis">Total Expense</div>
						</div>
					</v-col>
				</v-row>
			</div>
		</v-card-text>
	</v-card>
</template>

<style scoped>
	.chart-container {
		position: relative;
	}
</style>
