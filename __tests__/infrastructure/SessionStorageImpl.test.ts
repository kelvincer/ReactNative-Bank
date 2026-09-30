import {
    SESSION_TOKEN_KEY,
    createSessionStorageImpl,
    storage,
} from '@/infrastructure/storage/SessionStorageImpl'

const session = { token: '1000' }

beforeEach(() => {
    storage.clearAll()
    jest.clearAllMocks()
})

it('should store the token', async () => {
    await createSessionStorageImpl().save(session)

    expect(storage.getString(SESSION_TOKEN_KEY)).toBe('1000')
})
