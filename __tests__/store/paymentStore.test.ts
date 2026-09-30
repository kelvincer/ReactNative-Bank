import { Payment } from '@/domain/PayTypes'
import { PaymentRepository } from '@/domain/repositories/PaymentRepository'
import { createPayCredit } from '@/domain/usecases/PayCredit'
import { createPaymentStore } from '@/stores/paymentStore'
import { createFakePaymentRepository, toAxiosError } from '../helpers/fakeRepositories'

const payment: Payment = {
    title: 'Crédito Vehicular',
    identifier: '638474747847',
    monthlyFee: 850,
    paidDate: new Date('2025-04-20'),
    operation: 'OP-1000',
}

let paymentRepository: jest.Mocked<PaymentRepository>
let useTestPaymentStore: ReturnType<typeof createPaymentStore>

beforeEach(() => {
    jest.clearAllMocks()

    paymentRepository = createFakePaymentRepository()
    useTestPaymentStore = createPaymentStore({
        payCredit: createPayCredit({ paymentRepository })
    })
})

it('should have initial state', () => {
    const state = useTestPaymentStore.getState()

    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
})

it('should return the payment when the request succeeds', async () => {
    paymentRepository.makePay.mockResolvedValue({ success: true, payment })

    const result = await useTestPaymentStore.getState().makePay({
        title: 'Crédito Vehicular',
        identifier: 'CR-01',
    })

    const state = useTestPaymentStore.getState()

    expect(result).toEqual({ success: true, payment })
    expect(state.error).toBeNull()
    expect(state.isLoading).toBe(false)
})

it('should set isLoading true and error null while paying', async () => {
    let resolvePay!: (value: { success: boolean; payment: Payment | null }) => void
    paymentRepository.makePay.mockReturnValue(
        new Promise(resolve => {
            resolvePay = resolve
        }),
    )

    const payPromise = useTestPaymentStore.getState().makePay({
        title: 'Crédito Vehicular',
        identifier: 'CR-01',
    })

    const pendingState = useTestPaymentStore.getState()

    expect(pendingState.isLoading).toBe(true)
    expect(pendingState.error).toBeNull()

    resolvePay({ success: true, payment })
    await payPromise

    expect(useTestPaymentStore.getState().isLoading).toBe(false)
})

it('should return a null payment and map the error when the request fails', async () => {
    paymentRepository.makePay.mockRejectedValue(toAxiosError('Pago rechazado'))

    const result = await useTestPaymentStore.getState().makePay({
        title: 'Crédito Vehicular',
        identifier: 'CR-01',
    })

    const state = useTestPaymentStore.getState()

    expect(result).toEqual({ success: false, payment: null })
    expect(state.error).toBe('Pago rechazado')
    expect(state.isLoading).toBe(false)
})

it('should fall back to a default message when the error has no message', async () => {
    paymentRepository.makePay.mockRejectedValue(new Error('Network error'))

    await useTestPaymentStore.getState().makePay({
        title: 'Crédito Vehicular',
        identifier: 'CR-01',
    })

    expect(useTestPaymentStore.getState().error).toBe('Error en el servicio')
})
