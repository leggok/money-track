import axiosApiInstance from "@/services/api/axiosConfig";

export default class UsersService {
	static getBalance(userId: number) {
		return axiosApiInstance.get(`/users/${userId}/balance`);
	}
}
