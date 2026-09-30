import { env } from '@/config/env'

it('should expose the base url inlined from the .env file', () => {
    expect(env.apiBaseUrl).toMatch(/^https?:\/\//)
})