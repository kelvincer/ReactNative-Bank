import { LoginRequest, LoginResponse } from "@/domain/AuthTypes";
import { api } from "@/infrastructure/network/api";

export const loginRequest = async (
    credentials: LoginRequest,
): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
        '/login',
        credentials,
    );

    return response.data;
};