import { createPaymentRepositoryImpl } from '@/infrastructure/repositories/PaymentRepositoryImpl'
import { createFakeAxiosClient } from '../helpers/fakeAxiosClient'

const client = createFakeAxiosClient()
const paymentRepository = createPaymentRepositoryImpl(client)

const post = client.post as unknown as jest.Mock

it('should return the payment response data', async () => {
  const payment = {
    title: 'Crédito Vehicular',
    identifier: '638474747847',
    monthlyFee: 850,
    paidDate: new Date('2025-04-20'),
    operation: 'OP-1000',
  }

  post.mockResolvedValue({ data: { success: true, payment } })

  const request = { title: 'Crédito Vehicular', identifier: 'CR-01' }
  const result = await paymentRepository.makePay(request)

  expect(result).toEqual({ success: true, payment })
  expect(post).toHaveBeenCalledWith('/payments', request)
})

it('should propagate the failure to the caller', async () => {
  post.mockRejectedValue(new Error('Network error'))

  await expect(
    paymentRepository.makePay({ title: 'Crédito Vehicular', identifier: 'CR-01' }),
  ).rejects.toThrow('Network error')
})
