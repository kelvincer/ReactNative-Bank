import { env } from '@/config/env'
import { createApiClient } from '@/infrastructure/network/api'
import { createAuthRepositoryImpl } from '@/infrastructure/repositories/AuthRepositoryImpl'
import { createCreditsRepositoryImpl } from '@/infrastructure/repositories/CreditsRepositoryImpl'
import { createPaymentRepositoryImpl } from '@/infrastructure/repositories/PaymentRepositoryImpl'

const client = createApiClient(env.apiBaseUrl)

export const container = {
    auth: createAuthRepositoryImpl(client),
    credits: createCreditsRepositoryImpl(client),
    payment: createPaymentRepositoryImpl(client),
}
