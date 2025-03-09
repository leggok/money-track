<template>
	<v-container>
		<v-dialog v-model="dialog" max-width="500px" @click:outside="emit('close')">
			<v-card>
				<v-card-title class="headline">Створити категорію</v-card-title>

				<v-card-text>
					<!-- Форма для створення категорії -->
					<v-form v-model="valid">
						<v-text-field
							v-model="name"
							label="Назва категорії"
							:rules="[(v) => !!v || 'Назва категорії обов\'язкова']"
							required
						></v-text-field>

						<v-textarea
							v-model="description"
							label="Опис"
							rows="3"
							:rules="[
								(v) => v.length <= 500 || 'Опис не може бути більше 500 символів'
							]"
						></v-textarea>
					</v-form>
				</v-card-text>

				<v-card-actions>
					<!-- Кнопки для підтвердження або скасування -->
					<v-btn @click="closeDialog">Скасувати</v-btn>
					<v-btn color="primary" @click="createCategory" :disabled="!valid">
						Створити
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script setup lang="ts">
	import { ref, watch } from "vue";

	const props = defineProps({
		show: Boolean
	});

	const dialog = ref(props.show);
	const valid = ref(false);
	const name = ref("");
	const description = ref("");

	const emit = defineEmits(["close"]);

	const createCategory = () => {
		if (valid.value) {
			console.log("Створена нова категорія:", { name, description });

			dialog.value = false;

			name.value = "";
			description.value = "";

			emit("close");
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
</script>

<style scoped>
	.v-dialog__content {
		padding: 20px;
	}
</style>
