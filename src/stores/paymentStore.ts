import { create } from "zustand"
import { paymentRequest } from "../infrastructure/network/PaymentService"
import { PayRequest, PayResponse } from "../domain/PayTypes"

interface PaymentState {
    isLoading: boolean
    error: string | null
    makePay: (request: PayRequest) => Promise<PayResponse>
}

export const userPaymentState = create<PaymentState>((set, get) => ({

    isLoading: false,
    error: null,
    makePay: async (request: PayRequest): Promise<PayResponse> => {

        try {
            set({
                isLoading: true,
                error: null
            })

            const response = await paymentRequest(request)

            console.log('payment', response)
            console.log('payment', response.payment)

            set({
                isLoading: false,
                error: null
            })

            return { success: true, payment: response.payment }
        } catch (error: any) {
            set({
                isLoading: false,
                error:
                    error.response?.data?.message ??
                    'Error en el servicio',
            })

            return { success: false, payment: null }

        }
    }
}))