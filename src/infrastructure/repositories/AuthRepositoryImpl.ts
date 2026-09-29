import { AxiosInstance } from 'axios'
import { LoginRequest, LoginResponse } from '@/domain/AuthTypes'
import { AuthRepository } from '@/domain/repositories/AuthRepository'

export const createAuthRepositoryImpl = (client: AxiosInstance): AuthRepository => ({
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await client.post<LoginResponse>('/login', credentials)

        return response.data
    },
})
