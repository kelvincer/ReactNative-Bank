import { AuthRepository } from '@/domain/repositories/AuthRepository'
import { CreditsRepository } from '@/domain/repositories/CreditsRepository'
import { PaymentRepository } from '@/domain/repositories/PaymentRepository'

export const createFakeAuthRepository = (): jest.Mocked<AuthRepository> => ({
    login: jest.fn(),
})

export const createFakeCreditsRepository = (): jest.Mocked<CreditsRepository> => ({
    getCredits: jest.fn(),
})

export const createFakePaymentRepository = (): jest.Mocked<PaymentRepository> => ({
    makePay: jest.fn(),
})

export const toAxiosError = (message: string): unknown => ({
    response: {
        data: {
            message,
        },
    },
})
