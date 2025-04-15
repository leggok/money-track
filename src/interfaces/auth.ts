export interface Registration {
	first_name: string;
	last_name?: string;
	username: string;
	email: string;
	password: string;
}

export interface Login {
	email: string;
	password: string;
}
