import { AxiosInstance } from 'axios'
import { CreditsResponse } from '@/domain/Credit'
import { CreditsRepository } from '@/domain/repositories/CreditsRepository'

export const createCreditsRepositoryImpl = (client: AxiosInstance): CreditsRepository => ({
    getCredits: async (): Promise<CreditsResponse> => {
        const response = await client.get<CreditsResponse>('/credits')

        return response.data
    },
})
