<template>
	<v-container>
		<v-dialog v-model="dialog" max-width="500px" @click:outside="emit('close')">
			<v-card>
				<v-card-title class="headline">Створити категорію</v-card-title>

				<v-card-text>
					<v-form v-model="valid">
						<v-text-field
							v-model="title"
							label="Назва категорії"
							:rules="[(v) => !!v || 'Назва категорії обов\'язкова']"
							required
						></v-text-field>

						<v-file-input
							@change="handleFileUpload"
							accept="image/*"
							label="Завантажити іконку"
						></v-file-input>

						<v-color-picker v-model="color" hide-inputs></v-color-picker>
					</v-form>

					<!-- Попередній перегляд іконки -->
					<v-img v-if="previewIcon" :src="previewIcon" max-height="100" contain></v-img>
				</v-card-text>

				<v-card-actions>
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
	import { CategoriesService, UploadsService } from "@/services/api";
	import { prepareFileForUpload } from "@/utils/uploadsHelpers";

	const props = defineProps({
		show: Boolean
	});

	const dialog = ref(props.show);
	const valid = ref(false);
	const title = ref("");
	const color = ref("");
	const icon = ref<File | null>(null);
	const previewIcon = ref<string | null>(null);

	const emit = defineEmits(["close"]);

	const handleFileUpload = (event: Event) => {
		const fileInput = event.target as HTMLInputElement;
		if (fileInput.files && fileInput.files[0]) {
			icon.value = fileInput.files[0];

			const reader = new FileReader();
			reader.onload = () => {
				previewIcon.value = reader.result as string;
			};
			reader.readAsDataURL(icon.value);
		}
	};

	const createCategory = async () => {
		try {
			let fileUrl = null;
			if (icon.value) {
				const { base64, filename, extension } = await prepareFileForUpload(icon.value);

				fileUrl = await UploadsService.upload({
					base64,
					filename,
					extension,
					folder: "categories"
				});
			}

			const response = await CategoriesService.create({
				title: title.value,
				color: color.value,
				icon: fileUrl ? fileUrl.data.file.url : ""
			});

			console.log("Категорія створена:", response.data);
		} catch (error) {
			console.error("Помилка при створенні категорії", error);
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
