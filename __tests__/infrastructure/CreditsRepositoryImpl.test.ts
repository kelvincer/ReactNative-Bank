import { createCreditsRepositoryImpl } from '@/infrastructure/repositories/CreditsRepositoryImpl'
import { createFakeAxiosClient } from '../helpers/fakeAxiosClient'

const client = createFakeAxiosClient()
const creditsRepository = createCreditsRepositoryImpl(client)

const get = client.get as unknown as jest.Mock

const credit = {
  id: 1,
  title: 'Crédito Vehicular',
  identifier: '638474747847',
  status: 'Activo',
  balance: 12300,
  monthlyFee: 850,
  expiration: '2025-04-20',
  rate: 12.5,
  initDate: '2023-04-20',
  totalTerm: 48,
}

it('should return the credits response data', async () => {
  get.mockResolvedValue({ data: { credits: [credit] } })

  const result = await creditsRepository.getCredits()

  expect(result).toEqual({ credits: [credit] })
  expect(get).toHaveBeenCalledWith('/credits')
})

it('should propagate the failure to the caller', async () => {
  get.mockRejectedValue(new Error('Network error'))

  await expect(creditsRepository.getCredits()).rejects.toThrow('Network error')
})
