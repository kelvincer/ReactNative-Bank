import { create } from "zustand"
import { LoginRequest, User } from "@/domain/AuthTypes"
import { LoginUser } from "@/domain/usecases/LoginUser"
import { container } from "@/infrastructure/di/container"

interface AuthState {
    user: User | null
    token: string | null
    isLoading: boolean
    error: string | null
    login: (credentials: LoginRequest) => Promise<boolean>
    clearError: () => void
}

interface AuthStoreDependencies {
    loginUser: LoginUser
}

export const createAuthStore = ({ loginUser }: AuthStoreDependencies) => create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,
    login: async (credentials) => {
        set({
            isLoading: true,
            error: null
        })

        const result = await loginUser(credentials)

        if (!result.ok) {
            set({
                isLoading: false,
                error: result.message
            })

            return false
        }

        set({
            user: result.value.user,
            token: result.value.token,
            isLoading: false,
            error: null
        })

        return true
    },
    clearError: () => {
        set({
            error: null
        })
    }

}))

export const useAuthStore = createAuthStore({ loginUser: container.loginUser })
