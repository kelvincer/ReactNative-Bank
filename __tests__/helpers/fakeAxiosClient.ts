import { AxiosInstance } from 'axios'

export const createFakeAxiosClient = () =>
  ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }) as unknown as AxiosInstance
