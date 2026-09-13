import { api } from "./api"
import { PayRequest, PayResponse } from "../../domain/PayTypes"

export const paymentRequest = async (request: PayRequest): Promise<PayResponse> => {
    const response = await api.post<PayResponse>('/payments', request)
    return response.data
}