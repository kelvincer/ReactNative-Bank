import { AuthRepository } from '@/domain/repositories/AuthRepository'
import { SessionStorage } from '@/domain/SessionStorage'
import { createLoginUser } from '@/domain/usecases/LoginUser'
import { createAuthStore } from '@/stores/authStore'
import { createFakeAuthRepository, toAxiosError } from '../helpers/fakeRepositories'
import { createFakeSessionStorage } from '../helpers/fakeSessionStorage'

const user = { id: '1', name: 'name', email: 'email' }

let authRepository: jest.Mocked<AuthRepository>
let sessionStorage: jest.Mocked<SessionStorage>
let useTestAuthStore: ReturnType<typeof createAuthStore>

beforeEach(() => {
    jest.clearAllMocks()

    authRepository = createFakeAuthRepository()
    sessionStorage = createFakeSessionStorage()
    useTestAuthStore = createAuthStore({
        loginUser: createLoginUser({ authRepository, sessionStorage })
    })
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

it('should fall back to a default message when the rejection is not an error object', async () => {
    authRepository.login.mockRejectedValue('timeout')

    await useTestAuthStore.getState().login({
        email: 'test@test.com',
        password: 'wrong',
    })

    expect(useTestAuthStore.getState().error).toBe('No se pudo iniciar sesión')
})

it('should clear the error', () => {
    useTestAuthStore.setState({ error: 'Credenciales inválidas' })

    useTestAuthStore.getState().clearError()

    expect(useTestAuthStore.getState().error).toBeNull()
})
