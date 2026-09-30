import { LoginRequest } from '@/domain/AuthTypes'
import { AuthRepository } from '@/domain/repositories/AuthRepository'
import { Result, runUseCase } from '@/domain/Result'
import { Session, SessionStorage } from '@/domain/SessionStorage'

interface LoginUserDependencies {
    authRepository: AuthRepository
    sessionStorage: SessionStorage
}

export interface LoginUser {
    (credentials: LoginRequest): Promise<Result<Session>>
}

const FALLBACK_MESSAGE = 'No se pudo iniciar sesión'

/**
 * Inicio de sesion: pide el token al puerto de auth y deja la sesion
 * persistida, que es de donde la lee despues el interceptor de la API.
 */
export const createLoginUser = ({ authRepository, sessionStorage }: LoginUserDependencies): LoginUser =>
    async credentials => runUseCase(async () => {
        const response = await authRepository.login(credentials)
        const session: Session = { token: response.token }

        await sessionStorage.save(session)

        return session
    }, FALLBACK_MESSAGE)
