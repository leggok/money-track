export interface Registration {
	firstName: string;
	lastName?: string;
	username: string;
	email: string;
	password: string;
}

export interface Login {
	email: string;
	password: string;
}
