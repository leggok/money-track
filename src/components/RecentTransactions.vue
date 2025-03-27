<template>
	<v-card class="pa-4">
		<div class="flex-wrapper">
			<v-card-title>Останні транзакції</v-card-title>
			<v-btn @click="openPopup" class="category-btn" width="36" height="36">+</v-btn>
		</div>
		<v-list>
			<v-list-item v-for="tx in transactions" :key="tx.id">
				<v-list-item-title>
					<div class="wrapper" :class="tx.type">
						{{ tx.currency_id }} {{ tx.value.toLocaleString() }} - {{ tx.category_id }}
					</div>
				</v-list-item-title>
				<v-list-item-subtitle>{{ tx.createdAt }}</v-list-item-subtitle>
			</v-list-item>
		</v-list>
	</v-card>
	<AddDialog :show="openAddTransactionDialog" @close="openAddTransactionDialog = false" />
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import AddDialog from "@/components/Dialogs/Transaction/AddDialog.vue";
	import type { Transaction } from "@/interfaces";
	defineProps<{
		transactions: Transaction[];
	}>();

	const openAddTransactionDialog = ref(false);

	function openPopup() {
		openAddTransactionDialog.value = true;
	}
</script>

<style scoped lang="scss">
	.expense {
		background: #f08282;
	}
	.income {
		background: #8ff082;
	}
</style>
