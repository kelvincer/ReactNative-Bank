import { AxiosAdapter, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { createApiClient } from '@/infrastructure/network/api'
import { SESSION_TOKEN_KEY } from '@/infrastructure/storage/SessionStorageImpl'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Ejecuta una peticion real contra el cliente y devuelve la config que llego al
 * adaptador. Es la unica forma de observar el interceptor sin tocar las
 *estructuras internas de axios: se reemplaza el adaptador, que es parte de su
 * configuracion publica, y se deja que el pipeline corra entero.
 */
const sendRequestAndCaptureConfig = async (
    client: AxiosInstance,
): Promise<InternalAxiosRequestConfig> => {
    const adapter = jest.fn(
        async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => ({
            data: {},
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
        }),
    )

    client.defaults.adapter = adapter as AxiosAdapter

    await client.get('/credits')

    const [config] = adapter.mock.calls[0]

    return config
}

it('should build the client with the given base URL', () => {
    const client = createApiClient('http://test.local:8080')

    expect(client.defaults.baseURL).toBe('http://test.local:8080')
    expect(client.defaults.timeout).toBe(10000)
    expect(client.defaults.headers['Content-Type']).toBe('application/json')
})

it('should attach the stored token to the request', async () => {
    await AsyncStorage.setItem(SESSION_TOKEN_KEY, '1000')

    const config = await sendRequestAndCaptureConfig(createApiClient('http://test.local:8080'))

    expect(config.headers.Authorization).toBe('Bearer 1000')
})

it('should not attach an authorization header without a token', async () => {
    await AsyncStorage.removeItem(SESSION_TOKEN_KEY)

    const config = await sendRequestAndCaptureConfig(createApiClient('http://test.local:8080'))

    expect(config.headers.Authorization).toBeUndefined()
})
