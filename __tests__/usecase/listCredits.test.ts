import { Credit } from '@/domain/Credit'
import { CreditsRepository } from '@/domain/repositories/CreditsRepository'
import { createListCredits } from '@/domain/usecases/ListCredits'
import { createFakeCreditsRepository, toAxiosError } from '../helpers/fakeRepositories'

const credit: Credit = {
    id: 1,
    title: 'Crédito Vehicular',
    identifier: '638474747847',
    status: 'Activo',
    balance: 12300,
    monthlyFee: 850,
    expiration: new Date('2025-04-20'),
    rate: 12.5,
    initDate: new Date('2023-04-20'),
    totalTerm: 48,
}

let creditsRepository: jest.Mocked<CreditsRepository>
let listCredits: ReturnType<typeof createListCredits>

beforeEach(() => {
    jest.clearAllMocks()

    creditsRepository = createFakeCreditsRepository()
    listCredits = createListCredits({ creditsRepository })
})

it('should return the credits with the total balance', async () => {
    const credits = [credit, { ...credit, id: 2, balance: 700 }]
    creditsRepository.getCredits.mockResolvedValue({ credits })

    const result = await listCredits()

    expect(result).toEqual({ ok: true, value: { credits, totalAmount: 13000 } })
})

it('should return a zero total when there are no credits', async () => {
    creditsRepository.getCredits.mockResolvedValue({ credits: [] })

    const result = await listCredits()

    expect(result).toEqual({ ok: true, value: { credits: [], totalAmount: 0 } })
})

it('should map the backend message when the request fails', async () => {
    creditsRepository.getCredits.mockRejectedValue(toAxiosError('Sin créditos'))

    const result = await listCredits()

    expect(result).toEqual({ ok: false, message: 'Sin créditos' })
})

it('should fall back to a default message when the error has no message', async () => {
    creditsRepository.getCredits.mockRejectedValue(new Error('Network error'))

    const result = await listCredits()

    expect(result).toEqual({ ok: false, message: 'Error en el servicio' })
})
