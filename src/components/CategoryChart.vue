<template>
	<v-card class="category-chart pa-6 rounded-lg" elevation="2">
		<div class="d-flex justify-space-between align-center mb-4">
			<v-card-title class="text-h6 font-weight-bold pa-0">Expenses by Category</v-card-title>
			<v-btn
				@click="openPopup"
				icon="mdi-plus"
				variant="tonal"
				color="primary"
				size="small"
				class="add-category-btn"
			></v-btn>
		</div>

		<v-card-text class="pa-0">
			<div class="chart-container">
				<canvas id="categoryChart"></canvas>
			</div>
		</v-card-text>

		<v-divider class="my-6"></v-divider>

		<div class="categories-grid">
			<v-card
				v-for="category in categories"
				:key="category.id"
				class="category-card rounded-lg"
				:style="{ borderLeft: `4px solid ${category.color}` }"
			>
				<v-card-text class="pa-4">
					<div class="d-flex align-center">
						<v-avatar
							v-if="category.icon"
							size="40"
							:color="category.color"
							class="elevation-1 mr-4"
						>
							<v-img
								:src="typeof category.icon === 'string' ? category.icon : ''"
								alt="category icon"
							/>
						</v-avatar>
						<div class="category-info">
							<h3 class="text-body-1 font-weight-medium mb-1">
								{{ category.title }}
							</h3>
							<div class="text-caption text-medium-emphasis">
								{{ getCategoryTotal(category.id ?? 0) }} ₴
							</div>
						</div>
					</div>
				</v-card-text>
			</v-card>
		</div>

		<CreateCategory
			:show="openCreateCategoryDialog"
			@close="openCreateCategoryDialog = false"
		/>
	</v-card>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted, watch } from "vue";
	import { Chart, registerables } from "chart.js";
	import { CategoriesService } from "@/services/api";
	import CreateCategory from "@/components/Dialogs/Category/CreateCategory.vue";
	import type { Category, Transaction } from "@/interfaces";

	const openCreateCategoryDialog = ref(false);
	const categories = reactive<Category[]>([]);

	Chart.register(...registerables);

	function openPopup() {
		openCreateCategoryDialog.value = true;
	}

	const props = defineProps<{
		transactions: Transaction[];
	}>();

	function getCategoryTotal(categoryId: number): number {
		return props.transactions
			.filter((t) => t.type === "expense" && t.category_id === categoryId)
			.reduce((sum, t) => sum + t.value, 0);
	}

	onMounted(async () => {
		const { data } = await CategoriesService.getAll();
		categories.splice(0, categories.length, ...data.categories);
		initializeChart();
	});

	function initializeChart() {
		const ctx = document.getElementById("categoryChart") as HTMLCanvasElement;
		if (!ctx) return;

		const categoryTotals = categories.map((cat) => getCategoryTotal(cat.id ?? 0));
		const total = categoryTotals.reduce((a, b) => a + b, 0);

		// Destroy existing chart if it exists
		const existingChart = Chart.getChart(ctx);
		if (existingChart) {
			existingChart.destroy();
		}

		new Chart(ctx, {
			type: "doughnut",
			data: {
				labels: categories.map((category) => category.title),
				datasets: [
					{
						label: "Expenses",
						data: categoryTotals,
						backgroundColor: categories.map((category) => category.color),
						borderWidth: 0,
						hoverOffset: 8
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						callbacks: {
							label: function (context) {
								const value = context.raw as number;
								const percentage =
									total > 0 ? ((value / total) * 100).toFixed(1) : "0";
								return `${context.label}: ${value} ₴ (${percentage}%)`;
							}
						}
					}
				},
				cutout: "70%"
			}
		});
	}

	// Watch for changes in transactions to update the chart
	watch(
		() => props.transactions,
		() => {
			initializeChart();
		},
		{ deep: true }
	);
</script>

<style scoped lang="scss">
	.category-chart {
		background: #fff;
	}

	.chart-container {
		position: relative;
		height: 300px;
		margin: 0 auto;
	}

	.categories-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 16px;
	}

	.category-card {
		background: rgba(var(--v-theme-surface-variant), 0.5);
		transition: transform 0.2s ease-in-out;

		&:hover {
			transform: translateY(-2px);
		}
	}

	.add-category-btn {
		transition: transform 0.2s ease-in-out;

		&:hover {
			transform: scale(1.1);
		}
	}

	.category-info {
		flex: 1;
	}

	:deep(.v-card-title) {
		line-height: 1.2;
	}

	:deep(.v-card-text) {
		line-height: 1.2;
	}
</style>
