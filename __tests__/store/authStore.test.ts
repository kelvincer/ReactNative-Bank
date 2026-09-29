import { AuthRepository } from '@/domain/repositories/AuthRepository'
import { createAuthStore } from '@/stores/authStore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createFakeAuthRepository, toAxiosError } from '../helpers/fakeRepositories'

const user = { id: '1', name: 'name', email: 'email' }

let authRepository: jest.Mocked<AuthRepository>
let useTestAuthStore: ReturnType<typeof createAuthStore>

beforeEach(async () => {
  await AsyncStorage.clear()
  jest.clearAllMocks()

  authRepository = createFakeAuthRepository()
  useTestAuthStore = createAuthStore({ authRepository })
})

it('should have initial state', () => {
  const state = useTestAuthStore.getState()

  expect(state.user).toBeNull()
  expect(state.token).toBeNull()
  expect(state.isLoading).toBe(false)
  expect(state.error).toBeNull()
})

it('should login successfully', async () => {
  authRepository.login.mockResolvedValue({ user, token: '1000' })

  const result = await useTestAuthStore.getState().login({
    email: 'test@test.com',
    password: '123456',
  })

  const state = useTestAuthStore.getState()

  expect(result).toBe(true)
  expect(state.user).toEqual(user)
  expect(state.token).toBe('1000')
  expect(state.error).toBeNull()
  expect(state.isLoading).toBe(false)
})

it('should persist the token and the user', async () => {
  authRepository.login.mockResolvedValue({ user, token: '1000' })

  await useTestAuthStore.getState().login({
    email: 'test@test.com',
    password: '123456',
  })

  await expect(AsyncStorage.getItem('token')).resolves.toBe('1000')
  await expect(AsyncStorage.getItem('user')).resolves.toEqual(JSON.stringify(user))
})

it('should set isLoading true and error null while logging in', async () => {
  let resolveLogin!: (value: { user: typeof user; token: string }) => void
  authRepository.login.mockReturnValue(
    new Promise(resolve => {
      resolveLogin = resolve
    }),
  )

  const loginPromise = useTestAuthStore.getState().login({
    email: 'test@test.com',
    password: '123456',
  })

  const pendingState = useTestAuthStore.getState()

  expect(pendingState.token).toBeNull()
  expect(pendingState.isLoading).toBe(true)
  expect(pendingState.error).toBeNull()

  resolveLogin({ user, token: '1000' })
  await loginPromise

  expect(useTestAuthStore.getState().isLoading).toBe(false)
})

it('should map the backend message when the login fails', async () => {
  authRepository.login.mockRejectedValue(toAxiosError('Credenciales inválidas'))

  const result = await useTestAuthStore.getState().login({
    email: 'test@test.com',
    password: 'wrong',
  })

  const state = useTestAuthStore.getState()

  expect(result).toBe(false)
  expect(state.error).toBe('Credenciales inválidas')
  expect(state.isLoading).toBe(false)
})

it('should fall back to a default message when the error has no message', async () => {
  authRepository.login.mockRejectedValue(new Error('Network error'))

  await useTestAuthStore.getState().login({
    email: 'test@test.com',
    password: 'wrong',
  })

  expect(useTestAuthStore.getState().error).toBe('No se pudo iniciar sesión')
})

it('should clear the session and the persisted data on logout', async () => {
  authRepository.login.mockResolvedValue({ user, token: '1000' })

  await useTestAuthStore.getState().login({
    email: 'test@test.com',
    password: '123456',
  })
  await useTestAuthStore.getState().logout()

  const state = useTestAuthStore.getState()

  expect(state.user).toBeNull()
  expect(state.token).toBeNull()
  await expect(AsyncStorage.getItem('token')).resolves.toBeNull()
  await expect(AsyncStorage.getItem('user')).resolves.toBeNull()
})

it('should clear the error', () => {
  useTestAuthStore.setState({ error: 'Credenciales inválidas' })

  useTestAuthStore.getState().clearError()

  expect(useTestAuthStore.getState().error).toBeNull()
})
