<template>
	<v-card class="recent-transactions pa-6 rounded-lg" elevation="2">
		<div class="d-flex justify-space-between align-center mb-4">
			<v-card-title class="text-h6 font-weight-bold pa-0">Recent Transactions</v-card-title>
			<v-btn
				@click="openPopup"
				icon="mdi-plus"
				variant="tonal"
				color="primary"
				size="small"
				class="add-transaction-btn"
			></v-btn>
		</div>

		<v-list class="transactions-list" lines="two">
			<v-list-item
				v-for="tx in transactions"
				:key="tx.id"
				class="transaction-item mb-2 rounded-lg"
				:class="tx.type"
			>
				<template v-slot:prepend>
					<v-avatar
						:color="tx.type === 'income' ? 'success' : 'error'"
						size="40"
						class="elevation-1"
					>
						<v-icon
							:icon="tx.type === 'income' ? 'mdi-arrow-down' : 'mdi-arrow-up'"
							color="white"
						></v-icon>
					</v-avatar>
				</template>

				<v-list-item-title class="text-body-1 font-weight-medium">
					{{ tx.description || "No description" }}
				</v-list-item-title>
				<v-list-item-subtitle class="text-caption">
					<div class="d-flex align-center">
						<span class="amount mr-2">
							{{ tx.type === "income" ? "+" : "-" }}₴{{ tx.value.toLocaleString() }}
						</span>
						<v-chip
							size="x-small"
							:color="tx.type === 'income' ? 'success' : 'error'"
							variant="tonal"
							class="mr-2"
						>
							{{ tx.type }}
						</v-chip>
						<v-chip size="x-small" variant="outlined" class="text-caption">
							{{ formatDate(tx.timestamp) }}
						</v-chip>
					</div>
				</v-list-item-subtitle>
			</v-list-item>
		</v-list>

		<AddTransaction
			:show="openAddTransactionDialog"
			@close="openAddTransactionDialog = false"
		/>
	</v-card>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import AddTransaction from "@/components/Dialogs/Transaction/AddTransaction.vue";
	import type { Transaction } from "@/interfaces";

	defineProps<{
		transactions: Transaction[];
	}>();

	const openAddTransactionDialog = ref(false);

	function openPopup() {
		openAddTransactionDialog.value = true;
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	}
</script>

<style scoped lang="scss">
	.recent-transactions {
		background: #fff;
	}

	.transactions-list {
		max-height: 328px;
		overflow-y: auto;
	}

	.transaction-item {
		background: rgba(var(--v-theme-surface-variant), 0.5);
		transition: transform 0.2s ease-in-out;

		&:hover {
			background: rgba(var(--v-theme-surface-variant), 0.5);
		}

		&.income {
			border-left: 4px solid rgb(var(--v-theme-success));
		}

		&.expense {
			border-left: 4px solid rgb(var(--v-theme-error));
		}
	}

	.amount {
		font-weight: 600;
	}

	.add-transaction-btn {
		transition: transform 0.2s ease-in-out;

		&:hover {
			transform: scale(1.1);
		}
	}

	:deep(.v-list-item__prepend) {
		padding-right: 16px;
	}

	:deep(.v-list-item-title) {
		line-height: 1.2;
		margin-bottom: 4px;
	}

	:deep(.v-list-item-subtitle) {
		line-height: 1.2;
	}
</style>
