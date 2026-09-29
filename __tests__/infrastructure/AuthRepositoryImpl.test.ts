import { createAuthRepositoryImpl } from '@/infrastructure/repositories/AuthRepositoryImpl'
import { createFakeAxiosClient } from '../helpers/fakeAxiosClient'

const client = createFakeAxiosClient()
const authRepository = createAuthRepositoryImpl(client)

const post = client.post as unknown as jest.Mock

it('should return the login response data', async () => {
  const response = {
    user: {
      id: '1',
      name: 'name',
      email: 'email',
    },
    token: '1000',
  }

  post.mockResolvedValue({ data: response })

  const credentials = { email: 'name', password: 'pass' }
  const result = await authRepository.login(credentials)

  expect(result).toEqual(response)
  expect(post).toHaveBeenCalledWith('/login', credentials)
})

it('should propagate the failure to the caller', async () => {
  post.mockRejectedValue(new Error('Network error'))

  await expect(
    authRepository.login({ email: 'name', password: 'wrong' }),
  ).rejects.toThrow('Network error')
})
