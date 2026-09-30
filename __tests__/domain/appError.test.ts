import { resolveErrorMessage } from '@/domain/AppError'

const fallback = 'No se pudo iniciar sesión'

const toApiError = (body: unknown) => ({ response: { data: body } })

it('should return the message sent by the backend', () => {
    const error = toApiError({ message: 'Correo o contraseña incorrecto' })

    expect(resolveErrorMessage(error, fallback)).toBe('Correo o contraseña incorrecto')
})

it('should fall back when the error has no response', () => {
    expect(resolveErrorMessage(new Error('Network error'), fallback)).toBe(fallback)
    expect(resolveErrorMessage({}, fallback)).toBe(fallback)
})

it('should fall back when the response has no body', () => {
    expect(resolveErrorMessage({ response: undefined }, fallback)).toBe(fallback)
    expect(resolveErrorMessage({ response: {} }, fallback)).toBe(fallback)
})

it('should fall back when the body has no usable message', () => {
    expect(resolveErrorMessage(toApiError({}), fallback)).toBe(fallback)
    expect(resolveErrorMessage(toApiError({ message: '' }), fallback)).toBe(fallback)
    expect(resolveErrorMessage(toApiError({ message: 500 }), fallback)).toBe(fallback)
    expect(resolveErrorMessage(toApiError('Correo o contraseña incorrecto'), fallback)).toBe(fallback)
})

it('should fall back when the rejection is not an error object', () => {
    expect(resolveErrorMessage('timeout', fallback)).toBe(fallback)
    expect(resolveErrorMessage(null, fallback)).toBe(fallback)
    expect(resolveErrorMessage(undefined, fallback)).toBe(fallback)
})
