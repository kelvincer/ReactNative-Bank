import { Session, SessionStorage } from '@/domain/SessionStorage'
import { createMMKV } from 'react-native-mmkv'

export const SESSION_TOKEN_KEY = 'token'

export const storage = createMMKV()

/**
 * Adaptador del puerto de sesion sobre MMKV. Las claves viven aqui y no en el
 * dominio, que solo ve el puerto.
 */
export const createSessionStorageImpl = (): SessionStorage => ({
    save: async ({ token }: Session) => {
        storage.set(SESSION_TOKEN_KEY, token)
    },
})
