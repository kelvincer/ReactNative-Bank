import { AxiosInstance } from 'axios'
import { PayRequest, PayResponse } from '@/domain/PayTypes'
import { PaymentRepository } from '@/domain/repositories/PaymentRepository'

export const createPaymentRepositoryImpl = (client: AxiosInstance): PaymentRepository => ({
    makePay: async (request: PayRequest): Promise<PayResponse> => {
        const response = await client.post<PayResponse>('/payments', request)

        return response.data
    },
})
