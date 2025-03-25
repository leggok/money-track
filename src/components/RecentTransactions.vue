<script setup lang="ts">
	defineProps<{
		transactions: {
			id: number;
			type: string;
			amount: number;
			category: string;
			date: string;
		}[];
	}>();
</script>

<template>
	<v-card class="pa-4">
		<v-card-title>Останні транзакції</v-card-title>
		<v-list>
			<v-list-item v-for="tx in transactions" :key="tx.id">
				<v-list-item-title>
					{{ tx.category }} - ₴{{ tx.amount.toLocaleString() }}
				</v-list-item-title>
				<v-list-item-subtitle>{{ tx.date }}</v-list-item-subtitle>
			</v-list-item>
		</v-list>
	</v-card>
</template>
