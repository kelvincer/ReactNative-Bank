import axios, { AxiosInstance } from 'axios'
import { SESSION_TOKEN_KEY, storage } from '@/infrastructure/storage/SessionStorageImpl'

export const createApiClient = (baseURL: string): AxiosInstance => {
    const client = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    client.interceptors.request.use(config => {
        const token = storage.getString(SESSION_TOKEN_KEY)

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    })

    return client
}
