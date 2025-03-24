export async function prepareFileForUpload(
	file: File
): Promise<{ base64: string; filename: string; extension: string }> {
	const reader = new FileReader();

	return new Promise((resolve, reject) => {
		reader.readAsDataURL(file);
		reader.onload = () => {
			if (typeof reader.result === "string") {
				const base64 = reader.result.split(",")[1];
				const filename = file.name.split(".")[0];
				const extension = file.name.split(".").pop() || "";

				resolve({ base64, filename, extension });
			} else {
				reject(new Error("Failed to read file"));
			}
		};

		reader.onerror = (error) => reject(error);
	});
}
