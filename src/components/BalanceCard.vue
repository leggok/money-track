<script setup lang="ts">
	defineProps<{ balance: number }>();
</script>

<template>
	<v-card class="pa-4">
		<v-card-title>Загальний баланс</v-card-title>
		<v-card-text>
			<h2 class="text-h4 font-weight-bold">₴{{ balance.toLocaleString() }}</h2>
		</v-card-text>
	</v-card>
</template>
