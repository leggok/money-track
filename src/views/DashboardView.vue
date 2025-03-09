<template>
	<v-container>
		<v-row justify="center" width="100%">
			<v-col cols="12" width="100%">
				<v-card>
					<v-card-title>
						<span class="headline">Мій фінансовий дашборд</span>
					</v-card-title>

					<v-card-subtitle>
						<v-row>
							<v-col cols="12" sm="6">
								<v-subheader>Загальний баланс</v-subheader>
								<v-sheet elevation="1" class="pa-3 text-center">
									<span class="display-1">$1,250</span>
								</v-sheet>
							</v-col>
						</v-row>
					</v-card-subtitle>

					<v-card-text>
						<v-divider></v-divider>

						<v-subheader class="mt-4">Останні транзакції</v-subheader>

						<v-list>
							<v-list-item v-for="(transaction, index) in transactions" :key="index">
								<v-list-item-content>
									<v-list-item-title>
										<span class="font-weight-bold">{{
											transaction.title
										}}</span>
										<span class="text-subtitle-1">{{ transaction.date }}</span>
									</v-list-item-title>
									<v-list-item-subtitle>
										<span
											:class="
												transaction.type === 'expense'
													? 'red--text'
													: 'green--text'
											"
										>
											{{ transaction.amount }}
										</span>
										| {{ transaction.category }}
									</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
						</v-list>

						<v-divider></v-divider>

						<v-btn color="primary" class="mt-4" @click="openAddTransactionDialog"
							>Додати транзакцію</v-btn
						>
						<v-btn color="primary" class="mt-4" @click="openAddCategoryDialog"
							>Add Category</v-btn
						>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
	<CreateDialog :show="openCreateCategoryDialog" @close="openCreateCategoryDialog = false" />
</template>

<script setup lang="ts">
	import { ref, watch } from "vue";
	import CreateDialog from "@/components/Dialogs/Category/CreateDialog.vue";

	const openCreateCategoryDialog = ref(false);
	const transactions = [
		{
			title: "Обід",
			amount: "-$15",
			category: "Їжа",
			date: "10 березня",
			type: "expense"
		},
		{
			title: "Зарплата",
			amount: "+$2000",
			category: "Доходи",
			date: "9 березня",
			type: "income"
		},
		{
			title: "Таксі",
			amount: "-$8",
			category: "Транспорт",
			date: "9 березня",
			type: "expense"
		}
	];

	watch(
		() => openCreateCategoryDialog.value,
		(newVal) => {
			console.log(newVal);
		}
	);
	const openAddTransactionDialog = () => {
		console.log("Додати транзакцію");
	};
	const openAddCategoryDialog = () => {
		openCreateCategoryDialog.value = true;
	};
</script>

<style scoped>
	.v-card {
		margin-top: 20px;
	}
</style>
