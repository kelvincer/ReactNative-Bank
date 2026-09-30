import AsyncStorage from '@react-native-async-storage/async-storage'
import { Session, SessionStorage } from '@/domain/SessionStorage'

export const SESSION_TOKEN_KEY = 'token'
export const SESSION_USER_KEY = 'user'

/**
 * Adaptador del puerto de sesion sobre AsyncStorage. Las claves viven aqui y
 * no en el dominio, que solo ve el puerto.
 */
export const createSessionStorageImpl = (): SessionStorage => ({
    save: async ({ user, token }: Session) => {
        await AsyncStorage.setItem(SESSION_TOKEN_KEY, token)
        await AsyncStorage.setItem(SESSION_USER_KEY, JSON.stringify(user))
    },
})
