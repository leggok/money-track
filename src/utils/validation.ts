export const testEmail = (email: string) => {
	return /.+@.+\..+/.test(email);
};
