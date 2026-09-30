import { create } from "zustand"
import { Credit } from "@/domain/Credit"
import { ListCredits } from "@/domain/usecases/ListCredits"
import { container } from "@/infrastructure/di/container"

interface CreditsState {
    isLoading: boolean
    error: string | null
    totalAmount: number
    credits: Credit[]
    getCredits: () => Promise<void>
}

interface CreditsStoreDependencies {
    listCredits: ListCredits
}

export const createCreditsStore = ({ listCredits }: CreditsStoreDependencies) => create<CreditsState>((set) => ({
    isLoading: false,
    error: null,
    totalAmount: 0,
    credits: [],
    getCredits: async () => {
        set({
            isLoading: true,
            error: null
        })

        const result = await listCredits()

        if (!result.ok) {
            set({
                isLoading: false,
                error: result.message
            })

            return
        }

        set({
            credits: result.value.credits,
            totalAmount: result.value.totalAmount,
            isLoading: false,
            error: null
        })
    }
}))

export const useCreditsStore = createCreditsStore({ listCredits: container.listCredits })
