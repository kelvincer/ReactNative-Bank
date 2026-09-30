import { env } from '@/config/env'
import { createListCredits } from '@/domain/usecases/ListCredits'
import { createLoginUser } from '@/domain/usecases/LoginUser'
import { createPayCredit } from '@/domain/usecases/PayCredit'
import { createApiClient } from '@/infrastructure/network/api'
import { createAuthRepositoryImpl } from '@/infrastructure/repositories/AuthRepositoryImpl'
import { createCreditsRepositoryImpl } from '@/infrastructure/repositories/CreditsRepositoryImpl'
import { createPaymentRepositoryImpl } from '@/infrastructure/repositories/PaymentRepositoryImpl'
import { createSessionStorageImpl } from '@/infrastructure/storage/SessionStorageImpl'

const client = createApiClient(env.apiBaseUrl)

const auth = createAuthRepositoryImpl(client)
const credits = createCreditsRepositoryImpl(client)
const payment = createPaymentRepositoryImpl(client)
const sessionStorage = createSessionStorageImpl()

export const container = {
    auth,
    credits,
    payment,
    sessionStorage,
    loginUser: createLoginUser({ authRepository: auth, sessionStorage }),
    listCredits: createListCredits({ creditsRepository: credits }),
    payCredit: createPayCredit({ paymentRepository: payment }),
}
