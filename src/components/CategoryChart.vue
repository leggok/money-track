<template>
	<v-card class="pa-4">
		<div class="flex-wrapper">
			<v-card-title>Витрати за категоріями</v-card-title>
			<v-btn @click="openPopup" class="category-btn" width="36" height="36">+</v-btn>
		</div>

		<v-card-text>
			<canvas id="categoryChart"></canvas>
		</v-card-text>

		<div class="categories_wrapper">
			<div
				class="category"
				v-for="category in categories"
				:key="category.id"
				:style="{ backgroundColor: category.color }"
			>
				<v-avatar
					v-if="category.icon"
					size="40"
					:style="{ backgroundColor: category.color }"
				>
					<v-img
						:src="typeof category.icon === 'string' ? category.icon : ''"
						alt="icon"
					/>
				</v-avatar>
				<div class="category-content">
					<h3>{{ category.title }}</h3>
				</div>
			</div>
		</div>

		<CreateDialog :show="openCreateCategoryDialog" @close="openCreateCategoryDialog = false" />
	</v-card>
</template>

<script setup lang="ts">
	import { ref, reactive, computed, onMounted } from "vue";
	import { Chart, registerables } from "chart.js";
	import { CategoriesService } from "@/services/api";
	import CreateDialog from "@/components/Dialogs/Category/CreateDialog.vue";
	import type { Category } from "@/interfaces";

	const openCreateCategoryDialog = ref(false);

	const categories = reactive<Category[]>([]);

	Chart.register(...registerables);

	function openPopup() {
		openCreateCategoryDialog.value = true;
	}

	const props = defineProps<{
		transactions: { type: string; amount: number; category: string }[];
	}>();

	const chartData = computed(() => {
		const expenses = props.transactions.filter((t) => t.type === "expense");
		const categories = [...new Set(expenses.map((e) => e.category))];
		const data = categories.map((cat) =>
			expenses.filter((e) => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
		);

		return {
			labels: categories,
			datasets: [{ data, backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"] }]
		};
	});
	console.log("chartData", chartData);

	onMounted(async () => {
		const { data } = await CategoriesService.getAll();
		console.log("Categories", data);
		categories.splice(0, categories.length, ...data.categories);

		const ctx = document.getElementById("categoryChart") as HTMLCanvasElement;

		new Chart(ctx, {
			type: "pie",
			data: {
				labels: categories.map((category) => category.title),
				datasets: [
					{
						label: "Витрати",
						data: [100, 200, 300],
						backgroundColor: categories.map((category) => category.color),
						hoverOffset: 4
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: "top"
					},
					tooltip: {
						callbacks: {
							label: function (tooltipItem) {
								return `${tooltipItem.label}: ${tooltipItem.raw} грн`; // Форматування тултипу
							}
						}
					}
				}
			}
		});
	});
</script>

<style scoped lang="scss">
	.v-card {
		background-color: #f7f7f7;
		border-radius: 10px;
	}

	.category-btn {
		background-color: #4caf50;
		color: white;
		font-size: 18px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: auto;
		&:hover {
			background-color: #45a049;
		}
	}

	.v-card-title {
		font-size: 22px;
		font-weight: 500;
		color: #333;
	}

	.categories_wrapper {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 15px;
		margin-top: 20px;
	}

	.category {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15px;
		background-color: #ffffff;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
		}
		h3 {
			font-size: 18px;
			color: #333;
			margin: 0;
			font-weight: 500;
		}
	}

	.category-content {
		flex: 1;
		margin-left: 15px;
	}

	.v-avatar {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	#categoryChart {
		width: 100%;
		height: 300px;
		margin-top: 20px;
	}
</style>
