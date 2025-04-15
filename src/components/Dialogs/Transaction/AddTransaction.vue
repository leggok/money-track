<template>
	<v-container>
		<v-dialog
			v-model="dialog"
			max-width="500px"
			@click:outside="emit('close')"
			transition="dialog-bottom-transition"
		>
			<v-card class="rounded-lg">
				<v-card-title class="text-h5 font-weight-bold pa-6 pb-4">
					<v-icon start color="primary" class="mr-2">mdi-plus-circle</v-icon>
					Add New Transaction
				</v-card-title>

				<v-divider></v-divider>

				<v-card-text class="pa-6 pt-4">
					<v-form v-model="valid" @submit.prevent="addTransaction">
						<v-row>
							<v-col cols="12" md="6">
								<v-text-field
									v-model="transaction.description"
									label="Description"
									variant="outlined"
									prepend-inner-icon="mdi-text"
									:rules="[rules.required]"
									density="comfortable"
								></v-text-field>
							</v-col>

							<v-col cols="12" md="6">
								<v-text-field
									v-model="transaction.value"
									label="Amount"
									variant="outlined"
									prepend-inner-icon="mdi-currency-usd"
									type="number"
									:rules="[rules.required, rules.positive]"
									density="comfortable"
								></v-text-field>
							</v-col>

							<v-col cols="12" md="6">
								<v-select
									v-model="transaction.type"
									label="Type"
									:items="[
										{
											text: 'Expense',
											value: 'expense',
											icon: 'mdi-arrow-down',
											color: 'error'
										},
										{
											text: 'Income',
											value: 'income',
											icon: 'mdi-arrow-up',
											color: 'success'
										}
									]"
									item-title="text"
									item-value="value"
									variant="outlined"
									prepend-inner-icon="mdi-swap-vertical"
									:rules="[rules.required]"
									density="comfortable"
								>
									<template v-slot:item="{ props, item }">
										<v-list-item
											v-bind="props"
											:prepend-icon="item.raw.icon"
											:color="item.raw.color"
										>
											<v-list-item-title>{{
												item.raw.text
											}}</v-list-item-title>
										</v-list-item>
									</template>
								</v-select>
							</v-col>

							<v-col cols="12" md="6">
								<v-select
									v-model="transaction.currency_id"
									label="Currency"
									:items="currencies"
									item-title="text"
									item-value="value"
									variant="outlined"
									prepend-inner-icon="mdi-currency-exchange"
									:rules="[rules.required]"
									density="comfortable"
								></v-select>
							</v-col>

							<v-col cols="12">
								<v-select
									v-model="transaction.category_id"
									label="Category"
									:items="categories"
									item-title="text"
									item-value="value"
									variant="outlined"
									prepend-inner-icon="mdi-tag"
									:rules="[rules.required]"
									density="comfortable"
									chips
									closable-chips
								></v-select>
							</v-col>
						</v-row>
					</v-form>
				</v-card-text>

				<v-divider></v-divider>

				<v-card-actions class="pa-4">
					<v-spacer></v-spacer>
					<v-btn
						variant="text"
						@click="closeDialog"
						class="text-body-1 font-weight-medium"
					>
						Cancel
					</v-btn>
					<v-btn
						color="primary"
						@click="addTransaction"
						:disabled="!valid"
						class="text-body-1 font-weight-medium"
						:loading="loading"
					>
						<v-icon start>mdi-check</v-icon>
						Add Transaction
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
	import { showMessage } from "@/utils/message";

	const props = defineProps({
		show: Boolean
	});

	const userStore = useUserStore();
	const loading = ref(false);

	const dialog = ref(props.show);
	const valid = ref(false);
	const transaction = reactive(<Transaction>{
		description: "",
		value: 0,
		currency_id: 0,
		category_id: 0,
		type: "expense",
		user_id: userStore.user?.id ?? 0,
		timestamp: new Date().toISOString()
	});

	const categories = ref<Category[]>([]);
	const currencies = ref<Currency[]>([]);

	const emit = defineEmits(["close"]);

	const rules = {
		required: (value: string | number) => !!value || "This field is required",
		positive: (value: number) => value > 0 || "Amount must be positive"
	};

	const addTransaction = async () => {
		if (!valid.value) return;

		loading.value = true;
		try {
			await TransactionsService.add(transaction);
			showMessage("Transaction added successfully!", "success");
			closeDialog();
		} catch (error) {
			console.error("Error while adding transaction", error);
			showMessage("Failed to add transaction", "error");
		} finally {
			loading.value = false;
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
		categories.value = data.categories.map((category: Category) => ({
			text: category.title,
			value: category.id
		}));
	}

	async function fetchCurrencies() {
		const { data } = await CurrenciesService.getAll();
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

<script lang="ts">
	export default {
		name: "AddTransaction"
	};
</script>

<style scoped>
	.v-dialog__content {
		padding: 20px;
	}

	:deep(.v-field__input) {
		min-height: 48px;
	}

	:deep(.v-field__prepend-inner) {
		padding-top: 0;
	}
</style>
