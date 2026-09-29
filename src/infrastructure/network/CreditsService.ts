import { CreditsResponse } from "@/domain/Credit";
import { api } from "@/infrastructure/network/api";

export const creditsRequest = async (): Promise<CreditsResponse> => {
    const response = await api.get<CreditsResponse>('/credits')
    return response.data
}