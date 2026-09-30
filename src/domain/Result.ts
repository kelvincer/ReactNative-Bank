import { resolveErrorMessage } from '@/domain/AppError'

/**
 * Salida de un caso de uso: o el valor de negocio ya listo para copiarse al
 * estado, o el mensaje que la UI debe pintar. El error crudo nunca sale del
 * dominio, asi que ningun store necesita un try/catch.
 */
export type Result<T> =
    | { ok: true; value: T }
    | { ok: false; message: string }

/**
 * Corre la orquestacion de un caso de uso y traduce cualquier fallo con el
 * texto por defecto del caso. Es el unico lugar donde se captura la excepcion,
 * de modo que los stores solo tienen que leer el resultado.
 */
export const runUseCase = async <T>(
    action: () => Promise<T>,
    fallbackMessage: string,
): Promise<Result<T>> => {
    try {
        return { ok: true, value: await action() }
    } catch (error: unknown) {
        return { ok: false, message: resolveErrorMessage(error, fallbackMessage) }
    }
}
