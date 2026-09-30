import { Payment } from '@/domain/PayTypes'
import { PaymentRepository } from '@/domain/repositories/PaymentRepository'
import { createPayCredit } from '@/domain/usecases/PayCredit'
import { createFakePaymentRepository, toAxiosError } from '../helpers/fakeRepositories'

const request = { title: 'Crédito Vehicular', identifier: 'CR-01' }

const payment: Payment = {
    title: 'Crédito Vehicular',
    identifier: '638474747847',
    monthlyFee: 850,
    paidDate: new Date('2025-04-20'),
    operation: 'OP-1000',
}

let paymentRepository: jest.Mocked<PaymentRepository>
let payCredit: ReturnType<typeof createPayCredit>

beforeEach(() => {
    jest.clearAllMocks()

    paymentRepository = createFakePaymentRepository()
    payCredit = createPayCredit({ paymentRepository })
})

it('should return a successful payment', async () => {
    paymentRepository.makePay.mockResolvedValue({ success: true, payment })

    const result = await payCredit(request)

    expect(result).toEqual({ ok: true, value: { success: true, payment } })
})

it('should ask the repository with the given request', async () => {
    paymentRepository.makePay.mockResolvedValue({ success: true, payment })

    await payCredit(request)

    expect(paymentRepository.makePay).toHaveBeenCalledWith(request)
})

it('should keep a null payment when the backend does not send one', async () => {
    paymentRepository.makePay.mockResolvedValue({ success: false, payment: null })

    const result = await payCredit(request)

    expect(result).toEqual({ ok: true, value: { success: true, payment: null } })
})

it('should map the backend message when the request fails', async () => {
    paymentRepository.makePay.mockRejectedValue(toAxiosError('Pago rechazado'))

    const result = await payCredit(request)

    expect(result).toEqual({ ok: false, message: 'Pago rechazado' })
})

it('should fall back to a default message when the error has no message', async () => {
    paymentRepository.makePay.mockRejectedValue(new Error('Network error'))

    const result = await payCredit(request)

    expect(result).toEqual({ ok: false, message: 'Error en el servicio' })
})
