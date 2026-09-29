import { LoginRequest, LoginResponse } from '@/domain/AuthTypes'

export interface AuthRepository {
    login: (credentials: LoginRequest) => Promise<LoginResponse>
}
