import { CreditsResponse } from "../../domain/Credit";
import { api } from "./api";

export const creditsRequest = async (): Promise<CreditsResponse> => {
    const response = await api.get<CreditsResponse>('/user')
    return response.data
}