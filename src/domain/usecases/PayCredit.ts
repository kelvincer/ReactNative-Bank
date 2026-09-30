import { PayRequest, PayResponse } from '@/domain/PayTypes'
import { PaymentRepository } from '@/domain/repositories/PaymentRepository'
import { Result, runUseCase } from '@/domain/Result'

interface PayCreditDependencies {
    paymentRepository: PaymentRepository
}

export interface PayCredit {
    (request: PayRequest): Promise<Result<PayResponse>>
}

const FALLBACK_MESSAGE = 'Error en el servicio'

/**
 * Pago de un credito: normaliza la respuesta del backend a la forma que la
 * pantalla necesita para navegar a la constancia, sin tratar el error aqui.
 */
export const createPayCredit = ({ paymentRepository }: PayCreditDependencies): PayCredit =>
    request => runUseCase(async () => {
        const response = await paymentRepository.makePay(request)

        return { success: true, payment: response.payment }
    }, FALLBACK_MESSAGE)
