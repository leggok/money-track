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
					<v-icon start color="primary" class="mr-2">mdi-folder-plus</v-icon>
					Create Category
				</v-card-title>

				<v-divider></v-divider>

				<v-card-text class="pa-6 pt-4">
					<v-form v-model="valid" @submit.prevent="createCategory">
						<v-text-field
							v-model="title"
							label="Category Name"
							variant="outlined"
							prepend-inner-icon="mdi-text"
							:rules="[rules.required]"
							density="comfortable"
							class="mb-4"
						></v-text-field>

						<v-file-input
							@change="handleFileUpload"
							accept="image/*"
							label="Upload Icon"
							variant="outlined"
							prepend-inner-icon="mdi-image"
							density="comfortable"
							class="mb-4"
						>
							<template v-slot:selection="{ fileNames }">
								<template v-for="fileName in fileNames" :key="fileName">
									<v-chip size="small" label color="primary" class="me-2">
										{{ fileName }}
									</v-chip>
								</template>
							</template>
						</v-file-input>

						<div class="d-flex align-center mb-4">
							<v-icon class="mr-2">mdi-palette</v-icon>
							<span class="text-body-1">Category Color</span>
						</div>

						<v-color-picker
							v-model="color"
							hide-inputs
							class="mb-4"
							:swatches="[
								['#FF5252', '#FF4081', '#E040FB', '#7C4DFF'],
								['#448AFF', '#40C4FF', '#18FFFF', '#64FFDA'],
								['#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00'],
								['#FFD740', '#FFAB40', '#FF6E40', '#FF3D00']
							]"
						></v-color-picker>

						<div v-if="previewIcon" class="preview-container mb-4">
							<div class="text-caption text-medium-emphasis mb-2">Icon Preview</div>
							<v-img
								:src="previewIcon"
								max-height="100"
								contain
								class="rounded-lg elevation-1"
							></v-img>
						</div>
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
						@click="createCategory"
						:disabled="!valid"
						class="text-body-1 font-weight-medium"
						:loading="loading"
					>
						<v-icon start>mdi-check</v-icon>
						Create
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
	import { showMessage } from "@/utils/message";

	const props = defineProps({
		show: Boolean
	});

	const dialog = ref(props.show);
	const valid = ref(false);
	const loading = ref(false);
	const title = ref("");
	const color = ref("#448AFF");
	const icon = ref<File | null>(null);
	const previewIcon = ref<string | null>(null);

	const emit = defineEmits(["close"]);

	const rules = {
		required: (value: string) => !!value || "This field is required"
	};

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
		if (!valid.value) return;

		loading.value = true;
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

			showMessage("Category created successfully!", "success");
			closeDialog();
		} catch (error) {
			console.error("Error creating category", error);
			showMessage("Failed to create category", "error");
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
</script>

<script lang="ts">
	export default {
		name: "CreateCategory"
	};
</script>

<style scoped lang="scss">
	.v-dialog__content {
		padding: 20px;
	}

	.preview-container {
		background: rgba(var(--v-theme-surface-variant), 0.5);
		padding: 16px;
		border-radius: 8px;
	}

	:deep(.v-field__input) {
		min-height: 48px;
	}

	:deep(.v-field__prepend-inner) {
		padding-top: 0;
	}

	:deep(.v-color-picker) {
		width: 100%;
	}
</style>
