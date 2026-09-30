import { create } from "zustand"
import { PayRequest, PayResponse } from "@/domain/PayTypes"
import { PayCredit } from "@/domain/usecases/PayCredit"
import { container } from "@/infrastructure/di/container"

interface PaymentState {
    isLoading: boolean
    error: string | null
    makePay: (request: PayRequest) => Promise<PayResponse>
}

interface PaymentStoreDependencies {
    payCredit: PayCredit
}

export const createPaymentStore = ({ payCredit }: PaymentStoreDependencies) => create<PaymentState>((set) => ({

    isLoading: false,
    error: null,
    makePay: async (request: PayRequest): Promise<PayResponse> => {
        set({
            isLoading: true,
            error: null
        })

        const result = await payCredit(request)

        if (!result.ok) {
            set({
                isLoading: false,
                error: result.message
            })

            return { success: false, payment: null }
        }

        set({
            isLoading: false,
            error: null
        })

        return result.value
    }
}))

export const usePaymentStore = createPaymentStore({ payCredit: container.payCredit })
