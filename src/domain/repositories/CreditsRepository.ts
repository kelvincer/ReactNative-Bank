import { CreditsResponse } from '@/domain/Credit'

export interface CreditsRepository {
    getCredits: () => Promise<CreditsResponse>
}
