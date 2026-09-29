import { create } from "zustand"
import { PayRequest, PayResponse } from "@/domain/PayTypes"
import { PaymentRepository } from "@/domain/repositories/PaymentRepository"
import { container } from "@/infrastructure/di/container"

interface PaymentState {
    isLoading: boolean
    error: string | null
    makePay: (request: PayRequest) => Promise<PayResponse>
}

interface PaymentStoreDependencies {
    paymentRepository: PaymentRepository
}

export const createPaymentStore = ({ paymentRepository }: PaymentStoreDependencies) => create<PaymentState>((set) => ({

    isLoading: false,
    error: null,
    makePay: async (request: PayRequest): Promise<PayResponse> => {

        try {
            set({
                isLoading: true,
                error: null
            })

            const response = await paymentRepository.makePay(request)

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

export const usePaymentStore = createPaymentStore({ paymentRepository: container.payment })
