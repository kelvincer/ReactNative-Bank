import { InternalAxiosRequestConfig } from 'axios'
import { createApiClient } from '@/infrastructure/network/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

type RequestInterceptor = {
  fulfilled: (config: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig>
}

const getRequestInterceptors = (client: ReturnType<typeof createApiClient>): RequestInterceptor[] =>
  (client.interceptors.request as unknown as { handlers: RequestInterceptor[] }).handlers

const buildConfig = (): InternalAxiosRequestConfig =>
  ({ headers: {} } as InternalAxiosRequestConfig)

it('should build the client with the given base URL', () => {
  const client = createApiClient('http://test.local:8080')

  expect(client.defaults.baseURL).toBe('http://test.local:8080')
  expect(client.defaults.timeout).toBe(10000)
  expect(client.defaults.headers['Content-Type']).toBe('application/json')
})

it('should attach the stored token to the request', async () => {
  await AsyncStorage.setItem('token', '1000')

  const [interceptor] = getRequestInterceptors(createApiClient('http://test.local:8080'))
  const config = await interceptor.fulfilled(buildConfig())

  expect(config.headers.Authorization).toBe('Bearer 1000')
})

it('should not attach an authorization header without a token', async () => {
  await AsyncStorage.removeItem('token')

  const [interceptor] = getRequestInterceptors(createApiClient('http://test.local:8080'))
  const config = await interceptor.fulfilled(buildConfig())

  expect(config.headers.Authorization).toBeUndefined()
})
