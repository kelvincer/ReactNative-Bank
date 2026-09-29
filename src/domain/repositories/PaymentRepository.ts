import { PayRequest, PayResponse } from '@/domain/PayTypes'

export interface PaymentRepository {
    makePay: (request: PayRequest) => Promise<PayResponse>
}
