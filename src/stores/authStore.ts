import { create } from "zustand"
import { LoginRequest, User } from "@/domain/AuthTypes"
import { AuthRepository } from "@/domain/repositories/AuthRepository"
import { container } from "@/infrastructure/di/container"
import AsyncStorage from '@react-native-async-storage/async-storage'

interface AuthState {
    user: User | null
    token: string | null
    isLoading: boolean
    error: string | null
    login: (credentials: LoginRequest) => Promise<boolean>
    logout: () => Promise<void>
    clearError: () => void
}

interface AuthStoreDependencies {
    authRepository: AuthRepository
}

export const createAuthStore = ({ authRepository }: AuthStoreDependencies) => create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,
    login: async (credentials) => {
        try {

            set({
                isLoading: true,
                error: null
            })

            const response = await authRepository.login(credentials)
            await AsyncStorage.setItem('token', response.token);
            await AsyncStorage.setItem(
                'user',
                JSON.stringify(response.user),
            );

            set({
                user: response.user,
                token: response.token,
                isLoading: false,
                error: null
            })

            return true

        } catch (error: any) {
            set({
                isLoading: false,
                error:
                    error.response?.data?.message ??
                    'No se pudo iniciar sesión',
            })

            return false
        }
    },
    logout: async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        set({
            user: null,
            token: null,
            error: null
        })
    },
    clearError: () => {
        set({
            error: null
        })
    }

}))

export const useAuthStore = createAuthStore({ authRepository: container.auth })
