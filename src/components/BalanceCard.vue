<script setup lang="ts">
	defineProps<{ balance: number }>();
</script>

<template>
	<v-card class="balance-card pa-6 rounded-lg" elevation="2">
		<v-row align="center" no-gutters>
			<v-col cols="auto" class="mr-4">
				<v-avatar size="48" color="primary" class="elevation-2">
					<v-icon size="24" color="white">mdi-wallet</v-icon>
				</v-avatar>
			</v-col>
			<v-col>
				<v-card-title class="text-subtitle-1 font-weight-medium pa-0 text-medium-emphasis">
					Total Balance
				</v-card-title>
				<v-card-text class="pa-0">
					<div class="d-flex align-center">
						<h2 class="text-h4 font-weight-bold mr-2">
							₴{{ balance.toLocaleString() }}
						</h2>
						<v-chip v-if="balance > 0" size="small" color="success" class="ml-2">
							<v-icon start size="16">mdi-trending-up</v-icon>
							Positive
						</v-chip>
						<v-chip v-else-if="balance < 0" size="small" color="error" class="ml-2">
							<v-icon start size="16">mdi-trending-down</v-icon>
							Negative
						</v-chip>
					</div>
				</v-card-text>
			</v-col>
		</v-row>
	</v-card>
</template>

<style scoped>
	.balance-card {
		/* background: linear-gradient(
			135deg,
			var(--v-theme-surface) 0%,
			var(--v-theme-surface-variant) 100%
		); */
		background: #fff;
		transition: transform 0.2s ease-in-out;
	}

	.balance-card:hover {
		transform: translateY(-2px);
	}

	:deep(.v-card-title) {
		line-height: 1.2;
	}

	:deep(.v-card-text) {
		line-height: 1.2;
	}
</style>
