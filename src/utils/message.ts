import { ref } from "vue";

type MessageType = "success" | "error" | "warning" | "info";

interface MessageState {
	show: boolean;
	text: string;
	color: MessageType;
}

export const message = ref<MessageState>({
	show: false,
	text: "",
	color: "success"
});

export const showMessage = (msg: string, type: MessageType = "success") => {
	message.value.text = msg;
	message.value.color = type;
	message.value.show = true;
};
