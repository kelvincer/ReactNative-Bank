import { AuthRepository } from '@/domain/repositories/AuthRepository'
import { createLoginUser } from '@/domain/usecases/LoginUser'
import { SessionStorage } from '@/domain/SessionStorage'
import { createFakeAuthRepository, toAxiosError } from '../helpers/fakeRepositories'
import { createFakeSessionStorage } from '../helpers/fakeSessionStorage'

const credentials = { email: 'test@test.com', password: '123456' }

let authRepository: jest.Mocked<AuthRepository>
let sessionStorage: jest.Mocked<SessionStorage>
let loginUser: ReturnType<typeof createLoginUser>

beforeEach(() => {
    jest.clearAllMocks()

    authRepository = createFakeAuthRepository()
    sessionStorage = createFakeSessionStorage()
    loginUser = createLoginUser({ authRepository, sessionStorage })
})

it('should return the token of the logged user', async () => {
    authRepository.login.mockResolvedValue({ token: '1000' })

    const result = await loginUser(credentials)

    expect(result).toEqual({ ok: true, value: { token: '1000' } })
})

it('should ask the repository with the given credentials', async () => {
    authRepository.login.mockResolvedValue({ token: '1000' })

    await loginUser(credentials)

    expect(authRepository.login).toHaveBeenCalledWith(credentials)
})

it('should persist the session', async () => {
    authRepository.login.mockResolvedValue({ token: '1000' })

    await loginUser(credentials)

    expect(sessionStorage.save).toHaveBeenCalledWith({ token: '1000' })
})

it('should not persist anything when the login fails', async () => {
    authRepository.login.mockRejectedValue(toAxiosError('Credenciales inválidas'))

    await loginUser(credentials)

    expect(sessionStorage.save).not.toHaveBeenCalled()
})

it('should map the backend message when the login fails', async () => {
    authRepository.login.mockRejectedValue(toAxiosError('Credenciales inválidas'))

    const result = await loginUser(credentials)

    expect(result).toEqual({ ok: false, message: 'Credenciales inválidas' })
})

it('should fall back to a default message when the error has no message', async () => {
    authRepository.login.mockRejectedValue(new Error('Network error'))

    const result = await loginUser(credentials)

    expect(result).toEqual({ ok: false, message: 'No se pudo iniciar sesión' })
})

it('should fall back to a default message when the rejection is not an error object', async () => {
    authRepository.login.mockRejectedValue('timeout')

    const result = await loginUser(credentials)

    expect(result).toEqual({ ok: false, message: 'No se pudo iniciar sesión' })
})
