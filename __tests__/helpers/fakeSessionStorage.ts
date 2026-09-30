import { SessionStorage } from '@/domain/SessionStorage'

export const createFakeSessionStorage = (): jest.Mocked<SessionStorage> => ({
    save: jest.fn(),
})
