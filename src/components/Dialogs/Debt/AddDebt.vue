<template>
	<v-dialog :model-value="show" @update:model-value="emit('close')" max-width="500px">
		<v-card>
			<v-card-title>Add Debt</v-card-title>
			<v-card-text>
				<v-text-field v-model.number="debt.value" label="Amount" type="number" />
				<v-text-field v-model="debt.description" label="Description" />
				<v-text-field v-model="debt.lender_name" label="Counterparty name" />
				<v-radio-group v-model="role" inline>
					<v-radio label="I owe" value="owe" />
					<v-radio label="Owed to me" value="owed" />
				</v-radio-group>
				<v-select
					v-model="debt.currency_id"
					:items="currencies"
					item-title="code"
					item-value="id"
					label="Currency"
				/>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn variant="text" @click="emit('close')">Cancel</v-btn>
				<v-btn color="primary" @click="submit">Save</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
	import { reactive, ref } from "vue";
	import type { Debt, Currency } from "@/interfaces";
	import { DebtsService } from "@/services/api";
	import { useUserStore } from "@/stores/user";

	const props = defineProps<{ show: boolean; currencies: Currency[] }>();
	const emit = defineEmits<{ (e: "close"): void; (e: "saved"): void }>();

	const userStore = useUserStore();

	const debt = reactive<Partial<Debt>>({
		value: 0,
		description: "",
		lender_name: "",
		currency_id: userStore.user.main_currency_id ?? props.currencies[0]?.id ?? 1,
		borrower_id: userStore.user.id ?? 0,
		status: "active",
		category_id: 0
	});

	const role = ref<"owe" | "owed">("owe");

	async function submit() {
		// adjust ids based on role
		if (role.value === "owe") {
			debt.borrower_id = userStore.user.id ?? 0;
			debt.lender_id = undefined;
		} else {
			debt.lender_id = userStore.user.id ?? 0;
			debt.borrower_id = undefined;
		}

		try {
			await DebtsService.create(debt as Debt);
			emit("saved");
			emit("close");
		} catch (e) {
			console.error(e);
		}
	}
</script>
