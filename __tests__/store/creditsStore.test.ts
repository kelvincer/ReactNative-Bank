import { Credit } from '@/domain/Credit'
import { CreditsRepository } from '@/domain/repositories/CreditsRepository'
import { createCreditsStore } from '@/stores/creditsStore'
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
let useTestCreditsStore: ReturnType<typeof createCreditsStore>

beforeEach(() => {
  jest.clearAllMocks()

  creditsRepository = createFakeCreditsRepository()
  useTestCreditsStore = createCreditsStore({ creditsRepository })
})

it('should have initial state', () => {
  const state = useTestCreditsStore.getState()

  expect(state.credits).toEqual([])
  expect(state.totalAmount).toBe(0)
  expect(state.isLoading).toBe(false)
  expect(state.error).toBeNull()
})

it('should store the credits and the total balance', async () => {
  creditsRepository.getCredits.mockResolvedValue({
    credits: [credit, { ...credit, id: 2, balance: 700 }],
  })

  await useTestCreditsStore.getState().getCredits()

  const state = useTestCreditsStore.getState()

  expect(state.credits).toHaveLength(2)
  expect(state.totalAmount).toBe(13000)
  expect(state.error).toBeNull()
  expect(state.isLoading).toBe(false)
})

it('should set isLoading true and error null while loading', async () => {
  let resolveCredits!: (value: { credits: Credit[] }) => void
  creditsRepository.getCredits.mockReturnValue(
    new Promise(resolve => {
      resolveCredits = resolve
    }),
  )

  const creditsPromise = useTestCreditsStore.getState().getCredits()

  const pendingState = useTestCreditsStore.getState()

  expect(pendingState.isLoading).toBe(true)
  expect(pendingState.error).toBeNull()

  resolveCredits({ credits: [credit] })
  await creditsPromise

  expect(useTestCreditsStore.getState().isLoading).toBe(false)
})

it('should map the backend message when the request fails', async () => {
  creditsRepository.getCredits.mockRejectedValue(toAxiosError('Sin créditos'))

  await useTestCreditsStore.getState().getCredits()

  const state = useTestCreditsStore.getState()

  expect(state.error).toBe('Sin créditos')
  expect(state.isLoading).toBe(false)
})

it('should fall back to a default message when the error has no message', async () => {
  creditsRepository.getCredits.mockRejectedValue(new Error('Network error'))

  await useTestCreditsStore.getState().getCredits()

  expect(useTestCreditsStore.getState().error).toBe('Error en el servicio')
})
