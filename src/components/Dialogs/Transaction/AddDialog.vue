<template>
	<v-container>
		<v-dialog v-model="dialog" max-width="500px" @click:outside="emit('close')">
			<v-card>
				<v-card-title class="headline">Add transaction</v-card-title>

				<v-card-text>
					<v-form v-model="valid">
						<v-text-field
							v-model="transaction.description"
							label="Description"
						></v-text-field>

						<v-text-field
							v-model="transaction.value"
							label="Value"
							required
						></v-text-field>

						<v-select
							v-model="transaction.category_id"
							clearable
							chips
							label="Category"
							:items="categories"
							item-title="text"
							item-value="value"
							variant="outlined"
						></v-select>

						<v-select
							v-model="transaction.type"
							clearable
							chips
							label="Type"
							:items="[
								{ text: 'Expense', value: 'expense' },
								{ text: 'Income', value: 'income' }
							]"
							item-title="text"
							item-value="value"
							variant="outlined"
						></v-select>

						<v-select
							v-model="transaction.currency_id"
							clearable
							chips
							label="Currency"
							:items="currencies"
							item-title="text"
							item-value="value"
							variant="outlined"
						></v-select>
					</v-form>
				</v-card-text>

				<v-card-actions>
					<v-btn @click="closeDialog">Скасувати</v-btn>
					<v-btn color="primary" @click="addTransaction" :disabled="!valid">
						Створити
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script setup lang="ts">
	import { ref, watch, reactive, onMounted } from "vue";
	import { TransactionsService, CategoriesService, CurrenciesService } from "@/services/api";
	import type { Transaction, Category, Currency } from "@/interfaces";
	import { useUserStore } from "@/stores/user";

	const props = defineProps({
		show: Boolean
	});

	const userStore = useUserStore();

	const dialog = ref(props.show);
	const valid = ref(false);
	const transaction = reactive(<Transaction>{
		description: "",
		value: 0,
		currency_id: 0,
		category_id: 0,
		type: "expense",
		user_id: userStore.user.id
	});

	const categories = ref<Category[]>([]);
	const currencies = ref<Currency[]>([]);

	const emit = defineEmits(["close"]);

	const addTransaction = async () => {
		try {
			const response = await TransactionsService.add(transaction);

			console.log("Transaction added:", response.data);
		} catch (error) {
			console.error("Error while adding transaction", error);
		}
	};

	const closeDialog = () => {
		dialog.value = false;
		emit("close");
	};

	watch(
		() => props.show,
		(newVal) => {
			dialog.value = newVal;
		}
	);

	async function fetchCategories() {
		const { data } = await CategoriesService.getAll();
		console.log("categories", data);
		categories.value = data.categories.map((category: Category) => ({
			text: category.title,
			value: category.id
		}));
	}

	async function fetchCurrencies() {
		const { data } = await CurrenciesService.getAll();
		console.log("Currencies", data);
		currencies.value = data.currencies.map((currency: Currency) => ({
			text: currency.code,
			value: currency.id
		}));

		const firstCurrency = data.currencies[0];
		transaction.currency_id = firstCurrency.id;
	}

	onMounted(async () => {
		await fetchCategories();
		await fetchCurrencies();
	});
</script>

<style scoped>
	.v-dialog__content {
		padding: 20px;
	}
</style>
