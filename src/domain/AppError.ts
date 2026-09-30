/**
 * Cuerpo que el backend devuelve cuando una peticion falla:
 * `{ "message": "Correo o contrasena incorrecto" }`
 */
export interface ApiErrorBody {
    message?: string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null

const hasMessage = (value: unknown): value is ApiErrorBody & { message: string } =>
    isRecord(value) &&
    typeof value.message === 'string' &&
    value.message.length > 0

const isFailedResponse = (
    value: unknown,
): value is { data: ApiErrorBody & { message: string } } =>
    isRecord(value) && hasMessage(value.data)

/**
 * Lee el mensaje que envio el backend, o `null` si el fallo no lo trae
 * (error de red, timeout, peticion cancelada o cuerpo con otra forma).
 */
const readApiErrorMessage = (error: unknown): string | null => {
    if (!isRecord(error) || !isFailedResponse(error.response)) {
        return null
    }

    return error.response.data.message
}

/**
 * Texto que la UI muestra en pantalla: el mensaje del backend cuando existe y
 * el texto por defecto del store cuando no. Es el unico lugar que conoce la
 * forma del error, asi que los stores no leen `error.response.data.message`.
 */
export const resolveErrorMessage = (error: unknown, fallback: string): string =>
    readApiErrorMessage(error) ?? fallback
