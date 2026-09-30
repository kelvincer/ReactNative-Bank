import axios, { AxiosInstance } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SESSION_TOKEN_KEY } from '@/infrastructure/storage/SessionStorageImpl'

export const createApiClient = (baseURL: string): AxiosInstance => {
    const client = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    client.interceptors.request.use(async config => {
        const token = await AsyncStorage.getItem(SESSION_TOKEN_KEY)

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    })

    return client
}
