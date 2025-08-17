<template>
	<v-app>
		<Header v-if="showHeader" />
		<v-main>
			<RouterView />
		</v-main>
		<v-snackbar
			v-model="message.show"
			:color="message.color"
			timeout="3000"
			location="top"
			:absolute="true"
		>
			{{ message.text }}
		</v-snackbar>
	</v-app>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import { RouterView, useRoute } from "vue-router";
	import { message } from "@/utils/message";
	import Header from "@/components/Header.vue";

	const route = useRoute();
	
	const showHeader = computed(() => {
		return route.meta.auth !== false;
	});
</script>

<style scoped>
	/* App-level styles can be added here if needed */
</style>
