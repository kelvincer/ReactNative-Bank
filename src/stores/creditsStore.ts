import { create } from "zustand"
import { Credit } from "@/domain/Credit"
import { CreditsRepository } from "@/domain/repositories/CreditsRepository"
import { container } from "@/infrastructure/di/container"

interface CreditsState {
    isLoading: boolean
    error: string | null
    totalAmount: number
    credits: Credit[]
    getCredits: () => Promise<void>

}

interface CreditsStoreDependencies {
    creditsRepository: CreditsRepository
}

export const createCreditsStore = ({ creditsRepository }: CreditsStoreDependencies) => create<CreditsState>((set) => ({
    isLoading: false,
    error: null,
    totalAmount: 0,
    credits: [],
    getCredits: async () => {
        try {

            set({
                isLoading: true,
                error: null
            })

            const response = await creditsRepository.getCredits()

            const total = response.credits.reduce(
                (sum, product) => sum + product.balance,
                0
            );

            set({
                totalAmount: total,
                credits: response.credits,
                isLoading: false,
                error: null
            })

        } catch (error: any) {
            set({
                isLoading: false,
                error:
                    error.response?.data?.message ??
                    'Error en el servicio',
            })

        }
    }
}))

export const useCreditsStore = createCreditsStore({ creditsRepository: container.credits })
