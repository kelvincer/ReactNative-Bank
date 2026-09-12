import { create } from "zustand"
import { Credit } from "../domain/Credit"
import { creditsRequest } from "../infrastructure/network/CreditsService"

interface CreditsState {
    isLoading: boolean
    error: string | null
    totalAmount: number
    credits: Credit[]
    getCredits: () => Promise<void>

}

export const useCreditState = create<CreditsState>((set) => ({
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

            const response = await creditsRequest()

            console.log('res', response)
            console.log('resd', response.credits)

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