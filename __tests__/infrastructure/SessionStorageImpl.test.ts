import {
    SESSION_TOKEN_KEY,
    SESSION_USER_KEY,
    createSessionStorageImpl,
} from '@/infrastructure/storage/SessionStorageImpl'
import AsyncStorage from '@react-native-async-storage/async-storage'

const user = { id: '1', name: 'name', email: 'email' }
const session = { user, token: '1000' }

beforeEach(async () => {
    await AsyncStorage.clear()
    jest.clearAllMocks()
})

it('should store the token and the serialized user', async () => {
    await createSessionStorageImpl().save(session)

    await expect(AsyncStorage.getItem(SESSION_TOKEN_KEY)).resolves.toBe('1000')
    await expect(AsyncStorage.getItem(SESSION_USER_KEY)).resolves.toBe(JSON.stringify(user))
})
