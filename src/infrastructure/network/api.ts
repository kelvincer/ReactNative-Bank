import axios, { AxiosInstance } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const createApiClient = (baseURL: string): AxiosInstance => {
    const client = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    client.interceptors.request.use(async config => {
        const token = await AsyncStorage.getItem('token')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    })

    return client
}
